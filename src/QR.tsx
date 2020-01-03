import React from 'react'
import {Config} from '@bloomprotocol/qr'
import {FC, forwardProps} from 'react-forward-props'

import {useDrawQRCode} from './useRenderQRCode'

type QRProps = Config<any>

export const QR: FC<'canvas', QRProps> = props => {
  const canvasRef = useDrawQRCode(props)

  return <canvas {...forwardProps(props, 'data', 'options')} ref={canvasRef} />
}
