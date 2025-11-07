import { atom } from 'jotai';
import { encode } from "@toon-format/toon";
import { get_encoding, Tiktoken } from "tiktoken";

// Types
export interface ComparisonStats {
    jsonTokens: number;
    toonTokens: number;
    savings: number;
}

export type EncodingType = 'cl100k_base' | 'p50k_base' | 'r50k_base' | 'gpt2';

// ============================================
// BASE ATOMS (source of truth)
// ============================================

// User's JSON input
export const jsonInputAtom = atom<string>(
    JSON.stringify({
        "users": [
            { "id": 1, "name": "Alice", "role": "admin", "email": "alice@example.com" },
            { "id": 2, "name": "Bob", "role": "user", "email": "bob@example.com" },
            { "id": 3, "name": "Charlie", "role": "editor", "email": "charlie@example.com" },
            { "id": 4, "name": "Diana", "role": "user", "email": "diana@example.com" }
        ]
    }, null, 2)
);

// Selected encoding type
export const encodingTypeAtom = atom<EncodingType>('cl100k_base');

// ============================================
// DERIVED ATOMS (computed from base atoms)
// ============================================

// Parse and format JSON (with error handling)
export const parsedJsonAtom = atom((get) => {
    const input = get(jsonInputAtom);
    try {
        return {
            data: JSON.parse(input),
            formatted: JSON.stringify(JSON.parse(input), null, 2),
            error: null
        };
    } catch (e) {
        return {
            data: null,
            formatted: input,
            error: e instanceof Error ? e.message : "Invalid JSON. Please check your input."
        };
    }
});

// TOON output (auto-computed from JSON)
export const toonOutputAtom = atom((get) => {
    const { data, error } = get(parsedJsonAtom);
    if (error || !data) return '';

    try {
        return encode(data);
    } catch {
        return '';
    }
});

// Error atom (for UI display)
export const errorAtom = atom((get) => {
    const { error } = get(parsedJsonAtom);
    return error;
});

// Stats (auto-computed from JSON and TOON with proper encoder cleanup)
export const statsAtom = atom((get) => {
    const { formatted, error } = get(parsedJsonAtom);
    const toon = get(toonOutputAtom);
    const encodingType = get(encodingTypeAtom);

    if (error || !toon) {
        return {
            jsonTokens: 0,
            toonTokens: 0,
            savings: 0
        };
    }

    let encoder: Tiktoken | null = null;

    try {
        encoder = get_encoding(encodingType);

        const jsonTokens = encoder.encode(formatted).length;
        const toonTokens = encoder.encode(toon).length;

        const savings = jsonTokens > 0
            ? ((jsonTokens - toonTokens) / jsonTokens) * 100
            : 0;

        return {
            jsonTokens,
            toonTokens,
            savings
        };
    } catch (e) {
        console.error('Error encoding with tiktoken:', e);
        return {
            jsonTokens: 0,
            toonTokens: 0,
            savings: 0
        };
    } finally {
        // Always cleanup encoder after use
        if (encoder) {
            encoder.free();
        }
    }
});

// ============================================
// ACTIONS (write-only atoms)
// ============================================

// Format JSON action
export const formatJsonAtom = atom(
    null,
    (get, set) => {
        const { formatted, error } = get(parsedJsonAtom);
        if (!error) {
            set(jsonInputAtom, formatted);
        }
    }
);