import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import images from 'assets/images/images';
import cx from 'classnames';
import useEffectOnce from 'hoc/useEffectOnce';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreateUserParamsContext,
  TabName,
  UserContext,
} from 'contexts/user-profile/UserContext';

import { RoleScope } from 'constants/roleAndPermission.const';
import { getUserProfileMe } from 'store/authenticate/authenticate.action';

import { AppRouteConst } from 'constants/route.const';
import { useParams } from 'react-router-dom';

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
  // updateUserManagementActions,
  getListTravelDocumentActions,
  getListProvidedInspectionActions,
  getCountryActions,
  updateUserProfileActions,
} from 'store/user/user.action';
import moment from 'moment';
import { useFormContext } from 'react-hook-form';

import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import history from 'helpers/history.helper';
import forOwn from 'lodash/forOwn';
import isEmpty from 'lodash/isEmpty';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import AccountInformation from '../components/account-information/AccountInformation';
import AvailableArea from '../components/available-area/AvailableArea';
import Password from '../components/password/Password';
import RoleAndPermission from '../components/role-and-permission/RoleAndPermission';
import SidebarLeft from '../components/sidebar-left/SidebarLeft';
import RoleAndPermissionWithAdmin from '../components/role-and-permission/RoleAndPermissionWithAdmin';
import InspectorDetail from '../components/inspector-detail/InspectorDetail';
import styles from './detail.module.scss';

const UserManagementContainer = () => {
  const { id } = useParams<{ id: string }>();
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listCompany } = useSelector((state) => state.fleet);
  const { loading, userDetailResponse, listUser, params } = useSelector(
    (state) => state.user,
  );

  const [modal, setModal] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [modalAddRoleVisible, setModalAddRoleVisible] = useState(false);

  const {
    statusPage,
    currentTab,
    isInspector,
    handleSetActiveTabs,
    handleSetCurrentTab,
  } = useContext(UserContext);
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const dispatch = useDispatch();

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.UserProfile,
    modulePage: getCurrentModulePageByStatus(true),
  });

  const isParentCompany = useMemo(() => {
    const company = userInfo?.parentCompanyId || userInfo?.companyId;
    return userDetailResponse?.parentCompanyId === company;
  }, [
    userDetailResponse?.parentCompanyId,
    userInfo?.companyId,
    userInfo?.parentCompanyId,
  ]);

  useEffectOnce(() => {
    dispatch(
      getUserManagementDetailActions.request({ id, isUserProfile: true }),
    );
    dispatch(getCountryActions.request({ content: '' }));
    handleSetActiveTabs([
      TabName.ACCOUNT_INFORMATION,
      TabName.AVAILABLE_AREA,
      TabName.PASSWORD,
      TabName.INSPECTOR_DETAIL,
      TabName.ROLE_AND_PERMISSION,
    ]);

    return () => {
      dispatch(clearUserManagementDetailReducer());
    };
  });

  useEffect(() => {
    if (isInspector) {
      dispatch(getListTravelDocumentActions.request({ id }));
      dispatch(
        getListProvidedInspectionActions.request({
          id,
          companyId: userInfo?.companyId,
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
    if (isFirstLoad && userDetailResponse && userInfo) {
      // avatar: userDetailResponse?.avatar,
      setValue('accountInformation.firstName', userDetailResponse?.firstName);
      setValue('accountInformation.lastName', userDetailResponse?.lastName);
      setValue('accountInformation.jobTitle', userDetailResponse?.jobTitle);
      if (
        RoleScope.User !== userInfo.roleScope &&
        userDetailResponse?.companyId
      ) {
        setValue('accountInformation.companyId', userDetailResponse?.companyId);
      }
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

      setValue(
        'roles',
        userDetailResponse?.roles?.map((item) => item.id) || [],
      );
      setIsFirstLoad(false);
    }
  }, [
    userDetailResponse,
    statusPage,
    listCompany,
    isFirstLoad,
    setValue,
    userInfo,
  ]);

  const formatDataForm = useCallback(
    (data: CreateUserParamsContext) => {
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

      const params: CreateUserParams = {
        ...accountInformation,
        townOrCity: accountInformation?.townOrCity?.trim() || '',
        address: accountInformation?.address?.trim() || '',
        postCode: accountInformation?.postCode?.trim() || '',
        addressLine2: accountInformation?.addressLine2?.trim() || '',
        country: accountInformation?.country?.map((i) => i.value).join(''),
        // switchableCompanies: switchableCompanies?.map((i) => i?.value) || [],
        nationality: accountInformation?.nationality
          ?.map((i) => i.value)
          .join(''),
        stateOrProvince: accountInformation?.stateOrProvince
          ?.map((i) => i.value)
          .join(''),
        ...other,
        availableAreas: isInspector ? listAvailableAreas : [],
      };
      delete params.companyId;
      delete params.parentCompanyId;
      if (params.phoneNumber === '') {
        delete params.phoneNumber;
      }
      return params;
    },
    [isInspector, setValue],
  );

  const handleSubmitAccount = useCallback(
    (dataForm: CreateUserParamsContext) => {
      if (isEmpty(errors)) {
        const params = formatDataForm(dataForm);
        dispatch(
          updateUserProfileActions.request({
            id,
            data: {
              ...params,
              secondaryPhoneNumber: params?.secondaryPhoneNumber || null,
            },
            handleSuccess: () => {
              dispatch(getUserProfileMe.request());
              handleSetCurrentTab(TabName.PASSWORD);
            },
          }),
        );
      }
    },
    [dispatch, errors, formatDataForm, handleSetCurrentTab, id],
  );

  // const handleSubmitPassword = useCallback(
  //   (dataForm: CreateUserParamsContext) => {
  //     handleSetCurrentTab(TabName.ROLE_AND_PERMISSION);
  //   },
  //   [handleSetCurrentTab],
  // );

  const handleSubmitRoles = useCallback(
    (dataForm: CreateUserParamsContext, keepCurrentPage?: boolean) => {
      if (isEmpty(errors)) {
        const params = formatDataForm(dataForm);
        dispatch(
          updateUserProfileActions.request({
            id,
            data: params,
            handleSuccess: () => {
              dispatch(
                getUserManagementDetailActions.request({
                  id,
                  isUserProfile: true,
                }),
              );
              if (
                isInspector &&
                userInfo.roleScope !== RoleScope.SuperAdmin &&
                !keepCurrentPage
              ) {
                handleSetCurrentTab(TabName.AVAILABLE_AREA);
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
    (data: CreateUserParamsContext) => {
      if (isEmpty(errors)) {
        const params = formatDataForm(data);
        dispatch(
          updateUserProfileActions.request({
            id,
            data: params,
            handleSuccess: () => {
              handleSetCurrentTab(TabName.INSPECTOR_DETAIL);
            },
          }),
        );
      }
    },
    [dispatch, errors, formatDataForm, handleSetCurrentTab, id],
  );

  const renderTab = () => {
    switch (currentTab) {
      case TabName.ACCOUNT_INFORMATION:
        return (
          <AccountInformation
            onSubmit={handleSubmitAccount}
            dynamicLabels={dynamicLabels}
          />
        );

      case TabName.PASSWORD:
        return (
          <Password
            // onSubmit={handleSubmitPassword}
            dynamicLabels={dynamicLabels}
          />
        );
      case TabName.ROLE_AND_PERMISSION:
        if (!userInfo?.parentCompanyId && isParentCompany) {
          return (
            <RoleAndPermissionWithAdmin
              setModalAddRoleVisible={setModalAddRoleVisible}
              modalAddRoleVisible={modalAddRoleVisible}
              onSubmit={handleSubmitRoles}
            />
          );
        }
        return (
          <RoleAndPermission
            onSubmit={handleSubmitRoles}
            dynamicLabels={dynamicLabels}
          />
        );
      case TabName.AVAILABLE_AREA:
        return (
          <AvailableArea
            onSubmit={handleSubmitAvailableArea}
            dynamicLabels={dynamicLabels}
          />
        );
      case TabName.INSPECTOR_DETAIL:
        return <InspectorDetail dynamicLabels={dynamicLabels} />;
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
      <div className={cx('w-100', styles.wrapContainer)}>
        <header className={styles.titleHeader}>
          <span>
            {renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Edit User Profile'],
            )}
          </span>
          <div>{titleTab}</div>
        </header>

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
          dynamicLabels={dynamicLabels}
        />
      </div>
    </div>
  );
};

export default UserManagementContainer;
