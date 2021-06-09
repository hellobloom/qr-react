import { QRData } from './QRData'
import { Mode } from '../enums'
import { stringToBytes } from '../util/text'
import { BitBuffer } from '../util/BitBuffer'

export class QR8BitByte extends QRData {
  private bytes: number[]

  constructor(data: string) {
    super(Mode['8BIT_BYTE'], data)

    this.bytes = stringToBytes.SJIS(this.data)
  }

  public write(buffer: BitBuffer): void {
    this.bytes.forEach((datum) => buffer.put(datum, 8))
  }

  public getLength(): number {
    return this.bytes.length
  }
}
