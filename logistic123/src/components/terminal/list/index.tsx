import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { useMemo, useState } from 'react';

import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Terminal } from 'models/api/terminal/terminal.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTerminalActions,
  deleteTerminalActions,
  getListTerminalActions,
  updateTerminalActions,
} from 'store/terminal/terminal.action';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListPortActions } from 'store/port/port.action';
import styles from '../../list-common.module.scss';
import ModalMaster from '../common/ModalMaster';

const SecondCategoryListContainer = () => {
  const { t } = useTranslation([
    I18nNamespace.SECOND_CATEGORY,
    I18nNamespace.COMMON,
  ]);

  const dispatch = useDispatch();

  const { loading, listTerminal, params } = useSelector(
    (state) => state.terminal,
  );
  const { listPort } = useSelector((state) => state.port);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<Terminal>(undefined);

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListTerminalActions.request({ ...newParams, page: 1, pageSize: -1 }),
    );
  };

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createTerminalActions.request({
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
      const matchRecord = listPort?.data?.find(
        (each) => each.name === other?.portMasterId,
      );
      other.portMasterId = matchRecord.id;

      dispatch(
        updateTerminalActions.request({
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

  const handleDeleteSecondCategory = (id: string) => {
    dispatch(
      deleteTerminalActions.request({
        id,
        getListTerminal: () => {
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
      onPressButtonRight: () => handleDeleteSecondCategory(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listTerminal?.data) {
      return [];
    }

    return listTerminal?.data?.map((data) => ({
      id: data.id,
      code: data?.code || '',
      name: data?.name || '',
      portMasterId: data?.portMaster?.name || '',
      description: data?.description || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUserUsername: data?.createdUser?.username || '',
      updatedAt: data?.updatedUser?.username
        ? formatDateTime(data?.updatedAt)
        : '',
      updatedUserUsername: data?.updatedUser?.username || '',
      status: data?.status || '',
      companyName: data?.company?.name || '',
    }));
  }, [listTerminal?.data]);

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
              subFeature: SubFeatures.TERMINAL,
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
              subFeature: SubFeatures.TERMINAL,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.TERMINAL,
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
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'code',
        headerName: 'Terminal Code',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: 'Terminal Name',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'portMasterId',
        headerName: 'Port',
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

  useEffectOnce(() => {
    dispatch(getListPortActions.request({}));
  });

  return (
    <div className={styles.wrapper}>
      <HeaderPage breadCrumb={BREAD_CRUMB.TERMINAL} titlePage="Terminal">
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.TERMINAL,
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
        moduleTemplate={MODULE_TEMPLATE.terminal}
        fileName="Terminal"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
      />
      <ModalMaster
        title="Terminal information"
        isOpen={visibleModal}
        isView={isView}
        loading={loading}
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

export default SecondCategoryListContainer;
