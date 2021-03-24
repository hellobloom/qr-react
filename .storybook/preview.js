export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  argTypes: {
    bgColor: {
      control: {
        type: 'color',
      },
    },
    fgColor: {
      control: {
        type: 'color',
      },
    },
    ecLevel: {
      control: {
        type: 'select',
        options: ['L', 'M', 'Q', 'H']
      },
    },
    logo: {
      control: {
        type: 'object',
      },
    },
  }
};
