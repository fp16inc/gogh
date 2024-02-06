import { z } from 'zod'

export const generateImageSchema = z.object({
  model: z.string(),
  prompt: z.string(),
  negativePrompt: z.string(),
  cfgScale: z.coerce.number(),
  steps: z.coerce.number(),
  samplerName: z.string(),
  width: z.coerce.number(),
  height: z.coerce.number(),
  denoisingStrength: z.coerce.number(),
  scale: z.coerce.number(),
  batchSize: z.coerce.number(),
})
