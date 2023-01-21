import Frame1 from 'assets/images/Frame1.svg';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { I18nNamespace } from 'constants/i18n.const';
import { StatusHistory } from 'models/api/audit-checklist/audit-checklist.model';
import { ReportFindingHistory } from 'models/api/report-of-finding/report-of-finding.model';
import { IStepHistory } from 'models/common.model';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './history.module.scss';

export interface TableProps {
  data: StatusHistory[] | IStepHistory[] | ReportFindingHistory[];
  loading?: boolean;
  hideStatus?: boolean;
  showAction?: boolean;
  hideComment?: boolean;
  type?: string;
  showMatrix?: string;
}

const TableHistory: FC<TableProps> = ({
  data,
  showAction,
  hideStatus,
  hideComment,
  loading,
  type,
  showMatrix,
}) => {
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);

  return (
    <div className="">
      <div className={cx(styles.header)}>{t('selfDeclarationMatrix')}</div>
      <div className="d-flex">
        <div className={cx(styles.label1)}>
          <div className={styles.init} />
          Initiated/In progress
        </div>
        <div className={styles.label1}>
          <div className={styles.noQuestion} />
          No question
        </div>
      </div>
      {showMatrix ? (
        <img className={styles.matrix} src={Frame1} alt="frame1" />
      ) : (
        <NoDataImg />
      )}
    </div>
  );
};

export default TableHistory;
