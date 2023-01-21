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
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action, CommonApiParam } from 'models/common.model';
import { useMemo, useState } from 'react';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { useTranslation } from 'react-i18next';
import WrapComponentRole from 'components/wrap-component-role/WrapComponentRole';

import { useDispatch, useSelector } from 'react-redux';
import ModalMaster from './modals/ModalMaster';
import styles from '../../components/list-common.module.scss';
import { CargoType } from './utils/model';
import {
  createCargoTypeActions,
  deleteCargoTypeActions,
  getListCargoTypeActions,
  updateCargoTypeActions,
} from './store/action';

const CargoTypeContainerComponent = () => {
  const { t } = useTranslation([
    I18nNamespace.CARGO_TYPE,
    I18nNamespace.COMMON,
  ]);

  const dispatch = useDispatch();
  const { loading, listCargoTypes, params } = useSelector(
    (state) => state.cargoType,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<CargoType>(undefined);

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListCargoTypeActions.request({
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
        createCargoTypeActions.request({
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
        updateCargoTypeActions.request({
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
      deleteCargoTypeActions.request({
        id,
        getListCargoType: () => {
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
    if (!listCargoTypes?.data) {
      return [];
    }
    return listCargoTypes?.data?.map((data) => ({
      id: data?.id,
      code: data.code,
      name: data.name,
      description: data?.description,
      createdAt: formatDateTime(data?.createdAt),
      createdUser: data.createdUser?.username,
      updatedAt: data.updatedUser?.username && formatDateTime(data?.updatedAt),
      updatedUser: data.updatedUser?.username,
      status: data.status,
      company: data?.company?.name,
      companyId: data?.company?.id,
    }));
  }, [listCargoTypes?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const dataSelected = listCargoTypes?.data?.find(
            (i) => data?.id === i.id,
          );

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
              subFeature: SubFeatures.CARGO_TYPE,
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
              subFeature: SubFeatures.CARGO_TYPE,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(dataSelected?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CARGO_TYPE,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];
          if (!dataSelected) {
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
    [t, isMultiColumnFilter, listCargoTypes?.data, handleDelete],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.CARGO_TYPE}
        titlePage={t('cargoManagementTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CARGO_TYPE,
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
        moduleTemplate={MODULE_TEMPLATE.cargoType}
        fileName="Cargo Type"
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
        isCreate={isCreate}
        isView={isView}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
      />
    </div>
  );
};

const CargoTypeContainer = () => (
  <WrapComponentRole componentContainer={<CargoTypeContainerComponent />} />
);

export default CargoTypeContainer;
