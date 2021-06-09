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

export const BitByteModeWithObjData = Template.bind({})

const BitByteModeWithObjDataArgs: QRProps = {
  data: [
    {
      mode: '8BIT_BYTE',
      value: {
        url: 'https://bloom.co',
      },
    },
  ],
}

BitByteModeWithObjData.args = BitByteModeWithObjDataArgs
BitByteModeWithObjData.storyName = '8BIT_BYTE (JSON value)'

export const BitByteModeWithStringData = Template.bind({})

const BitByteModeWithStringDataArgs: QRProps = {
  data: [
    {
      mode: '8BIT_BYTE',
      value: 'https://bloom.co',
    },
  ],
}

BitByteModeWithStringData.args = BitByteModeWithStringDataArgs
BitByteModeWithStringData.storyName = '8BIT_BYTE (string value)'

// mode === 'NUM'

export const NumMode = Template.bind({})

const NumModeArgs: QRProps = {
  data: [
    {
      mode: 'NUM',
      value: '123456',
    },
  ],
}

NumMode.args = NumModeArgs
NumMode.storyName = 'NUM'

// mode === 'ALPHA_NUM'

export const AlphaNumMode = Template.bind({})

const AlphaNumModeArgs: QRProps = {
  data: [
    {
      mode: 'ALPHA_NUM',
      value: 'https://bloom.co',
    },
  ],
}

AlphaNumMode.args = AlphaNumModeArgs
AlphaNumMode.storyName = 'ALPHA_NUM'

// mode === 'KANJI'

export const KanjiMode = Template.bind({})

const KanjiModeArgs: QRProps = {
  data: [
    {
      mode: 'KANJI',
      value: '茗',
    },
  ],
}

KanjiMode.args = KanjiModeArgs
KanjiMode.storyName = 'KANJI'
