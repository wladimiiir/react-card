import React from 'react';
import Editor from '@/components/editor/Editor';
import Card from '@/components/card/Card.tsx';
import { registerCardComponent, registerEditorComponent } from '@/utils/webComponent.tsx';
import { CARD_NAME, EDITOR_NAME, VERSION } from '@/constants.ts';

const registerCards = () => {
  registerCardComponent(CARD_NAME, EDITOR_NAME, Card);
  registerEditorComponent(EDITOR_NAME, Editor);

  console.info(
    `%c    REACT-CARD    \n%c  Version ${VERSION}   `,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray',
  );
};

const init = () => {
  if (!window.React) {
    window.React = React;
  }

  if (!window.Babel) {
    const script = document.createElement('script');
    script.src = '/hacsfiles/react-card/babel.min.js';
    script.onload = registerCards;
    script.onerror = () => {
      console.error('Failed to load Babel script.');
    };
    document.head.appendChild(script);
  } else {
    registerCards();
  }
};

init();
