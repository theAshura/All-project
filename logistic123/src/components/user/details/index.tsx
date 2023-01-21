import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import images from 'assets/images/images';
import cx from 'classnames';
import { getLatLngByAddress, loadGoogleMap } from 'helpers/google.map.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import { useDispatch, useSelector } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { getListDivisionActions } from 'pages/division/store/action';
import {
  CreateUserParamsContext,
  StatusPage,
  TabName,
  UserContext,
} from 'contexts/user/UserContext';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
  ROLES_SCOPE,
  RoleScope,
} from 'constants/roleAndPermission.const';
import NoPermission from 'containers/no-permission';
import { AppRouteConst } from 'constants/route.const';
import { useLocation, useParams } from 'react-router-dom';
import { CommonQuery, CompanyLevelEnum } from 'constants/common.const';
import {
  AvailableAreaParams,
  CreateUserParams,
} from 'models/api/user/user.model';
import { AvailableAreaItem } from 'models/store/user/user.model';

import {
  getUserManagementDetailActions,
  clearUserManagementDetailReducer,
  deleteUserActions,
  updateParamsActions,
  updateUserManagementActions,
  getListTravelDocumentActions,
  getListProvidedInspectionActions,
  getCountryActions,
} from 'store/user/user.action';
import moment from 'moment';
import { getListCompanyActions } from 'store/fleet/fleet.action';
import { useFormContext } from 'react-hook-form';
import Button, { ButtonType } from 'components/ui/button/Button';
import HeaderPage from 'components/common/header-page/HeaderPage';
import history from 'helpers/history.helper';
import forOwn from 'lodash/forOwn';
import isEmpty from 'lodash/isEmpty';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import AccountInformation from '../components/account-information/AccountInformation';
import AvailableArea from '../components/available-area/AvailableArea';
import Password from '../components/password/Password';
import RoleAndPermission from '../components/role-and-permission/RoleAndPermission';
import SidebarLeft from '../components/sidebar-left/SidebarLeft';
import styles from './detail.module.scss';
import InspectorDetail from '../components/inspector-detail/InspectorDetail';

const UserManagementContainer = () => {
  const { id } = useParams<{ id: string }>();
  const [modal, setModal] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const { search } = useLocation();
  const { userInfo } = useSelector((state) => state.authenticate);

  const {
    statusPage,
    currentTab,
    isInspector,
    handleSetActiveTabs,
    handleSetCurrentTab,
  } = useContext(UserContext);
  const {
    setValue,
    // watch,
    formState: { errors },
  } = useFormContext();
  const dispatch = useDispatch();
  const { loading, userDetailResponse, listUser, params } = useSelector(
    (state) => state.user,
  );
  const { listDivision } = useSelector((state) => state.division);

  const [internalLoading, setInternalLoading] = useState(false);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.UserRolesUser,
    modulePage: getCurrentModulePageByStatus(
      search === CommonQuery.EDIT,
      false,
    ),
  });

  useEffectOnce(() => {
    loadGoogleMap(
      `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`,
    );
    const isChild =
      RoleScope.Admin === userInfo?.roleScope && !userInfo?.parentCompanyId;
    dispatch(getUserManagementDetailActions.request({ id }));
    dispatch(getCountryActions.request({ content: '' }));
    if (ROLES_SCOPE[0] === userInfo.roleScope || isChild) {
      dispatch(
        getListCompanyActions.request({
          page: 1,
          pageSize: -1,
          status: 'active',
          level: CompanyLevelEnum.MAIN_COMPANY,
        }),
      );
    }

    handleSetActiveTabs([
      TabName.ACCOUNT_INFORMATION,
      TabName.AVAILABLE_AREA,
      TabName.PASSWORD,
      TabName.INSPECTOR_DETAIL,
      TabName.ROLE_AND_PERMISSION,
    ]);

    return () => {
      setIsFirstLoad(true);
      dispatch(clearUserManagementDetailReducer());
    };
  });

  useEffect(() => {
    if (isInspector) {
      dispatch(getListTravelDocumentActions.request({ id }));
      dispatch(
        getListProvidedInspectionActions.request({
          id,
          companyId: userInfo?.mainCompanyId,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, isInspector]);

  const handleDeleteUser = () => {
    dispatch(
      deleteUserActions.request({
        id,
        getListUser: () => {
          if (listUser.data.length === 1) {
            let newParams = { ...params };
            if (params.page > 1) {
              newParams = {
                ...params,
                page: params.page - 1,
              };
              dispatch(updateParamsActions(newParams));
            } else {
              dispatch(updateParamsActions(params));
            }
          }
          history.push(AppRouteConst.USER);
        },
      }),
    );
  };

  useEffect(() => {
    if (userDetailResponse) {
      // avatar: userDetailResponse?.avatar,
      setValue('accountInformation.firstName', userDetailResponse?.firstName);
      setValue('accountInformation.lastName', userDetailResponse?.lastName);
      setValue('accountInformation.jobTitle', userDetailResponse?.jobTitle);
      setValue('accountInformation.companyId', userDetailResponse?.companyId);
      setValue('password', '^!$332VGUbmj'); // NOT SAVE just use to display

      setValue('accountInformation.status', userDetailResponse?.status);
      setValue('accountInformation.email', userDetailResponse?.email);
      setValue(
        'accountInformation.phoneNumber',
        userDetailResponse?.phoneNumber,
      );
      setValue(
        'accountInformation.secondaryPhoneNumber',
        userDetailResponse?.secondaryPhoneNumber,
      );
      setValue(
        'accountInformation.addressLine2',
        userDetailResponse?.addressLine2,
      );

      setValue('accountInformation.gender', userDetailResponse?.gender);
      setValue('accountInformation.dob', moment(userDetailResponse?.dob));
      setValue('accountInformation.nationality', [
        { ...userDetailResponse?.nationality },
      ]);
      setValue('accountInformation.country', [
        { ...userDetailResponse?.country },
      ]);

      setValue('accountInformation.stateOrProvince', [
        { ...userDetailResponse?.stateOrProvince },
      ]);
      setValue('accountInformation.townOrCity', userDetailResponse?.townOrCity);
      setValue('accountInformation.address', userDetailResponse?.address);
      setValue('accountInformation.postCode', userDetailResponse?.postCode);
      setValue('accountInformation.userType', userDetailResponse?.userType);
      // setValue(
      //   'accountInformation.controlType',
      //   userDetailResponse?.controlType,
      // );
      // setValue('accountInformation.rankId', userDetailResponse?.rank?.id);
      // setValue(
      //   'accountInformation.primaryDepartmentId',
      //   userDetailResponse?.primaryDepartment?.id,
      // );
      // setValue('accountInformation.employeeId', userDetailResponse?.employeeId);
      // setValue(
      //   'accountInformation.departmentIds',
      //   userDetailResponse?.departments?.map((item) => item.id) || [],
      // );

      setValue('availableAreas', userDetailResponse?.availableAreas);
      setValue('switchableCompanies', userDetailResponse?.switchableCompanies);
      // setValue(
      //   'accountInformation.applyFor',
      //   userDetailResponse?.applyFor || 'All',
      // );
      setValue(
        'roles',
        userDetailResponse?.roles?.map((item) => item.id) || [],
      );
      setValue('availableAreas', userDetailResponse?.availableAreas);

      let parentCompanyId: string = userDetailResponse?.parentCompanyId || '';

      if (RoleScope.Admin === userInfo?.roleScope) {
        parentCompanyId = userInfo?.mainCompanyId;
      }
      if (RoleScope.SuperAdmin === userInfo?.roleScope) {
        setValue(
          'accountInformation.parentCompanyId',
          userDetailResponse?.companyId,
        );
      } else {
        setValue('accountInformation.parentCompanyId', parentCompanyId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetailResponse]);

  useEffect(() => {
    if (userDetailResponse && listDivision?.data && isFirstLoad) {
      const divisionList = listDivision?.data?.filter((item) =>
        userDetailResponse?.divisions?.some((i) => i?.id === item.id),
      );

      setValue(
        'accountInformation.divisionIds',
        divisionList?.map((item) => ({
          label: item?.name,
          value: item?.id,
        })),
      );
      setIsFirstLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listDivision?.data, userDetailResponse]);

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
      setValue(
        'accountInformation.townOrCity',
        accountInformation?.townOrCity?.trim() || '',
      );
      setValue(
        'accountInformation.address',
        accountInformation?.address?.trim() || '',
      );
      setValue(
        'accountInformation.addressLine2',
        accountInformation?.addressLine2?.trim() || '',
      );
      setValue(
        'accountInformation.postCode',
        accountInformation?.postCode?.trim() || '',
      );

      const location = await getLatLngByAddress(
        `${accountInformation?.address?.trim() || ''}`,
      );

      const params: CreateUserParams = {
        ...accountInformation,
        townOrCity: accountInformation?.townOrCity?.trim() || '',
        address: accountInformation?.address?.trim() || '',
        postCode: accountInformation?.postCode?.trim() || '',
        addressLine2: accountInformation?.addressLine2?.trim() || '',
        country: accountInformation?.country?.map((i) => i.value).join(''),
        switchableCompanies: switchableCompanies?.map((i) => i?.value) || [],
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
    [isInspector, setValue, userInfo?.roleScope],
  );

  const handleSubmitAccount = useCallback(
    async (dataForm: CreateUserParamsContext) => {
      if (isEmpty(errors)) {
        setInternalLoading(true);
        const params = await formatDataForm(dataForm);
        setInternalLoading(false);

        dispatch(
          updateUserManagementActions.request({
            id,
            data: {
              ...params,
              secondaryPhoneNumber: params?.secondaryPhoneNumber || null,
            },
            handleSuccess: () => {
              dispatch(getUserManagementDetailActions.request({ id }));
              handleSetCurrentTab(TabName.PASSWORD);
              setValue('accountInformation.divisionIds', []);
            },
          }),
        );
      }
    },
    [dispatch, errors, formatDataForm, handleSetCurrentTab, id, setValue],
  );

  const handleSubmitPassword = useCallback(
    (dataForm: CreateUserParamsContext) => {
      handleSetCurrentTab(TabName.ROLE_AND_PERMISSION);
    },
    [handleSetCurrentTab],
  );

  const handleSubmitRoles = useCallback(
    async (
      dataForm: CreateUserParamsContext,
      keepCurrentPage?: boolean,
      tab?: string,
      containInspector?: boolean,
    ) => {
      if (tab === 'roleAndPermissionAdmin') {
        setInternalLoading(true);
        const params = await formatDataForm(dataForm);
        setInternalLoading(false);
        dispatch(
          updateUserManagementActions.request({
            id,
            data: params,
            handleSuccess: () => {
              dispatch(getUserManagementDetailActions.request({ id }));
            },
          }),
        );
        return;
      }
      if (isEmpty(errors)) {
        setInternalLoading(true);
        const params = await formatDataForm(dataForm);
        setInternalLoading(false);
        dispatch(
          updateUserManagementActions.request({
            id,
            data: params,
            handleSuccess: () => {
              dispatch(getUserManagementDetailActions.request({ id }));
              if (keepCurrentPage) {
                return;
              }
              if (
                (isInspector || containInspector) &&
                userInfo.roleScope !== RoleScope.SuperAdmin
              ) {
                handleSetCurrentTab(TabName.AVAILABLE_AREA);
              } else {
                history.push(AppRouteConst.USER);
              }
            },
          }),
        );
      }
    },
    [
      dispatch,
      errors,
      formatDataForm,
      handleSetCurrentTab,
      id,
      isInspector,
      userInfo.roleScope,
    ],
  );

  const handleSubmitAvailableArea = useCallback(
    async (data: CreateUserParamsContext) => {
      if (isEmpty(errors)) {
        setInternalLoading(true);
        const params = await formatDataForm(data);
        setInternalLoading(false);
        handleSetActiveTabs([TabName.AVAILABLE_AREA]);
        dispatch(
          updateUserManagementActions.request({
            id,
            data: params,
            handleSuccess: () => {
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
      id,
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
        return <InspectorDetail dynamicLabels={dynamicLabels} />;
      default:
        return (
          <AccountInformation
            onSubmit={handleSubmitAccount}
            internalLoading={internalLoading}
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

  const handleGetDivision = useCallback(
    (search?: string) => {
      dispatch(
        getListDivisionActions.request({
          pageSize: -1,
          isLeftMenu: false,
          content: search || '',
          status: 'active',
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (userInfo.roleScope !== RoleScope.SuperAdmin) {
      handleGetDivision();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAllowEdit = useCallback(() => {
    const isCreator = userInfo?.id === userDetailResponse?.createdUserId;
    if (userInfo?.roleScope === RoleScope.User && !isCreator) {
      return false;
    }
    return true;
  }, [userDetailResponse?.createdUserId, userInfo?.id, userInfo?.roleScope]);

  if (!userDetailResponse || loading) {
    return (
      <div className={cx(styles.noDateWrapper)}>
        <img
          src={images.common.loading}
          className={styles.loading}
          alt="loading"
        />
      </div>
    );
  }

  return (
    <div className={cx('d-flex', styles.user)}>
      <SidebarLeft dynamicLabels={dynamicLabels} />
      <PermissionCheck
        options={{
          feature: Features.USER_ROLE,
          subFeature: SubFeatures.USER,
          action:
            search === CommonQuery.EDIT
              ? ActionTypeEnum.UPDATE
              : ActionTypeEnum.VIEW,
        }}
      >
        {({ hasPermission }) =>
          hasPermission ? (
            <div className={cx('w-100', styles.wrapContainer)}>
              <HeaderPage
                breadCrumb={
                  search === CommonQuery.EDIT
                    ? BREAD_CRUMB.USER_EDIT
                    : BREAD_CRUMB.USER_DETAIL
                }
                titlePage={titleTab}
              >
                <div className="d-flex align-items-center">
                  {statusPage === StatusPage.VIEW && (
                    <div>
                      <Button
                        className={cx('me-2', styles.buttonFilter)}
                        buttonType={ButtonType.CancelOutline}
                        onClick={(e) => {
                          history.goBack();
                        }}
                      >
                        <span className="pe-2">
                          {renderDynamicLabel(
                            dynamicLabels,
                            COMMON_DYNAMIC_FIELDS.Back,
                          )}
                        </span>
                      </Button>

                      <PermissionCheck
                        options={{
                          feature: Features.USER_ROLE,
                          subFeature: SubFeatures.USER,
                          action: ActionTypeEnum.UPDATE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission &&
                          isAllowEdit() && (
                            <Button
                              className={cx('me-1', styles.buttonFilter)}
                              onClick={(e) => {
                                history.push(
                                  `${AppRouteConst.getUserById(id)}${
                                    CommonQuery.EDIT
                                  }`,
                                );
                              }}
                            >
                              <span className="pe-2">
                                {' '}
                                {renderDynamicLabel(
                                  dynamicLabels,
                                  COMMON_DYNAMIC_FIELDS.Edit,
                                )}
                              </span>
                              <img
                                src={images.icons.icEdit}
                                alt="edit"
                                className={styles.icEdit}
                              />
                            </Button>
                          )
                        }
                      </PermissionCheck>
                      <PermissionCheck
                        options={{
                          feature: Features.USER_ROLE,
                          subFeature: SubFeatures.USER,
                          action: ActionTypeEnum.DELETE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission &&
                          userInfo?.id ===
                            userDetailResponse?.createdUserId && (
                            <Button
                              className={cx('ms-1', styles.buttonFilter)}
                              buttonType={ButtonType.Orange}
                              onClick={(e) => setModal(true)}
                            >
                              <span className="pe-2">
                                {renderDynamicLabel(
                                  dynamicLabels,
                                  COMMON_DYNAMIC_FIELDS.Delete,
                                )}
                              </span>
                              <img
                                src={images.icons.icRemove}
                                alt="remove"
                                className={styles.icRemove}
                              />
                            </Button>
                          )
                        }
                      </PermissionCheck>
                    </div>
                  )}
                </div>
              </HeaderPage>
              {renderTab()}
              <ModalConfirm
                disable={loading}
                isDelete
                toggle={() => setModal(!modal)}
                modal={modal}
                handleSubmit={handleDeleteUser}
                title={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Delete?'],
                )}
                content={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS[
                    'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
                  ],
                )}
                cancelTxt={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Cancel,
                )}
                rightTxt={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Delete,
                )}
              />
            </div>
          ) : (
            <NoPermission />
          )
        }
      </PermissionCheck>
    </div>
  );
};

export default UserManagementContainer;
