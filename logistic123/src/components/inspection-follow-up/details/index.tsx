import images from 'assets/images/images';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import Button, { ButtonType } from 'components/ui/button/Button';
import { CommonQuery } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import NoPermissionComponent from 'containers/no-permission/index';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPlanningAndRequestDetailActions } from 'store/planning-and-request/planning-and-request.action';
import PermissionCheck from 'hoc/withPermissionCheck';
import useEffectOnce from 'hoc/useEffectOnce';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useDispatch, useSelector } from 'react-redux';
import {
  MAIL_MODULES_IDS,
  MAIL_TYPES_IDS,
} from 'constants/planning-and-request.const';
import ModalSendMail from 'components/mail-creation/modal-send-mail/ModalSendMail';
import { useLocation, useParams } from 'react-router-dom';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-follow-up.const';
import { getInspectionFollowUpDetailActions } from 'store/internal-audit-report/internal-audit-report.action';
import WatchListManagement from 'components/watch-list-icon/WatchListIcon';
import { WatchlistModuleEnum } from 'pages/watch-list/watch-list.const';
import { getListUserActions } from '../../../store/user/user.action';
import InspectionFollowUpForm from '../forms/InspectionFollowUpForm';
import styles from './detail.module.scss';

export default function InspectionFollowUpDetail() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionFollowUp,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [modalSendEmailVisible, setModalSendEmailVisible] = useState(false);

  const { id } = useParams<{ id: string }>();

  const { inspectionFollowDetail } = useSelector(
    (state) => state.internalAuditReport,
  );
  const { PlanningAndRequestDetail } = useSelector(
    (state) => state.planningAndRequest,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  useEffect(() => {
    if (inspectionFollowDetail?.planningRequest?.id) {
      dispatch(
        getPlanningAndRequestDetailActions.request(
          inspectionFollowDetail?.planningRequest?.id,
        ),
      );
    }
  }, [inspectionFollowDetail?.planningRequest?.id, dispatch]);

  useEffectOnce(() => {
    dispatch(getInspectionFollowUpDetailActions.request(id));
    dispatch(getListUserActions.request({ pageSize: -1 }));
  });

  const statusFollowUp = useMemo(() => {
    switch (inspectionFollowDetail?.followUp?.status) {
      case 'InProgress':
        return 'In-progress';
      case 'CloseOut':
        return 'Close out';
      default:
        return inspectionFollowDetail?.followUp?.status || '-';
    }
  }, [inspectionFollowDetail?.followUp?.status]);

  const isShowButtonEdit = useMemo(() => {
    const isCurrentDoc = checkDocHolderChartererVesselOwner(
      {
        vesselDocHolders:
          inspectionFollowDetail?.vessel?.vesselDocHolders || [],
        vesselCharterers:
          inspectionFollowDetail?.vessel?.vesselCharterers || [],
        vesselOwners: inspectionFollowDetail?.vessel?.vesselOwners || [],
        createdAt: inspectionFollowDetail?.followUp?.createdAt,
      },
      userInfo,
    );
    return (
      search !== CommonQuery.EDIT &&
      inspectionFollowDetail?.followUp?.status !== 'CloseOut' &&
      isCurrentDoc
    );
  }, [
    inspectionFollowDetail?.followUp?.createdAt,
    inspectionFollowDetail?.followUp?.status,
    inspectionFollowDetail?.vessel?.vesselCharterers,
    inspectionFollowDetail?.vessel?.vesselDocHolders,
    inspectionFollowDetail?.vessel?.vesselOwners,
    search,
    userInfo,
  ]);

  const getListByRelationship = useCallback(
    (relationship) => {
      if (inspectionFollowDetail?.rofUsers?.length > 0) {
        const rofUserManager = inspectionFollowDetail?.rofUsers?.filter(
          (item) => item.relationship === relationship,
        );
        return rofUserManager.map((item) => item.username)?.join(', ');
      }
      return '-';
    },
    [inspectionFollowDetail],
  );
  const auditorList = useMemo(() => {
    if (inspectionFollowDetail?.rofUsers?.length > 0) {
      const rofUserManager = inspectionFollowDetail?.rofUsers?.filter(
        (item) =>
          item.relationship === 'auditor' ||
          item.relationship === 'leadAuditor',
      );
      return rofUserManager.map((item) => item.username)?.join(', ');
    }
    return '-';
  }, [inspectionFollowDetail]);
  const vesselManagerList = useMemo(
    () => getListByRelationship('vesselManager'),
    [getListByRelationship],
  );
  const leadAuditorList = useMemo(
    () => getListByRelationship('leadAuditor'),
    [getListByRelationship],
  );

  const renderWatchIcon = useMemo(
    () => (
      <WatchListManagement
        referenceId={id}
        dynamicLabels={dynamicLabels}
        referenceModuleName={WatchlistModuleEnum.INSPECTION_FOLLOW_UP}
        referenceRefId={inspectionFollowDetail?.followUp?.refId}
      />
    ),
    [dynamicLabels, id, inspectionFollowDetail?.followUp?.refId],
  );

  return (
    <PermissionCheck
      options={{
        feature: Features.AUDIT_INSPECTION,
        subFeature: SubFeatures.INSPECTION_FOLLOW_UP,
        action: ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.editContainer}>
            <Container className={styles.headerContainer}>
              <div className={cx('d-flex justify-content-between')}>
                <div className={styles.headers}>
                  <BreadCrumb
                    current={
                      search === CommonQuery.EDIT
                        ? BREAD_CRUMB.INSPECTION_FOLLOW_UP_EDIT
                        : BREAD_CRUMB.INSPECTION_FOLLOW_UP_DETAIL
                    }
                  />
                  <div className={cx('fw-bold', styles.title)}>
                    {renderDynamicModuleLabel(
                      listModuleDynamicLabels,
                      DynamicLabelModuleName.AuditInspectionInspectionFollowUp,
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center pt-2">
                  {renderWatchIcon}
                  {!isEdit && (
                    <Button
                      className={cx(styles.buttonFilter)}
                      buttonType={ButtonType.CancelOutline}
                      // disabled={loading}
                      onClick={() => {
                        history.goBack();
                      }}
                    >
                      {renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS.Back,
                      )}
                    </Button>
                  )}

                  {isShowButtonEdit && (
                    <Button
                      className={cx('ms-3', styles.buttonFilter)}
                      // disabled={loading}
                      onClick={(e) => {
                        history.push(
                          `${AppRouteConst.getInspectionFollowUpById(id)}${
                            CommonQuery.EDIT
                          }`,
                        );
                      }}
                    >
                      <span className="pe-2">
                        {renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS.Edit,
                        )}
                      </span>
                      <img
                        src={images.icons.icEdit}
                        alt="edit"
                        className={styles.icEdit}
                      />
                    </Button>
                  )}

                  {statusFollowUp !== 'Draft' && (
                    <PermissionCheck
                      options={{
                        feature: Features.AUDIT_INSPECTION,
                        subFeature: SubFeatures.INSPECTION_FOLLOW_UP,
                        action: ActionTypeEnum.EMAIL,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={styles.btnSendMail}
                            onClick={() => setModalSendEmailVisible(true)}
                          >
                            <span className="pe-2">
                              {renderDynamicLabel(
                                dynamicLabels,
                                COMMON_DYNAMIC_FIELDS['Send mail'],
                              )}
                            </span>
                            <img
                              src={images.icons.icEmail}
                              alt="icActiveMailSend"
                            />
                          </Button>
                        )
                      }
                    </PermissionCheck>
                  )}
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-end">
                <div className={cx(styles.sno, styles.borderRight)}>
                  <span className={styles.label}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Ref.ID'],
                    )}
                    :{' '}
                  </span>
                  <b>{inspectionFollowDetail?.followUp?.refId || '-'}</b>
                </div>
                <div className={styles.status}>
                  <span className={styles.label}>
                    {' '}
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.Status,
                    )}
                    :{' '}
                  </span>
                  <b>{statusFollowUp}</b>
                </div>
                <div className={styles.sno}>
                  <span className={styles.label}>
                    {' '}
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                        'Global status'
                      ],
                    )}
                    :{' '}
                  </span>
                  <b>
                    {inspectionFollowDetail?.planningRequest?.globalStatus ||
                      '-'}
                  </b>
                </div>
              </div>
            </Container>
            <Container
              className={cx(styles.formContainer, styles.rofContainer)}
            >
              <InspectionFollowUpForm
                dynamicLabels={dynamicLabels}
                isEdit={isEdit}
              />
            </Container>
            <ModalSendMail
              planningAndRequestDetail={{
                ...PlanningAndRequestDetail,
                vessel: {
                  ...PlanningAndRequestDetail?.vessel,
                  name: inspectionFollowDetail?.rofPlanningRequest?.vesselName,
                },
                vesselManagerList,
                leadAuditorList,
                auditorList,
              }}
              dynamicLabels={dynamicLabels}
              mailModule={MAIL_MODULES_IDS.INSPECTION_FLOW_UP}
              planningRequestId={PlanningAndRequestDetail?.id}
              attachmentIdsPlanning={
                PlanningAndRequestDetail?.attachments || []
              }
              entityType={PlanningAndRequestDetail?.entityType || ''}
              vesselTypeId={
                PlanningAndRequestDetail?.vessel?.vesselType?.id || null
              }
              workingType={PlanningAndRequestDetail?.workingType || ''}
              isOpen={modalSendEmailVisible}
              zipFileName={`Inspection follow up ${inspectionFollowDetail?.refNo}.zip`}
              mailTypeId={MAIL_TYPES_IDS.INSPECTION_FLOW_UP}
              onClose={() => {
                setModalSendEmailVisible(false);
              }}
            />
          </div>
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
}
