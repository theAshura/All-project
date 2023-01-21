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
import { PSCDeficiency } from 'models/api/psc-deficiency/psc-deficiency.model';

import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPSCDeficiencyActions,
  deletePSCDeficiencyActions,
  getListPSCDeficiencyActions,
  updatePSCDeficiencyActions,
} from 'store/psc-deficiency/psc-deficiency.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ModalPscDeficiency from '../common/ModalPscDeficiency';
import styles from './list.module.scss';

const PSCDeficiencyContainer = () => {
  const { t } = useTranslation([
    I18nNamespace.PSC_DEFICIENCY,
    I18nNamespace.COMMON,
  ]);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const dispatch = useDispatch();

  const { loading, listPSCDeficiency, params } = useSelector(
    (state) => state.pscDeficiency,
  );

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<PSCDeficiency>(undefined);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);
      dispatch(
        getListPSCDeficiencyActions.request({
          ...newParams,
          pageSize: -1,
          isLeftMenu: false,
        }),
      );
    },
    [dispatch],
  );

  const handleDeletePSCDeficiency = (id: string) => {
    dispatch(
      deletePSCDeficiencyActions.request({
        id,
        getListPSCDeficiency: () => {
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
      onPressButtonRight: () => handleDeletePSCDeficiency(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listPSCDeficiency?.data) {
      return [];
    }
    return listPSCDeficiency?.data?.map((data) => ({
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
  }, [listPSCDeficiency?.data]);

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
          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setVisibleModal(true);
                setIsView(true);
                setIsCreate(false);
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.PSC_DEFICIENCY,
              buttonType: ButtonType.Blue,
              action: ActionTypeEnum.VIEW,
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setIsView(false);
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.PSC_DEFICIENCY,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'ms-1',
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.PSC_DEFICIENCY,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];
          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={data ? actions : []} />
            </div>
          );
        },
      },
      {
        field: 'code',
        headerName: t('txPSCCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: t('txPSCName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'description',
        headerName: t('txDescription'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: t('txCreatedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUser',
        headerName: t('txCreatedBy'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: t('txUpdatedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUser',
        headerName: t('txUpdatedBy'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('buttons.txStatus'),
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

  const onSubmitForm = useCallback(
    (formData) => {
      if (isCreate) {
        const { isNew, resetForm, ...other } = formData;
        dispatch(
          createPSCDeficiencyActions.request({
            ...other,
            afterCreate: () => {
              resetForm();

              if (!isNew) {
                setVisibleModal((e) => !e);
                setIsCreate(false);
              }
            },
          }),
        );
      } else {
        const { isNew, resetForm, ...other } = formData;
        dispatch(
          updatePSCDeficiencyActions.request({
            id: selectedData?.id,
            body: other,
            afterUpdate: () => {
              if (isNew) {
                resetForm();
                setIsCreate(true);
                handleGetList();
                return;
              }
              setVisibleModal((e) => !e);
              setIsCreate(false);
              handleGetList();
            },
          }),
        );
      }
    },
    [dispatch, handleGetList, isCreate, selectedData?.id],
  );

  return (
    <div className={styles.charterOwner}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.PSC_DEFICIENCY}
        titlePage={t('txPSC')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.PSC_DEFICIENCY,
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
        moduleTemplate={MODULE_TEMPLATE.pscDeficiency}
        fileName="PSC Deficiency"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
      />

      <ModalPscDeficiency
        title={t('txPSCInformation')}
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal((e) => !e);
          setSelectedData(undefined);
          setIsView(false);
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

export default PSCDeficiencyContainer;
