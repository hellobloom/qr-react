import { QRData } from './QRData'
import { Mode } from '../enums'
import { BitBuffer } from '../util/BitBuffer'
import { stringToBytes } from '../util/text'

export class QRKanji extends QRData {
  private bytes: number[]

  constructor(data: string) {
    super(Mode.KANJI, data)

    this.bytes = stringToBytes.SJIS(data)
  }

  public write(buffer: BitBuffer) {
    let i = 0

    while (i + 1 < this.bytes.length) {
      let character = ((0xff & this.bytes[i]) << 8) | (0xff & this.bytes[i + 1])

      if (character >= 0x8140 && character <= 0x9ffc) {
        character -= 0x8140
      } else if (character >= 0xe040 && character <= 0xebbf) {
        character -= 0xc140
      } else {
        throw new Error(`Unsupported char at ${i + 1} / ${character}`)
      }

      character = ((character >>> 8) & 0xff) * 0xc0 + (character & 0xff)

      buffer.put(character, 13)

      i += 2
    }

    if (i < this.bytes.length) {
      throw new Error('Data does not have sufficient length')
    }
  }

  public getLength() {
    return ~~(this.bytes.length / 2)
  }
}
