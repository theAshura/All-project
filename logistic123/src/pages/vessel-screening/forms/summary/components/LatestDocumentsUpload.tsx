import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { I18nNamespace } from 'constants/i18n.const';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import { getVesselScreeningDetailActions } from 'pages/vessel-screening/store/action';
import { FC, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import { LatestDocument } from 'pages/vessel-screening/utils/models/common.model';
import { handleDownloadFile } from 'helpers/file.helper';
import styles from './detail-information.module.scss';

interface Props {
  data?: any;
  className?: string;
}

export const LatestDocumentsUpload: FC<Props> = ({ data, className }) => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const { vesselScreeningDetail } = useSelector(
    (state) => state.vesselScreening,
  );
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVesselScreeningDetailActions.request(id));
  }, [dispatch, id]);

  const dataSource = useMemo(
    () =>
      vesselScreeningDetail?.latestDocuments?.map((item, index) => ({
        recentDocument: item.originName,
        date: formatDateLocalWithTime(item.createdAt),
      })),
    [vesselScreeningDetail?.latestDocuments],
  );

  const rowLabels = useMemo(
    () => [
      {
        id: 'recentDocument',
        label: t('summary.recentDocument'),
        sort: false,
        width: '100',
      },
      {
        id: 'date',
        label: t('summary.date'),
        sort: false,
        width: '100',
      },
    ],
    [t],
  );

  const sanitizeData = useCallback((item: LatestDocument) => {
    const finalData = {
      recentDocument: item.originName,
      date: formatDateLocalWithTime(item.createdAt),
    };
    return finalData;
  }, []);

  const renderRow = useCallback(
    (isScrollable?: boolean) => (
      <tbody>
        {vesselScreeningDetail?.latestDocuments?.map((item, index) => {
          const finalData = sanitizeData(item);
          return (
            <RowComponent
              key={item.id}
              isScrollable={isScrollable}
              data={finalData}
              rowLabels={rowLabels}
              onClickRow={() => handleDownloadFile(item)}
            />
          );
        })}
      </tbody>
    ),
    [vesselScreeningDetail?.latestDocuments, sanitizeData, rowLabels],
  );

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.titleLatest}>
        {t('summary.latestDocumentsUpload')}
      </div>
      {dataSource?.length ? (
        <TableCp
          rowLabels={rowLabels}
          renderRow={renderRow}
          isEmpty={
            !vesselScreeningDetail?.latestDocuments ||
            !vesselScreeningDetail?.latestDocuments.length
          }
          classNameNodataWrapper={styles.dataWrapperEmpty}
          isHiddenAction
        />
      ) : (
        <NoDataImg />
      )}
    </div>
  );
};
