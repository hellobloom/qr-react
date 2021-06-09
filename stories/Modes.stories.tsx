import React from 'react'
import { Meta, Story } from '@storybook/react'

// eslint-disable-next-line import/extensions
import { QR, QRProps } from '../src/index'

const meta: Meta = {
  title: 'QR/Modes',
  component: QR,
}

export default meta

const Template: Story<QRProps> = (args) => <QR {...args} width={256} height={256} />

// mode === '8BIT_BTYE'

export const BitByteWithObjData = Template.bind({})

const BitByteWithObjDataArgs: QRProps = {
  data: [
    {
      mode: '8BIT_BYTE',
      value: {
        url: 'https://bloom.co',
      },
    },
  ],
}

BitByteWithObjData.args = BitByteWithObjDataArgs
BitByteWithObjData.storyName = '8BIT_BYTE (JSON value)'

export const BitByteWithStringData = Template.bind({})

const BitByteWithStringDataArgs: QRProps = {
  data: [
    {
      mode: '8BIT_BYTE',
      value: 'https://bloom.co',
    },
  ],
}

BitByteWithStringData.args = BitByteWithStringDataArgs
BitByteWithStringData.storyName = '8BIT_BYTE (string value)'

// mode === 'NUM'

export const Num = Template.bind({})

const NumArgs: QRProps = {
  data: [
    {
      mode: 'NUM',
      value: '123456',
    },
  ],
}

Num.args = NumArgs
Num.storyName = 'NUM'

// mode === 'ALPHA_NUM'

export const AlphaNum = Template.bind({})

const AlphaNumArgs: QRProps = {
  data: [
    {
      mode: 'ALPHA_NUM',
      value: '123ABC',
    },
  ],
}

AlphaNum.args = AlphaNumArgs
AlphaNum.storyName = 'ALPHA_NUM'

// mode === 'KANJI'

export const Kanji = Template.bind({})

const KanjiArgs: QRProps = {
  data: [
    {
      mode: 'KANJI',
      value: '茗',
    },
  ],
}

Kanji.args = KanjiArgs
Kanji.storyName = 'KANJI'
