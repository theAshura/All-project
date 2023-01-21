import { FC, useCallback, useContext, useState, useMemo } from 'react';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import TableCp from 'components/common/table/TableCp';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { AdditionalReviewerSection } from 'models/api/internal-audit-report/internal-audit-report.model';
import { RowComponent } from 'components/common/table/row/rowCp';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import styles from '../form.module.scss';

interface Props {
  disabled?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const AdditionalReviewerSectionContent: FC<Props> = ({
  disabled,
  dynamicLabels,
}) => {
  const rowLabels = useMemo(
    () => [
      {
        id: 'sNo',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['S.No'],
        ),
        sort: true,
        width: '50',
      },
      {
        id: 'reviewName',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Review name'],
        ),
        sort: true,
        width: '100',
      },
      // {
      //   id: 'rank',
      //   label: renderDynamicLabel(
      //   dynamicLabels,
      //   INSPECTION_REPORT_FIELDS_DETAILS['Review department/ rank'],
      // ),
      //   sort: true,
      //   width: '300',
      // },
      {
        id: 'comment',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Reviewer comment'],
        ),
        sort: true,
        width: '100',
      },
      // {
      //   id: 'status',
      //   label: renderDynamicLabel(
      //   dynamicLabels,
      //   INSPECTION_REPORT_FIELDS_DETAILS['Status'],
      // ),
      //   sort: true,
      //   width: '160',
      // },
    ],
    [dynamicLabels],
  );

  const { additionalReviewerSection } = useContext(
    InternalAuditReportFormContext,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sanitizeData = (item: AdditionalReviewerSection, index: number) => {
    const finalData = {
      sNo: index + 1,
      reviewName: item?.createdUser?.username || '',
      // rank: '',
      comment: item?.remark || '',
      // status: item?.status || '',
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (additionalReviewerSection?.length > 0) {
        return (
          <tbody>
            {additionalReviewerSection
              ?.filter((i) => i.status === 'reassigned')
              ?.map((item, index) => {
                const finalData = sanitizeData(item, index);
                return (
                  <RowComponent
                    key={item.id}
                    isScrollable={isScrollable}
                    data={finalData}
                    onClickRow={undefined}
                    rowLabels={rowLabels}
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

  return useMemo(
    () => (
      <CollapseUI
        title={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Additional reviewer section'],
        )}
        collapseClassName={styles.collapse}
        isOpen={isOpen}
        content={
          <>
            <TableCp
              loading={false}
              rowLabels={rowLabels}
              isHiddenAction
              renderRow={renderRow}
              isEmpty={
                !additionalReviewerSection?.length || !additionalReviewerSection
              }
              classNameNodataWrapper={styles.dataWrapperEmpty}
            />
          </>
        }
        toggle={() => setIsOpen((prev) => !prev)}
      />
    ),
    [dynamicLabels, isOpen, rowLabels, renderRow, additionalReviewerSection],
  );
};

export default AdditionalReviewerSectionContent;
