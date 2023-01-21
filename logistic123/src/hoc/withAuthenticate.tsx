import { AuthRouteConst, AppRouteConst } from 'constants/route.const';
import { ComponentClass, FC } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';

interface WithAuthenticateOption {
  needAuthenticated?: boolean;
  unMatchingRedirect?: string;
}

export default function withAuthenticate(
  InnerComponent: ComponentClass<any> | FC,
  customOptions?: WithAuthenticateOption,
): FC {
  const options = {
    needAuthenticated: true,
    ...customOptions,
  };

  if (!options.unMatchingRedirect) {
    options.unMatchingRedirect = options.needAuthenticated
      ? AuthRouteConst.SIGN_IN
      : AppRouteConst.DASHBOARD;
  }

  const WithAuthenticate = (props) => {
    const isAuthenticate = useSelector((state) => !!state.authenticate.token);

    const { ...otherProps } = props;
    if (options.needAuthenticated !== isAuthenticate) {
      return (
        <Redirect
          to={{
            pathname: options.unMatchingRedirect,
          }}
          push
        />
      );
    }
    return <InnerComponent {...otherProps} />;
  };
  return WithAuthenticate;
}
