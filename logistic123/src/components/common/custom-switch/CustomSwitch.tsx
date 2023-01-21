import { FC, Suspense, useMemo } from 'react';
import { Route, RouteProps as RRRouteProps, Switch } from 'react-router';
import { v4 } from 'uuid';

interface RRRoutePropsCustom extends RRRouteProps {}

export type RouteProps = RRRoutePropsCustom;

export interface CustomSwitchProps {
  routes: RRRouteProps[];
}

const CustomSwitch: FC<CustomSwitchProps> = (props) => {
  const { routes = [] } = props;
  const uniqueId = useMemo(() => v4(), []);
  return (
    <Suspense fallback={<div />}>
      <Switch>
        {routes.map((i, index) => (
          <Route key={String(index) + uniqueId} {...i} />
        ))}
      </Switch>
    </Suspense>
  );
};

export default CustomSwitch;
