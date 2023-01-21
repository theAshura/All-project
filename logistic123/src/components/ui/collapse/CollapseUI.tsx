import images from 'assets/images/images';
import cx from 'classnames';
import { ReactNode } from 'react';
import { Collapse } from 'reactstrap';

export interface CollapseProps {
  toggle: () => void;
  content: string | ReactNode;
  className?: string;
  collapseClassName?: string;
  collapseHeaderClassName?: string;
  title?: string;
  isOpen?: boolean;
  badges?: any;
}

export function CollapseUI(props: CollapseProps) {
  const {
    isOpen,
    className,
    content,
    collapseHeaderClassName,
    toggle,
    title,
    collapseClassName,
    badges,
  } = props;
  return (
    <div className={cx('collapse-ui w-100', className)}>
      <button
        className={cx(
          'btn w-100 d-flex justify-content-between align-items-center',
          { 'bg-white': !isOpen, 'bg-primary': isOpen },
          collapseHeaderClassName,
        )}
        onClick={toggle}
      >
        <div className="d-flex align-items-center justify-content-between w-100">
          <p className="mb-0 fw-bold text-nowrap text-truncate">{title}</p>
          <div className="d-flex justify-content-end flex-wrap">{badges}</div>
        </div>
        <div
          className={cx(
            'btn-icon d-flex justify-content-center align-items-center',
            {
              'bg__btn-ic--white': isOpen,
              'bg__btn-ic--blue': !isOpen,
            },
          )}
        >
          <img
            className="ic-btn"
            src={
              isOpen
                ? images.icons.icArrowChevronUp
                : images.icons.icArrowChevronDown
            }
            alt="ic-close-modal"
          />
        </div>
      </button>
      <Collapse isOpen={isOpen} className={collapseClassName}>
        {content}
      </Collapse>
    </div>
  );
}
