import { glog, gexp } from './math'

export class Polynomial {
  private num: number[]

  public constructor(num: number[], shift = 0) {
    let offset = 0

    while (offset < num.length && num[offset] === 0) {
      offset += 1
    }

    this.num = new Array(num.length - offset + shift)
    for (let i = 0; i < num.length - offset; i += 1) {
      this.num[i] = num[i + offset]
    }
  }

  get length() {
    return this.num.length
  }

  public getAt(index: number) {
    return this.num[index]
  }

  public toString() {
    let buffer = ''
    for (let i = 0; i < this.length; i += 1) {
      if (i > 0) {
        buffer += ','
      }
      buffer += this.getAt(i)
    }
    return buffer.toString()
  }

  public toLogString() {
    let buffer = ''
    for (let i = 0; i < this.length; i += 1) {
      if (i > 0) {
        buffer += ','
      }
      buffer += glog(this.getAt(i))
    }
    return buffer.toString()
  }

  public multiply(e: Polynomial) {
    const num = new Array<number>(this.length + e.length - 1)

    for (let i = 0; i < this.length; i += 1) {
      for (let j = 0; j < e.length; j += 1) {
        // eslint-disable-next-line no-bitwise
        num[i + j] ^= gexp(glog(this.getAt(i)) + glog(e.getAt(j)))
      }
    }

    return new Polynomial(num)
  }

  public mod(e: Polynomial): Polynomial {
    if (this.length - e.length < 0) {
      return this
    }

    const ratio = glog(this.getAt(0)) - glog(e.getAt(0))

    // create copy
    const num: number[] = []
    for (let i = 0; i < this.length; i += 1) {
      num.push(this.getAt(i))
    }

    // subtract and calc rest.
    for (let i = 0; i < e.length; i += 1) {
      // eslint-disable-next-line no-bitwise
      num[i] ^= gexp(glog(e.getAt(i)) + ratio)
    }

    // call recursively
    return new Polynomial(num).mod(e)
  }
}
