import { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  getInternalAuditReportDetailActions,
  clearInternalAuditReportErrorsReducer,
  clearInternalAuditReportDetail,
} from 'store/internal-audit-report/internal-audit-report.action';
import { WorkFlowType, CommonQuery } from 'constants/common.const';
import { AuditReportModal } from 'components/internal-audit-report/forms/common/modals/audit-report-modal/AuditReportModal';
import {
  InternalAuditReportFormContext,
  CommentProps,
  IARReportHeaderDescriptionState,
  IARReportSubHeaderDescriptionState,
  IARReportHeaderComments,
  IARReportSubHeaderComments,
} from 'contexts/internal-audit-report/IARFormContext';
import { getListDepartmentMasterActionsApi } from 'api/department-master.api';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListVIQsActionsApi } from 'api/viq.api';
import { toastError } from 'helpers/notification.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import NoPermissionComponent from 'containers/no-permission/index';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { getListMainCategoryActionsApi } from 'api/main-category.api';
import { getListSecondCategoryActionsApi } from 'api/second-category.api';
import {
  getWorkFlowActiveUserPermissionActions,
  getWorkFlowPermissionStepActions,
} from 'store/work-flow/work-flow.action';
import { getListUserRecordActionsApi, getUrlImageApi } from 'api/user.api';

import Container from 'components/common/container/ContainerPage';
import moment from 'moment';
import { InternalAuditReportDetailResponse } from 'models/api/internal-audit-report/internal-audit-report.model';
import {
  getListStaticFindingItemActionsApi,
  getListPreviousInternalAuditReportsActionsApi,
} from 'api/internal-audit-report.api';
import { getPlanningAndRequestDetailActions } from 'store/planning-and-request/planning-and-request.action';
import { NonConformityModal } from '../forms/common/modals/non-comformity-modal/NonCoformityModal';
import { CommentModal } from '../forms/common/modals/comment-modal/CommentModal';
import { DescriptionModal } from '../forms/common/modals/description-modal/DescriptionModal';
import { ConfirmationModal } from '../forms/common/modals/confirmation-modal/ConfirmationModal';
import { InternalAuditModal } from '../forms/common/modals/internal-audit-modal/InternalAuditModal';
import HeaderSection from '../forms/common/header-section/HeaderSection';
import InternalAuditReportForm from '../forms';
import styles from './detail.module.scss';
import { ObservationModal } from '../forms/common/modals/observation-modal/ObservationModal';

export enum InternalAuditReportStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  REVIEWED_1 = 'reviewed_1',
  REVIEWED_2 = 'reviewed_2',
  REVIEWED_3 = 'reviewed_3',
  REVIEWED_4 = 'reviewed_4',
  REVIEWED_5 = 'reviewed_5',
  APPROVED = 'approved',
  REASSIGNED = 'reassigned',
  CLOSEOUT = 'closeout',
}

export enum IARReportHeaderTopics {
  OVERVIEW = 'Overview',
  SMS = 'Safety management system related',
  IHAS = 'Inspection history and status',
}

export default function InternalAuditReportDetail() {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { internalAuditReportDetail, loading: IARDetailLoading } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { loading: workFlowloading } = useSelector((store) => store.workFlow);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const paramsMaster = {
    page: 1,
    pageSize: -1,
    status: 'active',
    companyId: userInfo?.mainCompanyId,
  };

  const {
    internalAuditComments,
    globalLoading,
    handleSetBackgroundImage,
    handleSetGlobalLoading,
    handleSetIHASListofItems,
    handleSetRpHeaderComments,
    handleSetRpSubHeaderComments,
    handleSetRpHeaderDescription,
    handleSetRpSubHeaderDescription,
    handleSetAdditionalReviewerSection,
    handleSetNonConformityList,
    handleSetOBSList,
    handleSetDepartment,
    handleSetListPreviousIAR,
    handleSetMainCategory,
    handleSetSecondCategory,
    handleSetViqCategory,
    handleSetListAttachment,
    handleSetWorkFlowRemarks,
    handleSetListLastAuditFindings,
    handleFillComment,
    handleSetUsers,
    handleSetOfficeComment,
    handleSetSchedulerROFStatus,
  } = useContext(InternalAuditReportFormContext);

  const fillComment = (data) => {
    internalAuditComments.forEach((e) => {
      handleFillComment(e.name, data[`${e.name}`] || '');
    });
  };

  const { search } = useLocation();

  const fetchData = async (
    internalAuditReportDetail: InternalAuditReportDetailResponse,
    mounted: boolean,
  ) => {
    try {
      setDataLoading(true);
      await Promise.all([
        await getListDepartmentMasterActionsApi({ ...paramsMaster }),
        await getListMainCategoryActionsApi({ ...paramsMaster }),
        await getListSecondCategoryActionsApi({ ...paramsMaster }),
        await getListVIQsActionsApi({ ...paramsMaster }),
        internalAuditReportDetail?.vesselId &&
          (await getListStaticFindingItemActionsApi({
            vesselId: internalAuditReportDetail?.vesselId,
            fromDate: moment().startOf('month').toISOString(),
            toDate: moment().endOf('month').toISOString(),
          })),
        await getListUserRecordActionsApi({
          ...paramsMaster,
        }),
        await getListPreviousInternalAuditReportsActionsApi({
          id: internalAuditReportDetail?.id,
          page: 1,
          pageSize: -1,
        }),
        internalAuditReportDetail?.background &&
          (await getUrlImageApi(internalAuditReportDetail?.background)),
      ]).then((r) => {
        if (mounted) {
          handleSetDepartment(r[0]?.data?.data || []);
          handleSetMainCategory(r[1]?.data?.data || []);
          handleSetSecondCategory(r[2]?.data?.data || []);
          handleSetViqCategory(r[3]?.data?.data || []);
          handleSetListAttachment(internalAuditReportDetail?.attachments || []);
          handleSetIHASListofItems(r[4]?.data || []);
          handleSetUsers(r[5]?.data?.data || []);
          handleSetListPreviousIAR(r[6]?.data || []);
          handleSetBackgroundImage(r[7]?.data || null);
        }
      });
      setDataLoading(false);
    } catch (e) {
      toastError(e);
      setDataLoading(false);
    }
    const officeComment: CommentProps[] =
      internalAuditReportDetail?.internalAuditReportOfficeComments?.map(
        (item) => ({
          id: item.id,
          comment: item.comment,
          isNew: false,
          commentedDate: item?.createdAt || '',
          commentedBy: item?.createdUser?.username,
          jobTitle: item?.createdUser?.jobTitle,
        }),
      ) || [];

    if (mounted) {
      if (internalAuditReportDetail?.internalAuditReportComment && mounted) {
        fillComment(internalAuditReportDetail?.internalAuditReportComment);
      }
      handleSetOfficeComment(officeComment);
      handleSetAdditionalReviewerSection(
        internalAuditReportDetail?.internalAuditReportHistories,
      );
      handleSetWorkFlowRemarks(internalAuditReportDetail?.workflowRemarks);
      handleSetNonConformityList(
        internalAuditReportDetail?.nonConformities?.data,
      );
      handleSetOBSList(internalAuditReportDetail?.observations?.data);

      handleSetListLastAuditFindings(
        internalAuditReportDetail?.lastAuditFindings,
      );
      handleSetSchedulerROFStatus(internalAuditReportDetail?.reportFindingForm);
      const mapHeaderDescription: IARReportHeaderDescriptionState[] = [];

      internalAuditReportDetail?.IARReportHeaders?.filter((i) => !i?.parentId)
        ?.map((i) => ({
          headerId: i?.reportHeaderId,
          minScore: i?.minScore,
          maxScore: i?.maxScore,
          descriptions: i?.IARReportHeaderDescriptions,
        }))
        ?.forEach((i) => {
          i?.descriptions?.forEach((descriptionItem) => {
            const finalDescription = {
              id: descriptionItem?.id,
              headerId: i?.headerId,
              topic: descriptionItem?.topic,
              score: descriptionItem?.score,
              description: descriptionItem?.description,
              isNew: false,
              maxScore: i?.maxScore,
              minScore: i?.minScore,
            };

            mapHeaderDescription.push(finalDescription);
          });
        });
      handleSetRpHeaderDescription(mapHeaderDescription);
      const mapSubHeaderDescription: IARReportSubHeaderDescriptionState[] = [];
      internalAuditReportDetail?.IARReportHeaders?.filter((i) => !!i?.parentId)
        ?.map((i) => ({
          headerId: i?.reportHeaderId,
          minScore: i?.minScore,
          maxScore: i?.maxScore,
          parentId: i?.parentId,
          descriptions: i?.IARReportHeaderDescriptions,
        }))
        ?.forEach((i) => {
          i?.descriptions?.forEach((descriptionItem) => {
            const finalDescription = {
              id: descriptionItem?.id,
              headerId: i?.headerId,
              topic: descriptionItem?.topic,
              score: descriptionItem?.score,
              description: descriptionItem?.description,
              parentId: i?.parentId,
              isNew: false,
              maxScore: i?.maxScore,
              minScore: i?.minScore,
            };
            mapSubHeaderDescription.push(finalDescription);
          });
        });

      handleSetRpSubHeaderDescription(mapSubHeaderDescription);
    }
    const mapHeaderComments: IARReportHeaderComments[] =
      internalAuditReportDetail?.IARReportHeaders?.filter(
        (i) => !i?.parentId,
      )?.map((i) => ({
        id: i.id,
        reportHeaderId: i.reportHeaderId,
        headerTopic: i?.topic,
        headerComment: i?.headerComment || '',
      }));

    handleSetRpHeaderComments(mapHeaderComments);
    const mapSubHeaderComments: IARReportSubHeaderComments[] =
      internalAuditReportDetail?.IARReportHeaders?.filter(
        (i) => i?.parentId,
      )?.map((i) => ({
        id: i.id,
        reportHeaderId: i.reportHeaderId,
        headerTopic: i?.topic,
        headerComment: i?.headerComment || '',
        parentId: i?.parentId,
      }));

    handleSetRpSubHeaderComments(mapSubHeaderComments);
  };

  useEffect(() => {
    let mounted = true;
    if (internalAuditReportDetail) {
      fetchData(internalAuditReportDetail, mounted);
    }
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalAuditReportDetail]);

  useEffect(() => {
    if (id) {
      dispatch(getInternalAuditReportDetailActions.request(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (internalAuditReportDetail?.planningRequestId) {
      dispatch(
        getPlanningAndRequestDetailActions.request(
          internalAuditReportDetail?.planningRequestId,
        ),
      );
    }
  }, [internalAuditReportDetail?.planningRequestId, dispatch]);

  useEffect(() => {
    if (IARDetailLoading || dataLoading || workFlowloading) {
      handleSetGlobalLoading(true);
    } else {
      handleSetGlobalLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IARDetailLoading, dataLoading, workFlowloading]);

  // useEffect(() => {
  //   dispatch(
  //     getWorkFlowActiveUserPermissionActions.request({
  //       workflowType: WorkFlowType.INTERNAL_AUDIT_REPORT,
  //       isRefreshLoading: false,
  //     }),
  //   );
  // }, []);

  // useEffect(() => {
  //   dispatch(clearInternalAuditReportErrorsReducer());
  // }, []);

  // eslint-disable-next-line arrow-body-style
  useEffectOnce(() => {
    dispatch(clearInternalAuditReportErrorsReducer());
    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.INTERNAL_AUDIT_REPORT,
        isRefreshLoading: false,
      }),
    );
    dispatch(
      getWorkFlowPermissionStepActions.request({
        workflowType: WorkFlowType.INTERNAL_AUDIT_REPORT,
        isRefreshLoading: false,
      }),
    );
    return () => {
      dispatch(clearInternalAuditReportDetail());
    };
  });

  const handleSetInitialData = () => fetchData(internalAuditReportDetail, true);

  return (
    <PermissionCheck
      options={{
        feature: Features.AUDIT_INSPECTION,
        subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.EXECUTE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <>
            <HeaderSection />
            <Container className={styles.internalAuditReportDetail}>
              <InternalAuditReportForm
                loading={globalLoading}
                handleSetInitialData={handleSetInitialData}
                id={id}
              />
            </Container>
            <AuditReportModal />
            <CommentModal />
            <NonConformityModal />
            <InternalAuditModal />
            <ObservationModal />
            <ConfirmationModal />
            <DescriptionModal />
          </>
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
}
