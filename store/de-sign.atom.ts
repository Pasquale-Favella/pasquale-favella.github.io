import { atom } from "jotai"
import { atomWithReducer, atomWithStorage, loadable } from "jotai/utils"
import { PGlite, PGliteInterfaceExtensions } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'
import { vector } from '@electric-sql/pglite/vector'

export type DeSignDB = PGlite & PGliteInterfaceExtensions<{
  live: typeof live
  vector: typeof vector
}>

const dbAtom = atom(async () => {
  const db: DeSignDB = await PGlite.create({
    extensions: { live, vector },
    dataDir: 'idb://de-sign-db'
  });

  await db.exec(`
    -- Sketches table
    CREATE TABLE IF NOT EXISTS sketches (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        html TEXT NOT NULL,
        x REAL NOT NULL,
        y REAL NOT NULL,
        width REAL NOT NULL,
        height REAL NOT NULL,
        view TEXT NOT NULL CHECK (view IN ('result', 'code')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    -- Sketch history table
    CREATE TABLE IF NOT EXISTS sketch_history (
        id SERIAL PRIMARY KEY,
        sketch_id TEXT NOT NULL,
        prompt TEXT NOT NULL,
        html TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sketch_id) REFERENCES sketches(id) ON DELETE CASCADE
    );
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_sketch_history_sketch_id 
        ON sketch_history(sketch_id);
    CREATE INDEX IF NOT EXISTS idx_sketch_history_created_at 
        ON sketch_history(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_sketches_updated_at 
        ON sketches(updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_sketch_history_sketch_id 
        ON sketch_history(sketch_id);
    `);

  return db;
});

export const deSignDbLoadableAtom = loadable(dbAtom);

export type SketchView = 'result' | 'code';

export interface Sketch {
  id: string;
  prompt: string;
  html: string;
  x: number;
  y: number;
  width: number;
  height: number;
  view: SketchView;
}

export interface SketchHistory {
  id: number;
  sketch_id: string;
  prompt: string;
  html: string;
  x: number;
  y: number;
  width: number;
  height: number;
  view: SketchView;
  created_at: string;
}

export interface ModalState {
  isOpen: boolean;
  type?: 'create' | 'edit';
  sketchId?: string | null;
}

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

export const designSketchAiProviders = ['openai', 'anthropic', 'google'] as const;
export type DesignSketchAiProvider = (typeof designSketchAiProviders)[number];

export const providerModels: Record<DesignSketchAiProvider, string[]> = {
  openai: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini'],
  anthropic: [
    'claude-3-5-haiku-latest',
    'claude-3-5-sonnet-latest',
    'claude-4-opus-20250514',
    'claude-4-sonnet-20250514',
  ],
  google: [
    'models/gemini-2.5-pro',
    'models/gemini-2.5-flash',
    'models/gemini-2.0-flash',
    'models/gemini-1.5-flash-001',
    'models/gemini-1.5-pro-001',
  ],
};

export const providerLinks: Record<DesignSketchAiProvider, string> = {
  openai: 'https://platform.openai.com/account/api-keys',
  anthropic: 'https://console.anthropic.com/settings/keys',
  google: 'https://aistudio.google.com/app/apikey',
};

export const designSketchAiProviderAtom = atomWithStorage<DesignSketchAiProvider>('sketch-ai-provider', 'google');
export const designSketchAiModelAtom = atomWithStorage<string>('sketch-ai-model', providerModels.google[1]);
export const designSketchAiApiKeyAtom = atomWithStorage<string>('sketch-ai-api-key', '');


// Types for optimistic actions
export type OptimisticSketchAction =
  | { type: 'ADD'; payload: Sketch }
  | { type: 'UPDATE'; payload: { id: string; updates: Partial<Sketch> } }
  | { type: 'DELETE'; payload: string }
  | { type: 'SYNC'; payload: Sketch[] };

// Reducer for sketch state
const sketchesReducer = (state: Sketch[], action: OptimisticSketchAction): Sketch[] => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map(s =>
        s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
      );
    case 'DELETE':
      return state.filter(s => s.id !== action.payload);
    case 'SYNC':
      return action.payload;
    default:
      return state;
  }
};
// Base atom to store sketches in memory
const sketchesStateAtom = atom<Sketch[]>([]);

// Flag to track if we've loaded from DB
const hasLoadedFromDbAtom = atom(false);

// Main atom that auto-loads from database and handles reducer-like updates
export const sketchesAtom = atom(
  async (get) => {
    const sketches = get(sketchesStateAtom);
    const hasLoaded = get(hasLoadedFromDbAtom);

    // If not loaded yet, try to load from database
    if (!hasLoaded) {
      const dbLoadable = get(deSignDbLoadableAtom);

      if (dbLoadable.state === 'hasData') {
        const db = dbLoadable.data;
        const result = await db.query<Sketch>(
          `SELECT * FROM sketches ORDER BY updated_at DESC`
        );
        return result.rows;
      }
    }

    return sketches;
  },
  (get, set, action: OptimisticSketchAction) => {
    const current = get(sketchesStateAtom);
    const updated = sketchesReducer(current, action);
    set(hasLoadedFromDbAtom, true); // Mark as loaded
    set(sketchesStateAtom, updated);
  }
);

// Helper atom for database operations with optimistic updates
export const sketchActionsAtom = atom(
  null,
  async (get, set, action: OptimisticSketchAction) => {
    const dbLoadable = get(deSignDbLoadableAtom);

    if (dbLoadable.state !== 'hasData') {
      console.error('Database not ready');
      return;
    }

    const db = dbLoadable.data;

    // Apply optimistic update immediately
    set(sketchesAtom, action);

    try {
      // Perform actual database operation
      switch (action.type) {
        case 'ADD': {
          const sketch = action.payload;
          await db.query(
            `INSERT INTO sketches (id, prompt, html, x, y, width, height, view)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [sketch.id, sketch.prompt, sketch.html, sketch.x, sketch.y,
            sketch.width, sketch.height, sketch.view]
          );
          break;
        }
        case 'UPDATE': {
          const { id, updates } = action.payload;
          const result = await db.query<Sketch>(
            'SELECT * FROM sketches WHERE id = $1',
            [id]
          );
          const sketchToUpdate: Sketch | undefined = result.rows?.at(0);

          if (!sketchToUpdate) {
            throw new Error('Sketch not found');
          }

          const updatedSketch = { ...sketchToUpdate, ...updates };

          // Update sketch
          await db.query(
            `UPDATE sketches 
                 SET prompt = $2, html = $3, x = $4, y = $5, 
                     width = $6, height = $7, view = $8, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $1`,
            [id, updatedSketch.prompt, updatedSketch.html, updatedSketch.x,
              updatedSketch.y, updatedSketch.width, updatedSketch.height, updatedSketch.view]
          );

          if (sketchToUpdate.html !== updatedSketch.html || sketchToUpdate.prompt !== updatedSketch.prompt) {
            // Add to history
            await db.query(
              `INSERT INTO sketch_history (sketch_id, prompt, html)
                     VALUES ($1, $2, $3)`,
              [id, updatedSketch.prompt, updatedSketch.html]
            );
          }

          break;
        }
        case 'DELETE': {
          await db.query('DELETE FROM sketches WHERE id = $1', [action.payload]);
          break;
        }
      }

      // Refresh from database to ensure consistency
      const result = await db.query<Sketch>(
        `SELECT * FROM sketches ORDER BY updated_at DESC`
      );
      set(sketchesAtom, { type: 'SYNC', payload: result.rows });
    } catch (error) {
      console.error('Database operation failed:', error);

      // Rollback optimistic update by re-fetching from database
      const result = await db.query<Sketch>(
        `SELECT * FROM sketches ORDER BY updated_at DESC`
      );
      set(sketchesAtom, { type: 'SYNC', payload: result.rows });
    }
  }
);