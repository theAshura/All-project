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
import WrapComponentRole from 'components/wrap-component-role/WrapComponentRole';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action, CommonApiParam } from 'models/common.model';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import ModalMaster from './modals/ModalMaster';
import styles from '../../components/list-common.module.scss';
import { PlanDrawing } from './utils/model';
import {
  createPlanDrawingActions,
  deletePlanDrawingActions,
  getListPlanDrawingActions,
  updatePlanDrawingActions,
} from './store/action';

const PlanDrawingContainerComponent = () => {
  const { t } = useTranslation([
    I18nNamespace.PLAN_DRAWING,
    I18nNamespace.COMMON,
  ]);

  const dispatch = useDispatch();
  const { loading, listPlanDrawings, params } = useSelector(
    (state) => state.planDrawing,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<PlanDrawing>(undefined);

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListPlanDrawingActions.request({
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
        createPlanDrawingActions.request({
          ...other,
          handelSuccess: () => {
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
        updatePlanDrawingActions.request({
          id: selectedData?.id,
          data: other,
          handelSuccess: () => {
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

  const handleDeleteFn = (id: string) => {
    dispatch(
      deletePlanDrawingActions.request({
        id,
        handelSuccess: () => {
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
      onPressButtonRight: () => handleDeleteFn(id),
    });
  };
  const dataTable = useMemo(() => {
    if (!listPlanDrawings?.data) {
      return [];
    }
    return listPlanDrawings?.data?.map((data) => ({
      id: data.id,
      code: data.code || '',
      name: data.name || '',
      vesselTypes: data?.vesselTypes || '',
      description: data?.description || '',
      vesselType:
        data?.vesselTypes?.map((item) => item?.name)?.join(', ') || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUser: data.createdUser?.username || '',
      updatedAt:
        (data.updatedUser?.username && formatDateTime(data?.updatedAt)) || '',
      updatedUser: data.updatedUser?.username || '',
      status: data.status || '',
      company: data?.company?.name || '',
      companyId: data?.company?.id || '',
    }));
  }, [listPlanDrawings?.data]);

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
                setIsCreate(false);
                setSelectedData(data);
                setIsView(true);
              },
              feature: Features.CONFIGURATION,
              // subFeature: SubFeatures.PLAN_DRAWING,
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
              subFeature: SubFeatures.PLAN_DRAWING,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.PLAN_DRAWING,
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
        headerName: t('planDrawingCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: t('planDrawingName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselType',
        headerName: t('vesselType'),
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
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.PLAN_DRAWING}
        titlePage={t('planDrawingManagementTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.PLAN_DRAWING,
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
        moduleTemplate={MODULE_TEMPLATE.planDrawingMaster}
        fileName="Plans and Drawings"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
      />
      <ModalMaster
        title={t('planDrawingInformation')}
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
const PlanDrawingContainer = () => (
  <WrapComponentRole componentContainer={<PlanDrawingContainerComponent />} />
);

export default PlanDrawingContainer;
