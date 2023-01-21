import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { USER_MANAGEMENT_DYNAMIC_LIST_FIELDS } from 'constants/dynamic/userManagement.const';
import {
  ActionTypeEnum,
  Features,
  RoleScope,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { formatDateNoTime } from 'helpers/date.helper';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserActions, getListUserActions } from 'store/user/user.action';
import styles from '../../list-common.module.scss';

const UserManagementContainer = () => {
  // state
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const { loading, params, listUser } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.UserRolesUser,
    modulePage: ModulePage.List,
  });

  const dispatch = useDispatch();

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const param = handleFilterParams(params);
      dispatch(
        getListUserActions.request({
          ...param,
          pageSize: -1,
          isLeftMenu: false,
        }),
      );
    },
    [dispatch],
  );

  const viewDetail = useCallback(
    (id?: string, isNewTab?: boolean) => {
      const isCurrentUser = userInfo?.id === id;
      if (isCurrentUser) {
        history.push(`/user-profile/detail/${id}?edit`);
        return;
      }
      if (isNewTab) {
        const win = window.open(AppRouteConst.getUserById(id), '_blank');
        win.focus();
      } else {
        history.push(`${AppRouteConst.getUserById(id)}`);
      }
    },
    [userInfo?.id],
  );

  const handleDeleteUser = useCallback(
    (id: string) => {
      const currentStandard = listUser.data.find((item) => item.id === id);
      if (currentStandard) {
        dispatch(
          deleteUserActions.request({
            id,
            getListUser: () => {
              handleGetList();
            },
          }),
        );
      }
    },
    [dispatch, handleGetList, listUser],
  );
  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
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
        onPressButtonRight: () => handleDeleteUser(id),
      });
    },
    [dynamicLabels, handleDeleteUser],
  );
  const dataTable = useMemo(() => {
    if (!listUser?.data) {
      return [];
    }
    return listUser?.data?.map((item) => ({
      id: item?.id,
      firstName: item?.firstName,
      lastName: item?.lastName,
      email: item?.email,
      dob: formatDateNoTime(item?.dob),
      phoneNumber: item?.phoneNumber,
      jobTitle: item?.jobTitle,
      gender: item?.gender,
      nationality: item?.nationality,
      company: item?.company.name,
      country: item?.country,
      stateOrProvince: item?.stateOrProvince,
      townOrCity: item?.townOrCity,
      address: item?.address,
      postCode: item?.postCode,
      status: item?.status,
      createdUserId: item?.createdUserId,
    }));
  }, [listUser?.data]);

  const isAllowEdit = useCallback(
    (data) => {
      const isCreator = userInfo?.id === data?.createdUserId;
      if (userInfo?.roleScope === RoleScope.User && !isCreator) {
        return false;
      }
      return true;
    },
    [userInfo?.id, userInfo?.roleScope],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const isCurrentUser = userInfo?.id === data?.id;
          const isCreator = userInfo?.id === data?.createdUserId;

          const allowEdit = isAllowEdit(data);

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(data?.id),
              feature: Features.USER_ROLE,
              subFeature: SubFeatures.USER,
              buttonType: ButtonType.Blue,
            },
            allowEdit && {
              img: images.icons.icEdit,
              function: () => {
                if (isCurrentUser) {
                  history.push(`/user-profile/detail/${data?.id}?edit`);
                  return;
                }
                history.push(`${AppRouteConst.getUserById(data?.id)}?edit`);
              },
              feature: Features.USER_ROLE,
              subFeature: SubFeatures.USER,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'ms-1',
            },
            isCreator && {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.USER_ROLE,
              subFeature: SubFeatures.USER,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
              disable: isCurrentUser,
            },
            {
              img: images.icons.table.icNewTab,
              function: () => viewDetail(data?.id, true),
              feature: Features.USER_ROLE,
              subFeature: SubFeatures.USER,
              buttonType: ButtonType.Green,
              cssClass: 'ms-1',
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
        field: 'firstName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS['First name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'lastName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS['Last name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'email',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS.Email,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      // {
      //   field: 'dob',
      //   headerName: t('title.dob'),
      //   filter: isMultiColumnFilter
      //     ? 'agMultiColumnFilter'
      //     : 'agTextColumnFilter',
      // },
      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS.Company,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'phoneNumber',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS.Phone,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'jobTitle',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS['Job title'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'gender',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS.Gender,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'nationality',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS.Nationality,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'country',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS.Country,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'stateOrProvince',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS['State/ Province'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'townOrCity',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS['Town/ City'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'address',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS.Address,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'postCode',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS['Post code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_LIST_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [
      dynamicLabels,
      isMultiColumnFilter,
      userInfo?.id,
      isAllowEdit,
      viewDetail,
      handleDelete,
    ],
  );

  // render
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.USER}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.UserRolesUser,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.USER_ROLE,
            subFeature: SubFeatures.USER,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => history.push(AppRouteConst.USER_CREATE)}
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
                  COMMON_DYNAMIC_FIELDS['Create New'],
                )}
              </Button>
            )
          }
        </PermissionCheck>
        {/* </div> */}
      </HeaderPage>

      <AGGridModule
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.user}
        fileName={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.UserRolesUser,
        )}
        dataTable={dataTable}
        height="calc(100vh - 188px)"
        view={(params) => {
          viewDetail(params);
          return true;
        }}
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
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default UserManagementContainer;
