import { FC, useCallback, useMemo, useState } from 'react';
import { ViqMainCategory, ViqSubCategory } from 'models/api/viq/viq.model';
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
import { useSelector } from 'react-redux';

import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { VIQ_FIELDS_DETAILS } from 'constants/dynamic/vessel-inspection-questionnaires.const';
import styles from './table.module.scss';

export interface VIQSubExtend extends ViqSubCategory {
  mainCategoryName: string;
  subCategoryNo: string;
  secondSubCategoryNo?: string;
  subNo?: string;
  secondSubNumber?: number;
  parentSubName?: string;
  parentSubIndex?: number;
  mainIndex: number;
  subIndex: number;
  secondSubIndex?: number;
}

interface TableProps {
  dataDetail: ViqMainCategory[];
  isSecondSub?: boolean;
  loading?: boolean;
  isEdit: boolean;
  onDelete: (indexMain: number, indexSub: number) => void;
  onEdit: (data) => void;
}

const TableSubCateGory: FC<TableProps> = ({
  dataDetail = undefined,
  onDelete,
  loading,
  isEdit,
  onEdit,
}) => {
  const { potentialRisk } = useSelector((state) => state.viq);
  const [sort, setSort] = useState<string>('');

  const dynamicLabels = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
    modulePage: ModulePage.Create,
  });

  const formatValues = (fieldName: string, item: string) => {
    switch (fieldName) {
      case 'secondSubCategoryNumber':
        return Number(item);
      case 'subCategoryNo':
        return Number(item);
      default:
        return item;
    }
  };

  const dataTableSub = useMemo(() => {
    const dataResult = [];
    dataDetail?.forEach((mainItem, mainIndex) => {
      mainItem?.viqSubCategories?.forEach((subItem, subIndex) => {
        const dataItem = {
          ...subItem,
          mainCategoryName: mainItem.mainCategoryName,
          subCategoryNo: `${mainItem?.mainCategoryNo}.${subItem?.subRefNo}`,
          secondSubNumber: subItem?.children?.length || 0,
          mainIndex,
          subIndex,
          dateTime: subItem.dateTime || subItem.updatedAt || subItem.createdAt,
        };
        dataResult.push(dataItem);
      });
    });
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
  }, [dataDetail, sort]);

  const rowLabelsSub = [
    {
      id: 'action',
      label: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_DETAILS.Action),
      sort: false,
      width: '100',
    },
    {
      id: 'mainCategoryName',
      label: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_DETAILS['Main category name'],
      ),
      sort: true,
      width: '200',
    },
    {
      id: 'subCategoryNo',
      label: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_DETAILS['Main reference no.'],
      ),
      sort: true,
      width: '160',
    },
    {
      id: 'subCategoryName',
      label: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_DETAILS['Sub category name'],
      ),
      sort: true,
      width: '200',
    },

    {
      id: 'questions',
      label: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_DETAILS.Questions),
      sort: true,
      width: '200',
    },
    {
      id: 'guidance',
      label: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_DETAILS.Guidance),
      sort: true,
      width: '200',
    },
    {
      id: 'potentialRisk',
      label: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_DETAILS['Potential risk'],
      ),
      sort: true,
      width: '160',
    },
    {
      id: 'secondSubCategoryNumber',
      label: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_DETAILS['Second sub category number'],
      ),
      sort: true,
      width: '250',
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sanitizeData = (item: VIQSubExtend) => {
    const findRisk = potentialRisk?.find(
      (riskItem) => riskItem?.id === item?.potentialRiskId,
    );
    const finalData = {
      id: item.id,
      mainCategoryName: item?.mainCategoryName,
      subCategoryNo: item.subCategoryNo,
      subCategoryName: item?.subCategoryName,
      question: item?.question,
      guidance: item?.guidance,
      potentialRisk: findRisk?.risk || '',
      secondSubCategoryNumber: item.secondSubNumber,
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
          {dataTableSub.map((item: VIQSubExtend, index) => {
            const finalData = sanitizeData(item);
            const actions: Action[] = [
              {
                img: images.icons.icEdit,
                function: () => onEdit(item),
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.VIQ,
                action: ActionTypeEnum.UPDATE,
                cssClass: 'me-1',
              },
              {
                img: images.icons.icRemove,
                function: () => onDelete(item.mainIndex, item.subIndex),
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
                key={String(index) + item?.id}
              />
            );
          })}
        </tbody>
      );
    },
    [dataTableSub, isEdit, onDelete, onEdit, sanitizeData],
  );
  return (
    <div className={styles.tableViq}>
      <TableCp
        rowLabels={rowLabelsSub}
        isEmpty={dataTableSub?.length === 0}
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

export default TableSubCateGory;
