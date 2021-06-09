import { QR8BitByte, QRAlphaNum, QRKanji, QRNum, QRData } from './modes'
import { BitBuffer } from './util/BitBuffer'
import { getRSBlocks } from './util/RSBlock'
import { maskPatternToFunc, getPatternPosition, getBCHTypeInfo, getBCHTypeNumber, getLengthInBits, createData } from './util/qr'
import { ErrorCorrectionLevel, MaskPattern, Mode } from './shared'

export { ErrorCorrectionLevel, Mode, QR8BitByte, QRAlphaNum, QRKanji, QRNum, QRData }

export class QRCode {
  private _typeNumber: number

  private _ecLevel: ErrorCorrectionLevel

  private _qrDataList: QRData[]

  private _modules: (boolean | null)[][]

  private _moduleCount: number

  constructor(ecLevel: keyof typeof ErrorCorrectionLevel = 'L') {
    this._typeNumber = -1
    this._ecLevel = ErrorCorrectionLevel[ecLevel]
    this._qrDataList = []

    this._moduleCount = 0
    this._modules = []
  }

  get modules() {
    return this._modules
  }

  get moduleCount() {
    return this._moduleCount
  }

  get typeNumber() {
    return this._typeNumber
  }

  get ecLevel() {
    return this._ecLevel
  }

  get qrDataList() {
    return this._qrDataList
  }

  isDark = (row: number, col: number) => {
    return this.modules[row][col]
  }

  clearData = () => {
    this._qrDataList = []
  }

  addData = (data: QRData | string) => {
    if (typeof data === 'string') {
      this.qrDataList.push(new QR8BitByte(data))
    } else {
      this.qrDataList.push(data)
    }
  }

  make = () => {
    if (this.typeNumber < 1) {
      let typeNumber = 1
      for (; typeNumber < 40; typeNumber += 1) {
        const rsBlocks = getRSBlocks(typeNumber, this.ecLevel)

        const buffer = new BitBuffer()
        for (let i = 0; i < this.qrDataList.length; i += 1) {
          const data = this.qrDataList[i]
          buffer.put(data.mode, 4)
          buffer.put(data.getLength(), getLengthInBits(data.mode, i))
          data.write(buffer)
        }

        let totalDataCount = 0
        for (let i = 0; i < rsBlocks.length; i += 1) {
          totalDataCount += rsBlocks[i].dataCount
        }

        if (buffer.length <= totalDataCount * 8) break
      }
      this._typeNumber = typeNumber
    }
    this.makeImpl(false, this.getBestMaskPattern())
  }

  private getLostPoint = () => {
    const { moduleCount } = this

    let lostPoint = 0

    // LEVEL1

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        let sameCount = 0
        const dark = this.isDark(row, col)

        for (let r = -1; r <= 1; r += 1) {
          if (row + r < 0 || moduleCount <= row + r) {
            // eslint-disable-next-line no-continue
            continue
          }

          for (let c = -1; c <= 1; c += 1) {
            if (col + c < 0 || moduleCount <= col + c) {
              // eslint-disable-next-line no-continue
              continue
            }

            if (r === 0 && c === 0) {
              // eslint-disable-next-line no-continue
              continue
            }

            if (dark === this.isDark(row + r, col + c)) {
              sameCount += 1
            }
          }
        }

        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5
        }
      }
    }

    // LEVEL2

    for (let row = 0; row < moduleCount - 1; row += 1) {
      for (let col = 0; col < moduleCount - 1; col += 1) {
        let count = 0
        if (this.isDark(row, col)) count += 1
        if (this.isDark(row + 1, col)) count += 1
        if (this.isDark(row, col + 1)) count += 1
        if (this.isDark(row + 1, col + 1)) count += 1
        if (count === 0 || count === 4) {
          lostPoint += 3
        }
      }
    }

    // LEVEL3

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount - 6; col += 1) {
        if (
          this.isDark(row, col) &&
          !this.isDark(row, col + 1) &&
          this.isDark(row, col + 2) &&
          this.isDark(row, col + 3) &&
          this.isDark(row, col + 4) &&
          !this.isDark(row, col + 5) &&
          this.isDark(row, col + 6)
        ) {
          lostPoint += 40
        }
      }
    }

    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount - 6; row += 1) {
        if (
          this.isDark(row, col) &&
          !this.isDark(row + 1, col) &&
          this.isDark(row + 2, col) &&
          this.isDark(row + 3, col) &&
          this.isDark(row + 4, col) &&
          !this.isDark(row + 5, col) &&
          this.isDark(row + 6, col)
        ) {
          lostPoint += 40
        }
      }
    }

    // LEVEL4

    let darkCount = 0

    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount; row += 1) {
        if (this.isDark(row, col)) {
          darkCount += 1
        }
      }
    }

    const ratio = Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5
    lostPoint += ratio * 10

    return lostPoint
  }

  private getBestMaskPattern = () => {
    let minLostPoint = 0
    let pattern: MaskPattern = 0

    for (let i = 0; i < 8; i += 1) {
      this.makeImpl(true, i)
      const lostPoint = this.getLostPoint()

      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint
        pattern = i
      }
    }

    return pattern
  }

  private makeImpl = (test: boolean, maskPattern: MaskPattern) => {
    // initialize modules
    this._moduleCount = this.typeNumber * 4 + 17
    this._modules = (() => {
      const modules = new Array(this.moduleCount)
      for (let row = 0; row < this.moduleCount; row += 1) {
        modules[row] = new Array(this.moduleCount)
        for (let col = 0; col < this.moduleCount; col += 1) {
          modules[row][col] = null
        }
      }
      return modules
    })()

    this.setupPositionProbePattern(0, 0)
    this.setupPositionProbePattern(this.moduleCount - 7, 0)
    this.setupPositionProbePattern(0, this.moduleCount - 7)
    this.setupPositionAdjustPattern()
    this.setupTimingPattern()
    this.setupTypeInfo(test, maskPattern)

    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test)
    }

    const data = createData(this.typeNumber, this.ecLevel, this.qrDataList)
    this.mapData(data, maskPattern)
  }

  private mapData = (data: number[], maskPattern: MaskPattern) => {
    let inc = -1
    let row = this.moduleCount - 1
    let bitIndex = 7
    let byteIndex = 0
    const maskFunc = maskPatternToFunc[maskPattern]

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) {
        col -= 1
      }

      while (true) {
        for (let c = 0; c < 2; c += 1) {
          if (this.modules[row][col - c] === null) {
            let dark = false

            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1
            }

            const mask = maskFunc(row, col - c)

            if (mask) {
              dark = !dark
            }

            this._modules[row][col - c] = dark
            bitIndex -= 1

            if (bitIndex === -1) {
              byteIndex += 1
              bitIndex = 7
            }
          }
        }

        row += inc

        if (row < 0 || this.moduleCount <= row) {
          row -= inc
          inc = -inc
          break
        }
      }
    }
  }

  private setupPositionAdjustPattern = () => {
    const pos = getPatternPosition(this.typeNumber)

    for (let i = 0; i < pos.length; i += 1) {
      for (let j = 0; j < pos.length; j += 1) {
        const row = pos[i][0]
        const col = pos[i][1]

        if (this.modules[row][col] !== null) {
          // eslint-disable-next-line no-continue
          continue
        }

        for (let r = -2; r <= 2; r += 1) {
          for (let c = -2; c <= 2; c += 1) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              this._modules[row + r][col + c] = true
            } else {
              this._modules[row + r][col + c] = false
            }
          }
        }
      }
    }
  }

  private setupPositionProbePattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r += 1) {
      // eslint-disable-next-line no-continue
      if (row + r <= -1 || this.moduleCount <= row + r) continue

      for (let c = -1; c <= 7; c += 1) {
        // eslint-disable-next-line no-continue
        if (col + c <= -1 || this.moduleCount <= col + c) continue

        if (
          (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          this._modules[row + r][col + c] = true
        } else {
          this._modules[row + r][col + c] = false
        }
      }
    }
  }

  private setupTimingPattern = () => {
    for (let r = 8; r < this.moduleCount - 8; r += 1) {
      if (this.modules[r][6] !== null) {
        // eslint-disable-next-line no-continue
        continue
      }
      this._modules[r][6] = r % 2 === 0
    }
    for (let c = 8; c < this.moduleCount - 8; c += 1) {
      if (this.modules[6][c] !== null) {
        // eslint-disable-next-line no-continue
        continue
      }
      this._modules[6][c] = c % 2 === 0
    }
  }

  private setupTypeNumber = (test: boolean) => {
    const bits = getBCHTypeNumber(this.typeNumber)

    for (let i = 0; i < 18; i += 1) {
      this._modules[~~(i / 3)][(i % 3) + this.moduleCount - 8 - 3] = !test && ((bits >> i) & 1) === 1
    }

    for (let i = 0; i < 18; i += 1) {
      this._modules[(i % 3) + this.moduleCount - 8 - 3][~~(i / 3)] = !test && ((bits >> i) & 1) === 1
    }
  }

  private setupTypeInfo = (test: boolean, maskPattern: number) => {
    const data = (this.ecLevel << 3) | maskPattern
    const bits = getBCHTypeInfo(data)

    // vertical
    for (let i = 0; i < 15; i += 1) {
      const mod = !test && ((bits >> i) & 1) === 1

      if (i < 6) {
        this._modules[i][8] = mod
      } else if (i < 8) {
        this._modules[i + 1][8] = mod
      } else {
        this._modules[this.moduleCount - 15 + i][8] = mod
      }
    }

    // horizontal
    for (let i = 0; i < 15; i += 1) {
      const mod = !test && ((bits >> i) & 1) === 1

      if (i < 8) {
        this._modules[8][this.moduleCount - i - 1] = mod
      } else if (i < 9) {
        this._modules[8][15 - i - 1 + 1] = mod
      } else {
        this._modules[8][15 - i - 1] = mod
      }
    }

    // fixed
    this._modules[this.moduleCount - 8][8] = !test
  }
}
