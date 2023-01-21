import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import NoPermission from 'components/no-permission';

const NoPermissionContainer = () => {
  const { token } = useSelector((state) => state.authenticate);

  if (token?.length === 0) {
    return <Redirect to="/auth/login" />;
  }
  return <NoPermission />;
};

export default NoPermissionContainer;
