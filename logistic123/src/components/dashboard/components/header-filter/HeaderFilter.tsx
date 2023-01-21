import { FC } from 'react';
import SelectUI from 'components/ui/select/Select';
import cx from 'classnames';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { ENTITY_TYPE_OPTIONS } from '../../../map-view/filter-map-view/filter.const';
import { IFilter } from '../../auditors/DashBoardAuditorsContainer';

interface Props {
  onChangeFilter: (e: IFilter) => void;
  filter: IFilter;
  className?: string;
  dynamicLabels?: IDynamicLabel;
}

const HeaderFilter: FC<Props> = ({
  onChangeFilter,
  className,
  dynamicLabels,
  filter,
}) => (
  <SelectUI
    data={ENTITY_TYPE_OPTIONS?.map((item) => ({
      ...item,
      label: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS[item?.label],
      ),
    }))}
    className={cx(className)}
    onChange={(e: string) => {
      onChangeFilter({ ...filter, entity: e === 'All' ? undefined : e });
    }}
    value={filter?.entity || 'All'}
    notAllowSortData
  />
);

export default HeaderFilter;
