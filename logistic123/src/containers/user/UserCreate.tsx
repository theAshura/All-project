import UserCreateContainer from 'components/user/create/index';
import UserProvider from 'contexts/user/UserContext';

const UserCreate = () => (
  <UserProvider>
    <UserCreateContainer />
  </UserProvider>
);
export default UserCreate;
