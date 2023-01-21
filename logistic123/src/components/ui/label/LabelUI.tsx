import { FC, HtmlHTMLAttributes, ReactElement } from 'react';
import images from 'assets/images/images';
import cx from 'classnames';

interface LabelUIProps {
  label: string | ReactElement;
  isRequired?: boolean;
}

const LabelUI: FC<LabelUIProps & HtmlHTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  label,
  isRequired,
  ...other
}) => (
  <div className={cx(className)} {...other}>
    <div className="d-flex align-items-start pb-1">
      <div>{label}</div>
      {isRequired && (
        <img src={images.icons.icRequiredAsterisk} alt="required" />
      )}
    </div>
  </div>
);

export default LabelUI;
