import { useEffect, useMemo, useState } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { useDispatch, useSelector } from 'react-redux';
import { AuditType } from 'models/api/audit-type/audit-type.model';
import {
  clearAuditTypeErrorsReducer,
  createAuditTypeActions,
  deleteAuditTypeActions,
  getListAuditTypeActions,
  updateAuditTypeActions,
} from 'store/audit-type/audit-type.action';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import upperFirst from 'lodash/upperFirst';
import { handleFilterParams } from 'helpers/filterParams.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { AUDIT_TYPE_FIELDS_LIST } from 'constants/dynamic/audit-type-management.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../../list-common.module.scss';
import ModalAuditType from '../common/ModalAuditType';

const AuditTypeContainer = () => {
  const dispatch = useDispatch();
  const { loading, listAuditTypes, params } = useSelector(
    (state) => state.auditType,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<AuditType>(undefined);
  const [isView, setIsView] = useState<boolean>(false);

  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonAudittype,
    modulePage: ModulePage.List,
  });

  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);

    dispatch(
      getListAuditTypeActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  const handleDeleteCharterOwner = (id: string) => {
    dispatch(
      deleteAuditTypeActions.request({
        id,
        getListAuditType: () => {
          handleGetList();
        },
      }),
    );
  };

  const onSubmitForm = (formData: AuditType) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createAuditTypeActions.request({
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
        updateAuditTypeActions.request({
          id: selectedData?.id,
          data: other,
          afterCreate: () => {
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
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicLabels,
        AUDIT_TYPE_FIELDS_LIST['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        AUDIT_TYPE_FIELDS_LIST[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Delete,
      ),

      onPressButtonRight: () => handleDeleteCharterOwner(id),
    });
  };

  const dataTable = useMemo(() => {
    if (!listAuditTypes?.data) {
      return [];
    }
    return listAuditTypes?.data?.map((data) => ({
      id: data.id,
      code: data.code || '',
      name: data.name || '',
      scope: data.scope || '',
      scopeValue: upperFirst(data.scope) || '',
      company: data?.company?.name || '',
      companyId: data?.company?.id || '',
    }));
  }, [listAuditTypes?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          AUDIT_TYPE_FIELDS_LIST.Action,
        ),
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
                setIsView(true);
                setSelectedData(data);
              },
              buttonType: ButtonType.Blue,
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.AUDIT_TYPE,
              action: ActionTypeEnum.VIEW,
              cssClass: 'me-1',
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
              subFeature: SubFeatures.AUDIT_TYPE,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.AUDIT_TYPE,
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
        headerName: renderDynamicLabel(
          dynamicLabels,
          AUDIT_TYPE_FIELDS_LIST['Inspection type code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          AUDIT_TYPE_FIELDS_LIST['Inspection type name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'scopeValue',
        headerName: renderDynamicLabel(
          dynamicLabels,
          AUDIT_TYPE_FIELDS_LIST.Scope,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicLabels,
          AUDIT_TYPE_FIELDS_LIST['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, handleDelete],
  );

  useEffect(() => {
    if (!visibleModal) {
      dispatch(clearAuditTypeErrorsReducer());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleModal]);

  return (
    <>
      <ModalAuditType
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal(false);
          setSelectedData(undefined);
          setIsCreate(false);
          setIsView(false);
        }}
        isCreate={isCreate}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
        isView={isView}
      />
      <div className={styles.wrapper}>
        <HeaderPage
          breadCrumb={BREAD_CRUMB.AUDIT_TYPE}
          titlePage={renderDynamicModuleLabel(
            listModuleDynamicLabels,
            DynamicLabelModuleName.ConfigurationCommonAudittype,
          )}
        >
          <PermissionCheck
            options={{
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.AUDIT_TYPE,
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
                  {renderDynamicLabel(
                    dynamicLabels,
                    AUDIT_TYPE_FIELDS_LIST['Create New'],
                  )}
                </Button>
              )
            }
          </PermissionCheck>
        </HeaderPage>

        <AGGridModule
          loading={loading}
          colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
          params={params}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          hasRangePicker={false}
          columnDefs={columnDefs}
          dataFilter={null}
          moduleTemplate={MODULE_TEMPLATE.auditType}
          fileName="Inspection Type"
          dataTable={dataTable}
          height="calc(100vh - 137px)"
          getList={handleGetList}
          classNameHeader={styles.header}
        />
      </div>
    </>
  );
};

export default AuditTypeContainer;
