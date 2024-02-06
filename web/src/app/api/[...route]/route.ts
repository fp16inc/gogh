import * as fs from 'fs'
import path from 'node:path'
import { client } from '@/api/stable-diffusion/client'
import { generateImageSchema } from '@/features/image/components/validations/generate-image-schema'
import { prisma } from '@/lib/prisma'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { revalidatePath } from 'next/cache'

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
  .get('/jobs', async (c) => {
    const jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Image: true,
      },
    })
    return c.json(jobs)
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

      const now = new Date()

      const images = prisma.$transaction(async (tx) => {
        if (!result.data?.images) {
          throw new Error('failed to generate image')
        }

        const job = await tx.job.create({
          data: {
            model: json.model,
            prompt: json.prompt,
            negativePrompt: json.negativePrompt,
            cfgScale: json.cfgScale,
            steps: json.steps,
            samplerName: json.samplerName,
            width: json.width,
            height: json.height,
            denoisingStrength: json.denoisingStrength,
            scale: json.scale,
            batchSize: json.batchSize,
          },
        })

        const promises = result.data.images?.map(async (image, index) => {
          const filename = `${now.getTime()}_${index}.png`
          const filepath = `images/${filename}`
          const fullpath = path.join(process.cwd(), 'public', filepath)

          fs.writeFileSync(fullpath, image, 'base64')

          return tx.image.create({
            data: {
              jobId: job.id,
              path: filepath,
            },
          })
        })

        return await Promise.all(promises)
      })

      revalidatePath('/')

      return c.json(images)
    },
  )

const fetch = app.fetch

export { fetch as GET, fetch as PUT, fetch as POST, fetch as DELETE }

export type AppType = typeof route
