import React, { DetailedHTMLProps } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { ContentRenderer } from './ContentRenderer.tsx';
import { ComponentRegistrar } from './ComponentRegistrar';
import { EditModeInfo } from './EditModeInfo.tsx';
import { CardProps } from '@/types.ts';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ha-card': DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

const Card = ({ tw, signals, dispatchEvent, previewMode, editMode }: CardProps) => {
  useSignals();

  const { content, componentName } = signals.config.value;
  const shouldRender = !componentName || previewMode || editMode;

  return (
    <>
      {componentName && <ComponentRegistrar content={content} componentName={componentName} />}
      {shouldRender && (
        <ha-card>
          <ContentRenderer tw={tw} content={content} hass={signals.hass} dispatchEvent={dispatchEvent} />
          {componentName && editMode && <EditModeInfo tw={tw} componentName={componentName} />}
        </ha-card>
      )}
    </>
  );
};

export default Card;
