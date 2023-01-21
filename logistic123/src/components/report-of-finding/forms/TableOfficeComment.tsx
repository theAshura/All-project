import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Input from 'components/ui/input/Input';
import { MaxLength } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './form.module.scss';

interface Comment {
  sNo?: number;
  comment?: string;
  reviewerName?: string;
  reviewerRank?: string;
  reviewerDate?: Date;
}
interface TableOfficeCommentProps {
  loading?: boolean;
  data: Comment[];
  handleChange?: (value) => void;
}

export const TableOfficeComment: FC<TableOfficeCommentProps> = (props) => {
  const { loading, data, handleChange } = props;

  const { t } = useTranslation([
    I18nNamespace.REPORT_OF_FINDING,
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
      id: 'comment',
      label: t('txComment'),
      sort: true,
      width: '100',
    },
    {
      id: 'reviewerName',
      label: t('txReviewerName'),
      sort: true,
      width: '260',
    },
    {
      id: 'reviewerRank',
      label: t('txReviewerRank'),
      sort: true,
      width: '240',
    },
    {
      id: 'reviewerDate',
      label: t('txReviewedDate'),
      sort: true,
      width: '100',
    },
  ];
  const sanitizeData = (data, index) => {
    const finalData = {
      sNo: data?.sNo,
      comment: data?.comment,
      reviewerName: data?.reviewerName,
      reviewerRank: data?.reviewerRank,
      reviewerDate: data?.reviewerDate,
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && data?.length > 0) {
        return (
          <tbody>
            {data?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              return (
                <RowComponent
                  isScrollable={isScrollable}
                  data={finalData}
                  key={JSON.stringify(finalData)}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [loading, data],
  );

  return (
    <div className={cx('mt-4', styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>{t('txOffice')}</div>
        </div>
        <div>
          <Input
            maxLength={MaxLength.MAX_LENGTH_COMMENTS}
            placeholder="Enter office comment"
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
        <div className={styles.table}>
          <TableCp
            rowLabels={rowLabels}
            renderRow={renderRow}
            loading={loading}
            isHiddenAction
            isEmpty={undefined}
          />
          <Input
            label={t('txWorkflowRemarks')}
            maxLength={MaxLength.MAX_LENGTH_COMMENTS}
            placeholder="Enter office comment"
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
