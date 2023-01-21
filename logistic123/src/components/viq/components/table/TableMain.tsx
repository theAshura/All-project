/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useCallback, useMemo, useState } from 'react';
import { ViqMainCategory } from 'models/api/viq/viq.model';
import images from 'assets/images/images';
import TableCp from 'components/common/table/TableCp';
import { RowComponent } from 'components/common/table/row/rowCp';
import { Action } from 'models/common.model';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { ButtonType } from 'components/ui/button/Button';

import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { VIQ_FIELDS_DETAILS } from 'constants/dynamic/vessel-inspection-questionnaires.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import styles from './table.module.scss';

interface TableProps {
  data: ViqMainCategory[];
  onDelete: (mainIndex: number) => void;
  isEdit: boolean;
  loading?: boolean;
  onEdit: (data: ViqMainCategory, index: number) => void;
  dynamicLabels?: IDynamicLabel;
}

const TableMainCateGory: FC<TableProps> = ({
  data = [],
  loading,
  isEdit,
  onDelete,
  onEdit,
  dynamicLabels,
}) => {
  const [sort, setSort] = useState<string>('');

  const rowLabels = [
    {
      id: 'action',
      label: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_DETAILS.Action),
      sort: false,
      width: '100',
    },
    {
      id: 'mainCategoryNo',
      label: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_DETAILS['Main reference no.'],
      ),
      sort: true,
      width: '400',
    },
    {
      id: 'mainCategoryName',
      label: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_DETAILS['Main category name'],
      ),
      sort: true,
      width: '400',
    },
    {
      id: 'subCategoryNumber',
      label: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_DETAILS['Sub category number'],
      ),

      sort: true,
      width: '400',
    },
  ];
  const formatValues = (fieldName: string, item: string) => {
    switch (fieldName) {
      case 'mainCategoryName':
        return item;

      default:
        return Number(item);
    }
  };

  const dataTableSub = useMemo(() => {
    const dataResult = data?.map((mainItem, mainIndex) => ({
      ...mainItem,
      mainIndex,
      dateTime: mainItem.dateTime || mainItem.updatedAt || mainItem.createdAt,
    }));

    const sortName = sort?.split(':')[0] || '';
    const sortType = sort?.split(':')[1] || '';
    if (sort) {
      dataResult.sort((current, next) => {
        const currentValue = formatValues(sortName, current[sortName]);
        const nextValue = formatValues(sortName, next[sortName]);

        if (sortType === '1') {
          return currentValue > nextValue ? 1 : -1;
        }
        if (sortType === '-1') {
          return currentValue < nextValue ? 1 : -1;
        }
        return current.dateTime < next.dateTime ? 1 : -1;
      });
    }

    return dataResult;
  }, [data, sort]);

  const sanitizeData = (item: ViqMainCategory) => {
    const finalData = {
      id: item.id,
      mainCategoryNo: item?.mainCategoryNo,
      mainCategoryName: item?.mainCategoryName,
      subCategoryNumber:
        item?.viqSubCategories?.filter((item) => !item.parentId)?.length || 0,
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!dataTableSub.length) {
        return null;
      }
      return (
        <tbody>
          {dataTableSub.map((item) => {
            const finalData = sanitizeData(item);
            const actions: Action[] = [
              {
                img: images.icons.icEdit,
                function: () => onEdit(item, item.mainIndex),
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.VIQ,
                action: ActionTypeEnum.UPDATE,
                cssClass: 'me-1',
              },
              {
                img: images.icons.icRemove,
                function: () => onDelete(item.mainIndex),
                buttonType: ButtonType.Orange,
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.VIQ,
                action: ActionTypeEnum.DELETE,
                cssClass: 'ms-1',
              },
            ];
            return (
              <RowComponent
                isScrollable={isScrollable}
                data={finalData}
                actionList={isEdit ? actions : []}
                key={String(item.mainIndex)}
              />
            );
          })}
        </tbody>
      );
    },
    [dataTableSub, isEdit, onDelete, onEdit],
  );

  return (
    <div className={styles.tableViq}>
      <TableCp
        rowLabels={rowLabels}
        isEmpty={data?.length === 0 || !data}
        renderRow={renderRow}
        classNameNodataWrapper={styles.dataWrapperEmpty}
        loading={loading}
        defaultSort={sort}
        sortFunction={(filed, sortType) => {
          let newSort: string = sort;
          newSort = filed ? `${filed}:${sortType}` : '';
          setSort(newSort);
        }}
      />
    </div>
  );
};

export default TableMainCateGory;
