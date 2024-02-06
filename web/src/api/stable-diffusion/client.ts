import createClient from 'openapi-fetch'
import { components, paths } from './schema'

export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_STABLE_DIFFUSION_BASE_URL,
})

export type Schemas = components['schemas']
