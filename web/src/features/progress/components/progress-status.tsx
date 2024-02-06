'use client'

import { Progress } from '@/components/ui/progress'
import { client } from '@/lib/client'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import useSWR from 'swr'
import { match } from 'ts-pattern'

export const ProgressStatus = () => {
  const { data, error } = useSWR(
    'progress',
    async () => {
      const result = await client.api.progress.$get().then((res) => res.json())
      return result.data
    },
    {
      refreshInterval: 500,
    },
  )

  const status = useMemo(() => {
    if (error) return 'error'
    if (!data) return 'loading'
    if (data.progress > 0) return 'generating'
    return 'idle'
  }, [data, error])

  const label = match(status)
    .with('idle', () => 'アイドル')
    .with('generating', () => '生成中')
    .with('error', () => 'エラー')
    .with('loading', () => '読み込み中')
    .exhaustive()

  return (
    <div className={'flex items-center space-x-2'}>
      <span
        className={cn(
          'inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline',
          {
            'bg-green-500/10 text-green-400': status === 'idle',
            'bg-orange-500/10 text-orange-400': status === 'generating',
            'bg-red-500/10 text-red-400': status === 'error',
          },
        )}
      >
        <span className="relative flex h-1.5 w-1.5 mr-0.5">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              {
                'bg-green-400': status === 'idle',
                'bg-orange-400': status === 'generating',
                'bg-red-400': status === 'error',
              },
            )}
          />
          <span
            className={cn('relative inline-flex rounded-full h-1.5 w-1.5', {
              'bg-green-500': status === 'idle',
              'bg-orange-500': status === 'generating',
              'bg-red-500': status === 'error',
            })}
          />
        </span>

        <span>{label}</span>
      </span>
      {!!data?.progress && (
        <Progress value={data.progress * 100} className={'h-1 w-40'} />
      )}
    </div>
  )
}
