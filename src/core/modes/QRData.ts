import { BitBuffer } from '../util/BitBuffer'
import { Mode } from '../shared'

type TypeNumberGroup = 'under10' | 'under27' | 'under41'

const typeNumberToLengthInBits: { [key in TypeNumberGroup]: { [key in Mode]: number } } = {
  under10: {
    [Mode.NUM]: 10,
    [Mode.ALPHA_NUM]: 9,
    [Mode['8BIT_BYTE']]: 8,
    [Mode.KANJI]: 8,
  },
  under27: {
    [Mode.NUM]: 12,
    [Mode.ALPHA_NUM]: 11,
    [Mode['8BIT_BYTE']]: 16,
    [Mode.KANJI]: 10,
  },
  under41: {
    [Mode.NUM]: 14,
    [Mode.ALPHA_NUM]: 13,
    [Mode['8BIT_BYTE']]: 16,
    [Mode.KANJI]: 12,
  },
}

export abstract class QRData {
  constructor(private _mode: Mode, private _data: string) {}

  get mode() {
    return this._mode
  }

  get data() {
    return this._data
  }

  abstract getLength(): number

  abstract write(buffer: BitBuffer): void

  getLengthInBits(typeNumber: number): number {
    let typeNumberGroup: TypeNumberGroup

    if (typeNumber >= 1 && typeNumber < 10) {
      typeNumberGroup = 'under10'
    } else if (typeNumber < 27) {
      typeNumberGroup = 'under27'
    } else if (typeNumber < 41) {
      typeNumberGroup = 'under41'
    } else {
      throw new Error(`Unsupported typeNumber: ${typeNumber}`)
    }

    return typeNumberToLengthInBits[typeNumberGroup][this.mode]
  }
}
