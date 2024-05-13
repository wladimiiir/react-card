import React, { ElementType } from 'react';
import { signal } from '@preact/signals-react';
import ReactDOM from 'react-dom/client';
import { create, cssomSheet, TW } from 'twind';
import { computeCardSize, HomeAssistant } from 'custom-card-helpers';
import { CardConfig, CardSignals } from '@/types.ts';

export const registerCardComponent = (name: string, editorName: string, component: ElementType) => {
  const cardElement = createCardElement(component, editorName);
  customElements.define(name, cardElement);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: name,
    name: 'React Card',
    description: 'Powerful card that can render React components.',
  });
};

export const registerEditorComponent = (name: string, component: ElementType) => {
  const editorElement = createCardElement(component);
  customElements.define(name, editorElement);
};

const createCardElement = (ReactComponent: ElementType, editorCardName?: string) => {
  return class Card extends HTMLElement {
    tw: TW;
    root: ReactDOM.Root;
    signals: CardSignals;
    editMode: boolean;

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      const sheet = cssomSheet({ target: new CSSStyleSheet() });
      const { tw } = create({
        sheet,
        preflight: (base) => {
          const normalized = { ...base };
          // Remove the following rules as they interfere with the HA default styles
          delete normalized['*,::before,::after'];
          return normalized;
        },
      });

      this.tw = tw;
      this.root = ReactDOM.createRoot(this.shadowRoot);
      this.shadowRoot.adoptedStyleSheets = [sheet.target];
      this.signals = {
        hass: signal({} as HomeAssistant),
        config: signal({
          content: '',
        } as CardConfig),
      };
    }

    static getConfigElement() {
      return editorCardName ? document.createElement(editorCardName) : null;
    }

    set hass(hass: HomeAssistant) {
      this.signals.hass.value = hass;
    }

    connectedCallback() {
      this.render();
    }

    setConfig(config: CardConfig) {
      this.signals.config.value = config;
    }

    getCardSize(): number | Promise<number> {
      return computeCardSize(this);
    }

    render() {
      const parentElement = this.shadowRoot.host.parentElement;
      const previewMode = parentElement?.tagName?.toLowerCase() === 'hui-card-preview';

      this.root.render(
        <React.StrictMode>
          <ReactComponent
            tw={this.tw}
            dispatchEvent={this.dispatchEvent.bind(this)}
            signals={this.signals}
            editMode={this.editMode}
            previewMode={previewMode}
          />
        </React.StrictMode>,
      );
    }
  };
};

export default createCardElement;
