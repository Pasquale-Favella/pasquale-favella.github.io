import { FC, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { streamText, CoreMessage, LanguageModelV1Middleware, wrapLanguageModel } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import DOMPurify from 'dompurify';
import { useMailEditor } from '@/hooks/use-mail-editor';
import { VscEdit, VscCode, VscEye } from 'react-icons/vsc';
import { LuMonitor, LuTablet, LuSmartphone } from 'react-icons/lu';
import MailPromptForm from './MailPromptForm';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { promptSchema, PromptFormValues } from '@/types/mail';
import MailCodeEditor from './MailCodeEditor/MailCodeEditor';
import MailPreview from './MailPreview/MailPreview';
import MailHistoryDrawer from './MailHistoryDrawer';

const MailEditor: FC = () => {
  const {
    mailContent,
    setMailContent,
    systemPrompt,
    provider,
    model,
    apiKey,
    setContentWithHistory,
  } = useMailEditor();

  const [view, setView] = useState<'code' | 'preview'>('preview');
  const [screenSize, setScreenSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

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
              text: `Based on the following HTML, please apply the following changes: ${data.prompt}. Here is the HTML: ${mailContent}`,
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

        const htmlSanitizerMiddleware: LanguageModelV1Middleware = {
          wrapGenerate: async ({ doGenerate }) => {
            const { text, ...rest } = await doGenerate();
            const sanitizedText = text ? DOMPurify.sanitize(text) : text;
            return { text: sanitizedText, ...rest };
          },
        };

        const modelWithSanitizer = wrapLanguageModel({
          model: aiProvider(model),
          middleware: htmlSanitizerMiddleware,
        });

        const result = streamText({
          model: modelWithSanitizer,
          messages: [userMessage],
          system: systemPrompt,
          onError: (err) => {
            toast.error((err.error as Error).message);
          },
          onFinish: (step) => {
            if(step.finishReason === 'stop') {
              toast.success('Template generated successfully!');
            }
          },
        });

        for await (const delta of result.textStream) {
          fullCompletion += delta;
        }

        setContentWithHistory(fullCompletion); // Use the new atom to set content and manage history
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
      mailContent,
      setContentWithHistory,
      view,
      reset,
    ]
  );

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2 border rounded-md p-1">
          <div className="tooltip" data-tip="Preview">
            <button
              className={`btn btn-sm btn-ghost ${view === 'preview' ? 'btn-active' : ''}`}
              onClick={() => setView('preview')}
            >
              <VscEye size={20} />
            </button>
          </div>

          <div className="tooltip" data-tip="Code Editor">
            <button
              className={`btn btn-sm btn-ghost ${view === 'code' ? 'btn-active' : ''}`}
              onClick={() => setView('code')}
            >
              <VscCode size={20} />
            </button>
          </div>
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
        
        <MailHistoryDrawer />
          
      </div>

      {view === 'code' ? (
        <MailCodeEditor content={mailContent} onUpdate={setMailContent} />
      ) : (
        <MailPreview
          content={mailContent}
          screenSize={screenSize}
        />
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
