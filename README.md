# QR React

A React wrapper around [@bloomprotocol/qr](https://github.com/hellobloom/qr)

- [Usage](#usage)

## Installation

```
npm install --save @bloomprotocol/qr-react
```

## Usage

![Sample QR](https://github.com/hellobloom/qr-react/raw/master/images/sampleQR.png)

```tsx
import {QR, Options} from '@bloomprotocol/qr-react'

const MyComponent: React.FC = props => {
  const qrData: any = ...
  const qrOptions: Partial<Options> = {size: 256}

  return (
    <div>
      ...
      <QR data={qrData} options={qrOptions}  />
      ...
    </div>
  )
}
```
