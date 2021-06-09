import { BitBuffer } from '../util/BitBuffer'
import { Mode } from '../shared'

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
}
