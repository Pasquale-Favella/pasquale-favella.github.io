// Cleaned up imports
import { NextSeo } from "next-seo";
import Layout from "@/components/Layout/Layout";
import RichEditor from "@/components/RichEditor/RichEditor";
// Removed direct useAtom from 'jotai' and specific atom imports for page state
import { OutputData, BlockToolData } from "@editorjs/editorjs"; // BlockToolData might not be needed if not used directly by page
import LivePreview from '@/components/MailEditor/LivePreview';
import { aiProvidersList, AIProvider } from "@/store/aiConfig.atom"; // Keep AIProvider type and list for UI
// Removed AI service function imports, they are now in useAIActions
// Removed useState import as local states are moved to hooks

// Import custom hooks
import { useMailEditorState } from "@/hooks/useMailEditorState";
import { useAIConfig } from "@/hooks/useAIConfig";
import { useAIActions } from "@/hooks/useAIActions";

const MailTemplateEditorPage: React.FC = () => {
  const { editorContent, setEditorContent } = useMailEditorState();
  const {
    selectedProvider, // Renamed from selectedProviderForSelect for clarity in page
    setSelectedProvider, // Renamed from setSelectedProviderForSelect
    apiKey, // Renamed from apiKeyForInput for clarity in page
    setApiKey, // Renamed from setApiKeyForInput
    aiFeaturesEnabled,
    setAiFeaturesEnabled, // This is the enhanced setter from the hook
    apiKeyDocUrl, // Destructure apiKeyDocUrl
  } = useAIConfig();

  const {
    aiPrompt, setAiPrompt,
    isLoadingAI,
    aiSuggestion, // setAiSuggestion is not directly used by page, handled by useAIActions
    handleFetchSuggestion,
    handleInsertSuggestion,
    selectedBlockId, setSelectedBlockId, // setSelectedBlockId is the enhanced one from useAIActions
    editingAIContent, // setEditingAIContent is not directly used by page, handled by useAIActions
    isLoadingEditingAI,
    handlePerformAIEdit,
    handleConfirmAIEdit,
    resetAIActionsState,
    // Destructure new block generation states and handlers
    blockGenPrompt, setBlockGenPrompt,
    isLoadingBlockGen,
    generatedBlocks,
    blockGenError, // setBlockGenError is also available if needed for manual error setting
    handleGenerateBlocks,
    handleInsertGeneratedBlocks,
  } = useAIActions();

  const paragraphBlocks = editorContent.blocks.filter(block => block.type === 'paragraph');

  const handleToggleAIFeatures = (enabled: boolean) => {
    setAiFeaturesEnabled(enabled); // This will clear provider/key via the useAIConfig hook's logic
    if (!enabled) {
      resetAIActionsState(); // Clear AI action specific states from useAIActions
    }
  };

  // handleEditorChange remains the same as it uses setEditorContent from useMailEditorState
  const handleEditorChange = (data: OutputData | undefined) => {
    if (data) {
      setEditorContent(data);
    }
  };

  // All other handlers (handleFetchSuggestion, handleInsertSuggestion, handlePerformAIEdit, handleConfirmAIEdit)
  // are now obtained from the useAIActions hook.

  return (
    <Layout>
      <NextSeo
        title="Mail Template Editor"
        description="Create and edit beautiful mail templates with an advanced editor and AI-powered suggestions."
      />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mail Template Editor</h1>
        <div className="bg-white shadow-md rounded-lg p-4">
          <RichEditor
            initialData={editorContent} // From useMailEditorState
            onEditorChange={handleEditorChange} // Remains local, uses setEditorContent from useMailEditorState
            placeholder="Start crafting your mail template..."
            className="min-h-[400px] border rounded-md p-2"
          />
        </div>
        <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
          <LivePreview editorData={editorContent} /> {/* From useMailEditorState */}
        </div>

        {/* AI Configuration and Suggestions Section */}
        <div className="mt-8 p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">AI Tools</h2>
          {/* AI Config Sub-section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ai-provider-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select AI Provider
                </label>
                <select
                  id="ai-provider-select"
                  value={selectedProvider || ''} // From useAIConfig
                  onChange={(e) => setSelectedProvider(e.target.value as AIProvider || null)} // From useAIConfig
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={!aiFeaturesEnabled} // From useAIConfig
                >
                  <option value="">Select a provider</option>
                  {aiProvidersList.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  id="api-key-input"
                  value={apiKey} // From useAIConfig
                  onChange={(e) => setApiKey(e.target.value)} // From useAIConfig
                  placeholder="Enter your API key"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={!aiFeaturesEnabled} // From useAIConfig
                />
                {apiKeyDocUrl && selectedProvider && aiFeaturesEnabled && (
                  <div className="mt-1 text-xs">
                    <a
                      href={apiKeyDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    >
                      Where to find the API key for {aiProvidersList.find(p => p.id === selectedProvider)?.name}?
                    </a>
                  </div>
                )}
              </div>
            </div>
          {/* Toggle for enabling/disabling AI features */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Enable AI Features</span>
              <button
                onClick={() => handleToggleAIFeatures(!aiFeaturesEnabled)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none ${
                  aiFeaturesEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    aiFeaturesEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          {selectedProvider && apiKey && aiFeaturesEnabled && ( // Also check aiFeaturesEnabled here
            <p className="text-sm text-green-600 mt-2">
                AI features enabled with {aiProvidersList.find(p => p.id === selectedProvider)?.name}.
              </p>
            )}
          </div>

          {/* AI-Powered Suggestions Sub-section */}
          {aiFeaturesEnabled && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generate New Content</h3>
              <textarea
                value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., Write a welcome email for new subscribers to our tech newsletter."
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoadingAI || !selectedProvider || !apiKey || !aiFeaturesEnabled} // Also disable if features are off
            />
            <button
              onClick={handleFetchSuggestion}
              disabled={isLoadingAI || !selectedProvider || !apiKey || !aiPrompt.trim() || !aiFeaturesEnabled} // Also disable if features are off
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
            >
              {isLoadingAI ? '⚙️ Generating...' : 'Get Suggestion'}
            </button>

            {aiSuggestion && (
              <div className="mt-4 p-3 border rounded-md bg-gray-50">
                <h4 className="text-md font-semibold mb-1">Suggestion:</h4>
                <p className={`text-sm ${aiSuggestion.startsWith('Error:') ? 'text-red-700 font-semibold p-2 bg-red-100 rounded-md' : 'text-gray-700'}`}>
                  {aiSuggestion}
                </p>
                {!aiSuggestion.startsWith('Error:') && aiSuggestion.trim() && (
                  <button
                    onClick={handleInsertSuggestion}
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs"
                  >
                    Insert into Editor
                  </button>
                )}
              </div>
            )}
            </div>
          )}

          {/* AI Content Editing Sub-section */}
          {aiFeaturesEnabled && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Edit Existing Paragraph</h3>
              {paragraphBlocks.length > 0 ? (
                <div>
                  <label htmlFor="block-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Select a Paragraph Block to Edit:
                  </label>
                  <select
                    id="block-select"
                    value={selectedBlockId || ''}
                    onChange={(e) => {
                    setSelectedBlockId(e.target.value || null); // setSelectedBlockId from useAIActions
                    // setEditingAIContent(null); // This is now handled by the enhanced setSelectedBlockId in useAIActions
                    }}
                  className="mb-1 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={!aiFeaturesEnabled}
                  >
                    <option value="">-- Select a block --</option>
                    {paragraphBlocks.map(block => ( // paragraphBlocks uses editorContent from useMailEditorState
                      <option key={block.id} value={block.id!}>
                        {(block.data as {text: string}).text?.substring(0, 50) + ((block.data as {text: string}).text?.length > 50 ? '...' : '') || `Block ID: ${block.id}`}
                      </option>
                    ))}
                  </select>
                <p className="text-xs text-gray-500 mt-1 mb-2">Select a paragraph from the dropdown. Its text will appear below for AI editing.</p>

                  {selectedBlockId && paragraphBlocks.find(b => b.id === selectedBlockId)?.data.text && (
                    <div className="my-2 p-2 border rounded bg-gray-50">
                      <p className="text-sm font-semibold">Selected text:</p>
                      <p className="text-sm text-gray-600 italic">"{(paragraphBlocks.find(b => b.id === selectedBlockId)?.data as {text:string}).text}"</p>
                    </div>
                  )}

                  {selectedBlockId && ( // selectedBlockId from useAIActions
                    <div className="space-x-2 mt-2">
                      <button onClick={() => handlePerformAIEdit('rephrase')} disabled={isLoadingEditingAI || !selectedProvider || !apiKey || !aiFeaturesEnabled} className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 text-sm">Rephrase</button>
                      <button onClick={() => handlePerformAIEdit('shorten')} disabled={isLoadingEditingAI || !selectedProvider || !apiKey || !aiFeaturesEnabled} className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 text-sm">Shorten</button>
                      <button onClick={() => handlePerformAIEdit('lengthen')} disabled={isLoadingEditingAI || !selectedProvider || !apiKey || !aiFeaturesEnabled} className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 text-sm">Lengthen</button>
                    </div>
                  )}

                  {isLoadingEditingAI && <p className="text-sm text-blue-600 mt-2">⚙️ AI is editing...</p>} {/* isLoadingEditingAI from useAIActions */}

                  {editingAIContent && ( // editingAIContent from useAIActions
                    <div className="mt-4 p-3 border rounded-md bg-gray-50">
                      <h4 className="text-md font-semibold mb-1">Edited Suggestion:</h4>
                      <p className={`text-sm ${editingAIContent.startsWith('Error:') ? 'text-red-600' : 'text-gray-700'}`}>
                        {editingAIContent}
                      </p>
                      {!editingAIContent.startsWith('Error:') && editingAIContent.trim() && (
                        <button onClick={handleConfirmAIEdit} className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs">Apply Changes</button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Add some paragraph blocks to the editor to enable AI editing features.</p>
              )}
            </div>
          )}

          {/* Section for Generating Multiple Blocks with AI */}
          {aiFeaturesEnabled && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generate Multiple Blocks with AI</h3>

              <label htmlFor="block-gen-prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Describe the blocks you want to create:
              </label>
              <textarea
                id="block-gen-prompt"
                value={blockGenPrompt}
                onChange={(e) => setBlockGenPrompt(e.target.value)}
                placeholder="e.g., A welcome header, an introductory paragraph, and a bullet list of key features."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoadingBlockGen || !selectedProvider || !apiKey}
              />
              <button
                onClick={handleGenerateBlocks}
                disabled={isLoadingBlockGen || !selectedProvider || !apiKey || !blockGenPrompt.trim()}
                className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:bg-gray-300"
              >
                {isLoadingBlockGen ? '⚙️ Generating Blocks...' : 'Generate Blocks'}
              </button>

              {blockGenError && (
                <div className="mt-4 p-3 border rounded-md bg-red-100">
                  <p className="text-sm text-red-700 font-semibold">{blockGenError}</p>
                </div>
              )}

              {generatedBlocks && generatedBlocks.length > 0 && (
                <div className="mt-4 p-3 border rounded-md bg-gray-50">
                  <h4 className="text-md font-semibold mb-1">Generated Blocks Preview:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 max-h-40 overflow-y-auto">
                    {generatedBlocks.map((block, index) => (
                      <li key={block.id || `gen-block-${index}`}>
                        Type: <span className="font-semibold">{block.type}</span> - Preview: {
                          (block.data as any).text?.substring(0, 30) ||
                          ((block.data as any).items && Array.isArray((block.data as any).items) ? (block.data as any).items.join(', ').substring(0,30) : '') ||
                          ((block.data as any).file?.url ? (block.data as any).file.url.substring(0,30) : '') ||
                          'N/A'
                        }...
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleInsertGeneratedBlocks}
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs"
                  >
                    Add These Blocks to Editor
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MailTemplateEditorPage;
