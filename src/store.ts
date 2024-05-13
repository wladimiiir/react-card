import { Signal } from '@preact/signals-react';
import { ComponentType } from 'react';

const Store = {
  components: new Signal<Record<string, ComponentType>>({}),
};

export const storeComponent = (name: string, component: ComponentType | null) => {
  if (component === null) {
    delete Store.components.value[name];
  } else {
    Store.components.value[name] = component;
  }
};

export const getComponents = () => Store.components;
