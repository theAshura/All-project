import NotFound from 'components/not-found';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';

const NotFoundContainer = () => {
  const { token } = useSelector((state) => state.authenticate);

  if (token?.length === 0) {
    return <Redirect to="/auth/login" />;
  }
  return <NotFound />;
};

export default NotFoundContainer;
