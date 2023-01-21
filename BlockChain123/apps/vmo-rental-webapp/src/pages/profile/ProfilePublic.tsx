import { ReactComponent as IcForRent } from '@assets/images/common/ic_forRent.svg';
import { ReactComponent as IcRentals } from '@assets/images/common/ic_rentals.svg';
import NavTabs, { NavTab } from '@components/Route/NavTabs';
import { PROFILE_ROUTES, ROUTES } from '@constants/routes';
import { TabProps } from '@containers/profile/components/TabContent';
import Profile from '@containers/profile/Profile';
import { useAuth } from '@context/auth';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { authApi, UserInfo } from '@namo-workspace/services';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export interface ListedRecentUser {
  id: string;
  name: string;
  img: string;
}

const ProfilePublic = () => {
  const { address } = useParams();
  const [infoProfile, setInfoProfile] = useState<UserInfo>();
  const { userInfo } = useAuth();
  const [userListed, setUserListed] =
    useLocalStorage<ListedRecentUser[]>('userListed');

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const navTabs: NavTab[] = useMemo(
    () => [
      {
        path: PROFILE_ROUTES.FOR_RENT,
        label: 'FOR RENT',
        icon: <IcForRent />,
      },
      {
        path: PROFILE_ROUTES.RENTALS,
        label: 'RENTALS',
        icon: <IcRentals />,
      },
    ],

    []
  );

  const fetchAPIProfile = useCallback(async () => {
    if (address) {
      setIsLoading(true);

      const resInfoProfile = await authApi.getUserInfoPublic(address);
      let listRecentTopUser = [];
      try {
        listRecentTopUser = JSON.parse(
          localStorage.getItem('userListed') || '[]'
        );
      } catch (e) {}

      const isTrue = listRecentTopUser.some(function (el: { id: string }) {
        return el?.id === resInfoProfile?.id;
      });
      !isTrue &&
        setUserListed([
          ...(userListed ?? []),
          {
            id: resInfoProfile?.id ? resInfoProfile?.id : '',
            name: resInfoProfile?.name ? resInfoProfile?.name : '',
            img: resInfoProfile?.coverImage ? resInfoProfile?.coverImage : '',
          },
        ]);

      setInfoProfile(resInfoProfile);

      setIsLoading(false);
    }
  }, [address, setUserListed, userListed]);

  useEffect(() => {
    if (address === userInfo?.address) {
      navigate(ROUTES.PROFILE);
    }
  }, [address, navigate, userInfo]);

  useEffect(() => {
    fetchAPIProfile();
  }, []);

  return (
    <Profile
      userInfo={infoProfile}
      statusPublic={true}
      address={address}
      isLoading={isLoading}
    >
      <NavTabs<TabProps> tabs={navTabs} statusPublic={true} address={address} />
    </Profile>
  );
};

export default ProfilePublic;
