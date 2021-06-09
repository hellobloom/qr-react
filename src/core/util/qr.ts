import { gexp } from './math'
import { Polynomial } from './Polynomial'
import { Mode, ErrorCorrectionLevel, MaskPattern } from '../shared'
import { getRSBlocks, RSBlock } from './RSBlock'
import { BitBuffer } from './BitBuffer'
import { QRData } from '../modes'

const PATTERN_POSITION_TABLE = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170],
]

const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0)

const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0)

const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1)

const PAD0 = 0xec

const PAD1 = 0x11

export const getLengthInBits = (mode: Mode, typeNumber: number) => {
  if (typeNumber >= 1 && typeNumber < 10) {
    // 1 - 9
    switch (mode) {
      case Mode.NUM:
        return 10
      case Mode.ALPHA_NUM:
        return 9
      case Mode['8BIT_BYTE']:
        return 8
      case Mode.KANJI:
        return 8
      default:
        throw new Error(`mode:${mode}`)
    }
  } else if (typeNumber < 27) {
    // 10 - 26
    switch (mode) {
      case Mode.NUM:
        return 12
      case Mode.ALPHA_NUM:
        return 11
      case Mode['8BIT_BYTE']:
        return 16
      case Mode.KANJI:
        return 10
      default:
        throw new Error(`mode:${mode}`)
    }
  } else if (typeNumber < 41) {
    // 27 - 40
    switch (mode) {
      case Mode.NUM:
        return 14
      case Mode.ALPHA_NUM:
        return 13
      case Mode['8BIT_BYTE']:
        return 16
      case Mode.KANJI:
        return 12
      default:
        throw new Error(`mode:${mode}`)
    }
  } else {
    throw new Error(`Unsupported typeNumber: ${typeNumber}`)
  }
}

export const getPatternPosition = (typeNumber: number) => {
  return PATTERN_POSITION_TABLE[typeNumber - 1]
}

export const getErrorCorrectionPolynomial = (ecLength: number) => {
  let a = new Polynomial([1])

  for (let i = 0; i < ecLength; i += 1) {
    a = a.multiply(new Polynomial([1, gexp(i)]))
  }

  return a
}

type MaskFunc = ((i: number, j: number) => boolean) | ((i: number) => boolean)

export const maskPatternToFunc: { [key in MaskPattern]: MaskFunc } = {
  [MaskPattern.PATTERN000]: (i: number, j: number) => (i + j) % 2 === 0,
  [MaskPattern.PATTERN001]: (i: number) => i % 2 === 0,
  [MaskPattern.PATTERN010]: (_: number, j: number) => j % 3 === 0,
  [MaskPattern.PATTERN011]: (i: number, j: number) => (i + j) % 3 === 0,
  [MaskPattern.PATTERN100]: (i: number, j: number) => (~~(i / 2) + ~~(j / 3)) % 2 === 0,
  [MaskPattern.PATTERN101]: (i: number, j: number) => ((i * j) % 2) + ((i * j) % 3) === 0,
  [MaskPattern.PATTERN110]: (i: number, j: number) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
  [MaskPattern.PATTERN111]: (i: number, j: number) => (((i * j) % 3) + ((i + j) % 2)) % 2 === 0,
}

const getBCHDigit = (_data: number) => {
  let data = _data
  let digit = 0

  while (data !== 0) {
    digit += 1

    data >>>= 1
  }
  return digit
}

export const getBCHTypeInfo = (data: number) => {
  let d = data << 10
  while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
    d ^= G15 << (getBCHDigit(d) - getBCHDigit(G15))
  }
  return ((data << 10) | d) ^ G15_MASK
}

export const getBCHTypeNumber = (data: number) => {
  let d = data << 12
  while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
    d ^= G18 << (getBCHDigit(d) - getBCHDigit(G18))
  }
  return (data << 12) | d
}

const createBytes = (buffer: BitBuffer, rsBlocks: RSBlock[]) => {
  let offset = 0

  let maxDcCount = 0
  let maxEcCount = 0

  const dcdata: number[][] = new Array(rsBlocks.length)
  const ecdata: number[][] = new Array(rsBlocks.length)

  for (let r = 0; r < rsBlocks.length; r += 1) {
    const dcCount = rsBlocks[r].dataCount
    const ecCount = rsBlocks[r].totalCount - dcCount

    maxDcCount = Math.max(maxDcCount, dcCount)
    maxEcCount = Math.max(maxEcCount, ecCount)

    dcdata[r] = new Array(dcCount)
    for (let i = 0; i < dcdata[r].length; i += 1) {
      dcdata[r][i] = 0xff & buffer.buffer[i + offset]
    }
    offset += dcCount

    const rsPoly = getErrorCorrectionPolynomial(ecCount)
    const rawPoly = new Polynomial(dcdata[r], rsPoly.length - 1)

    const modPoly = rawPoly.mod(rsPoly)
    ecdata[r] = new Array(rsPoly.length - 1)
    for (let i = 0; i < ecdata[r].length; i += 1) {
      const modIndex = i + modPoly.length - ecdata[r].length
      ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0
    }
  }

  let totalCodeCount = 0
  for (let i = 0; i < rsBlocks.length; i += 1) {
    totalCodeCount += rsBlocks[i].totalCount
  }

  const data = new Array(totalCodeCount)
  let index = 0

  for (let i = 0; i < maxDcCount; i += 1) {
    for (let r = 0; r < rsBlocks.length; r += 1) {
      if (i < dcdata[r].length) {
        data[index] = dcdata[r][i]
        index += 1
      }
    }
  }

  for (let i = 0; i < maxEcCount; i += 1) {
    for (let r = 0; r < rsBlocks.length; r += 1) {
      if (i < ecdata[r].length) {
        data[index] = ecdata[r][i]
        index += 1
      }
    }
  }

  return data
}

export const createData = (typeNumber: number, ecLevel: ErrorCorrectionLevel, dataArray: QRData[]) => {
  const rsBlocks = getRSBlocks(typeNumber, ecLevel)

  const buffer = new BitBuffer()

  for (let i = 0; i < dataArray.length; i += 1) {
    const data = dataArray[i]
    buffer.put(data.mode, 4)
    buffer.put(data.getLength(), data.getLengthInBits(typeNumber))
    data.write(buffer)
  }

  // calc max data count
  let totalDataCount = 0
  for (let i = 0; i < rsBlocks.length; i += 1) {
    totalDataCount += rsBlocks[i].dataCount
  }

  if (buffer.length > totalDataCount * 8) {
    throw new Error(`Length overflow (${buffer.length}>${totalDataCount * 8})`)
  }

  // end
  if (buffer.length + 4 <= totalDataCount * 8) {
    buffer.put(0, 4)
  }

  // padding
  while (buffer.length % 8 !== 0) {
    buffer.putBit(false)
  }

  // padding
  while (true) {
    if (buffer.length >= totalDataCount * 8) {
      break
    }
    buffer.put(PAD0, 8)

    if (buffer.length >= totalDataCount * 8) {
      break
    }
    buffer.put(PAD1, 8)
  }

  return createBytes(buffer, rsBlocks)
}
