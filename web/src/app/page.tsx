import { GenerateImageForm } from '@/features/image/components/features/generate-image-form'
import { JobAccordion } from '@/features/job/components/job-accordion'
import { client } from '@/lib/client'

export default async function Home() {
  const [jobs, models, samplers, loras] = await Promise.all([
    client.api.jobs.$get().then((res) => res.json()),
    client.api.models.$get().then((res) => res.json()),
    client.api.samplers.$get().then((res) => res.json()),
    client.api.loras.$get().then((res) => res.json()),
  ])

  return (
    <div className={'grid grid-cols-[1fr,400px] h-screen'}>
      <div className={'p-6 pt-12 overflow-y-scroll'}>
        <JobAccordion jobs={jobs} />
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
