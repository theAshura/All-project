import Tooltip from 'antd/lib/tooltip';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { TOOLTIP_COLOR } from 'constants/common.const';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import lowerCase from 'lodash/lowerCase';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { IARHistory } from 'models/api/internal-audit-report/internal-audit-report.model';
import { useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from '../form.module.scss';

const UserHistory = ({ dynamicLabels }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const rowLabels = useMemo(
    () => [
      {
        id: 'SNo',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['S.No'],
        ),
        sort: false,
        width: '60',
      },
      {
        id: 'status',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Status,
        ),
        width: '70',
        sort: false,
      },
      {
        id: 'updatedUser',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Updated user'],
        ),
        sort: false,
        width: '120',
        maxWidth: '300',
      },
      {
        id: 'jobTitle',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Job title'],
        ),
        sort: false,
        width: '70',
        maxWidth: '200',
      },

      {
        id: 'comment',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Comment,
        ),
        sort: false,
        width: '100',
        maxWidth: '590',
      },
      {
        id: 'updatedDate',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Updated date'],
        ),
        sort: false,
        width: '70',
        maxWidth: '120',
      },
    ],
    [dynamicLabels],
  );

  const handleStatus = (status: string) => {
    if (lowerCase(status)?.includes('reviewed')) {
      return status?.replaceAll('ed_', ' ');
    }
    if (status === 'closeout') {
      return 'Close out';
    }
    return status;
  };

  const sanitizeData = useCallback((item: IARHistory, index: number) => {
    const finalData = {
      SNo: index + 1,
      status: handleStatus(item.status),
      updatedUser: item?.createdUser?.username,
      jobTitle: item?.createdUser?.jobTitle,
      comment: (
        <Tooltip placement="topLeft" title={item?.remark} color={TOOLTIP_COLOR}>
          <span className="limit-line-text">{item?.remark}</span>
        </Tooltip>
      ),
      updatedDate: formatDateLocalWithTime(item?.updatedAt),
    };
    return finalData;
  }, []);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (internalAuditReportDetail?.internalAuditReportHistories?.length > 0) {
        return (
          <tbody>
            {internalAuditReportDetail?.internalAuditReportHistories?.map(
              (item, index) => {
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
              },
            )}
          </tbody>
        );
      }
      return null;
    },
    [
      internalAuditReportDetail?.internalAuditReportHistories,
      rowLabels,
      sanitizeData,
    ],
  );

  return (
    <CollapseUI
      title={renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['User history section'],
      )}
      collapseClassName={styles.collapse}
      isOpen={isOpen}
      content={
        <TableCp
          isHiddenAction
          loading={false}
          rowLabels={rowLabels}
          renderRow={renderRow}
          isEmpty={
            !internalAuditReportDetail?.internalAuditReportHistories ||
            !internalAuditReportDetail?.internalAuditReportHistories?.length
          }
          classNameNodataWrapper={styles.dataWrapperEmpty}
        />
      }
      toggle={() => setIsOpen((prev) => !prev)}
    />
  );
};

export default UserHistory;
