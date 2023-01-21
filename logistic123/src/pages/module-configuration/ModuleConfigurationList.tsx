import { useMemo, memo, useState, useCallback, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import cx from 'classnames';

import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import {
  ActionTypeEnum,
  Features,
  RoleScope,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action } from 'models/common.model';

import styles from 'components/list-common.module.scss';
import images from 'assets/images/images';
import { ButtonType } from 'components/ui/button/Button';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import {
  getListModuleConfigurationActions,
  selectModule,
} from 'store/module-configuration/module-configuration.action';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { ListModuleConfigDataTable } from 'models/store/module-configuration/module-configuration.model';
import { useParams } from 'react-router';

const ModuleConfigurationList: FC = () => {
  const uniqueId = useMemo(() => v4(), []);
  const dispatch = useDispatch();
  const { listModuleConfiguration, loading } = useSelector(
    (store) => store.moduleConfiguration,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { id: selectedCompany } = useParams<{ id: string }>();

  const listModule = useMemo(
    () =>
      listModuleConfiguration && listModuleConfiguration?.data?.length
        ? listModuleConfiguration.data.map((module) => ({
            id: module?.id || '',
            originalName: module?.defaultLabel || '',
            description: module?.description || '',
            updatedDate: formatDateTime(module?.updatedAt) || '',
            updatedUser: module?.modifiedBy?.username || '',
            currentName: module?.userDefinedLabel || '',
          }))
        : [],
    [listModuleConfiguration],
  );

  const handleGetList = useCallback(() => {
    if (selectedCompany) {
      dispatch(
        getListModuleConfigurationActions.request({
          companyId: selectedCompany,
          pageSize: -1,
        }),
      );
    }
  }, [dispatch, selectedCompany]);

  const handleViewDetail = useCallback(
    (param: string, type?: string) => {
      const selectedItem = listModuleConfiguration?.data?.find(
        (module) => module.id === param,
      );

      if (selectedItem) {
        dispatch(selectModule(selectedItem));

        history.push(
          `${AppRouteConst.getModuleConfigurationDetailById(
            selectedItem.id,
            selectedCompany || '',
          )}?${type || 'view'}`,
        );
      }

      return true;
    },
    [dispatch, listModuleConfiguration?.data, selectedCompany],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: 'Action',
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({
          data,
        }: {
          data: ListModuleConfigDataTable;
        }) => {
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              // TODO: fix this later on
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY,
              buttonType: ButtonType.Blue,
              action: ActionTypeEnum.VIEW,
              function: () => handleViewDetail(data?.id),
            },
            {
              img: images.icons.icEdit,
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'ms-1',
              function: () => handleViewDetail(data?.id, 'edit'),
            },
          ];

          if (!data) {
            actions = [];
          }
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
        field: 'originalName',
        headerName: 'Module Original Name',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'currentName',
        headerName: 'Module Current Name',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'description',
        headerName: 'Description',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedDate',
        headerName: 'Update Date',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUser',
        headerName: 'Updated By User',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [handleViewDetail, isMultiColumnFilter],
  );

  return (
    <div key={uniqueId}>
      <AGGridModule
        loading={loading}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        hasRangePicker
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.moduleConfigurationList}
        fileName="Module Configuration"
        dataTable={listModule}
        height="calc(100vh - 188px)"
        view={(params) => handleViewDetail(params)}
        hiddenTemplate={userInfo?.roleScope === RoleScope.SuperAdmin}
        extensions={
          userInfo?.roleScope === RoleScope.SuperAdmin
            ? {
                saveTemplate: false,
                saveAsTemplate: false,
                deleteTemplate: false,
                globalTemplate: false,
              }
            : {}
        }
        getList={handleGetList}
        classNameHeader={styles.header}
        params={null}
      />
    </div>
  );
};

export default memo(ModuleConfigurationList);
