'use client'

import { type ImgHTMLAttributes } from 'react'
import Zoom from 'react-medium-image-zoom'

const defaultImageSizes =
  '(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px'

export type ImageZoomProps = {
  /**
   * Image props when zoom in
   */
  zoomInProps?: ImgHTMLAttributes<HTMLImageElement>
} & React.ImgHTMLAttributes<HTMLImageElement>

export function ImageZoom({
  zoomInProps,
  src,
  children,
  ...props
}: ImageZoomProps) {
  return (
    <Zoom
      zoomMargin={20}
      wrapElement="span"
      zoomImg={{
        src: src,
        sizes: undefined,
        ...zoomInProps,
      }}
    >
      {children ?? (
        <img src={src} sizes={defaultImageSizes} {...props} alt={''} />
      )}
    </Zoom>
  )
}
