import { QRData } from './QRData'
import { Mode } from '../shared'
import { BitBuffer } from '../util/BitBuffer'

export class QRNum extends QRData {
  constructor(data: string) {
    super(Mode.NUM, data)
  }

  write(buffer: BitBuffer) {
    const { data } = this
    let i = 0

    while (i + 2 < data.length) {
      buffer.put(parseInt(data.substring(i, i + 3), 10), 10)
      i += 3
    }

    if (i < data.length) {
      if (data.length - i === 1) {
        buffer.put(parseInt(data.substring(i, i + 1), 10), 4)
      } else if (data.length - i === 2) {
        buffer.put(parseInt(data.substring(i, i + 2), 10), 7)
      }
    }
  }

  getLength() {
    return this.data.length
  }
}
