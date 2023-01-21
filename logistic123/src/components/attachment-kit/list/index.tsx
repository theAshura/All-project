import { useCallback, useState, useMemo } from 'react';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';

import images from 'assets/images/images';
import history from 'helpers/history.helper';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { CommonQuery } from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { handleFilterParams } from 'helpers/filterParams.helper';
import {
  deleteAttachmentKitActions,
  getListAttachmentKitSActions,
} from 'store/attachment-kit/attachment-kit.action';
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
import { ATTACHMENT_KIT_LIST_DYNAMIC_FIELDS } from 'constants/dynamic/attachmentKit.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../../list-common.module.scss';

const AttachmentKitContainer = () => {
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const dispatch = useDispatch();
  const { loading, listAttachmentKit, params } = useSelector(
    (state) => state.attachmentKit,
  );

  const { userInfo } = useSelector((state) => state.authenticate);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAttachmentKit,
    modulePage: ModulePage.List,
  });

  const viewDetail = useCallback((id?: string, isNewTab?: boolean) => {
    if (isNewTab) {
      const win = window.open(
        AppRouteConst.getAttachmentKiteById(id),
        '_blank',
      );
      win.focus();
    } else {
      history.push(`${AppRouteConst.getAttachmentKiteById(id)}`);
    }
  }, []);

  const editDetail = useCallback((id?: string) => {
    history.push(
      `${AppRouteConst.getAttachmentKiteById(id)}${CommonQuery.EDIT}`,
    );
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);

      dispatch(
        getListAttachmentKitSActions.request({
          ...newParams,
          pageSize: -1,
          isLeftMenu: false,
        }),
      );
    },
    [dispatch],
  );

  const handleDeleteAttachmentKit = useCallback(
    (id: string) => {
      dispatch(
        deleteAttachmentKitActions.request({
          id,
          handleSuccess: () => {
            handleGetList();
          },
        }),
      );
    },
    [dispatch, handleGetList],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_LIST_DYNAMIC_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_LIST_DYNAMIC_FIELDS[
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
        onPressButtonRight: () => handleDeleteAttachmentKit(id),
      });
    },
    [dynamicLabels, handleDeleteAttachmentKit],
  );

  const dataTable = useMemo(() => {
    if (!listAttachmentKit?.data) {
      return [];
    }
    return listAttachmentKit?.data?.map((data) => ({
      id: data.id,
      code: data?.code || '',
      name: data?.name || '',
      description: data?.description || '',
      status: data?.status || '',
      company: data?.company?.name || '',
      companyId: data?.company?.id || '',
      createdUserId: data?.createdUserId,
    }));
  }, [listAttachmentKit?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_LIST_DYNAMIC_FIELDS.Action,
        ),
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
              function: () => viewDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.ATTACHMENT_KIT,
              buttonType: ButtonType.Blue,
              action: ActionTypeEnum.VIEW,
              cssClass: 'me-1',
            },
          ];

          if (userInfo?.mainCompanyId === data?.companyId) {
            actions = [
              ...actions,
              {
                img: images.icons.icEdit,
                function: () => editDetail(data?.id),
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.ATTACHMENT_KIT,
                action: ActionTypeEnum.UPDATE,
              },
            ];
          }
          const isCreator = userInfo?.id === data?.createdUserId;

          if (isCreator) {
            actions = [
              ...actions,

              {
                img: images.icons.icRemove,
                function: () => handleDelete(data?.id),
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.ATTACHMENT_KIT,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
              },
            ];
          }
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
        headerName: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_LIST_DYNAMIC_FIELDS.Code,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_LIST_DYNAMIC_FIELDS.Name,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_LIST_DYNAMIC_FIELDS.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_LIST_DYNAMIC_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_LIST_DYNAMIC_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      dynamicLabels,
      isMultiColumnFilter,
      userInfo?.mainCompanyId,
      userInfo?.id,
      viewDetail,
      editDetail,
      handleDelete,
    ],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.ATTACHMENT_KIT}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionAttachmentKit,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.ATTACHMENT_KIT,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() =>
                  history.push(AppRouteConst.ATTACHMENT_KIT_CREATE)
                }
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
                  ATTACHMENT_KIT_LIST_DYNAMIC_FIELDS['Create New'],
                )}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>

      <AGGridModule
        loading={loading}
        params={params}
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.attachmentKit}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionAttachmentKit,
        )}
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        view={(params) => {
          viewDetail(params);
          return true;
        }}
        getList={handleGetList}
        classNameHeader={styles.header}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default AttachmentKitContainer;
