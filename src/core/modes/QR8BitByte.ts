import { QRData } from './QRData'
import { Mode } from '../shared'
import { BitBuffer } from '../util/BitBuffer'

const stringToBytes = (str: string) => {
  const utf8: number[] = []

  for (let i = 0; i < str.length; i += 1) {
    let charcode = str.charCodeAt(i)
    if (charcode < 0x80) {
      utf8.push(charcode)
    } else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f))
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f))
    } else {
      // surrogate pair
      i += 1
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff))
      utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f))
    }
  }
  return utf8
}

export class QR8BitByte extends QRData {
  private bytes: number[]

  constructor(data: string) {
    super(Mode['8BIT_BYTE'], data)

    this.bytes = stringToBytes(this.data)
  }

  write(buffer: BitBuffer): void {
    this.bytes.forEach((datum) => buffer.put(datum, 8))
  }

  getLength() {
    return this.bytes.length
  }
}
