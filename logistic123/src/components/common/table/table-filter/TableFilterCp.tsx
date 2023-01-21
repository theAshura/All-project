import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { KeyCode } from 'constants/filter.const';
import { TableFilterProps } from 'models/common.model';
import Button, { ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import Input from 'components/ui/input/Input';
import styles from './table-filter.module.scss';

interface Props extends TableFilterProps {
  renderAdditionalFilter?: () => void;
  disableClearBtn?: boolean;
  disable?: boolean;
}

const TableFilterCp: FC<Props> = (props) => {
  const {
    handleChangeSearchValue,
    handleClearSearchValue,
    handleGetList,
    renderAdditionalFilter,
    searchContent,
    disableClearBtn,
    disable,
  } = props;
  const { t } = useTranslation([I18nNamespace.GROUP, I18nNamespace.COMMON]);

  const onKeyUp = (e) => {
    if (e.keyCode === KeyCode.ENTER) {
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
        label={t('buttons.search')}
        className={styles.inputSearch}
        onChange={(e) => handleChangeSearchValue('search', e.target.value)}
        value={searchContent}
        disabled={disable}
        maxLength={128}
        placeholder={t('buttons.search')}
      />
      <div className={styles.wrapAction}>
        {renderAdditionalFilter && renderAdditionalFilter()}
        <Button
          buttonType={ButtonType.Outline}
          className={styles.buttonFilter}
          onClick={() => handleGetList()}
          disabled={disable}
        >
          {t('buttons.search')}
        </Button>
        <Button
          onClick={() => handleClearSearchValue()}
          buttonType={ButtonType.OutlineDangerous}
          className={styles.buttonFilter}
          disabledCss={disableClearBtn}
          disabled={disableClearBtn}
        >
          {t('buttons.clearAll')}
        </Button>
      </div>
    </div>
  );
};

TableFilterCp.defaultProps = {
  renderAdditionalFilter: undefined,
  disableClearBtn: false,
  disable: false,
};

export default TableFilterCp;
