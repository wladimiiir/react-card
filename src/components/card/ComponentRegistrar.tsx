import { ReactElement, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { createDynamicComponent } from '@/utils/dynamicComponent.ts';
import { storeComponent } from '@/store.ts';

type Props = {
  componentName: string;
  content: string;
};

export const ComponentRegistrar = ({ componentName, content }: Props): ReactElement => {
  const [debouncedComponentName] = useDebounce(componentName, 500);
  const [debouncedContent] = useDebounce(content, 500);

  useEffect(() => {
    try {
      const Component = createDynamicComponent(debouncedContent);
      storeComponent(debouncedComponentName, Component());
    } catch (e) {
      storeComponent(debouncedComponentName, null);
    }
  }, [debouncedContent, debouncedComponentName]);

  return null;
};
