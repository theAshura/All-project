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
import { PscAction } from 'models/api/psc-action/psc-action.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPscActions,
  deletePscActions,
  getListPscActions,
  updatePscActions,
} from 'store/psc-action/psc-action.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ModalPSCAction from '../common/ModalPSCAction';
import styles from './list.module.scss';

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

const PscActionContainer = () => {
  const { t } = useTranslation([
    I18nNamespace.PSC_ACTION,
    I18nNamespace.COMMON,
  ]);

  const dispatch = useDispatch();

  const { loading, listPscActions, params } = useSelector(
    (state) => state.pscAction,
  );

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<PscAction>(undefined);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);
      dispatch(
        getListPscActions.request({
          ...newParams,
          pageSize: -1,
          isLeftMenu: false,
        }),
      );
    },
    [dispatch],
  );

  const handleDeletePscAction = (id: string) => {
    dispatch(
      deletePscActions.request({
        id,
        getListPscAction: () => {
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
      onPressButtonRight: () => handleDeletePscAction(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listPscActions?.data) {
      return [];
    }
    return listPscActions?.data?.map((data) => ({
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
  }, [listPscActions?.data]);

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
              subFeature: SubFeatures.PSC_ACTION,
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
                subFeature: SubFeatures.PSC_ACTION,
                action: ActionTypeEnum.UPDATE,
                cssClass: 'ms-1',
              },
              {
                img: images.icons.icRemove,
                function: () => handleDelete(data?.id),
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.PSC_ACTION,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
              },
            ];
          }
          return (
            <div className="d-flex justify-content-start align-items-center">
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
    [t, isMultiColumnFilter, handleDelete],
  );

  const onSubmitForm = useCallback(
    (formData) => {
      if (isCreate) {
        const { isNew, resetForm, ...other } = formData;
        dispatch(
          createPscActions.request({
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
          updatePscActions.request({
            id: selectedData?.id,
            data: other,
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
    <div className={styles.pscAction}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.PSC_ACTION}
        titlePage={t('headPageTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.PSC_ACTION,
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
        moduleTemplate={MODULE_TEMPLATE.pscAction}
        fileName="PSC Action"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
      />

      <ModalPSCAction
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

export default PscActionContainer;
