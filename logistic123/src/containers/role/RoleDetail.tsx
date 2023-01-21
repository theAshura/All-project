import RoleDetailContainer from 'components/role/details/index';
import RoleAndPermissionProvider from '../../contexts/role/RoleContext';

const RoleDetail = () => (
  <RoleAndPermissionProvider>
    <div>
      <RoleDetailContainer />
    </div>
  </RoleAndPermissionProvider>
);

export default RoleDetail;
