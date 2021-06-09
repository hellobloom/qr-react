export class BitBuffer {
  private _buffer: number[]

  private _length: number

  public constructor() {
    this._buffer = []
    this._length = 0
  }

  get buffer() {
    return this._buffer
  }

  get length() {
    return this._length
  }

  public toString() {
    let buffer = ''
    for (let i = 0; i < this.length; i += 1) {
      buffer += this.getBit(i) ? '1' : '0'
    }
    return buffer
  }

  private getBit(index: number) {
    return ((this.buffer[~~(index / 8)] >>> (7 - (index % 8))) & 1) === 1
  }

  public put(num: number, length: number) {
    for (let i = 0; i < length; i += 1) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1)
    }
  }

  public putBit(bit: boolean) {
    const bufferIndex = Math.floor(this.length / 8)
    if (this.buffer.length <= bufferIndex) {
      this.buffer.push(0)
    }
    if (bit) {
      this.buffer[bufferIndex] |= 0x80 >>> this.length % 8
    }
    this._length += 1
  }
}
