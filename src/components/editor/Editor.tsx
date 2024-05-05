import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import { useComputed } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CardProps } from "../../types.ts";

const Editor = ({ signals, dispatchEvent }: CardProps) => {
	useSignals();

	const content = useComputed(() => signals.config.value.content);

	const onChange = (newCode: string) => {
		const event = new CustomEvent('config-changed', {
			bubbles: true,
			composed: true,
			detail: {
				config: {
					...signals.config.value,
					content: newCode
				}
			}
		})

		dispatchEvent(event);
	}

	return (
		<AceEditor
			height="400px"
			width="100%"
			value={content.value}
			onChange={onChange}
			mode="javascript"
			theme="monokai"
			fontSize="16px"
			highlightActiveLine={true}
			setOptions={{
				useWorker: false,
				enableLiveAutocompletion: true,
				showLineNumbers: true,
				tabSize: 2
			}}
		/>
	);
};

export default Editor;
