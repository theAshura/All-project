import Tooltip from 'antd/lib/tooltip';
import cx from 'classnames';
import NewAsyncSelect, {
  NewAsyncOptions,
} from 'components/ui/async-select/NewAsyncSelect';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { filterContentSelect } from 'helpers/filterSelect.helper';
import isEqual from 'lodash/isEqual';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { DataObj } from 'models/common.model';
import { memo, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../modal-list.module.scss';

export interface RowLabelType {
  label: string;
  id: string;
  width: number | string;
}

export interface RowTableProps {
  data: DataObj;
  indexItem: number;
  id: string;
  hideCheckBox?: boolean;
  styleRow?: Object;
  rowLabels: RowLabelType[];
  handleConfirm: (dataValue: NewAsyncOptions[]) => void;
  disabled: boolean;
  firstError: boolean;
  dynamicLabels?: IDynamicLabel;
}

const RowModalCp = ({
  data,
  indexItem,
  id,
  rowLabels,
  styleRow,
  handleConfirm,
  disabled,
  firstError,
  dynamicLabels,
}: RowTableProps) => {
  const { loading, listValueManagements } = useSelector(
    (state) => state.valueManagement,
  );
  const [templateOptions, setTemplateOptions] = useState([]);

  const provinceOptionProps: NewAsyncOptions[] = useMemo(
    () =>
      listValueManagements?.data?.map((item) => ({
        value: item?.id || '',
        label: item?.number?.toString() || '',
      })) || [],
    [listValueManagements],
  );

  const onChangeSearchState = useCallback(
    (value: string) => {
      const newData = filterContentSelect(value, provinceOptionProps || []);
      setTemplateOptions(newData);
    },
    [provinceOptionProps],
  );

  const valueSelect = useMemo(() => {
    const dataSelect = provinceOptionProps?.find(
      (p) => p.value === data?.idValue,
    );
    return dataSelect ? [dataSelect] : [];
  }, [data?.idValue, provinceOptionProps]);

  return (
    <div
      id={`value_${indexItem}`}
      style={styleRow || {}}
      className={cx(styles.wrapRow, 'd-flex align-items-center')}
    >
      <div
        style={{ width: rowLabels[0].width }}
        className={cx(styles.checkBox, 'ps-3')}
      >
        {indexItem + 1}
      </div>

      <div
        style={{ width: rowLabels[1].width }}
        className="limit-line-text ps-3"
      >
        <Tooltip placement="topLeft" destroyTooltipOnHide title={data.value}>
          {data.value || '   '}
        </Tooltip>
      </div>
      <div style={{ width: rowLabels[2].width }} className="ps-3 py-2">
        <NewAsyncSelect
          disabled={loading || disabled}
          titleResults={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Selected value'],
          )}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Please select'],
          )}
          dynamicLabels={dynamicLabels}
          searchContent={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Value,
          )}
          textSelectAll={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Select all'],
          )}
          value={valueSelect}
          onChangeSearch={onChangeSearchState}
          options={templateOptions}
          handleConfirm={(value) => handleConfirm(value)}
        />
        {firstError && !valueSelect?.length && (
          <div className="message-required mt-2">
            {renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Please add value for answer option'],
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const RowModalComponent = memo(RowModalCp, isEqual);
