import { type AppType } from '@/app/api/[...route]/route'
import { hc } from 'hono/client'

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL is not defined')
}

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL)
