import { BitBuffer } from '../util/BitBuffer'
import { Mode } from '../enums'

export abstract class QRData {
  constructor(private _mode: Mode, private _data: string) {}

  get mode() {
    return this._mode
  }

  get data() {
    return this._data
  }

  public abstract getLength(): number

  public abstract write(buffer: BitBuffer): void

  public getLengthInBits(typeNumber: number): number {
    if (typeNumber >= 1 && typeNumber < 10) {
      switch (this.mode) {
        case Mode.NUM:
          return 10
        case Mode.ALPHA_NUM:
          return 9
        case Mode['8BIT_BYTE']:
          return 8
        case Mode.KANJI:
          return 8
        default:
          throw new Error(`Unsupported mode: ${this.mode}`)
      }
    } else if (typeNumber < 27) {
      switch (this.mode) {
        case Mode.NUM:
          return 12
        case Mode.ALPHA_NUM:
          return 11
        case Mode['8BIT_BYTE']:
          return 16
        case Mode.KANJI:
          return 10
        default:
          throw new Error(`Unsupported mode: ${this.mode}`)
      }
    } else if (typeNumber < 41) {
      switch (this.mode) {
        case Mode.NUM:
          return 14
        case Mode.ALPHA_NUM:
          return 13
        case Mode['8BIT_BYTE']:
          return 16
        case Mode.KANJI:
          return 12
        default:
          throw new Error(`Unsupported mode: ${this.mode}`)
      }
    } else {
      throw new Error(`Unsupported typeNumber: ${typeNumber}`)
    }
  }
}
