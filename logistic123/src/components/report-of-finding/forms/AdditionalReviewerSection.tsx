import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import cx from 'classnames';
import TableCp from 'components/common/table/TableCp';
import { ReportFindingHistory } from 'models/api/report-of-finding/report-of-finding.model';
import { RowComponent } from 'components/common/table/row/rowCp';
import Card from 'components/common/card/Card';
import { useSelector } from 'react-redux';
import styles from './form.module.scss';

interface Props {
  disabled?: boolean;
  data: ReportFindingHistory[];
}

const AdditionalReviewerSectionContent: FC<Props> = ({ disabled, data }) => {
  const { t } = useTranslation([
    I18nNamespace.INTERNAL_AUDIT_REPORT,
    I18nNamespace.COMMON,
  ]);
  const { ReportOfFindingDetail } = useSelector(
    (state) => state.reportOfFinding,
  );
  const [additionalReviewerSection, setAdditionalReviewerSection] = useState<
    ReportFindingHistory[]
  >(data || []);
  const dataItemSorted = (
    ReportOfFindingDetail?.reportFindingHistories || []
  ).sort((x, y) => {
    if (x.createdAt > y.createdAt) return -1;
    return 1;
  });

  useEffect(() => {
    if (data && data.length) {
      const additionalReviewers = data?.filter(
        (i) =>
          i?.status === 'Reassigned' ||
          (dataItemSorted[1]?.status === 'Close out' &&
            ReportOfFindingDetail?.status === 'Draft'),
      );
      setAdditionalReviewerSection(additionalReviewers);
    }
  }, [ReportOfFindingDetail?.status, data, dataItemSorted]);

  const rowLabels = useMemo(
    () => [
      {
        id: 'sNo',
        label: 'S.No',
        sort: true,
        width: '100',
      },
      {
        id: 'reviewName',
        label: 'Review name ',
        sort: true,
        width: '300',
      },
      {
        id: 'comment',
        label: 'Reviewer comment',
        sort: true,
        width: '300',
      },
    ],
    [],
  );

  const sanitizeData = (item: ReportFindingHistory, index: number) => {
    const finalData = {
      sNo: index + 1,
      'createdUser.username': item?.createdUser?.username,
      'item.officeComment': item?.workflowRemark || null,
    };
    return finalData;
  };
  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (additionalReviewerSection?.length > 0) {
        return (
          <tbody>
            {additionalReviewerSection
              ?.filter((t) => t.workflowRemark?.trim()?.length > 0)
              .map((item, index) => {
                const finalData = sanitizeData(item, index);

                return (
                  <RowComponent
                    isScrollable={isScrollable}
                    data={finalData}
                    actionList={undefined}
                    onClickRow={undefined}
                    rowLabels={rowLabels}
                    key={JSON.stringify(finalData)}
                  />
                );
              })}
          </tbody>
        );
      }

      return null;
    },
    [additionalReviewerSection, rowLabels],
  );

  return (
    <>
      {additionalReviewerSection?.length > 0 && (
        <Card className={cx(styles.cardContainer)}>
          <div className="d-flex justify-content-between">
            <p className={cx(styles.titleForm)}>
              {t('additionalReviewerSectionTitle')}
            </p>
          </div>
          <TableCp
            loading={false}
            isHiddenAction
            rowLabels={rowLabels}
            renderRow={renderRow}
            isEmpty={undefined}
            classNameNodataWrapper={styles.dataWrapperEmpty}
          />
        </Card>
      )}
    </>
  );
};

export default AdditionalReviewerSectionContent;
