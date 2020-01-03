import React from 'react'
import {Config} from '@bloomprotocol/qr'

import {useDrawQRCode} from './useRenderQRCode'

type QRProps = Config<any>

export const QR: React.FC<QRProps> = props => {
  const canvasRef = useDrawQRCode(props)

  return <canvas ref={canvasRef} />
}
