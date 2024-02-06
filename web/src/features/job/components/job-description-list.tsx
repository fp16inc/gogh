'use client'

import { CopyToClipboardButton } from '@/components/copy-to-clipboard-button'
import {
  DescriptionList,
  DescriptionListLabel,
  DescriptionListRow,
  DescriptionListValue,
} from '@/components/description-list'
import { Button } from '@/components/ui/button'
import { Job } from '@prisma/client'
import { ClipboardCheckIcon, ClipboardIcon } from 'lucide-react'

type SerializedJob = Omit<Job, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

type Props = {
  job: SerializedJob
}

export const JobDescriptionList = ({ job }: Props) => {
  const properties = [
    {
      label: 'モデル',
      value: job.model,
      isDisplay: true,
    },
    {
      label: 'プロンプト',
      value: job.prompt,
      isDisplay: true,
    },
    {
      label: 'ネガティブプロンプト',
      value: job.negativePrompt,
      isDisplay: true,
    },
    {
      label: 'CFGスケール',
      value: job.cfgScale,
      isDisplay: true,
    },
    {
      label: 'ステップ',
      value: job.steps,
      isDisplay: true,
    },
    {
      label: 'サンプラー',
      value: job.samplerName,
      isDisplay: true,
    },
    {
      label: '画像サイズ',
      value: `${job.width}x${job.height}`,
      isDisplay: true,
    },
    {
      label: 'ノイズ除去強度',
      value: job.denoisingStrength,
      isDisplay: true,
    },
    {
      label: '高画質倍率',
      value: job.scale,
      isDisplay: true,
    },
    {
      label: '生成枚数',
      value: job.batchSize,
      isDisplay: true,
    },
  ].filter((property) => property.isDisplay)

  return (
    <DescriptionList>
      {properties.map((property) => (
        <DescriptionListRow key={property.label}>
          <DescriptionListLabel>{property.label}</DescriptionListLabel>
          <DescriptionListValue
            className={'flex justify-between items-start gap-2'}
          >
            <span className={'flex-1'}>{property.value || '未設定'}</span>
            <CopyToClipboardButton
              render={({ copyToClipboard, hasCopiedText }) => (
                <Button
                  type={'button'}
                  size={'icon'}
                  variant={'outline'}
                  className={'w-6 h-6'}
                  onClick={() => copyToClipboard(property.value.toString())}
                >
                  {hasCopiedText ? (
                    <ClipboardCheckIcon className={'w-3 h-3'} />
                  ) : (
                    <ClipboardIcon className={'w-3 h-3'} />
                  )}
                </Button>
              )}
            />
          </DescriptionListValue>
        </DescriptionListRow>
      ))}
    </DescriptionList>
  )
}
