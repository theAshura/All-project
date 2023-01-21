import { useCallback, useState, memo } from 'react';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize } from 'components/ui/button/Button';
import images from 'assets/images/images';
import CountryAGList from './List/CountryAGList';
import styles from '../../components/list-common.module.scss';

const CountryContainer = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleClickCreateNewCountry = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  return (
    <div className={styles.wrapper}>
      <HeaderPage breadCrumb={BREAD_CRUMB.COUNTRY} titlePage="Country Master">
        <div className={styles.headerBtnContainer}>
          <Button
            onClick={handleClickCreateNewCountry}
            buttonSize={ButtonSize.Medium}
            className="button_create"
            renderSuffix={
              <img
                src={images.icons.icAddCircle}
                alt="icAddCircle"
                className={styles.icButton}
              />
            }
          >
            Create New
          </Button>
        </div>
      </HeaderPage>
      <CountryAGList
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </div>
  );
};

export default memo(CountryContainer);
