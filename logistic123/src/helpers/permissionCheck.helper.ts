/* eslint-disable no-lonely-if */
import {
  Features,
  SubFeatures,
  RoleScope,
} from 'constants/roleAndPermission.const';
import history from 'helpers/history.helper';
import { AppRouteConst, AuthRouteConst } from 'constants/route.const';
import { LoginSuccessResponse } from 'models/api/authentication.model';
import moment from 'moment';
import { UserAssignments } from 'models/common.model';
import { checkTextSearch } from './utils.helper';

interface Options {
  feature: string;
  subFeature: string;
  action?: string;
}

// Todo: filterByRolePermissiong chua hoan thien, logic check con thieu, can cap nhat them trong tuong lai KHONG DUOC XOA CAI TODO NAY

export const SuperAdminAllowFeatures = [
  `${Features.GROUP_COMPANY}::${SubFeatures.GROUP_MASTER}::`,
  `${Features.GROUP_COMPANY}::${SubFeatures.COMPANY}::`,
  `${Features.USER_ROLE}::${SubFeatures.ROLE_AND_PERMISSION}::`,
  `${Features.USER_ROLE}::${SubFeatures.USER}::`,
];

export const AdminNotAllowFeatures = [
  `${Features.GROUP_COMPANY}::${SubFeatures.GROUP_MASTER}::`,
];

export const SubAdminNotAllowFeatures = [
  `${Features.GROUP_COMPANY}::${SubFeatures.GROUP_MASTER}::`,
  `${Features.GROUP_COMPANY}::${SubFeatures.COMPANY}::`,
];

export const UserNotAllowFeatures = [
  // `${Features.GROUP_COMPANY}::${SubFeatures.GROUP_MASTER}::`,
  // `${Features.GROUP_COMPANY}::${SubFeatures.COMPANY}::`,
  `${Features.USER_ROLE}::${SubFeatures.ROLE_AND_PERMISSION}::`,
  // `${Features.USER_ROLE}::${SubFeatures.USER}::`,
];

export const permissionCheck = (
  userInfo: LoginSuccessResponse,
  options: Options,
  textSearch?: string,
) => {
  const { feature, subFeature, action } = options;
  const { rolePermissions, roleScope, parentCompanyId } = userInfo || {};

  const filterByRolePermission = () => {
    let result: boolean;
    if (action && subFeature) {
      result = rolePermissions.includes(`${feature}::${subFeature}::${action}`);
    } else if (!action && subFeature) {
      result = !!rolePermissions.find((i) =>
        i.startsWith(`${feature}::${subFeature}::`),
      );
    } else {
      result = !!rolePermissions.find((i) => i.startsWith(`${feature}`));
    }
    return result;
  };

  if (roleScope === 'SuperAdmin') {
    if (
      SuperAdminAllowFeatures.includes(`${feature}::${subFeature}::`) &&
      checkTextSearch(textSearch, subFeature)
    ) {
      return true;
    }
    return false;
  }
  if (roleScope === 'Admin') {
    if (!parentCompanyId) {
      if (AdminNotAllowFeatures.includes(`${feature}::${subFeature}::`)) {
        return false;
      }
      const resultFiltered = filterByRolePermission();
      return resultFiltered && checkTextSearch(textSearch, subFeature);
    }
    if (SubAdminNotAllowFeatures.includes(`${feature}::${subFeature}::`)) {
      return false;
    }
    const resultFiltered = filterByRolePermission();
    return resultFiltered && checkTextSearch(textSearch, subFeature);
  }
  if (roleScope === 'User') {
    if (UserNotAllowFeatures.includes(`${feature}::${subFeature}::`)) {
      return false;
    }
    const resultFiltered = filterByRolePermission();
    return resultFiltered && checkTextSearch(textSearch, subFeature);
  }
  return false;
};

export const checkAssignmentPermission = (
  userId: string,
  permission: string,
  listAssignment: UserAssignments[],
) =>
  listAssignment?.some(
    (item) => item?.permission === permission && item?.user?.id === userId,
  );

// export const redirectByRolePermissions = (
//   permissions?: string[],
//   roleScope?: string,
// ) => {
//   if (roleScope === RoleScope.SuperAdmin) {
//     history.replace(AppRouteConst.COMPANY_TYPE);
//     return;
//   }
//   if (
//     permissions?.some((item) =>
//       item.includes(
//         `${Features.MASTER_DASHBOARD}::${Features.MASTER_DASHBOARD}`,
//       ),
//     )
//   ) {
//     history.replace(AppRouteConst.DASHBOARD_MASTER);
//     return;
//   }
//   if (
//     permissions?.some((item) =>
//       item.includes(
//         `${Features.MASTER_DASHBOARD}::${SubFeatures.VIEW_DASHBOARD}`,
//       ),
//     )
//   ) {
//     history.replace(AppRouteConst.DASHBOARD);
//     return;
//   }
//   if (
//     permissions?.some((item) =>
//       item.includes(
//         `${Features.MASTER_DASHBOARD}::${SubFeatures.QA_DASHBOARD}`,
//       ),
//     )
//   ) {
//     history.replace(AppRouteConst.QA_DASHBOARD);
//     return;
//   }

//   const firstPermission = ROLE_AND_PERMISSION_WITH_LINKS.find((item) =>
//     permissions?.[0]?.includes(item.name),
//   );
//   if (firstPermission) {
//     history.replace(firstPermission?.link || '/');
//     return;
//   }
//   history.replace(AppRouteConst.DASHBOARD);
// };

export const redirectByRolePermissions = (
  permissions?: string[],
  roleScope?: string,
) => {
  if (roleScope === RoleScope.SuperAdmin) {
    history.replace(AppRouteConst.COMPANY_TYPE);
    return;
  }
  history.replace(AppRouteConst.HOME_PAGE);
};

export const checkTimeLifePassword = (
  roleScope?: string,
  changePassDate?: string,
) => {
  const dateLeft = moment(changePassDate)?.diff(moment(), 'days');

  if (roleScope === RoleScope.Admin && dateLeft <= 7) {
    history.replace(
      `${AuthRouteConst.RESET_PASSWORD_ROUTINE}?changePassDate=${changePassDate}`,
    );
  }
  if (roleScope === RoleScope.User && dateLeft <= 14) {
    history.replace(
      `${AuthRouteConst.RESET_PASSWORD_ROUTINE}?changePassDate=${changePassDate}`,
    );
  }
};
