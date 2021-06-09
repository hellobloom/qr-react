module.exports = {
  extends: ['@bloomprotocol/eslint-config'],
  rules: {
    'no-bitwise': 'off',
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
}
