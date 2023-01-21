import UserManagementContainer from 'components/user/details/index';
import TabsProvider from 'contexts/user/UserContext';

const UserDetail = () => (
  <TabsProvider>
    <UserManagementContainer />
  </TabsProvider>
);

export default UserDetail;
