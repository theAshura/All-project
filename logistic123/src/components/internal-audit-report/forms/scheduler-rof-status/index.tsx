import { FC, useCallback, useContext, useMemo } from 'react';
import { AppRouteConst } from 'constants/route.const';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { IReportFindingForm } from 'models/api/internal-audit-report/internal-audit-report.model';
import { RowComponent } from 'components/common/table/row/rowCp';
import { Action } from 'models/common.model';
import Button, { ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import cx from 'classnames';
import TableCp from 'components/common/table/TableCp';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from '../form.module.scss';

interface Props {
  toggle: () => void;
  title: string;
  isOpen: boolean;
  dynamicLabels?: IDynamicLabel;
}

const SchedulerROFStatusTable: FC<Props> = ({
  toggle,
  title,
  dynamicLabels,
  isOpen,
}) => {
  const { schedulerROFStatus } = useContext(InternalAuditReportFormContext);

  const rowLabels = useMemo(
    () => [
      {
        id: 'action',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Action,
        ),
        sort: false,
        width: '100',
      },
      {
        id: 'refNo',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Scheduler reference'],
        ),
        sort: true,
        width: '100',
      },
      {
        id: 'status',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Scheduler status'],
        ),
        sort: true,
        width: '150',
      },
      {
        id: 'planningRequest.refId',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Report of findings reference'],
        ),
        width: '200',
        sort: true,
      },
      {
        id: 'planningRequest.status',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Report of findings status'],
        ),
        sort: true,
        width: '200',
      },
    ],
    [dynamicLabels],
  );

  const fillStatus = (status: string) => {
    const statusTest = status?.toLowerCase();
    if (!statusTest) return '';
    switch (statusTest) {
      case 'draft':
        return 'Draft';
      case 'submitted':
        return 'Submitted';
      case 'approved':
        return 'Approved';
      case 'auditor_accepted':
        return 'Inspector accepted';
      case 'rejected':
        return 'Reassigned';
      case 'planned_successfully':
        return 'Planned successfully';
      case 'Completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const sanitizeData = useCallback((item: IReportFindingForm) => {
    const finalData = {
      refNo: item?.planningRequest?.refId,
      'planningRequest.status': fillStatus(item?.planningRequest?.status),
      'planningRequest.refId': item?.refNo,
      status: item?.status,
    };
    return finalData;
  }, []);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      const arrschedulerROFStatus = [schedulerROFStatus];
      if (schedulerROFStatus) {
        return (
          <tbody>
            {arrschedulerROFStatus.map((item) => {
              const finalData = sanitizeData(item);
              const actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => {
                    const win = window.open(
                      AppRouteConst.getPlanningAndRequestById(
                        item?.planningRequestId,
                      ),
                      '_blank',
                    );
                    return win.focus();
                  },
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                  // disable: disabled,
                },
              ];
              return (
                <RowComponent
                  key={item.id}
                  isScrollable={isScrollable}
                  actionList={actions}
                  data={finalData}
                  onClickRow={() => {
                    const win = window.open(
                      AppRouteConst.getPlanningAndRequestById(
                        item?.planningRequestId,
                      ),
                      '_blank',
                    );
                    return win.focus();
                  }}
                  rowLabels={rowLabels}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [schedulerROFStatus, sanitizeData, rowLabels],
  );

  return useMemo(
    () => (
      <Modal
        isOpen={isOpen}
        title={title}
        toggle={toggle}
        w={850}
        content={
          <div>
            <p className={cx(styles.titleModle, 'mb-3')}>
              {renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS[
                  'Scheduler and report of findings status'
                ],
              )}
            </p>
            <TableCp
              loading={false}
              rowLabels={rowLabels}
              renderRow={renderRow}
              isEmpty={!schedulerROFStatus}
              classNameNodataWrapper={styles.dataWrapperEmpty}
            />
          </div>
        }
        footer={
          <div className="d-flex justify-content-end">
            <Button onClick={toggle}>
              {renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS.Close,
              )}
            </Button>
          </div>
        }
        modalType={ModalType.NORMAL}
      />
    ),
    [
      isOpen,
      title,
      toggle,
      dynamicLabels,
      rowLabels,
      renderRow,
      schedulerROFStatus,
    ],
  );
};

export default SchedulerROFStatusTable;
