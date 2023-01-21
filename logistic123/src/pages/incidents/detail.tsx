import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import commonStyles from 'components/list-common.module.scss';

import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { useLocation, useParams } from 'react-router';
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
import images from 'assets/images/images';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { getCurrentModulePageByStatus } from 'helpers/dynamic.helper';
import WatchListManagement from 'components/watch-list-icon/WatchListIcon';
import PopoverStatus from 'components/audit-checklist/common/popover-status/PopoverStatus';
import { StepStatus } from 'components/common/step-line/lineStepCP';
import { WatchlistModuleEnum } from 'pages/watch-list/watch-list.const';
import { IncidentsStatuses } from 'constants/components/incidents.const';
import styles from './detail.module.scss';
import {
  clearIncidentErrorsReducer,
  deleteIncidentsActions,
  getIncidentDetailActions,
  updateIncidentsActions,
} from './store/action';
import FormIncidents from './form';

const DEFAULT_ITEMS = [
  {
    id: IncidentsStatuses.Draft,
    name: IncidentsStatuses.Draft,
    status: StepStatus.INACTIVE,
  },
  {
    id: IncidentsStatuses.Submitted,
    name: IncidentsStatuses.Submitted,
    status: StepStatus.INACTIVE,
  },
  {
    id: IncidentsStatuses.Reviewed,
    name: IncidentsStatuses.Reviewed,
    status: StepStatus.INACTIVE,
  },
];

const ListIncidentDetail = () => {
  const { t } = useTranslation([I18nNamespace.INCIDENTS, I18nNamespace.COMMON]);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { status } = useMemo(() => queryString.parse(search), [search]);

  const { incidentDetail } = useSelector((state) => state.incidents);

  const { userInfo } = useSelector((state) => state.authenticate);

  const handleSubmit = useCallback(
    (dataForm) => {
      dispatch(
        updateIncidentsActions.request({
          id,
          data: {
            ...dataForm,
            status: dataForm?.status || IncidentsStatuses.Draft,
          },
          handleSuccess: () => {
            history.push(`${AppRouteConst.INCIDENTS}`);
          },
        }),
      );
    },
    [dispatch, id],
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.QuantityAssuranceIncidentsIncidents,
    modulePage: getCurrentModulePageByStatus(status === 'edit'),
  });

  const onDelete = useCallback(() => {
    dispatch(
      deleteIncidentsActions.request({
        id,
        isDetail: true,
        handleSuccess: () => {
          history.push(AppRouteConst.INCIDENTS);
        },
      }),
    );
  }, [dispatch, id]);

  const handleDelete = useCallback(() => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: onDelete,
    });
  }, [onDelete, t]);

  useEffect(() => {
    if (id) {
      dispatch(getIncidentDetailActions.request(id));
    }
    return () => {
      dispatch(clearIncidentErrorsReducer());
    };
  }, [dispatch, id]);

  const renderActions = useMemo(() => {
    const isCurrentDocChartererVesselOwner = checkDocHolderChartererVesselOwner(
      {
        vesselDocHolders: incidentDetail?.vessel?.vesselDocHolders,
        vesselCharterers: incidentDetail?.vessel?.vesselCharterers,
        vesselOwners: incidentDetail?.vessel?.vesselOwners,
        createdAt: incidentDetail?.createdAt,
      },
      userInfo,
    );

    return (
      <div className="d-flex align-items-center">
        <WatchListManagement
          dynamicLabels={dynamicLabels}
          referenceId={id}
          referenceModuleName={WatchlistModuleEnum.INCIDENTS}
          referenceRefId={incidentDetail?.refId}
        />
        <Button
          className={cx('me-2', styles.buttonFilter)}
          buttonType={ButtonType.CancelOutline}
          onClick={(e) => {
            history.push(AppRouteConst.INCIDENTS);
          }}
        >
          <span className="pe-2">Back</span>
        </Button>
        {isCurrentDocChartererVesselOwner && (
          <PermissionCheck
            options={{
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.INCIDENTS,
              action: ActionTypeEnum.UPDATE,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
                <Button
                  className={cx('me-1', styles.buttonFilter)}
                  onClick={(e) => {
                    history.push(
                      `${AppRouteConst.getIncidentsById(id)}?status=edit`,
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
        )}
        {isCurrentDocChartererVesselOwner && (
          <PermissionCheck
            options={{
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.INCIDENTS,
              action: ActionTypeEnum.DELETE,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
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
        )}
      </div>
    );
  }, [
    dynamicLabels,
    handleDelete,
    id,
    incidentDetail?.createdAt,
    incidentDetail?.refId,
    incidentDetail?.vessel?.vesselCharterers,
    incidentDetail?.vessel?.vesselDocHolders,
    incidentDetail?.vessel?.vesselOwners,
    userInfo,
  ]);

  const findHistoryByStatus = useCallback(
    (status: string) => {
      const statusHistory =
        incidentDetail?.incidentInvestigationHistories || [];
      const historyFiltered = statusHistory.filter(
        (item) => item.status === status,
      );
      const dataPopulated = historyFiltered.map((item) => ({
        datetime: item?.updatedAt,
        description: item?.createdUser?.username,
        name: item?.createdUser?.jobTitle,
      }));
      return dataPopulated;
    },
    [incidentDetail?.incidentInvestigationHistories],
  );

  const stepStatusItems = useMemo(() => {
    switch (incidentDetail?.status) {
      case IncidentsStatuses.Draft: {
        const newItems = DEFAULT_ITEMS.map((i, index) => {
          if (index < 1) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          return i;
        });
        return newItems;
      }

      case IncidentsStatuses.Submitted: {
        const newItems = DEFAULT_ITEMS.map((i, index) => {
          if (index < 2) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          return i;
        });
        return newItems;
      }
      case IncidentsStatuses.Reviewed: {
        const newItems = DEFAULT_ITEMS.map((i, index) => {
          if (index < 3) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          return i;
        });
        return newItems;
      }

      default:
        return DEFAULT_ITEMS;
    }
  }, [findHistoryByStatus, incidentDetail?.status]);

  return (
    <div className={commonStyles.wrapper}>
      <HeaderPage
        breadCrumb={
          status === 'edit'
            ? BREAD_CRUMB.INCIDENTS_EDIT
            : BREAD_CRUMB.INCIDENTS_DETAIL
        }
        titlePage={t('incidents')}
      >
        <div className="d-flex flex-column justify-content-between">
          <div>{status !== 'edit' && renderActions}</div>
          <div className={cx('d-flex align-items-center', styles.wrapInfoHead)}>
            <PopoverStatus
              header="Workflow progress"
              stepStatusItems={stepStatusItems}
              status={incidentDetail?.status || IncidentsStatuses.Draft}
              className={styles.historySteps}
              dynamicLabels={dynamicLabels}
            />
            <div className={styles.refDetail}>
              {t('refID')}: <span>{incidentDetail?.refId}</span>
            </div>
          </div>
        </div>
      </HeaderPage>

      <div className={cx(styles.wrapperDetail, 'pt-2')}>
        <FormIncidents
          isEdit={status === 'edit'}
          data={incidentDetail}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ListIncidentDetail;
