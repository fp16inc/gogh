import { ImageCarousel } from '@/components/image-carousel'
import { GenerateImageForm } from '@/features/image/components/features/generate-image-form'
import { client } from '@/lib/client'
import { format } from 'date-fns'

export default async function Home() {
  const [jobs, models, samplers, loras] = await Promise.all([
    client.api.jobs.$get().then((res) => res.json()),
    client.api.models.$get().then((res) => res.json()),
    client.api.samplers.$get().then((res) => res.json()),
    client.api.loras.$get().then((res) => res.json()),
  ])

  return (
    <div className={'grid grid-cols-[1fr,400px] h-screen'}>
      <div className={'p-6 pt-12 overflow-y-scroll divide-y'}>
        {jobs.map((job) => (
          <div key={job.id} className={'p-3'}>
            <p className={'text-zinc-300 font-medium text-xs'}>
              {format(job.createdAt, 'yyyy/MM/dd HH:mm')}
            </p>
            <div className={'px-12 mt-2'}>
              <ImageCarousel images={job.Image.map((image) => image.path)} />
            </div>
          </div>
        ))}
      </div>
      <div className={'p-6 border-l h-screen overflow-scroll'}>
        <GenerateImageForm
          models={models.data}
          loras={loras.data}
          samplers={samplers.data}
        />
      </div>
    </div>
  )
}
