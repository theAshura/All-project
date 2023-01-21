import images from 'assets/images/images';
import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import commonStyles from 'components/list-common.module.scss';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import {
  DATA_SPACE,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  Features,
  ActionTypeEnum,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { formatDateLocalNoTime } from 'helpers/date.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import styles from './list.module.scss';
import { getListVesselScreeningActions } from './store/action';
import { VesselScreeningDetail } from './utils/models/common.model';

const PageListVesselScreening = () => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const dispatch = useDispatch();
  const { loading, listVesselScreening } = useSelector(
    (state) => state.vesselScreening,
  );

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const viewDetail = useCallback((id?: string, isNewTab?: boolean) => {
    if (isNewTab) {
      const win = window.open(
        `${AppRouteConst.getVesselScreeningById(id, 'detail')}?tab=summary`,
        '_blank',
      );
      win.focus();
    } else {
      history.push(
        `${AppRouteConst.getVesselScreeningById(id, 'detail')}?tab=summary`,
      );
    }
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(
      `${AppRouteConst.getVesselScreeningById(id, 'edit')}?tab=summary`,
    );
  }, []);

  const getList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListVesselScreeningActions.request({ ...newParams, pageSize: -1 }),
      );
    },
    [dispatch],
  );

  const checkWorkflow = useCallback(
    (item: VesselScreeningDetail): Action[] => {
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        {
          img: images.icons.table.icNewTab,
          function: () => viewDetail(item?.id, true),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.VESSEL_SCREENING,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Green,
        },
      ];
      return actions;
    },
    [editDetail, viewDetail],
  );

  const dataTable = useMemo(() => {
    if (!listVesselScreening?.data) {
      return [];
    }
    return listVesselScreening?.data?.map((item) => ({
      id: item?.id,
      requestNO: item?.requestNo || DATA_SPACE,
      requester: item?.nameRequest || DATA_SPACE,
      company: item?.company?.name || DATA_SPACE,
      requestDate: item?.dateRequest
        ? formatDateLocalNoTime(item?.dateRequest)
        : DATA_SPACE,
      vessel: item?.vessel?.name || DATA_SPACE,
      imoNumber: item?.vessel?.imoNumber || DATA_SPACE,
      status: item?.status || DATA_SPACE,
      cargoType: item?.cargoType?.name || DATA_SPACE,
      cargoId: item?.cargo?.code || DATA_SPACE,
      createdDate: item?.createdAt
        ? formatDateLocalNoTime(item?.createdAt)
        : DATA_SPACE,
      riskRating: item?.riskRating !== null ? item?.riskRating : DATA_SPACE,
    }));
  }, [listVesselScreening?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('table.action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          let actions = checkWorkflow(data);
          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                commonStyles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'requestNO',
        headerName: t('table.requestNO'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'requestDate',
        headerName: t('table.requestDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'requester',
        headerName: t('table.requester'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'company',
        headerName: t('table.company'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'riskRating',
        headerName: t('table.riskRating'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vessel',
        headerName: t('table.vessel'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'imoNumber',
        headerName: t('table.imoNumber'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('table.status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'cargoType',
        headerName: t('table.cargoType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdDate',
        headerName: t('table.createdDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow],
  );

  return (
    <div className={commonStyles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.VESSEL_SCREENING}
        titlePage={t('vesselScreening')}
      >
        <PermissionCheck
          options={{
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.VESSEL_SCREENING,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  history.push(AppRouteConst.VESSEL_SCREENING_CREATE);
                }}
                buttonSize={ButtonSize.Medium}
                className="button_create"
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={commonStyles.icButton}
                  />
                }
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
        moduleTemplate={MODULE_TEMPLATE.vesselScreening}
        fileName="Vessel Screening_Vessel Screening List"
        dataTable={dataTable}
        height="calc(100vh - 198px)"
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

export default PageListVesselScreening;
