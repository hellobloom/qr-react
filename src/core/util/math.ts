let _tables: {
  logTable: number[]
  expTable: number[]
}

const lazyLoadLogAndExpTables = () => {
  if (!_tables) {
    const expTable: number[] = new Array(256)
    const logTable: number[] = new Array(256)

    for (let i = 0; i < 8; i += 1) {
      expTable[i] = 1 << i
    }
    for (let i = 8; i < 256; i += 1) {
      // eslint-disable-next-line no-bitwise
      expTable[i] = expTable[i - 4] ^ expTable[i - 5] ^ expTable[i - 6] ^ expTable[i - 8]
    }
    for (let i = 0; i < 255; i += 1) {
      logTable[expTable[i]] = i
    }

    _tables = {
      expTable,
      logTable,
    }
  }

  return _tables
}

export const glog = (n: number) => {
  if (n < 1) {
    throw new Error(`n cannot be less than 1: ${n}`)
  }
  const { logTable } = lazyLoadLogAndExpTables()
  return logTable[n]
}

export const gexp = (n: number) => {
  let copy = n
  while (copy < 0) {
    copy += 255
  }
  while (copy >= 256) {
    copy -= 255
  }
  const { expTable } = lazyLoadLogAndExpTables()
  return expTable[copy]
}
