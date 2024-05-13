import { TW } from 'twind';
import { Signal } from '@preact/signals-react';
import { HomeAssistant } from 'custom-card-helpers';
import Babel from 'babel__standalone';

declare global {
  interface Window {
    Babel?: typeof Babel;
    customCards?: unknown[];
  }
}

export type CardConfig = {
  type: 'custom:react-card';
  content: string;
  componentName: string;
};

export type CardSignals = {
  hass: Signal<HomeAssistant>;
  config: Signal<CardConfig>;
};

export type CardProps = {
  tw: TW;
  dispatchEvent: (event: Event) => void;
  signals: CardSignals;
  editMode: boolean;
  previewMode: boolean;
};
