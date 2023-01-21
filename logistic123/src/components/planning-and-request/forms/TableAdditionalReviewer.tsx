import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import { I18nNamespace } from 'constants/i18n.const';
import { AdditionalReviewer } from 'models/api/planning-and-request/planning-and-request.model';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from 'reactstrap';
import styles from './form.module.scss';

interface TableAdditionalReviewerProps {
  loading?: boolean;
  value?: AdditionalReviewer[];
  onchange?: (comment) => void;
  disable?: boolean;
}

export const TableAdditionalReviewer: FC<TableAdditionalReviewerProps> = (
  props,
) => {
  const { loading, value } = props;
  const [additional, setAdditional] = useState<AdditionalReviewer[]>([]);

  const { t } = useTranslation([
    I18nNamespace.PLANNING_AND_REQUEST,
    I18nNamespace.COMMON,
  ]);

  const rowLabels = [
    {
      id: 'sNo',
      label: t('txSNo'),
      sort: true,
      width: '100',
    },

    {
      id: 'reviewerId',
      label: t('txReviewerName'),
      sort: true,
      width: '200',
    },
    {
      id: 'comment',
      label: t('txReviewerComment'),
      sort: true,
      width: '200',
    },
  ];

  const sanitizeData = (data: AdditionalReviewer, index) => {
    if (data) {
      const finalData = {
        sNo: index + 1,
        reviewerId: data?.createdUser?.username,
        comment: data.comment,
      };
      return finalData;
    }
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && additional?.length > 0) {
        return (
          <tbody>
            {additional.map((item, index) => {
              const finalData = sanitizeData(item, index);
              return (
                <RowComponent
                  isScrollable={isScrollable}
                  data={finalData}
                  rowLabels={rowLabels}
                  key={item?.id}
                />
              );
            })}
          </tbody>
        );
      }
    },
    [loading, additional],
  );

  useEffect(() => {
    setAdditional(value);
  }, [value]);

  return (
    <div className={cx('mt-4', styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center pb-4">
          <div className={cx(styles.titleContainer)}>{t('txReviewer')}</div>
        </div>
        <Table hover className={cx(styles.table, 'pt-4')}>
          <thead className={styles.thread}>
            <tr className={styles.title}>
              {rowLabels.map((item) => (
                <th
                  className={cx('fw-bold', styles.subTitle)}
                  style={{
                    width: item.width,
                  }}
                  key={item.id}
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          {renderRow()}
        </Table>
      </div>
    </div>
  );
};
