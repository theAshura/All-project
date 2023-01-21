import cx from 'classnames';
import { ReactNode, useMemo } from 'react';
import styles from './metadata.module.scss';

interface IProps {
  className?: string;
  data: string[] | ReactNode[];
  requestNo?: string;
}

const Metadata = ({ className, data, requestNo }: IProps) => {
  const content = useMemo(
    () =>
      data?.map((chunk) => (
        <div className={cx(styles.textInfo)} key={chunk}>
          <span>{chunk}</span>
        </div>
      )),
    [data],
  );

  return (
    <div
      className={cx(
        styles.vesselInfo,
        'd-flex justify-content-between',
        className,
      )}
    >
      <div className={cx('d-flex')}>{content}</div>
      <div className={styles.requestNo}>
        {requestNo && `Request No: ${requestNo || '-'}`}
      </div>
    </div>
  );
};

export default Metadata;
