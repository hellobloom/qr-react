export enum Mode {
  'NUM' = 1 << 0,
  'ALPHA_NUM' = 1 << 1,
  '8BIT_BYTE' = 1 << 2,
  'KANJI' = 1 << 3,
}

export enum ErrorCorrectionLevel {
  'L' = 1,
  'M' = 0,
  'Q' = 3,
  'H' = 2,
}

export enum MaskPattern {
  PATTERN000 = 0b000,
  PATTERN001 = 0b001,
  PATTERN010 = 0b010,
  PATTERN011 = 0b011,
  PATTERN100 = 0b100,
  PATTERN101 = 0b101,
  PATTERN110 = 0b110,
  PATTERN111 = 0b111,
}
