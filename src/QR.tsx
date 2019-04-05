import React from 'react'
import {RenderConfig} from '@bloomprotocol/qr'

import {useRenderQRCode} from './useRenderQRCode'

type QRProps<T> = RenderConfig<T>

const QR: React.FC<QRProps<any>> = props => {
  const containerRef = useRenderQRCode<any, HTMLSpanElement>(props)

  // Set this to inline-block so the container only takes up enough room for the QR code.
  // Consumers can wrap this in whatever they want for positioning.
  return <span style={{display: 'inline-block'}} ref={containerRef} />
}

export {QR}
