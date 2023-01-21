import AsyncSelectTableProps from 'components/ui/async-select/async-select-table/AsyncSelectTable';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { DataTable } from './ModalAssignment';

interface SelecTable {
  control?: Control;
  messageRequired?: string;
  placeholder?: string;
  dynamicLabels?: IDynamicLabel;
}

const SelectTableProps: FC<DataTable & SelecTable> = (props) => {
  const {
    title,
    name,
    control,
    isRequired,
    dataRows,
    messageRequired,
    dynamicLabels,
    placeholder,
  } = props;

  const rowLabels = [
    {
      label: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['User name'],
      ),
      id: 'userName',
      width: '25%',
    },
    {
      label: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Job title'],
      ),
      id: 'jobTitle',
      width: '25%',
    },
    {
      label: renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Company),
      id: 'company',
      width: '25%',
    },
    {
      label: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Business division'],
      ),
      id: 'businessDivision',
      width: '25%',
    },
  ];

  const [options, setOptions] = useState(dataRows);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <AsyncSelectTableProps
          rowLabels={rowLabels}
          handleChangeResult={field.onChange}
          labelSelect={title}
          dynamicLabels={dynamicLabels}
          handleConfirm={field.onChange}
          result={field.value}
          multiple
          messageRequired={messageRequired}
          isRequired={isRequired}
          disabled={false}
          hasTooltip
          titleResults={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Selected,
          )}
          placeholder={
            placeholder ||
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Please select'],
            )
          }
          searchContent={title}
          textSelectAll={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Select all'],
          )}
          onChangeSearch={(value: string) => {
            const contentSearch = value.trim().toUpperCase();
            const result =
              dataRows.filter((item) =>
                `${item?.userName}${item?.jobTitle}${item?.company}${item?.businessDivision}`
                  .toString()
                  .toUpperCase()
                  .includes(contentSearch),
              ) || [];
            setOptions(result);
          }}
          options={options}
          value={field.value}
        />
      )}
    />
  );
};
export default SelectTableProps;
