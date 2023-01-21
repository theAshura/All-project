import { toastError } from 'helpers/notification.helper';
import { useEffect, useState } from 'react';
import { getListEmailUserApiRequest } from '../api/authentication.api';

const useListMailUsers = (params?: any) => {
  const [loading, setLoading] = useState(false);
  const [listEmailUsers, setListEmailUsers] = useState(null);
  useEffect(() => {
    setLoading(true);
    getListEmailUserApiRequest()
      .then((res) => {
        setLoading(false);
        setListEmailUsers(res?.data || []);
      })
      .catch((err) => {
        toastError(err);
        setLoading(false);
      });
  }, []);
  return {
    loading,
    listEmailUsers,
  };
};

export default useListMailUsers;
