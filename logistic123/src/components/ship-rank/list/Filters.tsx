import cx from 'classnames';
import { FC } from 'react';
import Select from 'components/ui/select/Select';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { statusAllOptions } from 'constants/filter.const';
import images from 'assets/images/images';
import Input from 'components/ui/input/Input';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { KeyPress } from 'constants/common.const';
import styles from './list.module.scss';

interface CharterOwnerFilterProps {
  handleChangeSearchValue: (field: string, value: string | number) => void;
  handleClearSearchValue: () => void;
  handleGetList: () => void;
  content: string;
  status: string;
  disable: boolean;
}

const UserManagementFilter: FC<CharterOwnerFilterProps> = ({
  handleChangeSearchValue,
  handleClearSearchValue,
  handleGetList,
  content,
  status,
  disable,
}) => {
  const { t } = useTranslation(I18nNamespace.CHARTER_OWNER);

  const onKeyUp = (e) => {
    if (e.keyCode === KeyPress.ENTER) {
      handleGetList(); // search
    }
  };
  return (
    <div className={styles.wrapperFilter}>
      <Input
        renderPrefix={
          <img src={images.icons.menu.icSearchInActive} alt="buttonReset" />
        }
        onKeyUp={onKeyUp}
        label="Search"
        className={styles.inputSearch}
        onChange={(e) => handleChangeSearchValue('search', e.target.value)}
        value={content}
        disabled={disable}
        maxLength={128}
        placeholder="Search"
      />
      <div className={styles.wrapSelect}>
        <div className={styles.labelFilter}>{t('status')}</div>
        <Select
          data={statusAllOptions}
          value={status}
          disabled={disable}
          className={styles.inputSelect}
          onChange={(value) => handleChangeSearchValue('status', value)}
        />
      </div>
      <Button
        className={cx(styles.buttonFilter, 'ms-0')}
        buttonType={ButtonType.Outline}
        buttonSize={ButtonSize.Medium}
        onClick={() => handleGetList()} // search
        disabled={disable}
      >
        Search
      </Button>
      <Button
        onClick={() => handleClearSearchValue()} // default
        buttonType={ButtonType.OutlineDangerous}
        className={styles.buttonFilter}
        buttonSize={ButtonSize.Medium}
        disabledCss={content?.trim()?.length === 0 && status === 'all'}
        disabled={
          disable || (content?.trim()?.length === 0 && status === 'all')
        }
      >
        {t('clearAll')}
      </Button>
    </div>
  );
};

export default UserManagementFilter;
