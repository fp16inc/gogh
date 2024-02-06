import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectProps } from '@radix-ui/react-select'

type Props = {
  samplers: { name: string }[]
} & Omit<SelectProps, 'children'>

export const SamplerSelect = ({
  samplers,
  disabled,
  ...selectProps
}: Props) => {
  return (
    <Select disabled={disabled} {...selectProps}>
      <SelectTrigger className={'border-2'}>
        <SelectValue placeholder="サンプラーを選択" />
      </SelectTrigger>
      <SelectContent>
        {samplers.map((sampler) => (
          <SelectItem key={sampler.name} value={sampler.name}>
            {sampler.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
