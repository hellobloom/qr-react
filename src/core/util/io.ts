abstract class InputStream {
  public abstract readByte(): number

  public close() {}
}

abstract class OutputStream {
  public abstract writeByte(b: number): void

  public writeBytes(bytes: number[]) {
    bytes.forEach(this.writeByte)
  }

  public flush() {}

  public close() {
    this.flush()
  }
}

export class ByteArrayOutputStream extends OutputStream {
  private bytes: number[] = []

  public writeByte(byte: number) {
    this.bytes.push(byte & 0xff)
  }

  public writeShort(i: number) {
    this.writeByte(i)
    this.writeByte(i >>> 8)
  }

  public writeBytes(buffer: number[], _offset?: number, _length?: number) {
    const offset = _offset || 0
    const length = _length || buffer.length

    for (let i = 0; i < length; i += 1) {
      this.writeByte(buffer[i + offset])
    }
  }

  public toByteArray() {
    return this.bytes
  }
}

export class ByteArrayInputStream extends InputStream {
  private index = 0

  constructor(private bytes: number[]) {
    super()
  }

  public readByte() {
    if (this.index < this.bytes.length) {
      const byte = this.bytes[this.index]
      this.index += 1
      return byte
    }
    return -1
  }
}

export class Base64EncodeOutputStream extends OutputStream {
  private buffer = 0

  private bufferLength = 0

  private length = 0

  constructor(private outputStream: OutputStream) {
    super()
  }

  public writeByte(byte: number) {
    this.buffer = (this.buffer << 8) | (byte & 0xff)
    this.bufferLength += 8
    this.length += 1

    while (this.bufferLength >= 6) {
      this.writeEncoded(this.buffer >>> (this.bufferLength - 6))
      this.bufferLength -= 6
    }
  }

  public flush() {
    if (this.bufferLength > 0) {
      this.writeEncoded(this.buffer << (6 - this.bufferLength))
      this.buffer = 0
      this.bufferLength = 0
    }

    if (this.length % 3 !== 0) {
      const paddingLength = 3 - (this.length % 3)

      for (let i = 0; i < paddingLength; i += 1) {
        this.outputStream.writeByte('='.charCodeAt(0))
      }
    }
  }

  private writeEncoded(byte: number) {
    this.outputStream.writeByte(Base64EncodeOutputStream.encode(byte & 0x3f))
  }

  private static encode(byte: number): number {
    if (byte < 0) {
      // error.
    } else if (byte < 26) {
      return 'A'.charCodeAt(0) + byte
    } else if (byte < 52) {
      return 'a'.charCodeAt(0) + (byte - 26)
    } else if (byte < 62) {
      return '0'.charCodeAt(0) + (byte - 52)
    } else if (byte === 62) {
      return '+'.charCodeAt(0)
    } else if (byte === 63) {
      return '/'.charCodeAt(0)
    }
    throw new Error(`Unsupported byte: ${byte}`)
  }
}

export class Base64DecodeInputStream extends InputStream {
  private buffer = 0

  private bufferLength = 0

  constructor(private inputStream: InputStream) {
    super()
  }

  public readByte(): number {
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
      } else if (Base64DecodeInputStream.isWhitespace(byte)) {
        // ignore if whitespace.
        // eslint-disable-next-line no-continue
        continue
      }

      this.buffer = (this.buffer << 6) | Base64DecodeInputStream.decode(byte)
      this.bufferLength += 6
    }

    const n = (this.buffer >>> (this.bufferLength - 8)) & 0xff
    this.bufferLength -= 8
    return n
  }

  private static isWhitespace(byte: number) {
    return byte === '\v'.charCodeAt(0) || byte === '\t'.charCodeAt(0) || byte === '\r'.charCodeAt(0) || byte === '\n'.charCodeAt(0)
  }

  private static decode(byte: number) {
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
}

export class Base64 {
  public static encode(data: number[]) {
    const byteArrayOutputStream = new ByteArrayOutputStream()

    try {
      const base64OutputStream = new Base64EncodeOutputStream(byteArrayOutputStream)
      try {
        base64OutputStream.writeBytes(data)
      } finally {
        base64OutputStream.close()
      }
    } finally {
      byteArrayOutputStream.close()
    }

    return byteArrayOutputStream.toByteArray()
  }

  public static decode(data: number[]) {
    const byteArrayOutputStream = new ByteArrayOutputStream()

    try {
      const base64InputStream = new Base64DecodeInputStream(new ByteArrayInputStream(data))

      try {
        let b: number

        // eslint-disable-next-line no-cond-assign
        while ((b = base64InputStream.readByte()) !== -1) {
          byteArrayOutputStream.writeByte(b)
        }
      } finally {
        base64InputStream.close()
      }
    } finally {
      byteArrayOutputStream.close()
    }

    return byteArrayOutputStream.toByteArray()
  }
}
