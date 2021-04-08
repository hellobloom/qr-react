# 3.1.0

**Features**:

- Support rendering string data

# 3.0.0

**Breaking Changes**:

- Render `<svg />` instead of canvas
- Remove the `options` prop
  - Instead apply the options directly to the `QR` component
- Remove the `size` option
  - Instead size the QR code either with a `className`, `style`, or `height` + `width`
- Change the `shouldHideLogo` option to `logo.hide`
- Remove the `useDrawQRCode` and `useRenderQRCode` hooks

**Features**:

- Fully render with React

# 2.0.0

**Breaking Changes**:

- Upgrade to `@bloomprotocol/qr@2.0.0`

# 1.0.0

- Initial Release
