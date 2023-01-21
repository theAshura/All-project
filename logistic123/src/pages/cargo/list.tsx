import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';

import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { Action, CommonApiParam } from 'models/common.model';
import { useMemo, useState } from 'react';
import WrapComponentRole from 'components/wrap-component-role/WrapComponentRole';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ModalMaster from './modals/ModalMaster';
import styles from '../../components/list-common.module.scss';
import { Cargo } from './utils/model';
import {
  createCargoActions,
  deleteCargoActions,
  getListCargoActions,
  updateCargoActions,
} from './store/action';

const CargoContainerComponent = () => {
  const { t } = useTranslation([I18nNamespace.CARGO, I18nNamespace.COMMON]);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const dispatch = useDispatch();
  const { loading, listCargos, params } = useSelector((state) => state.cargo);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<Cargo>(undefined);
  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListCargoActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createCargoActions.request({
          ...other,
          afterCreate: () => {
            resetForm();

            if (!isNew) {
              setVisibleModal((e) => !e);
              setIsCreate(false);
            }

            handleGetList();
          },
        }),
      );
    } else {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        updateCargoActions.request({
          id: selectedData?.id,
          data: other,
          afterUpdate: () => {
            handleGetList();
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

  const handleDeleteCharterOwner = (id: string) => {
    dispatch(
      deleteCargoActions.request({
        id,
        getListCargo: () => {
          handleGetList();
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
      onPressButtonRight: () => handleDeleteCharterOwner(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listCargos?.data) {
      return [];
    }
    return listCargos?.data?.map((data) => ({
      id: data.id,
      code: data.code || '',
      name: data.name || '',
      description: data?.description || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUser: data.createdUser?.username || '',
      updatedAt:
        (data.updatedUser?.username && formatDateTime(data?.updatedAt)) || '',
      updatedUser: data.updatedUser?.username || '',
      status: data.status || '',
      company: data?.company?.name || '',
      companyId: data?.company?.id || '',
    }));
  }, [listCargos?.data]);

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
          const dataSelected = listCargos?.data?.find((i) => data?.id === i.id);

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(dataSelected);
                setIsView(true);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CARGO,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(dataSelected);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CARGO,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(dataSelected?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CARGO,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];
          if (!data) {
            actions = [];
          }
          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'code',
        headerName: t('cargoID'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: t('cargoName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: t('description'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: t('createdDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUser',
        headerName: t('createdUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: t('updatedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
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
    [t, isMultiColumnFilter, listCargos?.data, handleDelete],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.CARGO}
        titlePage={t('cargoManagementTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CARGO,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  setVisibleModal(true);
                  setIsCreate(true);
                  setSelectedData(undefined);
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
                {t('createNew')}
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
        moduleTemplate={MODULE_TEMPLATE.cargo}
        fileName="Cargo"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
      />
      <ModalMaster
        title={t('cargoInformation')}
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal((e) => !e);
          setSelectedData(undefined);
          setIsCreate(undefined);
          setIsView(false);
        }}
        isView={isView}
        isCreate={isCreate}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
      />
    </div>
  );
};
const CargoContainer = () => (
  <WrapComponentRole componentContainer={<CargoContainerComponent />} />
);

export default CargoContainer;
