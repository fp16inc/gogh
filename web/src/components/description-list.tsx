import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type DataListProps = {
  className?: string
  children: ReactNode
}

export const DescriptionList = ({ children, className }: DataListProps) => {
  return (
    <dl className={cn('divide-y divide-white/10', className)}>{children}</dl>
  )
}

type DescriptionListRowProps = {
  className?: string
  children: ReactNode
}

export const DescriptionListRow = ({
  className,
  children,
}: DescriptionListRowProps) => {
  return (
    <div
      className={cn(
        'px-2 py-2.5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

type DescriptionListLabelProps = {
  className?: string
  children: ReactNode
}

export const DescriptionListLabel = ({
  className,
  children,
}: DescriptionListLabelProps) => {
  return (
    <dt className={cn('text-xs font-medium leading-6 text-white', className)}>
      {children}
    </dt>
  )
}

type DescriptionListValueProps = {
  className?: string
  children: ReactNode
}

export const DescriptionListValue = ({
  className,
  children,
}: DescriptionListValueProps) => {
  return (
    <dd
      className={cn(
        'mt-1 text-xs leading-6 text-gray-400 sm:col-span-2 sm:mt-0',
        className,
      )}
    >
      {children}
    </dd>
  )
}
