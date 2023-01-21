import { useCallback, useMemo, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { ItemStatus, StepStatus } from 'components/common/step-line/lineStepCP';
import PopoverStatus from 'components/audit-checklist/common/popover-status/PopoverStatus';
import styles from './header-section.module.scss';

const IARStatusSection = ({ dynamicLabels }) => {
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { stepStatusItems, handleSetStepStatusItems } = useContext(
    InternalAuditReportFormContext,
  );

  const handleUpdateStepStatus = useCallback(
    (config: {
      newDraft: string;
      newSubmitted: string;
      newReviewed: string;
      newApproved: string;
      newCloseout: string;
    }) => {
      const newStepStatus = [...stepStatusItems];
      const draft = newStepStatus.findIndex((i) => i.id === ItemStatus.DRAFT);
      const submitted = newStepStatus.findIndex(
        (i) => i.id === ItemStatus.SUBMITTED,
      );
      const reviewed = newStepStatus.findIndex(
        (i) => i.id === ItemStatus.REVIEWED,
      );
      const approved = newStepStatus.findIndex(
        (i) => i.id === ItemStatus.APPROVED,
      );
      const closeout = newStepStatus.findIndex(
        (i) => i.id === ItemStatus.CLOSED_OUT,
      );
      newStepStatus[draft].status = config.newDraft;
      newStepStatus[submitted].status = config.newSubmitted;
      newStepStatus[reviewed].status = config.newReviewed;
      newStepStatus[approved].status = config.newApproved;
      newStepStatus[closeout].status = config.newCloseout;
      handleSetStepStatusItems(newStepStatus);
    },
    [handleSetStepStatusItems, stepStatusItems],
  );

  const renderStepStatus = useCallback(() => {
    if (
      [
        InternalAuditReportStatus.REVIEWED_1.toString(),
        InternalAuditReportStatus.REVIEWED_2.toString(),
        InternalAuditReportStatus.REVIEWED_3.toString(),
        InternalAuditReportStatus.REVIEWED_4.toString(),
        InternalAuditReportStatus.REVIEWED_5.toString(),
      ].includes(internalAuditReportDetail?.status)
    ) {
      handleUpdateStepStatus({
        newDraft: StepStatus.ACTIVE,
        newSubmitted: StepStatus.ACTIVE,
        newReviewed: StepStatus.ACTIVE,
        newApproved: StepStatus.INACTIVE,
        newCloseout: StepStatus.INACTIVE,
      });
    } else if (
      internalAuditReportDetail?.status === InternalAuditReportStatus.SUBMITTED
    ) {
      handleUpdateStepStatus({
        newDraft: StepStatus.ACTIVE,
        newSubmitted: StepStatus.ACTIVE,
        newReviewed: StepStatus.INACTIVE,
        newApproved: StepStatus.INACTIVE,
        newCloseout: StepStatus.INACTIVE,
      });
    } else if (
      internalAuditReportDetail?.status === InternalAuditReportStatus.DRAFT
    ) {
      handleUpdateStepStatus({
        newDraft: StepStatus.ACTIVE,
        newSubmitted: StepStatus.INACTIVE,
        newReviewed: StepStatus.INACTIVE,
        newApproved: StepStatus.INACTIVE,
        newCloseout: StepStatus.INACTIVE,
      });
    } else if (
      internalAuditReportDetail?.status ===
        InternalAuditReportStatus.REASSIGNED &&
      [
        InternalAuditReportStatus.REVIEWED_1.toString(),
        InternalAuditReportStatus.REVIEWED_2.toString(),
        InternalAuditReportStatus.REVIEWED_3.toString(),
        InternalAuditReportStatus.REVIEWED_4.toString(),
        InternalAuditReportStatus.SUBMITTED.toString(),
      ].includes(internalAuditReportDetail?.previousStatus)
    ) {
      handleUpdateStepStatus({
        newDraft: StepStatus.ACTIVE,
        newSubmitted: StepStatus.ACTIVE,
        newReviewed: StepStatus.ERROR,
        newApproved: StepStatus.INACTIVE,
        newCloseout: StepStatus.INACTIVE,
      });
    } else if (
      internalAuditReportDetail?.status ===
        InternalAuditReportStatus.REASSIGNED &&
      internalAuditReportDetail?.previousStatus ===
        InternalAuditReportStatus.REVIEWED_5
    ) {
      handleUpdateStepStatus({
        newDraft: StepStatus.ACTIVE,
        newSubmitted: StepStatus.ACTIVE,
        newReviewed: StepStatus.ACTIVE,
        newApproved: StepStatus.ERROR,
        newCloseout: StepStatus.INACTIVE,
      });
    } else if (
      internalAuditReportDetail?.status === InternalAuditReportStatus.APPROVED
    ) {
      handleUpdateStepStatus({
        newDraft: StepStatus.ACTIVE,
        newSubmitted: StepStatus.ACTIVE,
        newReviewed: StepStatus.ACTIVE,
        newApproved: StepStatus.ACTIVE,
        newCloseout: StepStatus.INACTIVE,
      });
    } else if (
      internalAuditReportDetail?.status === InternalAuditReportStatus.CLOSEOUT
    ) {
      handleUpdateStepStatus({
        newDraft: StepStatus.ACTIVE,
        newSubmitted: StepStatus.ACTIVE,
        newReviewed: StepStatus.ACTIVE,
        newApproved: StepStatus.ACTIVE,
        newCloseout: StepStatus.ACTIVE,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalAuditReportDetail]);

  useEffect(() => {
    renderStepStatus();
  }, [renderStepStatus]);

  // const findHistoryByStatus = useCallback(
  //   (status: string) => {
  //     const statusHistory =
  //       internalAuditReportDetail?.internalAuditReportHistories || [];
  //     console.log(statusHistory);
  //     let lastReassignedStatusIndex = 0;
  //     let historyFiltered;
  //     let dataPopulated;
  //     // eslint-disable-next-line no-plusplus
  //     for (let index = statusHistory.length - 1; index >= 0; index--) {
  //       if (
  //         statusHistory[index].status === InternalAuditReportStatus.REASSIGNED
  //       ) {
  //         lastReassignedStatusIndex = index;
  //         break;
  //       }
  //     }
  //     const lastHistoryCycle = statusHistory.slice(
  //       lastReassignedStatusIndex,
  //       statusHistory.length,
  //     );
  //     if (status === ItemStatus.REVIEWED) {
  //       historyFiltered = lastHistoryCycle.filter((item) =>
  //         [
  //           InternalAuditReportStatus.REVIEWED_1.toString(),
  //           InternalAuditReportStatus.REVIEWED_2.toString(),
  //           InternalAuditReportStatus.REVIEWED_3.toString(),
  //           InternalAuditReportStatus.REVIEWED_4.toString(),
  //           InternalAuditReportStatus.REVIEWED_5.toString(),
  //         ].includes(item.status),
  //       );
  //       const lengthReview = historyFiltered.length;
  //       let newDataReview = [];
  //       let i;
  //       for (i = lengthReview - 1; i >= 0; i -= 1) {
  //         if (
  //           historyFiltered[i].status !==
  //           InternalAuditReportStatus.REVIEWED_1.toString()
  //         ) {
  //           newDataReview = [historyFiltered[i], ...newDataReview];
  //         }
  //         if (
  //           historyFiltered[i].status ===
  //           InternalAuditReportStatus.REVIEWED_1.toString()
  //         ) {
  //           newDataReview = [historyFiltered[i], ...newDataReview];
  //           break;
  //         }
  //       }

  //       dataPopulated = newDataReview.map((item, index) => ({
  //         datetime: item?.updatedAt,
  //         description: item?.createdUser?.username,
  //         name: item?.createdUser?.jobTitle,
  //         id: v4(),
  //         isMulti: true,
  //         label: `Review ${index + 1}`,
  //       }));
  //     } else if (status === ItemStatus.CLOSED_OUT) {
  //       historyFiltered = lastHistoryCycle.filter(
  //         (i) => i.status === InternalAuditReportStatus.CLOSEOUT,
  //       );
  //       dataPopulated = historyFiltered.map((item) => ({
  //         datetime: item?.updatedAt,
  //         description: item?.createdUser?.username,
  //         name: item?.createdUser?.jobTitle,
  //       }));
  //     } else {
  //       historyFiltered = lastHistoryCycle.filter(
  //         (item) =>
  //           String(item.status).toLowerCase() === String(status).toLowerCase(),
  //       );
  //       if (status === ItemStatus.DRAFT && historyFiltered.length === 0) {
  //         historyFiltered = new Array(statusHistory[lastReassignedStatusIndex]);
  //       }
  //       dataPopulated = historyFiltered.map((item) => ({
  //         datetime: item?.updatedAt,
  //         description: item?.createdUser?.username,
  //         name: item?.createdUser?.jobTitle,
  //       }));
  //     }

  //     return dataPopulated;
  //   },
  //   [internalAuditReportDetail],
  // );

  const findHistoryByStatus = useCallback(
    (status: string) => {
      const statusHistory =
        internalAuditReportDetail?.internalAuditReportHistories || [];
      if (status === 'reviewed') {
        const historyFiltered = statusHistory.filter((item) =>
          String(item.status).toLowerCase().includes('review'),
        );

        const dataPopulated = historyFiltered.map((item) => ({
          id: item.id,
          datetime: item?.updatedAt,
          description: item?.createdUser?.username,
          name: item?.createdUser?.jobTitle,
        }));
        return dataPopulated;
      }
      const historyFiltered = statusHistory.filter(
        (item) =>
          String(item.status).toLowerCase() ===
          String(status).toLocaleLowerCase(),
      );

      const dataPopulated = historyFiltered.map((item) => ({
        datetime: item?.updatedAt,
        description: item?.createdUser?.username,
        name: item?.createdUser?.jobTitle,
      }));
      return dataPopulated;
    },
    [internalAuditReportDetail?.internalAuditReportHistories],
  );

  const populateStatusItems = useMemo(() => {
    if (internalAuditReportDetail?.status && stepStatusItems) {
      return stepStatusItems.map((item, index) => {
        if (item.status === 'inactive') {
          return item;
        }
        if (item.status === 'error') {
          return {
            ...item,
            info: findHistoryByStatus('reassigned'),
          };
        }
        if (item.id === 'Reviewed') {
          return {
            ...item,
            isMultiInfoStatus: true,
            info: findHistoryByStatus('reviewed'),
          };
        }
        return {
          ...item,
          info: findHistoryByStatus(
            item.id === 'Closed out' ? 'closeout' : item.id,
          ),
        };
      });
    }

    return stepStatusItems;
  }, [internalAuditReportDetail, stepStatusItems, findHistoryByStatus]);

  return useMemo(
    () => (
      <PopoverStatus
        header={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Workflow progress'],
        )}
        dynamicLabels={dynamicLabels}
        stepStatusItems={populateStatusItems}
        status={internalAuditReportDetail?.status}
        className={styles.historySteps}
      />
    ),
    [dynamicLabels, populateStatusItems, internalAuditReportDetail?.status],
  );
};
export default IARStatusSection;
