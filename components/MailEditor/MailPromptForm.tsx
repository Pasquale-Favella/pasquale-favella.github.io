import { FC, ChangeEvent, useRef, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  VscGear,
  VscArrowRight,
  VscSparkle,
  VscLink,
  VscClose,
} from 'react-icons/vsc';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/Popover';
import MailSettings from './MailSettings';
import { PromptFormValues } from '@/types/mail';

interface MailPromptFormProps {
  onSubmit: (data: PromptFormValues) => void;
  onEnhance: (prompt: string) => void;
  isLoading: boolean;
  isEnhancing: boolean;
  apiKey: string | null;
}

const MailPromptForm: FC<MailPromptFormProps> = ({
  onSubmit,
  onEnhance,
  isLoading,
  isEnhancing,
  apiKey,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PromptFormValues>();

  const prompt = watch('prompt');
  const image = watch('image');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!(image instanceof File)) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setValue('image', e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setValue('image', undefined);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {preview && (
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1"
          >
            <VscClose />
          </button>
        </div>
      )}
      <div className="relative">
        <textarea
          {...register('prompt')}
          className="w-full p-4 border rounded pr-12 pb-10"
          rows={3}
          placeholder="Enter your prompt here..."
        />
        <div className="absolute top-2 right-2">
          <button
            type="submit"
            className="btn btn-square btn-sm btn-primary"
            disabled={isLoading || !apiKey || !prompt}
          >
            {isLoading ? (
              <span className="loading loading-spinner" />
            ) : (
              <VscArrowRight size={24} />
            )}
          </button>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
           <div className="tooltip" data-tip="Attach Image">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-square btn-sm"
            >
              <VscLink size={24} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          
          <div className="tooltip" data-tip="Enhance Prompt">
            <button
              type="button"
              onClick={() => onEnhance(prompt)}
              className="btn btn-square btn-sm"
              disabled={isEnhancing || !apiKey || !prompt}
            >
              {isEnhancing ? (
                <span className="loading loading-spinner" />
              ) : (
                <VscSparkle size={24} />
              )}
            </button>
          </div>

          <div className="tooltip" data-tip="AI Settings">
            <Popover>
              <PopoverTrigger className="btn btn-square btn-sm">
                <VscGear size={24} />
              </PopoverTrigger>
              <PopoverContent>
                <MailSettings />
              </PopoverContent>
            </Popover>
          </div>
          
        </div>
      </div>
      {errors.prompt && (
        <p className="text-red-500">{errors.prompt.message}</p>
      )}
    </form>
  );
};

export default MailPromptForm;
