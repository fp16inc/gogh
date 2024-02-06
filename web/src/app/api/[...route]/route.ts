import * as fs from 'fs'
import path from 'node:path'
import { client } from '@/api/stable-diffusion/client'
import { generateImageSchema } from '@/features/image/components/validations/generate-image-schema'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

const app = new Hono().basePath('/api')

const route = app
  .get('/progress', async (c) => {
    const result = await client.GET('/sdapi/v1/progress', {
      params: {
        query: {
          skip_current_image: true,
        },
      },
    })
    return c.json(result)
  })
  .get('/models', async (c) => {
    const result = await client.GET('/sdapi/v1/sd-models')
    if (result.error) {
      throw new Error()
    }
    return c.json(result)
  })
  .get('/samplers', async (c) => {
    const result = await client.GET('/sdapi/v1/samplers')
    return c.json(result as { data: { name: string }[] })
  })
  .get('/loras', async (c) => {
    const result = await client.GET('/sdapi/v1/loras')
    return c.json(result as { data: { name: string }[] })
  })
  .post(
    '/images/generate',
    zValidator('json', generateImageSchema),
    async (c) => {
      const json = c.req.valid('json')

      const result = await client.POST('/sdapi/v1/txt2img', {
        body: {
          prompt: json.prompt,
          negative_prompt: json.negativePrompt,
          cfg_scale: json.cfgScale,
          steps: json.steps,
          sampler_name: json.samplerName,
          width: json.width,
          height: json.height,
          denoising_strength: json.denoisingStrength,
          batch_size: json.batchSize,
          enable_hr: true,
          hr_scale: json.scale,
          hr_upscaler: 'ESRGAN_4x',
          override_settings: {
            // @ts-expect-error
            sd_model_checkpoint: json.model,
          },
        },
      })

      if (!result.data?.images) {
        throw new Error('failed to generate image')
      }

      const now = new Date()

      const images = result.data.images.map((image, index) => {
        const filename = `${now.getTime()}_${index}.png`
        const filepath = `public/images/${filename}`
        fs.writeFileSync(path.join(process.cwd(), filepath), image, 'base64')
        return filename
      })

      return c.json(images)
    },
  )

const fetch = app.fetch

export { fetch as GET, fetch as PUT, fetch as POST, fetch as DELETE }

export type AppType = typeof route
