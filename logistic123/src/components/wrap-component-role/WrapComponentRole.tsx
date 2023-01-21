import NoPermissionComponent from 'containers/no-permission/index';
import { FC, ReactElement, useMemo } from 'react';
// import jwt_decode from 'jwt-decode';
// import { JWTDecode } from 'models/api/authentication.model';
// import { useSelector } from 'react-redux';
import { RoleScope } from 'constants/roleAndPermission.const';

interface WrapComponentRoleProp {
  roleScope?: string;
  componentContainer: ReactElement;
  hasMainUser?: boolean;
}

// const MAIN_COMPANY = 'Main Company';

const WrapComponentRole: FC<WrapComponentRoleProp> = ({
  roleScope = RoleScope.Admin,
  hasMainUser = true,
  componentContainer,
}) => {
  // const { userInfo } = useSelector((store) => store.authenticate);
  // const dataToken: JWTDecode = useMemo(
  //   () => jwt_decode(userInfo?.token),
  //   [userInfo],
  // );
  // const isUserMain = useMemo(() => {
  //   if (userInfo?.roleScope === RoleScope.User) {
  //     return dataToken?.companyLevel === MAIN_COMPANY;
  //   }
  //   return false;
  // }, [dataToken?.companyLevel, userInfo?.roleScope]);

  const displayComponent = useMemo(
    () =>
      // if (hasMainUser) {
      //   return userInfo?.roleScope === roleScope || isUserMain;
      // }
      // return userInfo?.roleScope === roleScope;
      true,
    [],
  );

  return (
    <>{displayComponent ? componentContainer : <NoPermissionComponent />}</>
  );
};

export default WrapComponentRole;
