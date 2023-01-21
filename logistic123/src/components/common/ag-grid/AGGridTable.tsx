import { FC, Suspense, lazy } from 'react';
import { SharedProps } from 'ag-grid-react';
import { AGGridTableProps } from './AGGridCore';

const LazyAg = lazy(() => import('./AGGridCore'));

const AgTable: FC<AGGridTableProps & SharedProps> = (props) => (
  <Suspense fallback={<div />}>
    <LazyAg {...props} />
  </Suspense>
);

export default AgTable;
