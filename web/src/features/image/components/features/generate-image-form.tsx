'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { GradientButton } from '@/components/gradient-button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { generateImageSchema } from '@/features/image/components/validations/generate-image-schema'
import { LoraSelect } from '@/features/lora/components/lora-select'
import { ModelSelect } from '@/features/model/components/model-select'
import { SamplerSelect } from '@/features/sampler/components/sampler-select'
import { client } from '@/lib/client'
import { ImagePlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ComponentProps, useState } from 'react'
import { toast } from 'sonner'

const formSchema = generateImageSchema.extend({
  size: z.union([
    z.literal('1x1'),
    z.literal('3x4'),
    z.literal('2x3'),
    z.literal('9x16'),
    z.literal('4x3'),
    z.literal('3x2'),
    z.literal('16x9'),
    z.literal('custom'),
  ]),
})

type FormValues = z.infer<typeof formSchema>

const IMAGE_SIZE_OPTIONS = [
  { label: '768x768 (1:1)', value: '1x1', width: '768', height: '768' },
  { label: '578x768 (3:4)', value: '3x4', width: '578', height: '768' },
  { label: '512x768 (2:3)', value: '2x3', width: '512', height: '768' },
  { label: '431x768 (9:16)', value: '9x16', width: '431', height: '768' },
  { label: '768x576 (4:3)', value: '4x3', width: '768', height: '576' },
  { label: '768x512 (3:2)', value: '3x2', width: '768', height: '512' },
  { label: '768x431 (16:9)', value: '16x9', width: '768', height: '431' },
  { label: 'カスタマイズ', value: 'custom', width: '', height: '' },
] as const

type Props = {
  models: ComponentProps<typeof ModelSelect>['models']
  samplers: ComponentProps<typeof SamplerSelect>['samplers']
  loras: ComponentProps<typeof LoraSelect>['loras']
}

export function GenerateImageForm(props: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues: {
      model: props.models[0]?.title,
      prompt: '',
      negativePrompt: '',
      cfgScale: 7,
      steps: 20,
      samplerName: props.samplers[0]?.name,
      size: '1x1',
      width: 768,
      height: 768,
      denoisingStrength: 0.2,
      scale: 1,
      batchSize: 1,
    },
    resolver: zodResolver(formSchema),
  })

  const watchedSize = form.watch('size')
  const watchedPrompt = form.watch('prompt')

  const handleChangeSize = (value: string) => {
    const target = IMAGE_SIZE_OPTIONS.find((option) => option.value === value)

    if (target) {
      form.setValue('size', target.value)
      form.setValue('width', Number(target.width))
      form.setValue('height', Number(target.height))
    }
  }

  const handleSelectLora = (value: string) => {
    form.setValue('prompt', `${watchedPrompt} <lora:${value}:1>`)
  }

  const onSubmit = async (values: FormValues) => {
    const { size: _size, ...rest } = values

    setIsLoading(true)

    try {
      await client.api.images.generate
        .$post({
          json: rest,
        })
        .then((res) => res.json())

      form.reset()
      toast.success('画像生成が完了しました')

      router.refresh()
    } catch (e) {
      toast.success('画像生成に失敗しました', {
        description: e instanceof Error ? e.message : '不明なエラーです',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading}>
          <div className={'space-y-4'}>
            <FormField
              control={form.control}
              name={'model'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-xs'}>モデル</FormLabel>
                  <FormControl>
                    <ModelSelect
                      models={props.models}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'prompt'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-xs'}>プロンプト</FormLabel>
                  <FormControl>
                    <Textarea className={'border-2'} rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'negativePrompt'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-xs'}>
                    ネガティブプロンプト
                  </FormLabel>
                  <FormControl>
                    <Textarea className={'border-2'} rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'cfgScale'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-xs'}>CFGスケール</FormLabel>
                  <FormControl>
                    <Input className={'border-2'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'steps'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-xs'}>ステップ</FormLabel>
                  <FormControl>
                    <Input type={'number'} className={'border-2'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'model'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-xs'}>サンプラー</FormLabel>
                  <FormControl>
                    <SamplerSelect
                      samplers={props.samplers}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'size'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-xs'}>画像サイズ</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={handleChangeSize}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className={'border-2'}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_SIZE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={'grid grid-cols-2 gap-4'}>
              <FormField
                control={form.control}
                name={'width'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'text-xs'}>Width</FormLabel>
                    <FormControl>
                      <Input
                        className={'border-2'}
                        {...field}
                        disabled={watchedSize !== 'custom'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={'height'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'text-xs'}>Height</FormLabel>
                    <FormControl>
                      <Input
                        className={'border-2'}
                        {...field}
                        disabled={watchedSize !== 'custom'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={'denoisingStrength'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-xs'}>ノイズ除去強度</FormLabel>
                  <FormControl>
                    <Input type={'number'} className={'border-2'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'scale'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-xs'}>高画質倍率</FormLabel>
                  <FormControl>
                    <Input type={'number'} className={'border-2'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'batchSize'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-xs'}>生成枚数</FormLabel>
                  <FormControl>
                    <Input type={'number'} className={'border-2'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {props.loras.length > 0 && (
              <FormItem>
                <FormLabel className={'text-xs'}>Lora</FormLabel>
                <FormControl>
                  <LoraSelect loras={props.loras} onSelect={handleSelectLora} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </div>
        </fieldset>

        <Separator className={'my-6'} />

        <GradientButton
          disabled={isLoading}
          size={'lg'}
          type={'submit'}
          className={'w-full'}
        >
          <ImagePlusIcon className={'w-4 h-4 mr-3'} />
          生成
        </GradientButton>
      </form>
    </Form>
  )
}
