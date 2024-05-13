import { TW } from 'twind';

type Props = {
  tw: TW;
  componentName: string;
};

export const EditModeInfo = ({ tw, componentName }: Props) => {
  return (
    <div>
      <hr />
      <div className={tw('p-4')}>
        <div className={tw('text-sm')}>
          <code>{componentName}</code>
        </div>
        <div className={tw('mt-2 text-xs text-gray-200')}>
          This component can be used in another React Card component:
        </div>
        <div className={tw('mt-2 text-xs text-gray-200')}>
          <code className={tw('font-bold')}>{`<${componentName} />`}</code>
        </div>
        <div className={tw('mt-2 text-xs text-gray-200')}>
          This card will be hidden and <strong>will not</strong> be rendered in non-edit mode.
        </div>
      </div>
    </div>
  );
};
