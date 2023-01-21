import { useEffect, useState } from 'react';
import { toastError } from 'helpers/notification.helper';
import { IEmailCompanyConfig } from 'models/store/company/company.model';
import { getEmailCompanyConfigApi } from 'api/company.api';

const useEmailCompanyConfig = () => {
  const [loading, setLoading] = useState(false);
  const [emailCompany, setEmailCompany] = useState<IEmailCompanyConfig>(null);
  useEffect(() => {
    setLoading(true);
    getEmailCompanyConfigApi()
      .then((res) => {
        setLoading(false);
        setEmailCompany(res?.data || null);
      })
      .catch((err) => {
        toastError(err);
        setLoading(false);
      });
  }, []);
  return {
    loading,
    emailCompany,
  };
};

export default useEmailCompanyConfig;
