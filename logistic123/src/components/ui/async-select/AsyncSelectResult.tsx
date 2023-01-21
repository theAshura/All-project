import SelectResult, {
  Position,
} from 'components/common/select-result/SelectResult';
import NewAsyncSelect, {
  NewAsyncOptions,
  NewAsyncSelectProps,
} from 'components/ui/async-select/NewAsyncSelect';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useEffect, useState } from 'react';

export interface AsyncSelectResultProps extends NewAsyncSelectProps {
  handleChangeResult?: (value: NewAsyncOptions[]) => void;
  result?: Array<NewAsyncOptions>;
  disabled?: boolean;
  showResult?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const AsyncSelectResult: FC<AsyncSelectResultProps> = (props) => {
  const {
    result,
    handleChangeResult,
    disabled,
    showResult,
    dynamicLabels,
    ...other
  } = props;
  const [value, setValue] = useState<Array<NewAsyncOptions>>(result || []);
  const removeItem = (itemRemove) => {
    setValue((e) => e.filter((item) => item.value !== itemRemove));
    handleChangeResult(value.filter((item) => item.value !== itemRemove));
  };

  const handleClearAll = () => {
    setValue([]);
    handleChangeResult([]);
  };

  const handleChange = (newValue) => {
    handleChangeResult(newValue);
    setValue(newValue);
  };

  useEffect(() => {
    setValue(result);
  }, [result]);

  return (
    <div>
      <NewAsyncSelect
        handleConfirm={handleChange}
        disabled={disabled}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        value={value}
        dynamicLabels={dynamicLabels}
        {...other}
      />
      {(value?.length > 0 || showResult) && (
        <div style={{ paddingTop: '10px' }}>
          <SelectResult
            position={Position.VERTICAL}
            title={
              <div className="d-flex">
                <span>
                  {`${renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Selected,
                  )}:`}
                </span>
              </div>
            }
            disabled={disabled}
            listItem={value}
            handelClearItem={(value) => {
              if (!disabled) {
                removeItem(value);
              }
            }}
            handelClearAll={() => {
              if (!disabled) {
                handleClearAll();
              }
            }}
            dynamicLabels={dynamicLabels}
          />
        </div>
      )}
    </div>
  );
};
export default AsyncSelectResult;
