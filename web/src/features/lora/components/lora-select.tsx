import { useState } from 'react'

type Props = {
  loras: { name: string }[]
  onSelect: (value: string) => void
}

export const LoraSelect = ({ loras, onSelect }: Props) => {
  return (
    <div className={'divide-y border rounded'}>
      {loras.map((lora) => (
        <LoraSelectItem
          key={lora.name}
          lora={lora.name}
          onSelect={() => onSelect(lora.name)}
        />
      ))}
    </div>
  )
}

const LoraSelectItem = ({
  lora,
  onSelect,
}: { lora: string; onSelect: () => void }) => {
  const [isSelected, setIsSelected] = useState(false)

  const handleSelect = () => {
    setIsSelected(true)
    onSelect()
    setTimeout(() => {
      setIsSelected(false)
    }, 1000)
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: ignore mobile
    <div className={'py-1.5 px-2 cursor-pointer'} onClick={handleSelect}>
      <p className={'text-xs'}>{isSelected ? '追加しました' : lora}</p>
    </div>
  )
}
