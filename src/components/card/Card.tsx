import { DetailedHTMLProps, HTMLAttributes } from "react";
import { CardProps } from "../../types.ts";
import { ContentRenderer } from "./ContentRenderer.tsx";
import { useSignals } from "@preact/signals-react/runtime";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"ha-card": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
		}
	}
}

const Card = ({ tw, signals, dispatchEvent }: CardProps) => {
	useSignals();

	return (
		<ha-card>
			<ContentRenderer tw={tw} content={signals.config.value.content} hass={signals.hass} dispatchEvent={dispatchEvent}/>
		</ha-card>
	);
};

export default Card;
