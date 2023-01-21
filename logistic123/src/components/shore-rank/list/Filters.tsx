import { FC } from 'react';
import cx from 'classnames';
import Select from 'components/ui/select/Select';
import Button, { ButtonType } from 'components/ui/button/Button';
import { statusAllOptions } from 'constants/filter.const';
import images from 'assets/images/images';
import Input from 'components/ui/input/Input';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { KeyPress } from 'constants/common.const';
import styles from './list.module.scss';

interface ShoreRankFilterProps {
  handleChangeSearchValue: (field: string, value: string | number) => void;
  handleClearSearchValue: () => void;
  handleGetList: () => void;
  content: string;
  status: string;
  disable: boolean;
}

const ShoreRankFilter: FC<ShoreRankFilterProps> = ({
  handleChangeSearchValue,
  handleClearSearchValue,
  handleGetList,
  content,
  status,
  disable,
}) => {
  const { t } = useTranslation([
    I18nNamespace.SHORE_RANK,
    I18nNamespace.COMMON,
  ]);

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
        label="Search"
        className={styles.inputSearch}
        onChange={(e) => handleChangeSearchValue('search', e.target.value)}
        value={content}
        disabled={disable}
        maxLength={128}
        placeholder="Search"
      />
      <div className={styles.wrapAction}>
        <div className={styles.wrapSelect}>
          <Select
            labelSelect={t('buttons.txStatus')}
            data={statusAllOptions}
            value={status}
            disabled={disable}
            className={styles.inputSelect}
            onChange={(value) => handleChangeSearchValue('status', value)}
          />
        </div>
        <Button
          buttonType={ButtonType.Outline}
          className={cx(styles.buttonFilter, 'ms-0')}
          onClick={() => handleGetList()}
          disabled={disable}
        >
          Search
        </Button>
        <Button
          onClick={() => handleClearSearchValue()}
          buttonType={ButtonType.OutlineDangerous}
          className={styles.buttonFilter}
          disabledCss={content?.trim()?.length === 0 && status === 'all'}
          disabled={
            disable || (content?.trim()?.length === 0 && status === 'all')
          }
        >
          {t('buttons.txClearAll')}
        </Button>
      </div>
    </div>
  );
};

export default ShoreRankFilter;
