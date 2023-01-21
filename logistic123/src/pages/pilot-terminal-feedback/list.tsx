import images from 'assets/images/images';
import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import commonStyles from 'components/list-common.module.scss';
import isNil from 'lodash/isNil';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  DATA_SPACE,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';
import moment from 'moment';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';

import { getRiskLevel } from 'pages/vessel-screening/utils/functions';

import { RISK_LEVEL } from 'pages/vessel-screening/utils/constant';
import styles from './list.module.scss';
import {
  deletePilotTerminalFeedbacksActions,
  getListPilotTerminalFeedbackActions,
} from './store/action';
import { QUESTION_CONVERT_FEEDBACK } from './form/contants';
import { PilotTerminalFeedbackStatus } from './form/pilotTerminalFeedback';

const ListPilotTerminalFeedback = () => {
  const { t } = useTranslation([
    I18nNamespace.PILOT_TERMINAL_FEEDBACK,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { loading, listPilotTerminalFeedback } = useSelector(
    (state) => state.pilotTerminalFeedback,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const getList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListPilotTerminalFeedbackActions.request({
          ...newParams,
          pageSize: -1,
          isLeftMenu: false,
        }),
      );
    },
    [dispatch],
  );

  const viewDetail = useCallback((id?: string, isNewTab?: boolean) => {
    if (isNewTab) {
      const win = window.open(
        `${AppRouteConst.getPilotTerminalFeedbackById(id, 'detail')}`,
        '_blank',
      );
      win.focus();
    } else {
      history.push(
        `${AppRouteConst.getPilotTerminalFeedbackById(id, 'detail')}`,
      );
    }
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getPilotTerminalFeedbackById(id, 'edit')}`);
  }, []);

  const deleteRecord = useCallback(
    (idRecord?: string) => {
      dispatch(
        deletePilotTerminalFeedbacksActions.request({
          id: idRecord,
          handleSuccess: () => {
            getList();
          },
        }),
      );
    },
    [dispatch, getList],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => deleteRecord(id),
      });
    },
    [deleteRecord, t],
  );

  const dataTable = useMemo(() => {
    if (!listPilotTerminalFeedback?.data) {
      return [];
    }

    return listPilotTerminalFeedback?.data?.map((item, index) => {
      let flag = true;

      item?.pilotTerminalFeedbackChecklists?.forEach((item) => {
        const score = QUESTION_CONVERT_FEEDBACK[item?.checkListValue];
        if (!isNil(score)) {
          flag = false;
        }
      });

      return {
        id: item.id || DATA_SPACE,
        refId: item?.refId || DATA_SPACE,
        vesselName: item?.vessel?.name || DATA_SPACE,
        imo: item?.vessel?.imoNumber || DATA_SPACE,
        riskScore: item?.score || 0,
        feedbackType: item?.feedbackType || DATA_SPACE,
        feedbackByUser: item?.createdUser?.username || DATA_SPACE,
        dateOfInteraction:
          moment(item?.dateOfInteraction).format('DD/MM/YYYY') || DATA_SPACE,
        terminal: item?.terminal?.name || DATA_SPACE,
        port: item?.port?.name || DATA_SPACE,
        country: item?.country || DATA_SPACE,
        pilotage: item?.pilotAgeArea || DATA_SPACE,
        createdDate: moment(item?.createdAt).format('DD/MM/YYYY') || DATA_SPACE,
        createdByUser: item?.createdUser?.username || DATA_SPACE,
        updatedDate: moment(item?.updatedAt).format('DD/MM/YYYY') || DATA_SPACE,
        updatedByUser: item?.updatedUser?.username || DATA_SPACE,
        isAllNullable: flag,
        status: item?.status || DATA_SPACE,
        index,
        vessel: item?.vessel,
        createdAt: item?.createdAt,
      };
    });
  }, [listPilotTerminalFeedback?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('table.action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        minWidth: 150,
        maxWidth: 150,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;

          const isDocPermission = checkDocHolderChartererVesselOwner(
            {
              createdAt: data?.createdAt,
              vesselCharterers: data?.vessel?.vesselCharterers || [],
              vesselDocHolders: data?.vessel?.vesselOwners || [],
              vesselOwners: data?.vessel?.vesselDocHolders || [],
            },
            userInfo,
          );

          const allowEdit =
            isDocPermission &&
            data?.status !== PilotTerminalFeedbackStatus.SUBMITTED;

          const allowDelete =
            isDocPermission &&
            data?.status !== PilotTerminalFeedbackStatus.SUBMITTED;

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            allowEdit && {
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'me-1',
            },
            allowDelete && {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'me-1',
            },
            {
              img: images.icons.table.icNewTab,
              function: () => viewDetail(data?.id, true),
              feature: Features.QUALITY_ASSURANCE,

              // subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Green,
              cssClass: 'me-1',
            },
          ]?.filter((item) => item);

          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'refId',
        headerName: t('table.refId'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselName',
        headerName: t('table.vesselName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'imo',
        headerName: t('table.imo'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'riskScore',
        headerName: t('table.riskScore'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: (params) => {
          const { data, node, value } = params;

          if (node?.field === 'riskScore') {
            return value ? (
              <div
                className={cx(styles.riskScore, {
                  [styles.negligible]:
                    getRiskLevel(Number(node?.key)) === RISK_LEVEL.NEGLIGIBLE,
                  [styles.low]:
                    getRiskLevel(Number(node?.key)) === RISK_LEVEL.LOW,
                  [styles.medium]:
                    getRiskLevel(Number(node?.key)) === RISK_LEVEL.MEDIUM,
                  [styles.high]:
                    !data?.isAllNullable &&
                    getRiskLevel(Number(node?.key)) === RISK_LEVEL.HIGH,
                })}
              >
                {Number(node?.key)}
              </div>
            ) : null;
          }

          return (
            <div
              className={cx(styles.riskScore, {
                [styles.negligible]:
                  getRiskLevel(data?.riskScore) === RISK_LEVEL.NEGLIGIBLE,
                [styles.low]: getRiskLevel(data?.riskScore) === RISK_LEVEL.LOW,
                [styles.medium]:
                  getRiskLevel(data?.riskScore) === RISK_LEVEL.MEDIUM,
                [styles.high]:
                  !data?.isAllNullable &&
                  getRiskLevel(data?.riskScore) === RISK_LEVEL.HIGH,
              })}
            >
              {data?.riskScore}
            </div>
          );
        },
      },
      {
        field: 'feedbackType',
        headerName: t('table.feedbackType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'feedbackByUser',
        headerName: t('table.feedbackByUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'dateOfInteraction',
        headerName: t('table.dateOfInteraction'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'terminal',
        headerName: t('table.terminal'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'port',
        headerName: t('table.port'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'country',
        headerName: t('table.country'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'pilotage',
        headerName: t('table.pilotage'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'createdDate',
        headerName: t('table.createdDate'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'updatedDate',
        headerName: t('table.updatedDate'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedByUser',
        headerName: t('table.updatedByUser'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('table.status'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [t, isMultiColumnFilter, userInfo, viewDetail, editDetail, handleDelete],
  );

  return (
    <div className={commonStyles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.PILOT_TERMINAL_FEEDBACK}
        titlePage={t('pilotTerminalFeedback')}
      >
        <PermissionCheck
          options={{
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  history.push(AppRouteConst.PILOT_TERMINAL_FEEDBACK_CREATE);
                }}
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className="ps-2"
                  />
                }
                className={styles.btnCreate}
              >
                {t('buttons.createNew')}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>
      <AGGridModule
        loading={loading}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.pilotTerminalFeedback}
        fileName="pilotTerminalFeedback"
        dataTable={dataTable}
        height="calc(100vh - 210px)"
        view={(params) => {
          viewDetail(params);
          return true;
        }}
        getList={getList}
        classNameHeader={styles.header}
      />
    </div>
  );
};

export default ListPilotTerminalFeedback;
