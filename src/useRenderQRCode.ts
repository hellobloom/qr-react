import {useRef, useEffect} from 'react'
import {renderQRCode, RenderResult, RenderConfig} from '@bloomprotocol/qr'

export const useRenderQRCode = <T, E extends HTMLElement>(config: RenderConfig<T>) => {
  const containerRef = useRef<E>(null)
  const renderResultRef = useRef<RenderResult<T>>()

  useEffect(() => {
    if (!containerRef.current) {
      if (renderResultRef.current) {
        renderResultRef.current.remove()
        renderResultRef.current = undefined
      }

      return
    }

    if (!renderResultRef.current) {
      renderResultRef.current = renderQRCode(containerRef.current, config)
    } else {
      renderResultRef.current.update(config)
    }

    return () => {
      if (renderResultRef.current) {
        renderResultRef.current.remove()
        renderResultRef.current = undefined
      }
    }
  }, [containerRef, config])

  return containerRef
}
