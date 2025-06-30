import { z } from 'zod';

export const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty'),
  image: z.instanceof(File).optional(),
});

export type PromptFormValues = z.infer<typeof promptSchema>;
