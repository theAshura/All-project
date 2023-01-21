import { useState, useContext, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import { showNonConformityModal } from 'components/internal-audit-report/forms/common/modals/non-comformity-modal/NonCoformityModal';
import {
  InternalAuditReportFormContext,
  WorkflowStatus,
  FindingStatus,
} from 'contexts/internal-audit-report/IARFormContext';
import { RowComponent } from 'components/common/table/row/rowCp';
import { NonConformity as NonConformityModel } from 'models/api/internal-audit-report/internal-audit-report.model';
import { Action } from 'models/common.model';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { UserRecord } from 'models/api/user/user.model';
import images from 'assets/images/images';
import { ButtonType } from 'components/ui/button/Button';
import TableCp from 'components/common/table/TableCp';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { CommonQuery, TOOLTIP_COLOR } from 'constants/common.const';
import Tooltip from 'antd/lib/tooltip';
import {
  useReviewStatus,
  useAuditor,
  useDraftOrReassigned,
} from '../helpers/helpers';
import styles from '../form.module.scss';

const NonConformity = ({ dynamicLabels }) => {
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
  const { nonConformityList, users } = useContext(
    InternalAuditReportFormContext,
  );
  const { checkReviewStatus, isReviewerOrApprover } = useReviewStatus();
  const isAuditor = useAuditor();
  const isDraftOrReassigned = useDraftOrReassigned();

  const checkIsAuditor = useCallback(
    (item: NonConformityModel) => {
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
    [isDraftOrReassigned, isAuditor, isReviewerOrApprover, search],
  );

  const getCurrentReviewStatus = useCallback(
    (item: NonConformityModel) => {
      if (
        (checkReviewStatus() ||
          (internalAuditReportDetail?.status ===
            InternalAuditReportStatus.APPROVED &&
            isReviewerOrApprover())) &&
        item.workflowStatus !== WorkflowStatus.CLOSE_OUT &&
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
    (item: NonConformityModel) => {
      if (
        item?.picId === userInfo?.id &&
        item?.workflowStatus !== WorkflowStatus.CLOSE_OUT &&
        internalAuditReportDetail?.status !== InternalAuditReportStatus.CLOSEOUT
      ) {
        return true;
      }
      return false;
    },
    [userInfo, internalAuditReportDetail],
  );

  const sanitizeData = useCallback(
    (item: NonConformityModel) => {
      const picName: UserRecord = users?.find((i) => i.id === item?.picId);
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
      if (nonConformityList?.length > 0) {
        return (
          <tbody>
            {nonConformityList?.map((item, index) => {
              const finalData = sanitizeData(item);
              const isPIC = item?.picId === userInfo?.id || !item?.picId;
              const disableWithCloseCase =
                item.findingStatus === 'Closed' && !isReviewerOrApprover();

              const isNotAssignPicWhenReviewOrApprover =
                isReviewerOrApprover() &&
                !item?.picId &&
                item.workflowStatus !== 'Close out';

              let actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () =>
                    showNonConformityModal({ isEdit: false, data: item }),
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                  // disable: disabled,
                },
              ];

              if (
                ((isPIC &&
                  (checkPICPermission(item) ||
                    getCurrentReviewStatus(item) ||
                    checkIsAuditor(item)) &&
                  !disableWithCloseCase) ||
                  isNotAssignPicWhenReviewOrApprover ||
                  internalAuditReportDetail?.status ===
                    InternalAuditReportStatus.DRAFT) &&
                search === CommonQuery.EDIT
              ) {
                actions = [
                  ...actions,
                  {
                    img: images.icons.icEdit,
                    function: () =>
                      showNonConformityModal({ isEdit: true, data: item }),
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
      nonConformityList,
      sanitizeData,
      userInfo?.id,
      isReviewerOrApprover,
      checkPICPermission,
      getCurrentReviewStatus,
      checkIsAuditor,
      internalAuditReportDetail?.status,
      search,
      rowLabels,
    ],
  );

  return useMemo(
    () => (
      <CollapseUI
        title={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Non conformity'],
        )}
        collapseClassName={styles.collapse}
        isOpen={isOpen}
        content={
          <>
            <TableCp
              loading={false}
              rowLabels={rowLabels}
              isEmpty={!nonConformityList || !nonConformityList.length}
              renderRow={renderRow}
              classNameNodataWrapper={styles.dataWrapperEmpty}
            />
          </>
        }
        toggle={() => setIsOpen((prev) => !prev)}
      />
    ),
    [dynamicLabels, isOpen, nonConformityList, renderRow, rowLabels],
  );
};

export default NonConformity;
