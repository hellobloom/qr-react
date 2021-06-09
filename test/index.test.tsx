import React from 'react'
import { render } from '@testing-library/react'

import * as QR from '../stories/index.stories'
import * as QRModes from '../stories/Modes.stories'

const getArgs = <
  T extends {
    data: Record<string, unknown>
  },
>(
  args: T,
) => ({
  ...args,
  id: 'custom-id',
})

describe('QR', () => {
  it('default', () => {
    const { asFragment } = render(<QR.Default {...getArgs(QR.Default.args as any)} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('string data', () => {
    const { asFragment } = render(<QR.StringData {...getArgs(QR.StringData.args as any)} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('ec level', () => {
    const { asFragment } = render(<QR.ECLevel {...getArgs(QR.ECLevel.args as any)} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('color', () => {
    const { asFragment } = render(<QR.Color {...getArgs(QR.Color.args as any)} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('hide logo', () => {
    const { asFragment } = render(<QR.HideLogo {...getArgs(QR.HideLogo.args as any)} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('logo opacity', () => {
    const { asFragment } = render(<QR.LogoOpacity {...getArgs(QR.LogoOpacity.args as any)} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('custom logo', () => {
    const { asFragment } = render(<QR.CustomLogo {...getArgs(QR.CustomLogo.args as any)} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('custom renderers', () => {
    const { asFragment } = render(<QR.CustomRenderers {...getArgs(QR.CustomRenderers.args as any)} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('custom props', () => {
    const { asFragment } = render(<QR.CustomProps {...getArgs(QR.CustomProps.args as any)} />)
    expect(asFragment()).toMatchSnapshot()
  })

  describe('Modes', () => {
    it('8BIT_BYTE (Obj Data)', () => {
      const { asFragment } = render(<QRModes.BitByteWithObjData {...getArgs(QRModes.BitByteWithObjData.args as any)} />)
      expect(asFragment()).toMatchSnapshot()
    })

    it('8BIT_BYTE (String Data)', () => {
      const { asFragment } = render(<QRModes.BitByteWithStringData {...getArgs(QRModes.BitByteWithStringData.args as any)} />)
      expect(asFragment()).toMatchSnapshot()
    })

    it('NUM', () => {
      const { asFragment } = render(<QRModes.Num {...getArgs(QRModes.Num.args as any)} />)
      expect(asFragment()).toMatchSnapshot()
    })

    it('ALPHA_NUM', () => {
      const { asFragment } = render(<QRModes.AlphaNum {...getArgs(QRModes.AlphaNum.args as any)} />)
      expect(asFragment()).toMatchSnapshot()
    })

    it('KANJI', () => {
      const { asFragment } = render(<QRModes.Kanji {...getArgs(QRModes.Kanji.args as any)} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
