import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import styles from './switch-view.module.scss';

const SwitchView = ({ control, errors }) => {
  const { listChildrenCompany } = useSelector((state) => state.user);
  const [listChildOptions, setListChildrenCompanyOptions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const listOptions = listChildrenCompany?.map((i) => ({
      label: i?.name,
      value: i?.id,
    }));
    setListChildrenCompanyOptions(listOptions);
  }, [listChildrenCompany]);

  return (
    <div>
      <div className={styles.title}>Switch view</div>
      <AsyncSelectResultForm
        multiple
        disabled={false}
        labelSelect="Child company"
        control={control}
        name="switchableCompanies"
        id="switchableCompanies"
        titleResults="Selected"
        placeholder="Please select"
        textSelectAll="Select all"
        messageRequired={errors?.switchableCompanies?.message || ''}
        onChangeSearch={(value: string) => {
          setSearch(value);
        }}
        options={listChildOptions?.filter((i) => i?.label?.includes(search))}
      />
    </div>
  );
};

export default SwitchView;
