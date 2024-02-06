import { useCopyToClipboard } from '@uidotdev/usehooks'
import { ReactElement } from 'react'

type Props = {
  render: (params: {
    hasCopiedText: boolean
    copyToClipboard: (value: string) => void
  }) => ReactElement
}

export const CopyToClipboardButton = ({ render }: Props) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const hasCopiedText = Boolean(copiedText)

  return render({ hasCopiedText, copyToClipboard })
}
