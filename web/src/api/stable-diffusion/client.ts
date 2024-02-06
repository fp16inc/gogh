import createClient from 'openapi-fetch'
import { paths } from './schema'

export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLICK_STABLE_DIFFUSION_BASE_URL,
})
