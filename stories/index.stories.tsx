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

export const CustomRenderers = Template.bind({});

const CustomRenderersArgs: QRProps = {
  data: {
    url: 'https://bloom.co',
  },
  dotAs: (props) => (
    <rect
      shapeRendering="crispEdges"
      fill={props.color}
      x={props.left}
      y={props.top}
      height={props.size}
      width={props.size}
    />
  ),
  eyeAs: (props) => {
    const maskId = `${props.baseId}-eye-mask-${props.left}-${props.top}`

    return (
      <>
        <mask id={maskId}>
          <rect fill="white" x={props.left} y={props.top} width={props.size * 7} height={props.size * 7} />
          <rect
            fill="black"
            x={props.left + props.size}
            y={props.top + props.size}
            width={props.size * 5}
            height={props.size * 5}
          />
        </mask>
        <rect
          mask={`url(#${maskId})`}
          fill={props.color}
          x={props.left}
          y={props.top}
          width={props.size * 7}
          height={props.size * 7}
        />
        <rect fill={props.color} x={props.left + 2} y={props.top + 2} width={props.size * 3} height={props.size * 3} />
      </>
    )
  }
};

CustomRenderers.args = CustomRenderersArgs;

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
