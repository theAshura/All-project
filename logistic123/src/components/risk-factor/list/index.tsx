import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { RiskFactor } from 'models/api/risk-factor/risk-factor.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createRiskFactorActions,
  deleteRiskFactorActions,
  getListRiskFactorActions,
  updateRiskFactorActions,
} from 'store/risk-factor/risk-factor.action';
import styles from '../../list-common.module.scss';
import ModalMaster from '../common/ModalMaster';

const RiskFactorListContainer = () => {
  const { t } = useTranslation([
    I18nNamespace.RISK_FACTOR,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { loading, listRiskFactor, params } = useSelector(
    (state) => state.riskFactor,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<RiskFactor>(undefined);
  const [isView, setIsView] = useState<boolean>(false);

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListRiskFactorActions.request({ ...newParams, page: 1, pageSize: -1 }),
    );
  };

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createRiskFactorActions.request({
          ...other,
          afterCreate: () => {
            handleGetList({
              isRefreshLoading: false,
            });
            if (isNew) {
              resetForm();
              return;
            }
            setVisibleModal(false);
            setIsCreate(false);
          },
        }),
      );
    } else {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        updateRiskFactorActions.request({
          id: selectedData?.id,
          data: other,
          afterUpdate: () => {
            handleGetList({
              isRefreshLoading: false,
            });
            if (isNew) {
              resetForm();
              setIsCreate(true);
              return;
            }
            setVisibleModal((e) => !e);
            setIsCreate(false);
          },
        }),
      );
    }
  };

  const handleDeleteRiskFactor = (id: string) => {
    dispatch(
      deleteRiskFactorActions.request({
        id,
        getListRiskFactor: () => {
          handleGetList({
            isRefreshLoading: false,
          });
        },
      }),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: () => handleDeleteRiskFactor(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listRiskFactor?.data) {
      return [];
    }
    return listRiskFactor?.data?.map((data) => ({
      id: data.id,
      code: data?.code,
      name: data?.name,
      description: data?.description,
      createdDate: formatDateTime(data?.createdAt),
      createdUser: data?.createdUser.username,
      updatedDate: data?.updatedUser?.username
        ? formatDateTime(data?.updatedAt)
        : '',
      updatedUser: data?.updatedUser?.username,
      status: data?.status,
      company: data?.company.name,
    }));
  }, [listRiskFactor?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('buttons.txAction'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(data);
                setIsView(true);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.RISK_FACTOR,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.RISK_FACTOR,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.RISK_FACTOR,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];

          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={data ? actions : []} />
            </div>
          );
        },
      },
      {
        field: 'code',
        headerName: t('code'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: t('name'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdDate',
        headerName: t('createdDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdUser',
        headerName: t('createdUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedDate',
        headerName: t('updatedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedUser',
        headerName: t('updatedUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'company',
        headerName: t('fieldTable.company'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [t, isMultiColumnFilter, handleDelete],
  );
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.RISK_FACTOR}
        titlePage={t('headPageTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.RISK_FACTOR,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  setIsCreate(true);
                  setVisibleModal(true);
                }}
                buttonSize={ButtonSize.Medium}
                className="button_create"
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
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
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.riskFactor}
        fileName="Risk Factor"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
      />
      <ModalMaster
        title={t('generalInformation')}
        isOpen={visibleModal}
        loading={loading}
        isView={isView}
        toggle={() => {
          setVisibleModal((e) => !e);
          setSelectedData(undefined);
          setIsCreate(undefined);
          setIsView(false);
        }}
        isCreate={isCreate}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
      />
    </div>
  );
};

export default RiskFactorListContainer;
