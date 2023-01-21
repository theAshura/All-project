import images from 'assets/images/images';
import cx from 'classnames';
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
import useEffectOnce from 'hoc/useEffectOnce';
import PermissionCheck from 'hoc/withPermissionCheck';
import { AuthorityMaster } from 'models/api/authority-master/authority-master.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import {
  clearAuthorityMasterErrorsReducer,
  createAuthorityMasterActions,
  deleteAuthorityMasterActions,
  getListAuthorityMasterActions,
  updateAuthorityMasterActions,
} from 'store/authority-master/authority-master.action';
import { getListEventTypeActions } from 'store/event-type/event-type.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import ModalAuthorityMaster from '../common/ModalAuthorityMaster';
import styles from './list.module.scss';

export default function AuthorityMasterListContainer() {
  const dispatch = useDispatch();
  const { loading, listAuthorityMasters, params } = useSelector(
    (state) => state.authorityMaster,
  );
  const { t } = useTranslation([
    I18nNamespace.AUTHORITY_MASTER,
    I18nNamespace.COMMON,
  ]);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<AuthorityMaster>(undefined);

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListAuthorityMasterActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  useEffectOnce(() => {
    dispatch(
      getListEventTypeActions.request({ pageSize: -1, status: 'active' }),
    );
    dispatch(
      getListAuditTypeActions.request({ pageSize: -1, status: 'active' }),
    );
  });

  const handleDeleteAuthorityMaster = (id: string) => {
    dispatch(
      deleteAuthorityMasterActions.request({
        id,
        getListAuthorityMaster: () => {
          handleGetList();
        },
      }),
    );
  };
  const onSubmitForm = (formData: AuthorityMaster) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createAuthorityMasterActions.request({
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
        updateAuthorityMasterActions.request({
          id: selectedData?.id,
          data: other,
          afterCreate: () => {
            if (isNew) {
              resetForm();
              setIsCreate(true);
              handleGetList();
              setSelectedData(undefined);
              return;
            }
            setVisibleModal((e) => !e);
            setIsCreate(false);
            handleGetList();
          },
        }),
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: 'Confirmation?',
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: () => handleDeleteAuthorityMaster(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listAuthorityMasters?.data) {
      return [];
    }
    return listAuthorityMasters?.data?.map((data) => ({
      id: data?.id,
      code: data?.code || '',
      name: data?.name || '',
      eventTypes: data?.eventTypes?.map((i) => i.name)?.join(', ') || '',
      inspectionTypes:
        data?.inspectionTypes?.map((i) => i.name)?.join(', ') || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUser: data?.createdUser?.username || '',
      updatedAt: data?.updatedUser?.username
        ? formatDateTime(data?.updatedAt)
        : '',
      updatedUser: data?.updatedUser?.username || '',
      status: data?.status || '',
      company: data?.company?.name || '',
      companyId: data?.company?.id || '',
    }));
  }, [listAuthorityMasters?.data]);

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
          const dataSelected = listAuthorityMasters?.data?.find(
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
              subFeature: SubFeatures.AUTHORITY_MASTER,
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
              subFeature: SubFeatures.AUTHORITY_MASTER,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.AUTHORITY_MASTER,
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
        headerName: t('txAuthorityMasterCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: t('txAuthorityMasterName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'eventTypes',
        headerName: t('eventType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionTypes',
        headerName: t('inspectionType'),
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
        headerName: t('txCreatedUser'),
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
        headerName: t('txUpdatedUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('txStatus'),
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
    [t, isMultiColumnFilter, listAuthorityMasters?.data, handleDelete],
  );

  useEffect(() => {
    if (!visibleModal) {
      dispatch(clearAuthorityMasterErrorsReducer());
    }
  }, [dispatch, visibleModal]);

  // render
  return (
    <>
      <ModalAuthorityMaster
        title="Authority information"
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

      <div className="">
        <HeaderPage
          breadCrumb={BREAD_CRUMB.AUTHORITY_MASTER}
          titlePage="Authority Master"
        >
          <PermissionCheck
            options={{
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.AUTHORITY_MASTER,
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
                  className={cx(styles.button)}
                  renderSuffix={
                    <img
                      src={images.icons.icAddCircle}
                      alt="createNew"
                      className={styles.icButton}
                    />
                  }
                >
                  <span className={styles.createText}>Create New</span>
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
          moduleTemplate={MODULE_TEMPLATE.attachmentKit}
          fileName="Authority Master"
          dataTable={dataTable}
          height="calc(100vh - 137px)"
          getList={handleGetList}
          classNameHeader={styles.header}
        />
      </div>
    </>
  );
}
