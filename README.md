# QR React

SVG QR Renderer For React

- [QR React](#qr-react)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Props](#props)

## Installation

```
npm install --save @bloomprotocol/qr-react
```

## Usage

```tsx
import { QR } from '@bloomprotocol/qr-react'

const MyComponent: React.FC = (props) => {
  return (
    <QR
      data={{
        url: 'https://bloom.co',
      }}
      height={256}
      width={256}
    />
  )
}
```

![QR Example](https://github.com/hellobloom/qr-react/raw/master/assets/qr.png)

## Props

In addition to the custom props outlined below you can provide any extra `<svg>` props.

| Name    | Description                                                            | Type                                                | Default                   |
| ------- | ---------------------------------------------------------------------- | --------------------------------------------------- | ------------------------- |
| data    | The data displayed in the QR code                                      | `DataConfig[] \| Record<string, unknown> \| string` | -                         |
| bgColor | Background color of the QR code                                        | `string`                                            | `'#ffffff00'`             |
| fgColor | Color of the QR code dots and eyes                                     | `string`                                            | `'#6067f1'`               |
| ecLevel | The Error Correction Level to be applied                               | `'L' \| 'M' \| 'Q' \| 'H'`                          | `'L'`                     |
| logo    | Configuration of the logo to be displayed in the center of the QR code | [See below](#logo-config)                           | [See below](#logo-config) |
| eyeAs   | Optional custom component used to render the eyes of the QR            | `React.ComponentType<QREyeProps>`                   | -                         |
| dotAs   | Optional custom component used to render the dots of the QR            | `React.ComponentType<QRDotProps>`                   | -                         |

### QR Encoding Modes

If `props.data` is set to a `string` or `Record<string, unknown>` the default byte encoding will be used. If you want to control the mode or add multiple data sets you must set `props.data` to an array of `DataConfig` objects.

| Name  | Description                         | Type                                             |
| ----- | ----------------------------------- | ------------------------------------------------ |
| mode  | The encoding mode to be used        | `'8BIT_BYTE' \| 'NUM' \| 'ALPHA_NUM' \| 'KANJI'` |
| value | The value to be encoded into the QR | `string`                                         |

```tsx
import { QR } from '@bloomprotocol/qr-react'

const MyComponent: React.FC = (props) => {
  return (
    <QR
      data={[
        {
          mode: 'NUMERIC',
          value: '123456',
        },
      ]}
      height={256}
      width={256}
    />
  )
}
```

### Logo Config

| Name    | Description                                     | Type     | Default               |
| ------- | ----------------------------------------------- | -------- | --------------------- |
| image   | URL of the image to display (can be a data URL) | `string` | SVG of the Bloom logo |
| width   | Width of the image                              | `number` | 20% of the QR code    |
| height  | Height of the image                             | `number` | `width`               |
| opacity | Opacity of the image                            | `number` | `1`                   |

```tsx
import { QR } from '@bloomprotocol/qr-react'

const MyComponent: React.FC = (props) => {
  return (
    <QR
      data={{
        url: 'https://bloom.co',
      }}
      logo={{
        image: 'https://placekitten.com/200/200',
      }}
      height={256}
      width={256}
    />
  )
}
```
