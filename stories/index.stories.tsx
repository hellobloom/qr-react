import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ComponentProps } from 'react-forward-props';

import { QR, QRProps } from '../src/index';

const meta: Meta = {
  title: 'QR',
  component: QR,
};

export default meta;

const Template: Story<QRProps> = (args) => (
  <QR {...args} width={256} height={256} />
);

export const Default = Template.bind({});

const DefaultArgs: QRProps = {
  data: {
    url: 'https://bloom.co',
  },
};

Default.args = DefaultArgs;

export const StringData = Template.bind({});

const StringDataArgs: QRProps = {
  data: 'https://bloom.co',
};

StringData.args = StringDataArgs;

export const ECLevel = Template.bind({});

const ECLevelArgs: QRProps = {
  data: {
    url: 'https://bloom.co',
  },
  ecLevel: 'H',
};

ECLevel.args = ECLevelArgs;

export const Color = Template.bind({});

const ColorArgs: QRProps = {
  data: {
    url: 'https://bloom.co',
  },
  bgColor: '#c84c57',
  fgColor: '#ecbf58',
};

Color.args = ColorArgs;

export const HideLogo = Template.bind({});

const HideLogoArgs: QRProps = {
  data: {
    url: 'https://bloom.co',
  },
  logo: {
    hide: true,
  },
};

HideLogo.args = HideLogoArgs;

export const LogoOpacity = Template.bind({});

const LogoOpacityArgs: QRProps = {
  data: {
    url: 'https://bloom.co',
  },
  logo: {
    opacity: 0.3,
  },
};

LogoOpacity.args = LogoOpacityArgs;

export const CustomLogo = Template.bind({});

const CustomLogoArgs: QRProps = {
  data: {
    url: 'https://bloom.co',
  },
  logo: {
    image: 'https://placekitten.com/200/200',
  },
};

CustomLogo.args = CustomLogoArgs;

export const CustomProps = Template.bind({});

const CustomPropsArgs: ComponentProps<'svg', QRProps> = {
  data: {
    url: 'https://bloom.co',
  },
  onClick: () => {
    alert('Clicked!');
  },
  style: {
    margin: '25px',
  },
};

CustomProps.args = CustomPropsArgs;
