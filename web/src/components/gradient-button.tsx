import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = Omit<ButtonProps, 'variant'>

export const GradientButton = ({ className, ...buttonProps }: Props) => {
  return (
    <Button
      variant={'secondary'}
      className={cn(
        'bg-gradient-to-br from-pink-300/20 via-purple-300/20 to-indigo-400/20 border-2 border-purple-300/50',
        className,
      )}
      {...buttonProps}
    />
  )
}
