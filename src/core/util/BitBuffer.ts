export class BitBuffer {
  private _buffer: number[] = []

  private _length: number = 0

  get buffer() {
    return this._buffer
  }

  get length() {
    return this._length
  }

  put(num: number, length: number) {
    for (let i = 0; i < length; i += 1) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1)
    }
  }

  putBit(bit: boolean) {
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
