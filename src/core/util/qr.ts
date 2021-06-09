import { gexp } from './math'
import { Polynomial } from './Polynomial'
import { PATTERN_POSITION_TABLE, MAX_LENGTH, G15, G15_MASK, G18 } from '../constants'
import { Mode, ErrorCorrectionLevel, MaskPattern } from '../enums'

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

export const getMaxLength = (typeNumber: number, mode: Mode, ecLevel: ErrorCorrectionLevel) => {
  let e: number
  let m: number

  switch (ecLevel) {
    case ErrorCorrectionLevel.L:
      e = 0
      break
    case ErrorCorrectionLevel.M:
      e = 1
      break
    case ErrorCorrectionLevel.Q:
      e = 2
      break
    case ErrorCorrectionLevel.H:
      e = 3
      break
    default:
      throw new Error(`Unknown ecLevel: ${ecLevel}`)
  }

  switch (mode) {
    case Mode.NUM:
      m = 0
      break
    case Mode.ALPHA_NUM:
      m = 1
      break
    case Mode['8BIT_BYTE']:
      m = 2
      break
    case Mode.KANJI:
      m = 3
      break
    default:
      throw new Error(`Unknown mode: ${mode}`)
  }

  return MAX_LENGTH[typeNumber - 1][e][m]
}

export const getErrorCorrectionPolynomial = (ecLength: number) => {
  let a = new Polynomial([1])

  for (let i = 0; i < ecLength; i += 1) {
    a = a.multiply(new Polynomial([1, gexp(i)]))
  }

  return a
}

export const getMaskFunc = (maskPattern: number) => {
  switch (maskPattern) {
    case MaskPattern.PATTERN000:
      return (i: number, j: number) => (i + j) % 2 === 0
    case MaskPattern.PATTERN001:
      return (i: number) => i % 2 === 0
    case MaskPattern.PATTERN010:
      return (_: number, j: number) => j % 3 === 0
    case MaskPattern.PATTERN011:
      return (i: number, j: number) => (i + j) % 3 === 0
    case MaskPattern.PATTERN100:
      return (i: number, j: number) => (~~(i / 2) + ~~(j / 3)) % 2 === 0
    case MaskPattern.PATTERN101:
      return (i: number, j: number) => ((i * j) % 2) + ((i * j) % 3) === 0
    case MaskPattern.PATTERN110:
      return (i: number, j: number) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0
    case MaskPattern.PATTERN111:
      return (i: number, j: number) => (((i * j) % 3) + ((i + j) % 2)) % 2 === 0
    default:
      throw new Error(`Unknown mask pattern: ${maskPattern}`)
  }
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
