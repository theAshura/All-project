import { ButtonHTMLAttributes } from 'react';
import styles from 'components/common/table/table.module.scss';
import cx from 'classnames';

export enum ButtonTypeRow {
  OutlinePrimary = 'outline-primary',
  OutlineGreen = 'OutlineGreen',
}

export interface ButtonActionRowProp extends ButtonHTMLAttributes<any> {
  handleClick?: () => void;
  typeButton: typeof ButtonTypeRow[keyof typeof ButtonTypeRow];
}

export default function ButtonActionRow(props: ButtonActionRowProp) {
  const { children, handleClick, typeButton } = props;
  return (
    <button
      onClick={(e) => {
        handleClick();
        e.stopPropagation();
      }}
      className={cx(styles.btnActionRow, 'd-flex align-items-center', {
        [styles.btnOutlinePrimary]: typeButton === ButtonTypeRow.OutlinePrimary,
        [styles.btnOutlineGreen]: typeButton === ButtonTypeRow.OutlineGreen,
      })}
    >
      <p className="mb-0 mx-auto"> {children}</p>
    </button>
  );
}
