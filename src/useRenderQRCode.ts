import {useRef, useEffect} from 'react'
import {drawQRCode, renderQRCode, Result, Config} from '@bloomprotocol/qr'

export const useRenderQRCode = <T, E extends HTMLElement>(config: Config<T>) => {
  const containerRef = useRef<E>(null)
  const resultRef = useRef<Result<T>>()

  useEffect(() => {
    if (!containerRef.current) {
      if (resultRef.current) {
        resultRef.current.remove()
        resultRef.current = undefined
      }

      return
    }

    if (!resultRef.current) {
      resultRef.current = renderQRCode(containerRef.current, config)
    } else {
      resultRef.current.update(config)
    }

    return () => {
      if (resultRef.current) {
        resultRef.current.remove()
        resultRef.current = undefined
      }
    }
  }, [containerRef, config])

  return containerRef
}

export const useDrawQRCode = <T>(config: Config<T>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resultRef = useRef<Result<T>>()

  useEffect(() => {
    if (!canvasRef.current) return

    if (!resultRef.current) {
      resultRef.current = drawQRCode(canvasRef.current, config)
    } else {
      resultRef.current.update(config)
    }
  }, [canvasRef, config])

  return canvasRef
}
