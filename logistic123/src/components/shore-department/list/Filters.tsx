import images from 'assets/images/images';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import Input from 'components/ui/input/Input';
import Select from 'components/ui/select/Select';
import { KeyPress } from 'constants/common.const';
import { statusAllOptions } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './list.module.scss';

interface ShoreDepartmentFilterProps {
  handleChangeSearchValue?: (
    field: string,
    value: string | number | NewAsyncOptions,
  ) => void;
  handleClearSearchValue?: () => void;
  handleGetList?: (isRefreshLoading?: boolean) => void;
  content: string;
  status: string | number;
  disable: boolean;
}

const ShoreDepartmentFilter: FC<ShoreDepartmentFilterProps> = (props) => {
  // state
  const {
    handleChangeSearchValue,
    handleClearSearchValue,
    handleGetList,
    content,
    status,
    disable,
  } = props;
  const { t } = useTranslation([
    I18nNamespace.SHORE_DEPARTMENT,
    I18nNamespace.COMMON,
  ]);

  // function
  const onKeyUp = (e) => {
    if (e.keyCode === KeyPress.ENTER) {
      handleGetList(false);
    }
  };

  return (
    <div className={styles.wrapperFilter}>
      <Input
        renderPrefix={
          <img src={images.icons.menu.icSearchInActive} alt="buttonReset" />
        }
        onKeyUp={onKeyUp}
        label={t('buttons.txSearch')}
        className={styles.inputSearch}
        onChange={(e) => handleChangeSearchValue('search', e.target.value)}
        value={content}
        disabled={disable}
        maxLength={128}
        styleLabel={styles.labelFilter}
        placeholder={t('buttons.txSearch')}
      />
      <div className={styles.wrapAction}>
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
          className={styles.buttonFilter}
          onClick={() => handleGetList(false)}
          disabled={disable}
          buttonType={ButtonType.Outline}
          buttonSize={ButtonSize.Medium}
        >
          {t('buttons.txSearch')}
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
          {t('buttons.txClearAll')}
        </Button>
      </div>
    </div>
  );
};

export default ShoreDepartmentFilter;
