import { useCallback, useContext, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import {
  InternalAuditReportFormContext,
  WorkflowStatus,
  FindingStatus,
} from 'contexts/internal-audit-report/IARFormContext';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import TableCp from 'components/common/table/TableCp';
import { Action } from 'models/common.model';
import images from 'assets/images/images';
import { NonConformity } from 'models/api/internal-audit-report/internal-audit-report.model';
import { ButtonType } from 'components/ui/button/Button';
import { RowComponent } from 'components/common/table/row/rowCp';
import { CommonQuery, TOOLTIP_COLOR } from 'constants/common.const';
import Tooltip from 'antd/lib/tooltip';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { showObservationModal } from '../common/modals/observation-modal/ObservationModal';
import {
  useReviewStatus,
  useAuditor,
  useDraftOrReassigned,
} from '../helpers/helpers';
import styles from '../form.module.scss';

const Observation = ({ dynamicLabels }) => {
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
        id: 'auditType',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
        ),
        sort: false,
        width: '100',
        maxWidth: '300',
      },
      {
        id: 'natureFinding',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Nature of findings'],
        ),
        width: '150',
        sort: false,
      },
      {
        id: 'findings',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Findings,
        ),
        sort: false,
        width: '100',
        maxWidth: '300',
      },
      {
        id: 'isSignificant',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Is significant'],
        ),
        // (
        //   <Tooltip
        //     placement="topLeft"
        //     title="Is Significant"
        //     color={TOOLTIP_COLOR}
        //   >
        //     <span className="limit-line-text">Is Significant</span>
        //   </Tooltip>
        // ),
        sort: false,
        width: '150',
        fixedWidth: '150',
      },
      {
        id: 'pic',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.PIC,
        ),
        sort: false,
        width: '100',
        maxWidth: '300',
      },
      {
        id: 'status',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Status,
        ),
        sort: false,
        width: '100',
      },
      {
        id: 'workflowStatus',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Workflow status'],
        ),
        sort: false,
        width: '200',
      },
    ],
    [dynamicLabels],
  );
  const { userInfo } = useSelector((store) => store.authenticate);
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { search } = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { OBSList, users } = useContext(InternalAuditReportFormContext);
  const { checkReviewStatus, isReviewerOrApprover } = useReviewStatus();
  const isAuditor = useAuditor();
  const isDraftOrReassigned = useDraftOrReassigned();

  const checkIsAuditor = useCallback(
    (item: NonConformity) => {
      if (
        isAuditor() &&
        isDraftOrReassigned() &&
        item.workflowStatus !== WorkflowStatus.CLOSE_OUT &&
        search === CommonQuery.EDIT
      ) {
        if (
          (!isReviewerOrApprover() &&
            item.findingStatus === FindingStatus.OPENED) ||
          isReviewerOrApprover()
        ) {
          return true;
        }
        return false;
      }
      return false;
    },
    [isAuditor, isDraftOrReassigned, isReviewerOrApprover, search],
  );

  const getCurrentReviewStatus = useCallback(
    (item: NonConformity) => {
      if (
        (((checkReviewStatus() ||
          (internalAuditReportDetail?.status ===
            InternalAuditReportStatus.APPROVED &&
            isReviewerOrApprover())) &&
          item.workflowStatus !== WorkflowStatus.CLOSE_OUT) ||
          internalAuditReportDetail?.status ===
            InternalAuditReportStatus.DRAFT) &&
        search === CommonQuery.EDIT
      ) {
        return true;
      }
      return false;
    },
    [
      checkReviewStatus,
      internalAuditReportDetail,
      search,
      isReviewerOrApprover,
    ],
  );

  const checkPICPermission = useCallback(
    (item: NonConformity) => {
      if (
        item?.picId === userInfo?.id &&
        item?.workflowStatus !== WorkflowStatus.CLOSE_OUT &&
        internalAuditReportDetail?.status !==
          InternalAuditReportStatus.CLOSEOUT &&
        internalAuditReportDetail?.internalAuditReportHistories?.find(
          (i) => i?.status === 'submitted',
        )
      ) {
        return true;
      }
      return false;
    },
    [userInfo, internalAuditReportDetail],
  );

  const sanitizeData = useCallback(
    (item: NonConformity, index: number) => {
      const picName = users?.find((i) => i.id === item?.picId);
      const finalData = {
        auditType: item?.auditTypeName,
        natureFinding: item?.natureFindingName,
        findings: item?.findingComment,
        isSignificant: item?.isSignificant ? 'Yes' : 'No',
        pic: (
          <Tooltip
            placement="topLeft"
            title={picName?.username}
            color={TOOLTIP_COLOR}
          >
            <span className="limit-line-text">{picName?.username}</span>
          </Tooltip>
        ),
        status: item?.findingStatus,
        workflowStatus: item?.workflowStatus,
      };
      return finalData;
    },
    [users],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (OBSList?.length > 0) {
        return (
          <tbody>
            {OBSList?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              const disableWithCloseCase =
                item.findingStatus === 'Closed' && item?.picId === userInfo?.id;
              const closeoutRofAndIAR =
                internalAuditReportDetail?.internalAuditReportHistories?.find(
                  (i) => i.status === 'Close out',
                );

              let actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () =>
                    showObservationModal({ isEdit: false, data: item }),
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                  // disable: disabled,
                },
              ];
              if (
                (((checkPICPermission(item) ||
                  getCurrentReviewStatus(item) ||
                  checkIsAuditor(item)) &&
                  !disableWithCloseCase &&
                  !closeoutRofAndIAR) ||
                  internalAuditReportDetail?.status ===
                    InternalAuditReportStatus.DRAFT) &&
                search === CommonQuery.EDIT
              ) {
                actions = [
                  ...actions,
                  {
                    img: images.icons.icEdit,
                    function: () =>
                      showObservationModal({ isEdit: true, data: item }),
                    feature: Features.AUDIT_INSPECTION,
                    subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                    action: ActionTypeEnum.VIEW,
                    cssClass: 'ms-1',
                    // disable: disabled,
                  },
                ];
              }
              return (
                <RowComponent
                  key={item.id}
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={actions}
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
    [
      OBSList,
      sanitizeData,
      userInfo?.id,
      internalAuditReportDetail?.internalAuditReportHistories,
      internalAuditReportDetail?.status,
      checkPICPermission,
      getCurrentReviewStatus,
      checkIsAuditor,
      search,
      rowLabels,
    ],
  );

  return useMemo(
    () => (
      <CollapseUI
        title={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Observation,
        )}
        collapseClassName={styles.collapse}
        isOpen={isOpen}
        content={
          <>
            <TableCp
              loading={false}
              rowLabels={rowLabels}
              isEmpty={!OBSList || !OBSList.length}
              renderRow={renderRow}
              classNameNodataWrapper={styles.dataWrapperEmpty}
            />
          </>
        }
        toggle={() => setIsOpen((prev) => !prev)}
      />
    ),
    [dynamicLabels, isOpen, rowLabels, OBSList, renderRow],
  );
};

export default Observation;
