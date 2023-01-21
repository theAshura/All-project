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
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';

import WrapComponentRole from 'components/wrap-component-role/WrapComponentRole';
import PermissionCheck from 'hoc/withPermissionCheck';
import { OwnerBusiness } from 'models/api/owner-business/owner-business.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../components/list-common.module.scss';
import ModalOwnerBusiness from './modals/ModalMaster';
import {
  createOwnerBusiness,
  deleteOwnerBusiness,
  getListOwnerBusiness,
  updateOwnerBusiness,
} from './store/action';

const DEFAULT_CODE = [
  '10',
  '15',
  '16',
  '17',
  '18',
  '30',
  '40',
  '15',
  '45',
  '55',
  '70',
  '85',
  '99',
];

const OwnerBusinessContainerComponent = () => {
  const { t } = useTranslation([
    I18nNamespace.OWNER_BUSINESS,
    I18nNamespace.COMMON,
  ]);

  const dispatch = useDispatch();

  const { loading, listOwnerBusiness, params } = useSelector(
    (state) => state.ownerBusiness,
  );

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<OwnerBusiness>(undefined);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);

      dispatch(getListOwnerBusiness.request({ ...newParams, pageSize: -1 }));
    },
    [dispatch],
  );

  const handleDeleteOwnerBusiness = (id: string) => {
    dispatch(
      deleteOwnerBusiness.request({
        id,
        getListOwnerBusiness: () => {
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
      onPressButtonRight: () => handleDeleteOwnerBusiness(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listOwnerBusiness?.data) {
      return [];
    }
    return listOwnerBusiness?.data?.map((data) => ({
      id: data.id,
      code: data?.code,
      name: data?.name,
      description: data?.description,
      createdAt: formatDateTime(data?.createdAt),
      'createdUser.username': data?.createdUser?.username,
      updatedAt: data?.updatedUser?.username
        ? formatDateTime(data?.updatedAt)
        : '',
      'updatedUser.username': data?.updatedUser?.username,
      status: data?.status,
      'company.name': data?.company?.name,
    }));
  }, [listOwnerBusiness?.data]);

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
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setVisibleModal(true);
                setIsView(true);
                setIsCreate(false);
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.VESSEL_OWNER_BUSINESS,
              buttonType: ButtonType.Blue,
              action: ActionTypeEnum.VIEW,
            },
          ];
          if (!DEFAULT_CODE.includes(data?.code)) {
            actions = [
              ...actions,
              {
                img: images.icons.icEdit,
                function: () => {
                  setVisibleModal(true);
                  setIsView(false);
                  setIsCreate(false);
                  setSelectedData(data);
                },
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.VESSEL_OWNER_BUSINESS,
                action: ActionTypeEnum.UPDATE,
                cssClass: 'ms-1',
              },
              {
                img: images.icons.icRemove,
                function: () => handleDelete(data?.id),
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.VESSEL_OWNER_BUSINESS,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
              },
            ];
          }

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
        field: 'createdUserUsername',
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
        field: 'updatedUserUsername',
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
        field: 'companyName',
        headerName: t('fieldTable.company'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [t, isMultiColumnFilter, handleDelete],
  );

  const onSubmitForm = useCallback(
    (formData) => {
      if (isCreate) {
        const { isNew, resetForm, ...other } = formData;
        dispatch(
          createOwnerBusiness.request({
            ...other,
            afterCreate: () => {
              if (isNew) {
                resetForm();

                return;
              }
              setVisibleModal((e) => !e);
              setIsCreate(false);
              resetForm();
            },
          }),
        );
      } else {
        const { isNew, resetForm, ...other } = formData;
        dispatch(
          updateOwnerBusiness.request({
            id: selectedData?.id,
            data: other,
            afterUpdate: () => {
              if (isNew) {
                resetForm();
                // setIsEdit(true);
                setIsCreate(true);
                handleGetList({
                  isRefreshLoading: false,
                });
                return;
              }
              setVisibleModal((e) => !e);
              // setIsEdit(false);
              setIsCreate(false);
              handleGetList({
                isRefreshLoading: false,
              });
            },
          }),
        );
      }
    },
    [dispatch, handleGetList, isCreate, selectedData?.id],
  );

  return (
    <div className={styles.pscAction}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.OWNER_BUSINESS}
        titlePage={t('headPageTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.VESSEL_OWNER_BUSINESS,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  setVisibleModal(true);
                  setIsCreate(true);
                  setIsView(false);
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
        moduleTemplate={MODULE_TEMPLATE.vesselOwnerBusiness}
        fileName="Vessel Owner Business"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
      />
      <ModalOwnerBusiness
        title={t('generalInformation')}
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal((e) => !e);
          setSelectedData(undefined);
          setIsCreate(undefined);
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

const OwnerBusinessContainer = () => (
  <WrapComponentRole componentContainer={<OwnerBusinessContainerComponent />} />
);
export default OwnerBusinessContainer;
