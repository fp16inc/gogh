import { Schemas } from '@/api/stable-diffusion/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectProps } from '@radix-ui/react-select'

type Props = {
  models: Schemas['SDModelItem'][]
} & Omit<SelectProps, 'children'>

export const ModelSelect = ({ models, disabled, ...selectProps }: Props) => {
  return (
    <Select disabled={disabled} {...selectProps}>
      <SelectTrigger className={'border-2'}>
        <SelectValue placeholder="モデルを選択" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.title} value={model.title}>
            {model.model_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
