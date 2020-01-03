import React, {useState} from 'react'
import {storiesOf} from '@storybook/react'

import {QR} from '../src/index'

const UpdatingQR = () => {
  const [count, setCount] = useState(0)

  return (
    <React.Fragment>
      <QR data={{url: 'https://bloom.co', count}} options={{size: 256}} />
      <button onClick={() => setCount(count + 1)}>Update QR</button>
    </React.Fragment>
  )
}

const RemovingQR = () => {
  const [removed, setRemoved] = useState(false)

  return (
    <React.Fragment>
      {removed === false && <QR data={{url: 'https://bloom.co'}} options={{size: 256}} />}
      <button onClick={() => setRemoved(!removed)}>{removed ? 'Render' : 'Removed'} QR</button>
    </React.Fragment>
  )
}

storiesOf('qr-react', module)
  .add('Bloom branded https://bloom.co QR', () => <QR data={{url: 'https://bloom.co'}} options={{size: 256}} />)
  .add('Updating QR', () => <UpdatingQR />)
  .add('Removing QR', () => <RemovingQR />)
