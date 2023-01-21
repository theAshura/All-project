import { FC, useEffect, useState } from 'react';
import cx from 'classnames';
import upperFirst from 'lodash/upperFirst';
import { Province } from 'models/store/user/user.model';
import images from 'assets/images/images';
import { Modal } from 'reactstrap';
import { useSelector } from 'react-redux';
import ResultsButton from 'components/ui/async-select/results-button/ResultsButton';
import { DataObj } from 'models/common.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';

import styles from './modal.module.scss';

interface SubmitData {
  country: DataObj;
  ports: DataObj[];
}

interface ModalAvailableAreaProps {
  modal: boolean;
  toggle: () => void;
  handleSubmit: (data: SubmitData) => void;
  loadingModal?: boolean;
  title?: string;
  isDelete?: boolean;
  type?: string;
  defaultCountry?: DataObj;
  defaultPorts?: DataObj[];
  isShowOptions?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const emptyOptions: DataObj[] = [];

const ModalAvailableShow: FC<ModalAvailableAreaProps> = (props) => {
  const {
    toggle,
    modal,
    type,
    defaultCountry,
    defaultPorts = emptyOptions,
    dynamicLabels,
  } = props;
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { listProvince } = useSelector((state) => state.user);

  const [provinceSelect, setProvinceSelect] = useState<DataObj[]>(defaultPorts);
  useEffect(() => {
    if (modal) {
      setProvinceSelect(defaultPorts);
    }
  }, [defaultPorts, defaultCountry, modal]);

  useEffect(() => {
    if (!modal) {
      setIsFirstLoad(true);
    }
  }, [modal]);

  useEffect(() => {
    if (
      isFirstLoad &&
      modal &&
      defaultPorts &&
      defaultPorts[0]?.label?.toString()?.length === 0
    ) {
      const newData =
        defaultPorts?.map((item) => {
          const dataFilter: Province[] = listProvince?.filter(
            (i) => i?.id?.toString() === item?.value?.toString(),
          );
          if (dataFilter) {
            return {
              value: dataFilter[0]?.id?.toString(),
              label: dataFilter[0]?.name,
            };
          }
          return item;
        }) || [];
      setProvinceSelect([...newData]);
      setIsFirstLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listProvince, defaultPorts]);

  const renderResult = () => (
    <>
      {provinceSelect.map((i, index) => (
        <ResultsButton
          className="mt-2 me-2"
          key={index.toString() + String(i.value)}
          hiddenImage
          disabled
          value={i.value}
          label={i.content}
        />
      ))}
    </>
  );

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      modalClassName={cx(styles.wrapper)}
      contentClassName={cx(styles.content)}
      className={styles.customModal}
      fade={false}
      style={{ height: '100%' }}
    >
      <div
        className={cx(
          'd-flex align-items-center justify-content-between',
          styles.header,
        )}
      >
        <span>{`${upperFirst(type)} preference`}</span>
        <div className={styles.icClose} onClick={toggle}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <div className={cx(styles.container)}>
        <div className="d-flex w-100">
          <img
            className={styles.countryFlag}
            src={defaultCountry?.image || images.common.avatarDefault}
            alt="avatar"
          />

          <div className={cx('text-start', styles.country)}>
            <p className="mb-0">{defaultCountry?.label}</p>
            <p className={styles.ports}>{`${
              defaultPorts?.length
            } ${renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.ports,
            )}`}</p>
          </div>
        </div>
        <div className={styles.driver} />
        <p className={styles.titleResults}>Selected ports </p>
        <div className={cx('d-flex flex-wrap', styles.listResult)}>
          {renderResult()}
        </div>
      </div>
    </Modal>
  );
};

export default ModalAvailableShow;
