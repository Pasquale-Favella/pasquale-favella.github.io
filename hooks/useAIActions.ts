// hooks/useAIActions.ts
import { useState, useCallback } from 'react';
import { useAIConfig } from './useAIConfig';
import { useMailEditorState } from './useMailEditorState';
import { getAISuggestion, rephraseTextAI, shortenTextAI, lengthenTextAI, generateAIBlocks } from '@/lib/aiService'; // New import
import { BlockToolData, OutputData } from '@editorjs/editorjs';

export function useAIActions() {
  const { selectedProvider, apiKey } = useAIConfig();
  const { editorContent, setEditorContent } = useMailEditorState();

  // States for generating single text suggestions
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // States for editing existing text blocks
  const [internalSelectedBlockId, setInternalSelectedBlockId] = useState<string | null>(null);
  const [editingAIContent, setEditingAIContent] = useState<string | null>(null);
  const [isLoadingEditingAI, setIsLoadingEditingAI] = useState(false);

  // States for generating multiple blocks
  const [blockGenPrompt, setBlockGenPrompt] = useState('');
  const [isLoadingBlockGen, setIsLoadingBlockGen] = useState(false);
  const [generatedBlocks, setGeneratedBlocks] = useState<BlockToolData[] | null>(null); // Using BlockToolData[]
  const [blockGenError, setBlockGenError] = useState<string | null>(null);

  const setSelectedBlockId = useCallback((blockId: string | null) => {
    setInternalSelectedBlockId(blockId);
    setEditingAIContent(null);
    setIsLoadingEditingAI(false);
  }, []);

  const handleFetchSuggestion = useCallback(async () => {
    if (!selectedProvider || !apiKey) {
      setAiSuggestion("Please select an AI provider and enter your API key first.");
      return;
    }
    if (!aiPrompt.trim()) {
      setAiSuggestion("Please enter a prompt for the AI.");
      return;
    }
    setIsLoadingAI(true);
    setAiSuggestion(null);
    const result = await getAISuggestion({ prompt: aiPrompt, provider: selectedProvider, apiKey });
    setAiSuggestion(result);
    setIsLoadingAI(false);
  }, [aiPrompt, selectedProvider, apiKey]);

  const handleInsertSuggestion = useCallback(() => {
    if (aiSuggestion && !aiSuggestion.startsWith('Error:') && aiSuggestion.trim()) {
      const newBlock: BlockToolData = { // Changed to BlockToolData
        id: `ai-${new Date().getTime()}`, // Basic unique ID
        type: 'paragraph',
        data: { text: aiSuggestion },
      };
      const updatedContent: OutputData = {
        ...editorContent,
        blocks: [...editorContent.blocks, newBlock],
        time: new Date().getTime(), // Update time
      };
      setEditorContent(updatedContent);
      setAiSuggestion(null);
      setAiPrompt('');
    }
  }, [aiSuggestion, editorContent, setEditorContent]);

  const handlePerformAIEdit = useCallback(async (action: 'rephrase' | 'shorten' | 'lengthen') => {
    if (!internalSelectedBlockId || !selectedProvider || !apiKey) { // Use internalSelectedBlockId
      setEditingAIContent("Please select a block, AI provider, and enter API key.");
      return;
    }
    const blockToEdit = editorContent.blocks.find(b => b.id === internalSelectedBlockId); // Use internalSelectedBlockId
    if (!blockToEdit || blockToEdit.type !== 'paragraph') {
      setEditingAIContent("Selected block is not a paragraph or not found.");
      return;
    }
    const textToEdit = (blockToEdit.data as { text?: string })?.text; // Type assertion for safety
    if (typeof textToEdit !== 'string' || !textToEdit.trim()) {
      setEditingAIContent("Selected block has no text to edit or text is empty.");
      return;
    }

    setIsLoadingEditingAI(true);
    setEditingAIContent(null);
    const params = { textToEdit, provider: selectedProvider, apiKey };
    let result = null;
    if (action === 'rephrase') result = await rephraseTextAI(params);
    else if (action === 'shorten') result = await shortenTextAI(params);
    else if (action === 'lengthen') result = await lengthenTextAI(params);
    setEditingAIContent(result);
    setIsLoadingEditingAI(false);
  }, [internalSelectedBlockId, selectedProvider, apiKey, editorContent]); // Use internalSelectedBlockId

  const handleConfirmAIEdit = useCallback(() => {
    if (!internalSelectedBlockId || !editingAIContent || editingAIContent.startsWith('Error:')) return; // Use internalSelectedBlockId

    const updatedBlocks = editorContent.blocks.map(block => {
      if (block.id === internalSelectedBlockId && block.type === 'paragraph') { // Use internalSelectedBlockId
        // Ensure data property exists and is an object before spreading
        const currentBlockData = block.data && typeof block.data === 'object' ? block.data : {};
        return {
          ...block,
          data: { ...currentBlockData, text: editingAIContent }
        };
      }
      return block;
    });

    setEditorContent({ ...editorContent, blocks: updatedBlocks, time: new Date().getTime() });
    setInternalSelectedBlockId(null); // Use internal setter
    setEditingAIContent(null);
  }, [internalSelectedBlockId, editingAIContent, editorContent, setEditorContent]); // Use internalSelectedBlockId

  const resetAIActionsState = useCallback(() => {
    setAiPrompt('');
    setAiSuggestion(null);
    setInternalSelectedBlockId(null); // Use internal setter
    setEditingAIContent(null);
    setIsLoadingAI(false);
    setIsLoadingEditingAI(false);
    // Add resets for block generation states
    setBlockGenPrompt('');
    setGeneratedBlocks(null);
    setBlockGenError(null);
    setIsLoadingBlockGen(false);
  }, []); // Add new setters to dependency array if they were not stable (useState setters are stable)

  const handleGenerateBlocks = useCallback(async () => {
    if (!selectedProvider || !apiKey) {
      setBlockGenError("Please select an AI provider and enter your API key first.");
      return;
    }
    if (!blockGenPrompt.trim()) {
      setBlockGenError("Please enter a prompt describing the blocks you want to generate.");
      return;
    }
    setIsLoadingBlockGen(true);
    setGeneratedBlocks(null);
    setBlockGenError(null);

    const { blocks, error } = await generateAIBlocks({
      userPrompt: blockGenPrompt,
      provider: selectedProvider,
      apiKey: apiKey,
    });

    if (error) {
      setBlockGenError(error);
    } else if (blocks && blocks.length > 0) {
      setGeneratedBlocks(blocks);
    } else {
      setBlockGenError("AI did not return any valid blocks. Try rephrasing your prompt.");
    }
    setIsLoadingBlockGen(false);
  }, [blockGenPrompt, selectedProvider, apiKey]);

  const handleInsertGeneratedBlocks = useCallback(() => {
    if (generatedBlocks && generatedBlocks.length > 0) {
      const updatedContent: OutputData = {
        ...editorContent,
        blocks: [...editorContent.blocks, ...generatedBlocks], // Append new blocks
        time: new Date().getTime(),
      };
      setEditorContent(updatedContent);
      setGeneratedBlocks(null);
      setBlockGenPrompt('');
      setBlockGenError(null);
    }
  }, [generatedBlocks, editorContent, setEditorContent]);

  return {
    // Existing states and handlers
    aiPrompt, setAiPrompt,
    isLoadingAI,
    aiSuggestion, setAiSuggestion,
    handleFetchSuggestion,
    handleInsertSuggestion,
    selectedBlockId: internalSelectedBlockId,
    setSelectedBlockId,
    editingAIContent, setEditingAIContent,
    isLoadingEditingAI,
    handlePerformAIEdit,
    handleConfirmAIEdit,
    resetAIActionsState, // Updated reset function

    // New states and handlers for block generation
    blockGenPrompt, setBlockGenPrompt,
    isLoadingBlockGen,
    generatedBlocks,
    blockGenError, setBlockGenError, // Expose setBlockGenError
    handleGenerateBlocks,
    handleInsertGeneratedBlocks,
  };
}
