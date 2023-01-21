import { FC } from 'react';
import Select from 'components/ui/select/Select';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import Input from 'components/ui/input/Input';
import { statusAllOptions } from 'constants/filter.const';

import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { KeyPress } from 'constants/common.const';
import styles from './list.module.scss';

interface RoleAndPermissionFilterProps {
  handleChangeSearchValue: (field: string, value: string | number) => void;
  handleClearSearchValue: () => void;
  handleGetList: () => void;
  content: string;
  status: string | number;
  disable: boolean;
}

const AuthorityMasterFilter: FC<RoleAndPermissionFilterProps> = (props) => {
  const {
    handleChangeSearchValue,
    handleClearSearchValue,
    handleGetList,
    content,
    status,
    disable,
  } = props;
  const { t } = useTranslation(I18nNamespace.AUTHORITY_MASTER);
  const onKeyUp = (e) => {
    if (e.keyCode === KeyPress.ENTER) {
      handleGetList();
    }
  };

  return (
    <div className={styles.wrapperFilter}>
      <Input
        renderPrefix={
          <img src={images.icons.menu.icSearchInActive} alt="buttonReset" />
        }
        onKeyUp={onKeyUp}
        label={t('txSearch')}
        className={styles.inputSearch}
        onChange={(e) => handleChangeSearchValue('search', e.target.value)}
        value={content}
        disabled={disable}
        maxLength={128}
        styleLabel={styles.labelFilter}
        placeholder="Search"
      />
      <div className={styles.wrapAction}>
        <div className={styles.wrapSelect}>
          <Select
            labelSelect={t('txStatusFilter')}
            data={statusAllOptions}
            value={status}
            disabled={disable}
            className={styles.inputSelect}
            styleLabel={styles.labelFilter}
            onChange={(value) => handleChangeSearchValue('status', value)}
          />
        </div>
        <Button
          className={styles.buttonFilter}
          onClick={() => handleGetList()}
          disabled={disable}
          buttonType={ButtonType.Outline}
          buttonSize={ButtonSize.Medium}
        >
          Search
        </Button>
        <Button
          onClick={() => handleClearSearchValue()}
          buttonType={ButtonType.OutlineDangerous}
          buttonSize={ButtonSize.Medium}
          className={styles.buttonFilter}
          disabledCss={content?.trim()?.length === 0 && status === 'all'}
          disabled={
            disable || (content?.trim()?.length === 0 && status === 'all')
          }
        >
          Clear all
        </Button>
      </div>
    </div>
  );
};

export default AuthorityMasterFilter;
