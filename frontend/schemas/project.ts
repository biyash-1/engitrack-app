import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name is too long'),
  type: z.enum(['residential', 'commercial', 'infrastructure', 'other'], {
    message: 'Please select a valid project type',
  }),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
