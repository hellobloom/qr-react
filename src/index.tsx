import React, {FC as BaseFC, ReactNode} from 'react'
import {FC} from 'react-forward-props'
import {useId} from '@reach/auto-id'

const QRCodeImpl = require('qr.js/lib/QRCode')

enum ErrorCorrectionLevel {
  'L' = 1,
  'M' = 0,
  'Q' = 3,
  'H' = 2,
}

type CellInfo = {
  top: number
  left: number
  color: string
  size: number
}

export type QROptions = {
  bgColor?: string
  fgColor?: string
  ecLevel?: keyof typeof ErrorCorrectionLevel
  // mode?: keyof typeof DataMode
  logo?: {
    hide?: boolean
    image?: string
    width?: number
    height?: number
    opacity?: number
  }
}

export type QRProps = QROptions & {
  data: string | Record<string, unknown>
}

export const QR: FC<'svg', QRProps> = ({data, fgColor = '#6067f1', bgColor = '#ffffff00', ecLevel = 'L', logo, ...props}) => {
  const id = useId(props.id)
  const logoMaskId = `${id}-logo-mask`

  const qr = new QRCodeImpl(-1, ErrorCorrectionLevel[ecLevel])
  qr.addData(typeof data === 'object' ? JSON.stringify(data) : data)
  qr.make()

  const cells: [boolean[]] = qr.modules
  const size = cells.length

  let img: ReactNode | undefined

  if (!logo?.hide) {
    const numberOfCellsToCover = Math.floor(cells.length * 0.2)
    const width = logo?.width || numberOfCellsToCover + (numberOfCellsToCover % 2 === 0 ? 1 : 0)
    const height = logo?.height || width
    const x = (size - width) / 2
    const y = (size - height) / 2
    const opacity = logo?.opacity || 1
    const src =
      logo?.image ||
      `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg width="25" height="25" viewBox="0 0 710 705" xmlns="http://www.w3.org/2000/svg"><path fill="${bgColor}" d="M0 0h710v705H0z"/><path fill="${fgColor}" d="M454.416 188.193C454.258 241.685 410.797 285 357.208 285c-53.59 0-97.05-43.315-97.208-96.807 0 0-3.503-18.079 15.18-58.318 31.939-68.792 80.762-98.557 80.762-98.557s52.935 33.24 84.462 98.557c16.54 34.266 14.012 58.318 14.012 58.318zm0 328.614C454.258 463.315 410.797 420 357.208 420c-53.59 0-97.05 43.315-97.208 96.807 0 0-3.503 18.079 15.18 58.318 31.939 68.792 80.762 98.557 80.762 98.557s52.935-33.24 84.462-98.557c16.54-34.266 14.012-58.318 14.012-58.318zm49.391-261.223c-53.492.158-96.807 43.619-96.807 97.208 0 53.59 43.315 97.05 96.807 97.208 0 0 18.079 3.503 58.318-15.18 68.792-31.939 98.557-80.762 98.557-80.762s-33.24-52.935-98.557-84.462c-34.266-16.54-58.318-14.012-58.318-14.012zm-297.614-1c53.492.158 96.807 43.619 96.807 97.208 0 53.59-43.315 97.05-96.807 97.208 0 0-18.079 3.503-58.318-15.18-68.792-31.939-98.557-80.762-98.557-80.762s33.24-52.935 98.557-84.462c34.266-16.54 58.318-14.012 58.318-14.012z"/></svg>`,
      )}`

    img = (
      <>
        <mask id={logoMaskId}>
          <rect fill="white" x={0} y={0} width="100%" height="100%" />
          <rect fill="black" x={x} y={y} width={width} height={height} />
        </mask>
        <image href={src} x={x} y={y} width={width} height={height} opacity={opacity} />
      </>
    )
  }

  return (
    <svg {...props} id={id} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
      <rect x={0} y={0} width="100%" height="100%" fill={bgColor} />
      <g mask={img ? `url(#${logoMaskId})` : undefined}>
        {cells.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (cell) {
              const isTopLeftEye = cellIndex <= 7 && rowIndex <= 7
              const isTopRightEye = cellIndex >= cells.length - 7 && rowIndex <= 7
              const isBottomLeftEye = cellIndex <= 7 && rowIndex >= row.length - 7
              const isEye = isTopLeftEye || isTopRightEye || isBottomLeftEye

              const cellInfo: CellInfo & {key: string} = {
                color: fgColor,
                left: cellIndex,
                top: rowIndex,
                size: 1,
                key: `row: ${rowIndex}; col: ${cellIndex}`,
              }

              if (isEye) {
                const isInnerEyeX = (cellIndex >= 2 && cellIndex <= 4) || (cellIndex >= cells.length - 6 && cellIndex <= cells.length - 2)
                const isInnerEyeY = (rowIndex >= 2 && rowIndex <= 4) || (rowIndex >= cells.length - 5 && rowIndex <= cells.length - 3)
                const isInnerEye = isInnerEyeX && isInnerEyeY

                if (!isInnerEye) {
                  const isLeft = cellIndex < row.length - 1 && cells[rowIndex][cellIndex + 1]
                  const isRight = cellIndex > 0 && cells[rowIndex][cellIndex - 1]
                  const isTop = rowIndex > 0 && cells[rowIndex - 1][cellIndex]
                  const isBottom = rowIndex < cells.length - 1 && cells[rowIndex + 1][cellIndex]

                  const isTopLeft = isBottom && !isTop && isLeft && !isRight

                  if (isTopLeft) {
                    return <QREye {...cellInfo} baseId={id} />
                  }
                }
              } else {
                return <QRDot {...cellInfo} />
              }
            }

            return undefined
          }),
        )}
      </g>
      {img}
    </svg>
  )
}

type QRDotProps = CellInfo

const QRDot: BaseFC<QRDotProps> = props => (
  <circle fill={props.color} cx={props.left + props.size / 2} cy={props.top + props.size / 2} r={(props.size / 2) * 0.85} />
)

type QREyeProps = CellInfo & {
  baseId?: string
}

const QREye: BaseFC<QREyeProps> = props => {
  const maskId = `${props.baseId}-eye-mask-${props.left}-${props.top}`

  return (
    <>
      <mask id={maskId}>
        <rect fill="white" x={props.left} y={props.top} width={props.size * 7} height={props.size * 7} rx={props.size} />
        <rect
          fill="black"
          x={props.left + props.size}
          y={props.top + props.size}
          width={props.size * 5}
          height={props.size * 5}
          rx={props.size / 4}
        />
      </mask>
      <rect
        mask={`url(#${maskId})`}
        fill={props.color}
        x={props.left}
        y={props.top}
        width={props.size * 7}
        height={props.size * 7}
        rx={props.size}
      />
      <rect fill={props.color} x={props.left + 2} y={props.top + 2} width={props.size * 3} height={props.size * 3} rx={props.size / 4} />
    </>
  )
}
