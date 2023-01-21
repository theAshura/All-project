import Tooltip from 'antd/lib/tooltip';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { CAR_STATUS } from 'constants/car.const';
import { TOOLTIP_COLOR } from 'constants/common.const';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { InternalAuditReportFormContext } from '../../../../contexts/internal-audit-report/IARFormContext';
import styles from '../form.module.scss';

const FindingSummary = ({ dynamicLabels }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { listCarCap } = useContext(InternalAuditReportFormContext);

  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const rowLabels = useMemo(
    () => [
      {
        id: 'auditType',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
        ),
        sort: true,
        width: '100',
        maxWidth: '300',
      },
      {
        id: 'totalNoFinding',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Total no of findings'],
        ),
        sort: true,
        width: '120',
        maxWidth: '120',
      },
      {
        id: 'totalNoOfCar',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Total no of CAR'],
        ),
        width: '170',
        maxWidth: '170',
        sort: true,
      },
      {
        id: 'totalNoOfOpenCar',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Total no of open CAR'],
        ),
        sort: true,
        width: '170',
        maxWidth: '170',
      },
      {
        id: 'totalNoOfClosedCar',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Total no of closed CAR'],
        ),
        sort: true,
        width: '170',
        maxWidth: '170',
      },
      {
        id: 'totalNoOfCap',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Total no of CAP'],
        ),
        sort: true,
        width: '170',
        maxWidth: '170',
      },
      {
        id: 'totalNoOfAcceptedCap',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Total no of accepted CAP'],
        ),
        sort: true,
        width: '170',
        maxWidth: '170',
      },
      {
        id: 'totalNoOfDeniedCap',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Total no of denied CAP'],
        ),
        sort: true,
        width: '170',
        maxWidth: '170',
      },
    ],
    [dynamicLabels],
  );
  const sanitizeData = useCallback(() => {
    const totalNoOfCar = listCarCap?.length;
    const totalNoOfOpenCar = listCarCap?.filter(
      (i) => i.status === CAR_STATUS.Open,
    )?.length;
    const totalNoOfClosedCar = listCarCap?.filter(
      (i) => i?.status === CAR_STATUS.Closed,
    )?.length;
    const totalNoOfCap = listCarCap?.filter((i) => !!i?.cap?.id)?.length;
    const totalNoOfAcceptedCap = listCarCap?.filter(
      (i) => i?.cap?.status === CAR_STATUS.Accepted,
    )?.length;
    const totalNoOfDeniedCap = listCarCap?.filter(
      (i) => i?.cap?.status === CAR_STATUS.Denied,
    )?.length;
    const finalData = {
      auditType: (
        <Tooltip
          placement="topLeft"
          title={
            internalAuditReportDetail?.iarAuditTypes?.length > 0
              ? internalAuditReportDetail?.iarAuditTypes
                  ?.map((item) => item.auditTypeName)
                  ?.join(', ')
              : ''
          }
          color={TOOLTIP_COLOR}
        >
          <span className="limit-line-text">
            {internalAuditReportDetail?.iarAuditTypes?.length > 0
              ? internalAuditReportDetail?.iarAuditTypes
                  ?.map((item) => item.auditTypeName)
                  ?.join(', ')
              : ''}
          </span>
        </Tooltip>
      ),
      totalNoFinding:
        internalAuditReportDetail?.reportFindingForm?.totalFindings,
      totalNoOfCar: totalNoOfCar || 0,
      totalNoOfOpenCar: totalNoOfOpenCar || 0,
      totalNoOfClosedCar: totalNoOfClosedCar || 0,
      totalNoOfCap: totalNoOfCap || 0,
      totalNoOfAcceptedCap: totalNoOfAcceptedCap || 0,
      totalNoOfDeniedCap: totalNoOfDeniedCap || 0,
    };
    return finalData;
  }, [
    internalAuditReportDetail?.iarAuditTypes,
    internalAuditReportDetail?.reportFindingForm?.totalFindings,
    listCarCap,
  ]);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      const finalData = sanitizeData();
      return (
        <tbody>
          <RowComponent
            isScrollable={isScrollable}
            data={finalData}
            onClickRow={undefined}
            rowLabels={rowLabels}
          />
        </tbody>
      );
    },
    [rowLabels, sanitizeData],
  );

  return useMemo(
    () => (
      <CollapseUI
        title={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS[
            'Finding/Corrective action request summary'
          ],
        )}
        collapseClassName={styles.collapse}
        isOpen={isOpen}
        content={
          <TableCp
            isHiddenAction
            loading={false}
            rowLabels={rowLabels}
            isEmpty={false}
            renderRow={renderRow}
          />
        }
        toggle={() => setIsOpen((prev) => !prev)}
      />
    ),
    [dynamicLabels, isOpen, rowLabels, renderRow],
  );
};

export default FindingSummary;
