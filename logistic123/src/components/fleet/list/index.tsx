import images from 'assets/images/images';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import HeaderPage from 'components/common/header-page/HeaderPage';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Fleet } from 'models/api/fleet/fleet.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createFleetActions,
  deleteFleetActions,
  getListFleetActions,
  updateFleetActions,
} from 'store/fleet/fleet.action';
import { handleFilterParams } from 'helpers/filterParams.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import styles from '../../list-common.module.scss';
import ModalMaster from '../common/ModalMaster';

const FleetContainer = () => {
  const { t } = useTranslation([I18nNamespace.FLEET, I18nNamespace.COMMON]);

  const dispatch = useDispatch();
  const { loading, listFleets, params } = useSelector((state) => state.fleet);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<Fleet>(undefined);

  const handleGetList = (params?: CommonApiParam) => {
    const param = handleFilterParams(params);

    dispatch(
      getListFleetActions.request({
        ...param,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createFleetActions.request({
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
        updateFleetActions.request({
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
      deleteFleetActions.request({
        id,
        getListFleet: () => {
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
    if (!listFleets?.data) {
      return [];
    }
    return listFleets?.data?.map((data) => ({
      id: data.id,
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
  }, [listFleets?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('fieldTable.action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const isCompany = userInfo?.mainCompanyId === data?.companyId;
          const actions: Action[] = isCompany
            ? [
                {
                  img: images.icons.icEdit,
                  function: () => {
                    setVisibleModal(true);
                    setIsCreate(false);
                    setSelectedData(data);
                  },
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.FLEET,
                  action: ActionTypeEnum.UPDATE,
                },
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(data?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.FLEET,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ]
            : [];
          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'code',
        headerName: t('fleetCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: t('fleetName'),
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
    [t, isMultiColumnFilter, userInfo?.mainCompanyId, handleDelete],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.FLEET}
        titlePage={t('fleetManagementTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.FLEET,
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
        hasRangePicker
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.eventType}
        fileName="eventType"
        dataTable={dataTable}
        height="calc(100vh - 188px)"
        getList={handleGetList}
        classNameHeader={styles.header}
      />
      <ModalMaster
        title={t('fleetInformation')}
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal((e) => !e);
          setSelectedData(undefined);
          setIsCreate(undefined);
        }}
        isCreate={isCreate}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
      />
    </div>
  );
};

export default FleetContainer;
