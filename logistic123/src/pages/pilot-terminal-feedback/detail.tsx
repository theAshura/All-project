import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import commonStyles from 'components/list-common.module.scss';

import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import Button, { ButtonType } from 'components/ui/button/Button';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { useParams } from 'react-router';
import images from 'assets/images/images';
import PopoverStatus from 'components/audit-checklist/common/popover-status/PopoverStatus';
import { ItemStatus } from 'components/common/step-line/lineStepCP';
import { Info, Item } from 'components/common/step-line/lineStepInfoCP';

import { getInfoByStatusAndWorkFlow } from 'helpers/lineStatus.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { getCurrentModulePageByStatus } from 'helpers/dynamic.helper';
import WatchListManagement from 'components/watch-list-icon/WatchListIcon';
import { WatchlistModuleEnum } from 'pages/watch-list/watch-list.const';
import styles from './detail.module.scss';
import {
  clearPilotTerminalFeedbackErrorsReducer,
  clearPilotTerminalFeedbackReducer,
  deletePilotTerminalFeedbacksActions,
  getPilotTerminalFeedbackDetailActions,
  updatePilotTerminalFeedbacksActions,
} from './store/action';
import PilotTerminalFeedback from './form/pilotTerminalFeedback';

const ListPilotTerminalFeedbackDetail = () => {
  const { t } = useTranslation([
    I18nNamespace.PILOT_TERMINAL_FEEDBACK,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { id, status } = useParams<{ id: string; status: 'edit' | 'detail' }>();
  const { userInfo } = useSelector((state) => state.authenticate);
  const { pilotTerminalFeedbackDetail, loading } = useSelector(
    (state) => state.pilotTerminalFeedback,
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.QuantityAssurancePilotTerminalFeedbackPilotTerminalFeedback,
    modulePage: getCurrentModulePageByStatus(status === 'edit'),
  });

  const canCurrentUserEdit = useMemo(
    () =>
      pilotTerminalFeedbackDetail
        ? checkDocHolderChartererVesselOwner(
            {
              createdAt: pilotTerminalFeedbackDetail.createdAt,
              vesselCharterers:
                pilotTerminalFeedbackDetail?.vessel?.vesselCharterers || [],
              vesselDocHolders:
                pilotTerminalFeedbackDetail?.vessel?.vesselOwners || [],
              vesselOwners:
                pilotTerminalFeedbackDetail?.vessel?.vesselDocHolders || [],
            },
            userInfo,
          )
        : false,
    [pilotTerminalFeedbackDetail, userInfo],
  );

  const isStatusSubmitted = useMemo(
    () => pilotTerminalFeedbackDetail?.status === ItemStatus.SUBMITTED,
    [pilotTerminalFeedbackDetail?.status],
  );

  const handleSubmit = useCallback(
    (dataForm) => {
      dispatch(
        updatePilotTerminalFeedbacksActions.request({
          id,
          data: { ...dataForm },
          handleSuccess: () => {
            history.push(`${AppRouteConst.PILOT_TERMINAL_FEEDBACK}`);
          },
        }),
      );
    },
    [dispatch, id],
  );

  const onDelete = useCallback(() => {
    dispatch(
      deletePilotTerminalFeedbacksActions.request({
        id,
        isDetail: true,
        handleSuccess: () => {
          history.push(AppRouteConst.PILOT_TERMINAL_FEEDBACK);
        },
      }),
    );
  }, [dispatch, id]);

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: onDelete,
    });
  };

  const stepItemMemo: Item[] = useMemo(() => {
    if (pilotTerminalFeedbackDetail) {
      const { workFlow } = pilotTerminalFeedbackDetail;
      const infoOfSubmittedStatus = getInfoByStatusAndWorkFlow(
        ItemStatus.SUBMITTED,
        workFlow,
      );

      const infoForStatusDraft: Info[] =
        getInfoByStatusAndWorkFlow(ItemStatus.DRAFT, workFlow).length === 0
          ? infoOfSubmittedStatus
          : getInfoByStatusAndWorkFlow(ItemStatus.DRAFT, workFlow);
      const infoForStatusSubmitted: Info[] = infoOfSubmittedStatus;

      return [
        {
          id: 'unique1',
          name: ItemStatus.DRAFT,
          status: 'active',
          info: infoForStatusDraft,
        },
        {
          id: 'unique2',
          name: ItemStatus.SUBMITTED,
          status:
            pilotTerminalFeedbackDetail?.status === ItemStatus.SUBMITTED
              ? 'active'
              : 'inactive',
          info: infoForStatusSubmitted,
        },
      ];
    }
    return [];
  }, [pilotTerminalFeedbackDetail]);

  useEffect(() => {
    if (id) {
      dispatch(getPilotTerminalFeedbackDetailActions.request(id));
    }

    return () => {
      dispatch(clearPilotTerminalFeedbackReducer());
      dispatch(clearPilotTerminalFeedbackErrorsReducer());
    };
  }, [dispatch, id]);

  return (
    <div className={commonStyles.wrapper}>
      <HeaderPage
        breadCrumb={
          status === 'edit'
            ? BREAD_CRUMB.PILOT_TERMINAL_FEEDBACK_EDIT
            : BREAD_CRUMB.PILOT_TERMINAL_FEEDBACK_DETAIL
        }
        titlePage={t('pilotTerminalFeedback')}
      >
        <div className="d-flex flex-column justify-content-between align-items-center">
          <div className={styles.statusAndRefContainer}>
            {status !== 'edit' && (
              <>
                <WatchListManagement
                  dynamicLabels={dynamicLabels}
                  referenceId={id}
                  referenceModuleName={
                    WatchlistModuleEnum.PILOT_TERMINAL_FEEDBACK
                  }
                  referenceRefId={pilotTerminalFeedbackDetail?.refId}
                />
                <Button
                  className={cx('me-2', styles.buttonFilter, {
                    [styles.margin0]: isStatusSubmitted,
                  })}
                  buttonType={ButtonType.CancelOutline}
                  onClick={(e) => {
                    history.push(AppRouteConst.PILOT_TERMINAL_FEEDBACK);
                  }}
                >
                  <span>Back</span>
                </Button>
                {!loading && (
                  <>
                    <PermissionCheck
                      options={{
                        feature: Features.QUALITY_ASSURANCE,
                        subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
                        action: ActionTypeEnum.UPDATE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission &&
                        canCurrentUserEdit &&
                        !isStatusSubmitted && (
                          <Button
                            className={cx('me-1', styles.buttonFilter)}
                            onClick={(e) => {
                              history.push(
                                `${AppRouteConst.getPilotTerminalFeedbackById(
                                  id,
                                  'edit',
                                )}`,
                              );
                            }}
                          >
                            <span className="pe-2">Edit</span>
                            <img
                              src={images.icons.icEdit}
                              alt="edit"
                              className={styles.icEdit}
                            />
                          </Button>
                        )
                      }
                    </PermissionCheck>
                    <PermissionCheck
                      options={{
                        feature: Features.QUALITY_ASSURANCE,
                        subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
                        action: ActionTypeEnum.DELETE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission &&
                        !isStatusSubmitted && (
                          <Button
                            className={cx('me-1', styles.Orange)}
                            buttonType={ButtonType.Orange}
                            onClick={handleDelete}
                          >
                            <span className="pe-2">Delete</span>
                            <img
                              src={images.icons.icRemove}
                              alt="edit"
                              className={styles.icRemove}
                            />
                          </Button>
                        )
                      }
                    </PermissionCheck>
                  </>
                )}
              </>
            )}
          </div>
          <div className={styles.statusAndRefContainer}>
            <div className={styles.refDetail}>
              {t('table.refId')}:{' '}
              <span>{pilotTerminalFeedbackDetail?.refId}</span>
            </div>
            <div className={cx(styles.refDetail, styles.marginLeft10px)}>
              <PopoverStatus
                header="Workflow progress"
                key="Popover Status In Pilot Feedback Terminal"
                status={pilotTerminalFeedbackDetail?.status || ''}
                stepStatusItems={stepItemMemo}
                lineStepStyle={styles.lineWidth}
              />
            </div>
          </div>
        </div>
      </HeaderPage>

      <div className={cx(styles.wrapperDetail, 'pt-2')}>
        <PilotTerminalFeedback
          screen={status}
          data={pilotTerminalFeedbackDetail}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ListPilotTerminalFeedbackDetail;
