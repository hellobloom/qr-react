import { QRData } from './QRData'
import { Mode } from '../enums'
import { BitBuffer } from '../util/BitBuffer'

export class QRAlphaNum extends QRData {
  constructor(data: string) {
    super(Mode.ALPHA_NUM, data)
  }

  public write(buffer: BitBuffer) {
    const { data } = this
    let i = 0

    while (i + 1 < data.length) {
      buffer.put(QRAlphaNum.getCode(data.charAt(i)) * 45 + QRAlphaNum.getCode(data.charAt(i + 1)), 11)
      i += 2
    }

    if (i < data.length) {
      buffer.put(QRAlphaNum.getCode(data.charAt(i)), 6)
    }
  }

  public getLength() {
    return this.data.length
  }

  private static getCode(character: string) {
    if (character >= '0' && character <= '9') {
      return character.charCodeAt(0) - '0'.charCodeAt(0)
    }
    if (character >= 'A' && character <= 'Z') {
      return character.charCodeAt(0) - 'A'.charCodeAt(0) + 10
    }
    switch (character) {
      case ' ':
        return 36
      case '$':
        return 37
      case '%':
        return 38
      case '*':
        return 39
      case '+':
        return 40
      case '-':
        return 41
      case '.':
        return 42
      case '/':
        return 43
      case ':':
        return 44
      default:
        throw new Error(`Unsupported character: ${character}`)
    }
  }
}
