import { TW } from "twind";

type Props = {
	tw: TW;
	error: Error;
}

export const ContentError = ({ tw, error }: Props) => (
	<div className={tw("p-4 bg-red-100 text-red-500")}>
		<p>Failed to render content due to the following error:</p>
		<p className={tw('font-bold text-sm')}>{error.message}</p>
	</div>
);

