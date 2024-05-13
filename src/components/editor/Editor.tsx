import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import beautify from 'ace-builds/src-noconflict/ext-beautify';
import { useComputed } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { useRef } from 'react';
import { CardProps } from '@/types.ts';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ha-textfield': any;
    }
  }
}

const Editor = ({ tw, signals, dispatchEvent }: CardProps) => {
  useSignals();

  const editorRef = useRef(null);
  const content = useComputed(() => signals.config.value.content);
  const componentName = useComputed(() => signals.config.value.componentName);

  const onContentChange = (newCode: string) => {
    const event = new CustomEvent('config-changed', {
      bubbles: true,
      composed: true,
      detail: {
        config: {
          ...signals.config.value,
          content: newCode,
        },
      },
    });

    dispatchEvent(event);
  };

  const onComponentNameChange = (event: Event) => {
    const newComponentName = (event.target as HTMLInputElement).value;

    const configChangedEvent = new CustomEvent('config-changed', {
      bubbles: true,
      composed: true,
      detail: {
        config: {
          ...signals.config.value,
          componentName: newComponentName,
        },
      },
    });

    console.log('%c CURRENT', 'background: yellow; color: black', beautify.beautify(editorRef.current.editor.session));
    dispatchEvent(configChangedEvent);
  };

  return (
    <>
      <ha-textfield
        class={tw('mb-4 w-full')}
        label="Component name"
        helper="Specify a name here if you want to register the Reusable Component with a custom name. If no name is provided, the component will be rendered directly."
        helperPersistent={true}
        placeholder="FancyComponent"
        value={componentName.value}
        onInput={onComponentNameChange}
      />
      <AceEditor
        ref={editorRef}
        height="400px"
        width="100%"
        value={content.value}
        debounceChangePeriod={500}
        onChange={onContentChange}
        mode="javascript"
        theme="monokai"
        highlightActiveLine={true}
        setOptions={{
          useWorker: false,
          enableBasicAutocompletion: true,
          showLineNumbers: true,
          tabSize: 2,
          enableSnippets: true,
        }}
      />
    </>
  );
};

export default Editor;
