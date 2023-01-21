import { RoleScope } from 'constants/roleAndPermission.const';

export const isUserAdminInCompany = (
  idCompanyUser: string,
  roleUser: string,
  idCompanyRoot: string,
  userId: string,
  createdBy: string,
) => {
  if (userId === createdBy) {
    return false;
  }
  return idCompanyRoot === idCompanyUser && roleUser === RoleScope.Admin;
};
