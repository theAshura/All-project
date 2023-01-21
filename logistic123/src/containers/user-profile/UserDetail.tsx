import UserManagementContainer from 'components/user-profile/details/index';
import TabsProvider from 'contexts/user-profile/UserContext';

const UserDetail = () => (
  <TabsProvider>
    <UserManagementContainer />
  </TabsProvider>
);

export default UserDetail;
