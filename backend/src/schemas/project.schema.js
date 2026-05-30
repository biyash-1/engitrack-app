const { z } = require('zod');

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200),
  type: z.enum(['residential', 'commercial', 'infrastructure', 'other'], {
    errorMap: () => ({ message: 'Type must be: residential, commercial, infrastructure, or other' }),
  }),
  description: z.string().max(2000).optional().default(''),
});

const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200).optional(),
  type: z.enum(['residential', 'commercial', 'infrastructure', 'other']).optional(),
  description: z.string().max(2000).optional(),
});

module.exports = { createProjectSchema, updateProjectSchema };
