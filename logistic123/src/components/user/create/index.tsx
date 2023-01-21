import { useCallback, useContext, useMemo, useEffect, useState } from 'react';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { getLatLngByAddress, loadGoogleMap } from 'helpers/google.map.helper';
import {
  TabName,
  UserContext,
  CreateUserParamsContext,
} from 'contexts/user/UserContext';

import {
  getUserManagementDetailActions,
  clearUserManagementDetailReducer,
  createNewUserManagementActions,
  updateUserManagementActions,
  getListProvidedInspectionActions,
  getListTravelDocumentActions,
} from 'store/user/user.action';
import {
  AvailableAreaParams,
  CreateUserParams,
} from 'models/api/user/user.model';
import { CompanyLevelEnum } from 'constants/common.const';
import { getListCompanyActions } from 'store/fleet/fleet.action';
import { AvailableAreaItem } from 'models/store/user/user.model';
import {
  ActionTypeEnum,
  Features,
  RoleScope,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import useEffectOnce from 'hoc/useEffectOnce';
import HeaderPage from 'components/common/header-page/HeaderPage';
import forOwn from 'lodash/forOwn';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { useFormContext } from 'react-hook-form';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { validateUserManagementDetailApi } from 'api/user.api';

import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import AccountInformation from '../components/account-information/AccountInformation';
import Password from '../components/password/Password';
import RoleAndPermission from '../components/role-and-permission/RoleAndPermission';
import SidebarLeft from '../components/sidebar-left/SidebarLeft';
import styles from './create.module.scss';
import AvailableArea from '../components/available-area/AvailableArea';
import InspectorDetail from '../components/inspector-detail/InspectorDetail';

const NewUserManagementContainer = () => {
  const { currentTab, isInspector, handleSetCurrentTab, handleSetActiveTabs } =
    useContext(UserContext);
  const {
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const watchPassword = watch('password');
  const { userInfo } = useSelector((state) => state.authenticate);
  const dispatch = useDispatch();
  const { userDetailResponse } = useSelector((state) => state.user);

  const [internalLoading, setInternalLoading] = useState(false);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.UserRolesUser,
    modulePage: getCurrentModulePageByStatus(false, true),
  });

  useEffectOnce(() => {
    loadGoogleMap(
      `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`,
    );

    const isChild =
      RoleScope.Admin === userInfo?.roleScope && !userInfo?.parentCompanyId;
    dispatch(getUserManagementDetailActions.request({}));
    if (userInfo.roleScope === RoleScope.SuperAdmin || isChild) {
      dispatch(
        getListCompanyActions.request({
          page: 1,
          pageSize: -1,
          status: 'active',
          level: CompanyLevelEnum.MAIN_COMPANY,
        }),
      );
    }

    return () => {
      dispatch(clearUserManagementDetailReducer());
    };
  });

  useEffect(() => {
    if (isInspector && userDetailResponse?.id) {
      dispatch(
        getListTravelDocumentActions.request({
          id: userDetailResponse?.id,
        }),
      );
      dispatch(
        getListProvidedInspectionActions.request({
          id: userDetailResponse?.id,
          companyId: userInfo?.companyId,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isInspector, userDetailResponse?.id]);

  const formatDataForm = useCallback(
    async (data: CreateUserParamsContext) => {
      const {
        accountInformation,
        availableAreas,
        switchableCompanies,
        password,
        ...other
      } = data;

      const listAvailableAreas: AvailableAreaParams[] = [];
      if (availableAreas) {
        forOwn(availableAreas, (value, key) => {
          value?.forEach((item: AvailableAreaItem) => {
            listAvailableAreas.push({
              portIds: item?.ports?.map((i) => i.value),
              country: item.country.value,
              preference: item?.preference,
            });
          });
        });
      }

      const location = await getLatLngByAddress(
        `${accountInformation?.address?.trim() || ''}`,
      );

      const params: CreateUserParams = {
        ...accountInformation,
        switchableCompanies: switchableCompanies?.map((i) => i?.value) || [],
        country: accountInformation?.country?.map((i) => i.value).join(''),
        secondaryPhoneNumber: accountInformation?.secondaryPhoneNumber || null,
        nationality: accountInformation?.nationality
          ?.map((i) => i.value)
          .join(''),
        stateOrProvince: accountInformation?.stateOrProvince
          ?.map((i) => i.value)
          .join(''),
        ...other,
        availableAreas: isInspector ? listAvailableAreas : [],
        latitude: location?.lat,
        longitude: location?.lng,
        divisionIds: accountInformation?.divisionIds?.length
          ? accountInformation?.divisionIds?.map((item) => item.value)
          : [],
        companyId:
          RoleScope.SuperAdmin === userInfo?.roleScope
            ? accountInformation?.parentCompanyId
            : accountInformation?.companyId,
      };
      if (params.phoneNumber === '') {
        delete params.phoneNumber;
      }
      return params;
    },
    [isInspector, userInfo?.roleScope],
  );

  const handleSubmitAccount = useCallback(
    async (data: CreateUserParamsContext) => {
      setInternalLoading(true);
      const params = await formatDataForm(data);
      setInternalLoading(false);
      if (isEmpty(errors) && userDetailResponse?.id) {
        dispatch(
          updateUserManagementActions.request({
            id: userDetailResponse?.id,
            data: {
              ...params,
              secondaryPhoneNumber: params?.secondaryPhoneNumber || null,
            },
            handleSuccess: () => {
              dispatch(
                getUserManagementDetailActions.request({
                  id: userDetailResponse?.id,
                }),
              );
              handleSetActiveTabs([TabName.PASSWORD]);
              handleSetCurrentTab(TabName.PASSWORD);
            },
          }),
        );
      } else if (isEmpty(errors?.accountInformation)) {
        const paramsValidate = userDetailResponse?.id
          ? {
              id: userDetailResponse?.id,
              email: params.email,
            }
          : { email: params.email };
        validateUserManagementDetailApi({ data: paramsValidate }).then(
          (res) => {
            handleSetActiveTabs([TabName.PASSWORD]);
            handleSetCurrentTab(TabName.PASSWORD);
          },
        );
      }
    },
    [
      dispatch,
      errors,
      formatDataForm,
      handleSetActiveTabs,
      handleSetCurrentTab,
      userDetailResponse?.id,
    ],
  );

  const handleSubmitPassword = useCallback(
    async (data: CreateUserParamsContext) => {
      const createUserFromSuperAdmin =
        userInfo?.roleScope === RoleScope.SuperAdmin && !userDetailResponse?.id;

      if (createUserFromSuperAdmin) {
        const params = await formatDataForm(data);
        dispatch(
          createNewUserManagementActions.request({
            ...params,
            password: watchPassword,
            handleSuccess: (id) => {
              history.push(AppRouteConst.USER);
            },
          }),
        );
        return;
      }
      handleSetActiveTabs([TabName.ROLE_AND_PERMISSION]);
      handleSetCurrentTab(TabName.ROLE_AND_PERMISSION);
    },
    [
      dispatch,
      formatDataForm,
      handleSetActiveTabs,
      handleSetCurrentTab,
      userDetailResponse?.id,
      userInfo?.roleScope,
      watchPassword,
    ],
  );

  const handleSubmitRoles = useCallback(
    async (
      data: CreateUserParamsContext,
      keepCurrentPage?: boolean,
      tab?: string,
      containInspector?: boolean,
    ) => {
      setInternalLoading(true);
      const params = await formatDataForm(data);
      setInternalLoading(false);
      if (!userDetailResponse?.id) {
        clearErrors('roles');
        dispatch(
          createNewUserManagementActions.request({
            ...params,
            password: watchPassword,
            handleSuccess: (id) => {
              dispatch(getUserManagementDetailActions.request({ id }));
              if (containInspector) {
                handleSetActiveTabs([
                  TabName.AVAILABLE_AREA,
                  TabName.INSPECTOR_DETAIL,
                ]);
                handleSetCurrentTab(TabName.AVAILABLE_AREA);
                return;
              }
              if (keepCurrentPage) {
                return;
              }
              history.push(AppRouteConst.USER);
            },
          }),
        );
      } else if (isEmpty(omit(errors, 'roles')) && userDetailResponse?.id) {
        clearErrors('roles');
        dispatch(
          updateUserManagementActions.request({
            id: userDetailResponse?.id,
            data: params,
            handleSuccess: () => {
              dispatch(
                getUserManagementDetailActions.request({
                  id: userDetailResponse?.id,
                }),
              );
              handleSetActiveTabs([
                TabName.AVAILABLE_AREA,
                TabName.INSPECTOR_DETAIL,
              ]);
              if (!keepCurrentPage && !containInspector) {
                history.push(AppRouteConst.USER);
              }
              if (containInspector) {
                handleSetCurrentTab(TabName.AVAILABLE_AREA);
              }
            },
          }),
        );
      }
    },
    [
      clearErrors,
      dispatch,
      errors,
      formatDataForm,
      handleSetActiveTabs,
      handleSetCurrentTab,
      userDetailResponse?.id,
      watchPassword,
    ],
  );

  const handleSubmitAvailableArea = useCallback(
    async (dataForm: CreateUserParamsContext) => {
      if (isEmpty(errors) && userDetailResponse?.id) {
        setInternalLoading(true);
        const params = await formatDataForm(dataForm);
        setInternalLoading(false);

        dispatch(
          updateUserManagementActions.request({
            id: userDetailResponse?.id,
            data: params,
            handleSuccess: () => {
              handleSetActiveTabs([TabName.INSPECTOR_DETAIL]);
              handleSetCurrentTab(TabName.INSPECTOR_DETAIL);
            },
          }),
        );
      }
    },
    [
      dispatch,
      errors,
      formatDataForm,
      handleSetActiveTabs,
      handleSetCurrentTab,
      userDetailResponse?.id,
    ],
  );

  const renderTab = () => {
    switch (currentTab) {
      case TabName.ACCOUNT_INFORMATION:
        return (
          <AccountInformation
            onSubmit={handleSubmitAccount}
            internalLoading={internalLoading}
            dynamicLabels={dynamicLabels}
          />
        );
      case TabName.PASSWORD:
        return (
          <Password
            onSubmit={handleSubmitPassword}
            dynamicLabels={dynamicLabels}
          />
        );
      case TabName.ROLE_AND_PERMISSION:
        return (
          <RoleAndPermission
            onSubmit={handleSubmitRoles}
            internalLoading={internalLoading}
            dynamicLabels={dynamicLabels}
          />
        );
      case TabName.AVAILABLE_AREA:
        return (
          <AvailableArea
            onSubmit={handleSubmitAvailableArea}
            internalLoading={internalLoading}
            dynamicLabels={dynamicLabels}
          />
        );
      case TabName.INSPECTOR_DETAIL:
        return <InspectorDetail isCreate dynamicLabels={dynamicLabels} />;
      default:
        return (
          <AccountInformation
            onSubmit={handleSubmitAccount}
            dynamicLabels={dynamicLabels}
          />
        );
    }
  };

  const titleTab: string = useMemo(() => {
    switch (currentTab) {
      case TabName.ACCOUNT_INFORMATION:
        return renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['User information'],
        );
      case TabName.AVAILABLE_AREA:
        return renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Available area'],
        );
      case TabName.PASSWORD:
        return renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Password,
        );
      case TabName.ROLE_AND_PERMISSION:
        return renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Role and permission'],
        );
      case TabName.INSPECTOR_DETAIL:
        return renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Inspector detail'],
        );
      default:
        return renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Title,
        );
    }
  }, [currentTab, dynamicLabels]);

  return (
    <PermissionCheck
      options={{
        feature: Features.USER_ROLE,
        subFeature: SubFeatures.USER,
        action: ActionTypeEnum.CREATE,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={cx('d-flex', styles.newUserManagement)}>
            <SidebarLeft dynamicLabels={dynamicLabels} />

            <div className={cx(styles.wrapContainer)}>
              <HeaderPage
                breadCrumb={BREAD_CRUMB.USER_CREATE}
                titlePage={titleTab}
              >
                <div />
              </HeaderPage>
              {renderTab()}
            </div>
          </div>
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
};

export default NewUserManagementContainer;
