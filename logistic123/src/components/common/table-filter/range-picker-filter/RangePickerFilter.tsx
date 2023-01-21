import { FC } from 'react';
import cx from 'classnames';
import { Moment } from 'moment';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { DateTimeRangePicker } from 'components/ui/datepicker/Datepicker';

import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import styles from '../tableFilter.module.scss';

interface RangePickerFilterProps {
  handleGetList?: () => void;
  disable?: boolean;
  onChangeRange?: (dates: Moment[]) => void;
  valueDateRange?: Moment[];
  typeRange: string;
  setTypeRange?: (typeRange: string) => void;
  isBgr?: boolean;
  className?: string;
  isQuickSearchDatePicker?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const RangePickerFilter: FC<RangePickerFilterProps> = (props) => {
  const {
    typeRange,
    setTypeRange,
    handleGetList,
    disable,
    onChangeRange,
    valueDateRange,
    isBgr,
    className,
    isQuickSearchDatePicker = false,
    dynamicLabels,
  } = props;

  return (
    <div
      className={cx(
        styles.wrapperFilter,
        styles.wrapperFilterDate,
        {
          [styles.wrapperFilterWhite]: isBgr,
        },
        className,
      )}
    >
      <div className="d-flex align-items-end">
        <div className={styles.dateTimeRangePicker}>
          <DateTimeRangePicker
            onChangeRange={onChangeRange}
            wrapperClassName="w-100"
            rangePickerClassName="w-100"
            valueDateRange={valueDateRange}
            separator={<div>-</div>}
            disabled={disable}
            typeRange={typeRange}
            setTypeRange={setTypeRange}
          />
        </div>
        {!isQuickSearchDatePicker && (
          <Button
            className={styles.buttonFilter}
            onClick={handleGetList}
            disabled={disable}
            buttonType={ButtonType.Outline}
            buttonSize={ButtonSize.Medium}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Search)}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RangePickerFilter;
