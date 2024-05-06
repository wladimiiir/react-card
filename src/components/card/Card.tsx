import React, { DetailedHTMLProps } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { CardProps } from '../../types.ts';
import { ContentRenderer } from './ContentRenderer.tsx';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ha-card': DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

const Card = ({ tw, signals, dispatchEvent }: CardProps) => {
  useSignals();

  return (
    <ha-card>
      <ContentRenderer
        tw={tw}
        content={signals.config.value.content}
        hass={signals.hass}
        dispatchEvent={dispatchEvent}
      />
    </ha-card>
  );
};

export default Card;
