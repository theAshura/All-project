import SelectResult, {
  Position,
} from 'components/common/select-result/SelectResult';
import { FC, useEffect, useState } from 'react';
import { DataObj } from 'models/common.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import NewAsyncSelect, {
  RowLabelType,
  NewAsyncSelectProps,
} from './NewAsyncSelect';

export interface AsyncSelectTableProps extends NewAsyncSelectProps {
  handleChangeResult?: (value: DataObj[]) => void;
  result?: Array<DataObj>;
  disabled?: boolean;
  showResult?: boolean;
  rowLabels: RowLabelType[];
  dynamicLabels?: IDynamicLabel;
}

const AsyncSelectTable: FC<AsyncSelectTableProps> = (props) => {
  const {
    result,
    handleChangeResult,
    disabled,
    showResult,
    dynamicLabels,
    ...other
  } = props;
  const [value, setValue] = useState<Array<DataObj>>(result || []);
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
          COMMON_DYNAMIC_FIELDS['Please selected'],
        )}
        dynamicLabels={dynamicLabels}
        value={value}
        {...other}
      />
      {(value?.length > 0 || showResult) && (
        <div style={{ paddingTop: '10px' }}>
          <SelectResult
            position={Position.VERTICAL}
            title={
              <div className="d-flex">
                <span>
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Selected,
                  )}
                  :
                </span>
              </div>
            }
            dynamicLabels={dynamicLabels}
            disabled={disabled}
            listItem={value?.map((i) => ({ value: i.value, label: i.content }))}
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
          />
        </div>
      )}
    </div>
  );
};
export default AsyncSelectTable;
