import { FC, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { streamText, CoreMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { useMailEditor } from '@/hooks/use-mail-editor';
import { VscClippy } from 'react-icons/vsc';
import { LuMonitor, LuTablet, LuSmartphone } from 'react-icons/lu';
import TipTapEditor from '../TipTapEditor';
import MailPromptForm from './MailPromptForm';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { promptSchema, PromptFormValues } from '@/types/mail';

const MailEditor: FC = () => {
  const { content, setContent, systemPrompt, provider, model, apiKey } =
    useMailEditor();

  const [view, setView] = useState<'editor' | 'preview'>('editor');
  const [screenSize, setScreenSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const methods = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
  });
  const { setValue, reset } = methods;

  const aiProvider = useMemo(() => {
    if (!apiKey) return null;
    switch (provider) {
      case 'openai':
        return createOpenAI({ apiKey });
      case 'anthropic':
        return createAnthropic({ apiKey });
      case 'google':
        return createGoogleGenerativeAI({ apiKey });
      default:
        return null;
    }
  }, [provider, apiKey]);

  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const enhancePrompt = useCallback(
    async (prompt: string) => {
      if (!aiProvider || !prompt) return;

      setIsEnhancing(true);
      let enhancedPrompt = '';

      try {
        const result = streamText({
          model: aiProvider(model),
          prompt: prompt,
          onError: (err) => {
            toast.error((err.error as Error).message);
          },
          onFinish: (step) => {
            console.log({ step });
            toast.success('Prompt enhanced successfully!');
          },
          system:
            'You are an expert in crafting email generation prompts. Enhance the following user prompt to be more detailed and effective for generating a professional email template. Respond only with the enhanced prompt, without any additional text or explanations.',
        });

        for await (const delta of result.textStream) {
          enhancedPrompt += delta;
        }

        setValue('prompt', enhancedPrompt);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setIsEnhancing(false);
      }
    },
    [aiProvider, model, setValue]
  );

  const handleEditorChange = useCallback(
    (html: string) => {
      setContent(html);
    },
    [setContent]
  );

  const generateTemplate = useCallback(
    async (data: PromptFormValues) => {
      if (!aiProvider) return;

      setIsLoading(true);

      let fullCompletion = '';

      try {
        const userMessage: CoreMessage = {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Based on the following HTML, please apply the following changes: ${data.prompt}. Here is the HTML: ${content}`,
            },
          ],
        };

        if (data.image && Array.isArray(userMessage.content)) {
          const imageBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            if (data.image) {
              reader.readAsDataURL(data.image);
            } else {
              reject(new Error('Image not found'));
            }
          });

          userMessage.content.push({
            type: 'image',
            image: imageBase64,
          });
        }

        const result = streamText({
          model: aiProvider(model),
          messages: [userMessage],
          system: systemPrompt,
          onError: (err) => {
            toast.error((err.error as Error).message);
          },
          onFinish: (step) => {
            console.log({ step });
            toast.success('Template generated successfully!');
          },
        });

        for await (const delta of result.textStream) {
          fullCompletion += delta;
        }

        handleEditorChange(fullCompletion);
        reset();
        if (view !== 'preview') setView('preview');
      } catch (err) {
        console.log({err})
        toast.error((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    [
      aiProvider,
      model,
      systemPrompt,
      content,
      handleEditorChange,
      view,
      reset,
    ]
  );

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Editor</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={view === 'preview'}
            onChange={() => setView(view === 'editor' ? 'preview' : 'editor')}
          />
          <span className="font-semibold">Preview</span>
        </div>
        {view === 'preview' && (
          <div className="flex items-center gap-2 border rounded-md p-1">
            <div className="tooltip" data-tip="Desktop">
              <button
                className={`btn btn-sm btn-ghost ${screenSize === 'desktop' ? 'btn-active' : ''}`}
                onClick={() => setScreenSize('desktop')}
              >
                <LuMonitor size={20} />
              </button>
            </div>
            <div className="tooltip" data-tip="Tablet">
              <button
                className={`btn btn-sm btn-ghost ${screenSize === 'tablet' ? 'btn-active' : ''}`}
                onClick={() => setScreenSize('tablet')}
              >
                <LuTablet size={20} />
              </button>
            </div>
            <div className="tooltip" data-tip="Mobile">
              <button
                className={`btn btn-sm btn-ghost ${screenSize === 'mobile' ? 'btn-active' : ''}`}
                onClick={() => setScreenSize('mobile')}
              >
                <LuSmartphone size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {view === 'editor' ? (
        <TipTapEditor content={content} onUpdate={handleEditorChange} />
      ) : (
        <div className={`flex justify-center ${screenSize === 'desktop' ? 'w-full' : screenSize === 'tablet' ? 'w-3/4' : 'w-1/2'} mx-auto`}>
          <div className="relative border p-4 rounded-lg min-h-48 w-full">
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl min-w-full"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <div
              className="tooltip absolute top-2 right-2"
              data-tip="Copy HTML"
            >
              <button
                onClick={() => navigator.clipboard.writeText(content)}
                className="btn btn-square btn-sm"
              >
                <VscClippy size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mt-4">
        <FormProvider {...methods}>
          <MailPromptForm
            onSubmit={generateTemplate}
            onEnhance={enhancePrompt}
            isLoading={isLoading}
            isEnhancing={isEnhancing}
            apiKey={apiKey}
          />
        </FormProvider>
      </div>
    </div>
  );
};

export default MailEditor;
