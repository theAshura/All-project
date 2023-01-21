import { FC, ReactElement } from 'react';
import images from 'assets/images/images';
import cx from 'classnames';

interface ResultsButtonProps {
  value: string | number;
  label: string | ReactElement;
  removeItem?: (value: string | number) => void;
  disabled?: boolean;
  hiddenImage?: boolean;
  className?: string;
}

const ResultsButton: FC<ResultsButtonProps> = (props) => {
  const { value, label, removeItem, disabled, hiddenImage, className } = props;
  return (
    <div className={cx('results-button', className)}>
      <button
        onClick={() => removeItem(value)}
        className={cx({ 'hidden-image': hiddenImage })}
        disabled={disabled}
      >
        <span>{label}</span>
        {!hiddenImage && (
          <img src={images.icons.icX} alt="result" style={{ marginLeft: 5 }} />
        )}
      </button>
    </div>
  );
};

export default ResultsButton;
