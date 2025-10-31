import { Sketch, CanvasTransform, designSketchAiProviderAtom, designSketchAiModelAtom, designSketchAiApiKeyAtom, DesignSketchAiProvider, providerModels, sketchesAtom, sketchActionsAtom, aiProviderAtom, generateHtmlAtom, editHtmlAtom } from '@/store/de-sign.atom';
import { useLiveQuery } from '@electric-sql/pglite-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';

export const useDesign = () => {
    const [provider, setProvider] = useAtom(designSketchAiProviderAtom);
    const [model, setModel] = useAtom(designSketchAiModelAtom);
    const [apiKey, setApiKey] = useAtom(designSketchAiApiKeyAtom);

    const generateHtml = useSetAtom(generateHtmlAtom);
    const editHtml = useSetAtom(editHtmlAtom);

    const sketches = useAtomValue(sketchesAtom);
    const dispatch = useSetAtom(sketchActionsAtom);

    const [selectedSketchId, setSelectedSketchId] = useState<string | null>(null);
    const [canvasTransform, setCanvasTransform] = useState<CanvasTransform>({
        x: 0,
        y: 0,
        scale: 1
    });

    const handleProviderChange = useCallback(
        (newProvider: DesignSketchAiProvider) => {
            setProvider(newProvider);
            setModel(providerModels[newProvider][0]);
        },
        [setProvider, setModel]
    );

    const addSketch = async (sketch: Sketch) => {
        await dispatch({ type: 'ADD', payload: sketch });
    }

    const updateSketch = async (id: string, updates: Partial<Sketch>) => {
        await dispatch({ type: 'UPDATE', payload: { id, updates } });
    }


    const deleteSketch = async (id: string) => {
        await dispatch({ type: 'DELETE', payload: id });

        if (selectedSketchId === id) {
            setSelectedSketchId(null);
        }
    }

    const duplicateSketch = useCallback((id: string) => {
        const original = sketches.find(s => s.id === id);
        if (original) {
            const newSketch: Sketch = {
                ...original,
                id: `sketch_${Date.now()}`,
                x: original.x + 20,
                y: original.y + 20,
            };
            addSketch(newSketch);
        }
    }, [sketches, addSketch]);

    const getSketchById = useCallback((id: string) => {
        return sketches.find(s => s.id === id);
    }, [sketches]);

    const fitToScreen = useCallback((containerWidth: number, containerHeight: number) => {
        if (sketches.length === 0) {
            setCanvasTransform({ x: 0, y: 0, scale: 1 });
            return;
        }

        const PADDING = 100;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        sketches.forEach(s => {
            minX = Math.min(minX, s.x);
            minY = Math.min(minY, s.y);
            maxX = Math.max(maxX, s.x + s.width);
            maxY = Math.max(maxY, s.y + s.height);
        });

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;

        if (contentWidth <= 0 || contentHeight <= 0) return;

        const scaleX = (containerWidth - PADDING * 2) / contentWidth;
        const scaleY = (containerHeight - PADDING * 2) / contentHeight;
        const newScale = Math.min(scaleX, scaleY, 1.5);

        const newX = (containerWidth / 2) - ((minX + contentWidth / 2) * newScale);
        const newY = (containerHeight / 2) - ((minY + contentHeight / 2) * newScale);

        setCanvasTransform({ x: newX, y: newY, scale: newScale });
    }, [sketches]);

    const setZoom = useCallback((scale: number) => {
        setCanvasTransform(prev => ({ ...prev, scale }));
    }, []);

    return {
        // State
        sketches,
        selectedSketchId,
        canvasTransform,

        // Sketch operations
        addSketch,
        updateSketch,
        deleteSketch,
        duplicateSketch,
        getSketchById,

        // Selection
        setSelectedSketchId,
        setCanvasTransform,
        setZoom,
        fitToScreen,

        //AI
        generateHtml,
        editHtml,
        provider,
        model,
        apiKey,
        handleProviderChange,
        setModel,
        setApiKey,
    };
};

export const useDesignSketchById = (id: string) => {
    const sketchQuery = useLiveQuery(`
        SELECT *
        FROM sketches
        WHERE id = $1
    `, [id]);

    const sketch: Sketch | undefined = useMemo(() => {
        return sketchQuery?.rows?.at(0);
    }, [sketchQuery?.rows]);

    return sketch;
}

export const useDesignAiGeneratedSketchHistoryById = (id: string) => {
    const recentHistoryQuery = useLiveQuery(`
            SELECT prompt, html, created_at AS timestamp
            FROM ai_generated_sketch_history
            WHERE sketch_id = $1
            ORDER BY timestamp ASC;
        `, [id]);

    const promptHistory = useMemo(() => {
        const sketchHistory: { sketchId: string; prompt: string; html: string; timestamp: string }[] = recentHistoryQuery?.rows ?? [];
        return sketchHistory.map(s => ({
            ...s, timestamp: new Date(s.timestamp).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }));
    }, [recentHistoryQuery?.rows]);

    return promptHistory;
}