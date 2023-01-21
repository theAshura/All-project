import { toastError } from 'helpers/notification.helper';
import { useEffect, useState } from 'react';

import { OptionProp } from 'components/ui/select/Select';

import { getListSubCompanyApi } from '../api/fleet.api';

const useListSubCompany = (params?: any) => {
  const [loading, setLoading] = useState(false);
  const [listSubCompany, setListSubCompany] = useState<OptionProp[]>([]);
  useEffect(() => {
    setLoading(true);
    getListSubCompanyApi(params)
      .then((res) => {
        setLoading(false);
        const dataState =
          res?.data?.map((i) => ({ value: i.id, label: i.name })) || [];
        setListSubCompany([{ value: 'all', label: 'All' }, ...dataState]);
      })
      .catch((err) => {
        toastError(err);
        setListSubCompany([{ value: 'all', label: 'All' }]);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    listSubCompany,
  };
};

export default useListSubCompany;
