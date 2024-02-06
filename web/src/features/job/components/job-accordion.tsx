import { ImageCarousel } from '@/components/image-carousel'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { JobDescriptionList } from '@/features/job/components/job-description-list'
import { format } from 'date-fns'
import { ComponentProps } from 'react'

type JobWithImages = ComponentProps<typeof JobDescriptionList>['job'] & {
  Image: { path: string }[]
}

type Props = {
  jobs: JobWithImages[]
}

export function JobAccordion(props: Props) {
  return (
    <Accordion type={'multiple'}>
      {props.jobs.map((job) => (
        <AccordionItem key={job.id} value={String(job.id)}>
          <AccordionTrigger>
            <div className={'text-left'}>
              <p className={'text-xs text-zinc-100/60'}>
                {format(job.createdAt, 'yyyy/MM/dd HH:mm')}
              </p>
            </div>
          </AccordionTrigger>

          {!!job.Image.length && (
            <div className={'pb-4 px-12'}>
              <ImageCarousel images={job.Image.map((image) => image.path)} />
            </div>
          )}

          <AccordionContent>
            <div
              className={'px-6 py-2 bg-zinc-400/10 backdrop-blur rounded-lg'}
            >
              <JobDescriptionList job={job} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
