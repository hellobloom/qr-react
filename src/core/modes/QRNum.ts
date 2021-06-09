import { QRData } from './QRData'
import { Mode } from '../shared'
import { BitBuffer } from '../util/BitBuffer'

const chatToNum = (character: string) => {
  if (character >= '0' && character <= '9') {
    return character.charCodeAt(0) - '0'.charCodeAt(0)
  }

  throw new Error(`Unsupported character: ${character}`)
}

const strToNum = (str: string) => {
  let num = 0

  for (let i = 0; i < str.length; i += 1) {
    num = num * 10 + chatToNum(str.charAt(i))
  }

  return num
}

export class QRNum extends QRData {
  constructor(data: string) {
    super(Mode.NUM, data)
  }

  write(buffer: BitBuffer) {
    const { data } = this
    let i = 0

    while (i + 2 < data.length) {
      buffer.put(strToNum(data.substring(i, i + 3)), 10)
      i += 3
    }

    if (i < data.length) {
      if (data.length - i === 1) {
        buffer.put(strToNum(data.substring(i, i + 1)), 4)
      } else if (data.length - i === 2) {
        buffer.put(strToNum(data.substring(i, i + 2)), 7)
      }
    }
  }

  getLength() {
    return this.data.length
  }
}
