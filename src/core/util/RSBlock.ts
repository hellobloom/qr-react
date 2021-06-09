import { RS_BLOCK_TABLE } from '../constants'
import { ErrorCorrectionLevel } from '../enums'

const getRsBlockTable = (typeNumber: number, ecLevel: ErrorCorrectionLevel) => {
  switch (ecLevel) {
    case ErrorCorrectionLevel.L:
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0]
    case ErrorCorrectionLevel.M:
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1]
    case ErrorCorrectionLevel.Q:
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2]
    case ErrorCorrectionLevel.H:
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3]
    default:
      throw new Error(`Unsupported ecLevel: ${ecLevel}`)
  }
}

export type RSBlock = {
  totalCount: number
  dataCount: number
}

export const getRSBlocks = (typeNumber: number, ErrorCorrectionLevel: ErrorCorrectionLevel) => {
  const rsBlock = getRsBlockTable(typeNumber, ErrorCorrectionLevel)
  const length = rsBlock.length / 3

  const list: RSBlock[] = []

  for (let i = 0; i < length; i += 1) {
    const count = rsBlock[i * 3 + 0]
    const totalCount = rsBlock[i * 3 + 1]
    const dataCount = rsBlock[i * 3 + 2]

    for (let j = 0; j < count; j += 1) {
      list.push({ totalCount, dataCount })
    }
  }

  return list
}
