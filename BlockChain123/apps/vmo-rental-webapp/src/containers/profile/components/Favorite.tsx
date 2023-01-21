import { useAuth } from '@context/auth';
import { FC } from 'react';
import { USER_DATA_TABS } from '../constants';
import TabContent from './TabContent';

const Favorite: FC = () => {
  const { userInfo } = useAuth();

  return (
    <TabContent address={userInfo?.address} tab={USER_DATA_TABS.FAVORITE} />
  );
};

export default Favorite;
