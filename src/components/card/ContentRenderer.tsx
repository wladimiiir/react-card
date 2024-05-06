import { TW } from 'twind';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect, useState } from 'react';

import { ContentError } from './ContentError';
import { HomeAssistant } from 'custom-card-helpers';
import { Signal, useComputed } from '@preact/signals-react';

const codeTemplate = '({tw, useState, useEffect, useEntityState, hass, ...props}) => { @content@; };';

const babelOptions = {
  presets: ['react'],
};

type Props = {
  tw: TW;
  content: string;
  hass: Signal<HomeAssistant>;
  dispatchEvent: (event: Event) => void;
};

export const ContentRenderer = ({ tw, content, hass, dispatchEvent }: Props) => {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState<Error | null>(null);

  const useEntityState = (entityId: string) => {
    return useComputed(() => {
      return hass.value.states?.[entityId]?.state;
    });
  };

  useEffect(() => {
    setError(null);

    try {
      const result = window.Babel.transform(codeTemplate.replace('@content@', content), babelOptions);
      const Component = Function(`"use strict";\nreturn ${result.code}`);
      setComponent(Component);
    } catch (e) {
      setError(e as Error);
      setComponent(null);
    }
  }, [content]);

  const onRenderError = (error: Error) => {
    setComponent(null);
    setError(error);
  };

  const handleClick = () => {
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId: 'sensor.house_power_consumption' },
      bubbles: true,
      composed: true,
    });

    dispatchEvent(event);
  };

  return (
    <div className={tw('p-4')} onClick={handleClick}>
      {Component ? (
        <ErrorBoundary onError={onRenderError} fallbackRender={() => <></>}>
          <Component tw={tw} useState={useState} useEffect={useEffect} hass={hass} useEntityState={useEntityState} />
        </ErrorBoundary>
      ) : null}
      {error ? <ContentError tw={tw} error={error} /> : null}
    </div>
  );
};
