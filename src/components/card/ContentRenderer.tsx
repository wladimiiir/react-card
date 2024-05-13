import { TW } from 'twind';
import { ErrorBoundary } from 'react-error-boundary';
import { ComponentType, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { HomeAssistant } from 'custom-card-helpers';
import clsx from 'clsx';
import { Signal, useComputed } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { ContentError } from './ContentError';
import { createDynamicComponent } from '@/utils/dynamicComponent.ts';
import { getComponents } from '@/store.ts';

type Props = {
  tw: TW;
  content: string;
  hass: Signal<HomeAssistant>;
  dispatchEvent: (event: Event) => void;
};

export const ContentRenderer = ({ tw, content, hass, dispatchEvent }: Props) => {
  useSignals();

  const [Component, setComponent] = useState<ComponentType<any>>(null);
  const [components, setComponents] = useState<Record<string, ComponentType>>({});
  const [error, setError] = useState<Error | null>(null);

  const useEntity = (entityId: string) => {
    return useComputed(() => {
      return hass.value.states?.[entityId];
    }).value;
  };

  const useEntityState = (entityId: string) => {
    return useComputed(() => {
      return hass.value.states?.[entityId]?.state;
    });
  };

  useEffect(() => {
    return getComponents().subscribe((c) => setComponents(c));
  }, []);

  useEffect(() => {
    try {
      const Component = createDynamicComponent(content);
      setComponent(Component);
      setError(null);
    } catch (e) {
      setComponent(null);
      setError(e as Error);
    }
  }, [content, components]);

  const onRenderError = (error: Error) => {
    setComponent(null);
    setError(error);
  };

  const showMoreInfo = (entityId: string) => {
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    });

    dispatchEvent(event);
  };

  return (
    <>
      {Component ? (
        <ErrorBoundary onError={onRenderError} fallbackRender={() => <></>}>
          <Component
            tw={tw}
            clsx={clsx}
            useState={useState}
            useEffect={useEffect}
            useLayoutEffect={useLayoutEffect}
            useRef={useRef}
            useMemo={useMemo}
            hass={hass}
            useEntity={useEntity}
            useEntityState={useEntityState}
            showMoreInfo={showMoreInfo}
            {...components}
          />
        </ErrorBoundary>
      ) : null}
      {error ? <ContentError tw={tw} error={error} /> : null}
    </>
  );
};
