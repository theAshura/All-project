import { useSelector } from 'react-redux';
import {
  Features,
  RoleScope,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { FC, ReactElement, useCallback, useMemo } from 'react';

interface Options {
  feature: string;
  subFeature?: string;
  action?: string;
  disableFeatureChecking?: boolean;
}

// Todo: filterByRolePermissiong chua hoan thien, logic check con thieu, can cap nhat them trong tuong lai KHONG DUOC XOA CAI TODO NAY
// Bây giờ xoá được chưa??????? ¯\_(ツ)_/¯

export const SuperAdminAllowFeatures = [
  `${Features.GROUP_COMPANY}::${SubFeatures.GROUP_MASTER}`,
  `${Features.GROUP_COMPANY}::${SubFeatures.COMPANY}`,
  `${Features.USER_ROLE}::${SubFeatures.ROLE_AND_PERMISSION}`,
  `${Features.USER_ROLE}::${SubFeatures.USER}`,
];

export const AdminNotAllowFeatures = [
  `${Features.GROUP_COMPANY}::${SubFeatures.GROUP_MASTER}`,
];

export const SubAdminNotAllowFeatures = [
  `${Features.GROUP_COMPANY}::${SubFeatures.GROUP_MASTER}`,
  `${Features.GROUP_COMPANY}::${SubFeatures.COMPANY}`,
];

export const UserNotAllowFeatures = [
  `${Features.GROUP_COMPANY}::${SubFeatures.GROUP_MASTER}`,
  // `${Features.GROUP_COMPANY}::${SubFeatures.COMPANY}`,
  `${Features.USER_ROLE}::${SubFeatures.ROLE_AND_PERMISSION}`,
  // `${Features.USER_ROLE}::${SubFeatures.USER}`,
];

interface PermissionCheckProps {
  children({ hasPermission: boolean }): ReactElement;
  options: Options;
}

const PermissionCheck: FC<PermissionCheckProps> = ({ children, options }) => {
  const { feature, subFeature, disableFeatureChecking, action } = options;
  const { userInfo } = useSelector((state) => state.authenticate);
  const { rolePermissions, roleScope, parentCompanyId } = userInfo;
  const filterByRolePermission = useCallback(() => {
    let result: boolean;
    if (feature === Features.HOME_PAGE && roleScope !== RoleScope.SuperAdmin) {
      return true;
    }
    if (action && subFeature) {
      result = rolePermissions.includes(`${feature}::${subFeature}::${action}`);
    } else if (!action && subFeature) {
      result = !!rolePermissions.find((i) =>
        i.startsWith(`${feature}::${subFeature}`),
      );
    } else {
      result = !!rolePermissions.find((i) => i.startsWith(`${feature}`));
    }
    return result;
  }, [feature, roleScope, action, subFeature, rolePermissions]);

  const hasPermission = useMemo<boolean>(() => {
    if (disableFeatureChecking) {
      return true;
    }
    if (roleScope === RoleScope.SuperAdmin) {
      if (SuperAdminAllowFeatures.includes(`${feature}::${subFeature}`)) {
        return true;
      }
      return false;
    }
    if (roleScope === RoleScope.Admin) {
      if (!parentCompanyId) {
        if (AdminNotAllowFeatures.includes(`${feature}::${subFeature}`)) {
          return false;
        }
        const resultFiltered = filterByRolePermission();
        return resultFiltered;
      }
      if (SubAdminNotAllowFeatures.includes(`${feature}::${subFeature}`)) {
        return false;
      }
      const resultFiltered = filterByRolePermission();
      return resultFiltered;
    }
    if (roleScope === RoleScope.User) {
      if (UserNotAllowFeatures.includes(`${feature}::${subFeature}`)) {
        return false;
      }
      const resultFiltered = filterByRolePermission();
      return resultFiltered;
    }
    return false;
  }, [
    disableFeatureChecking,
    roleScope,
    feature,
    subFeature,
    parentCompanyId,
    filterByRolePermission,
  ]);
  return children({ hasPermission });
};

export default PermissionCheck;
