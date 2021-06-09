abstract class InputStream {
  abstract readByte(): number

  close() {}
}

export class ByteArrayInputStream extends InputStream {
  private index = 0

  constructor(private bytes: number[]) {
    super()
  }

  readByte() {
    if (this.index < this.bytes.length) {
      const byte = this.bytes[this.index]
      this.index += 1
      return byte
    }
    return -1
  }
}

const isWhitespace = (byte: number) => {
  return byte === '\v'.charCodeAt(0) || byte === '\t'.charCodeAt(0) || byte === '\r'.charCodeAt(0) || byte === '\n'.charCodeAt(0)
}

const decode = (byte: number) => {
  if ('A'.charCodeAt(0) <= byte && byte <= 'Z'.charCodeAt(0)) {
    return byte - 'A'.charCodeAt(0)
  }
  if ('a'.charCodeAt(0) <= byte && byte <= 'z'.charCodeAt(0)) {
    return byte - 'a'.charCodeAt(0) + 26
  }
  if ('0'.charCodeAt(0) <= byte && byte <= '9'.charCodeAt(0)) {
    return byte - '0'.charCodeAt(0) + 52
  }
  if (byte === '+'.charCodeAt(0)) {
    return 62
  }
  if (byte === '/'.charCodeAt(0)) {
    return 63
  }
  throw new Error(`Unsupported byte: ${byte}`)
}

export class Base64DecodeInputStream extends InputStream {
  private buffer = 0

  private bufferLength = 0

  constructor(private inputStream: InputStream) {
    super()
  }

  readByte(): number {
    while (this.bufferLength < 8) {
      const byte = this.inputStream.readByte()

      if (byte === -1) {
        if (this.bufferLength === 0) {
          return -1
        }
        throw new Error(`Unexpected end of file./${this.bufferLength}`)
      } else if (byte === '='.charCodeAt(0)) {
        this.bufferLength = 0
        return -1
      } else if (isWhitespace(byte)) {
        // ignore if whitespace.
        // eslint-disable-next-line no-continue
        continue
      }

      this.buffer = (this.buffer << 6) | decode(byte)
      this.bufferLength += 6
    }

    const n = (this.buffer >>> (this.bufferLength - 8)) & 0xff
    this.bufferLength -= 8
    return n
  }
}
