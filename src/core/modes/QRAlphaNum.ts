import { QRData } from './QRData'
import { Mode } from '../shared'
import { BitBuffer } from '../util/BitBuffer'

// prettier-ignore
const ALPHA_NUM_CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ' ', '$', '%', '*', '+', '-', '.', '/', ':',
]

const safeGetCharCode = (char: string) => {
  const code = ALPHA_NUM_CHARS.indexOf(char)

  if (code < 0) throw new Error(`Unsupported character: ${char}`)

  return code
}

export class QRAlphaNum extends QRData {
  constructor(data: string) {
    super(Mode.ALPHA_NUM, data)
  }

  write(buffer: BitBuffer) {
    let i

    for (i = 0; i + 2 <= this.data.length; i += 2) {
      buffer.put(safeGetCharCode(this.data[i]) * 45 + safeGetCharCode(this.data[i + 1]), 11)
    }

    if (this.data.length % 2) {
      buffer.put(safeGetCharCode(this.data[i]), 6)
    }
  }

  getLength() {
    return this.data.length
  }
}