import { SelectionChangedEvent } from 'ag-grid-community';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { GroupButton } from 'components/ui/button/GroupButton';

import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { DIVISION_MAPPING_FIELDS_DETAILS } from 'constants/dynamic/division-mapping.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';

import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { CommonApiParam } from 'models/common.model';
import { getListDivisionActions } from 'pages/division/store/action';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'reactstrap';
import styles from './modal-form-division.module.scss';
import './modal-select-vessel.scss';

export interface RowLabelType {
  label: string;
  id: string;
  width: number | string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveData?: (data: any) => void;
  itemSelected?: any;
  setValue?: any;
  listVessel?: any;
  loading?: boolean;
  params?: any;
}

const ModalChooseDivision: FC<ModalProps> = ({
  isOpen,
  onClose,
  onSaveData,
  itemSelected,
  setValue,
  listVessel,
  loading,
  params,
}) => {
  const [listDataSelected, setListDataSelected] = useState([]);
  const [listData, setListData] = useState([]);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const dispatch = useDispatch();

  const modulePage = useMemo((): ModulePage => ModulePage.Create, []);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonDivisionMapping,
    modulePage,
  });

  useEffect(() => {
    if (listVessel) {
      setListData(listVessel || []);
    }
  }, [listVessel]);

  useEffect(() => {
    setListDataSelected(itemSelected);
  }, [itemSelected]);

  const handleCancel = useCallback(() => {
    onClose();
    setListData(listVessel || []);
  }, [listVessel, onClose]);

  const handleConfirm = useCallback(() => {
    handleCancel();
    onSaveData(listDataSelected);
    setListDataSelected([]);
  }, [handleCancel, listDataSelected, onSaveData]);

  // const handleSelectData = useCallback(
  //   (checked?: boolean, id?: string, clearAll?: boolean) => {
  //     if (clearAll) {
  //       setListDataSelected([]);
  //       return;
  //     }
  //     setClear(false);
  //     if (id === 'all') {
  //       if (listDataSelected?.length === initialData?.length) {
  //         setListDataSelected([]);
  //       } else {
  //         setListDataSelected(initialData);
  //       }
  //       return;
  //     }
  //     const existId = listDataSelected?.some((i) => i?.id === id);
  //     if (existId) {
  //       const newList = listDataSelected?.filter((i) => i.id !== id);
  //       setListDataSelected(newList);
  //     } else {
  //       const newList = cloneDeep(listDataSelected);
  //       const findingSelected = initialData?.find((i) => i.id === id);
  //       newList?.push(findingSelected);
  //       setListDataSelected(newList);
  //     }
  //   },
  //   [initialData, listDataSelected],
  // );
  const columnDefs = useMemo(
    () => [
      {
        field: '',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        headerCheckboxSelectionFilteredOnly: true,
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        minWidth: 60,
        maxWidth: 80,
        pinned: 'center',
      },
      {
        field: 'imoNumber',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_DETAILS['IMO number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_DETAILS['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_DETAILS['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(getListDivisionActions.request({ ...newParams, pageSize: -1 }));
    },
    [dispatch],
  );

  const dataTable = useMemo(
    () =>
      listData.map((item, index) => ({
        imoNumber: item?.imoNumber,
        name: item?.name,
        vesselType: item?.vesselType?.name,
        id: item?.id,
      })) || [],
    [listData],
  );

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {}}
      size="lg"
      modalClassName={cx(styles.wrapper)}
      contentClassName={cx(styles.content)}
      fade={false}
      className="modalSelectVessel"
    >
      <div className={cx(styles.container, styles.modalSelectVessel)}>
        <div className={cx(styles.header)}>
          <div className={cx(styles.title)}>
            {renderDynamicLabel(
              dynamicLabels,
              DIVISION_MAPPING_FIELDS_DETAILS['Division Mapping'],
            )}
          </div>
        </div>
        {/* <div className={cx(styles.multiSelect)}>
          <SelectResult
            position={Position.HORIZON}
            title={
              <div className={(cx(styles.titleSelect), 'd-flex')}>
                <span>{`${t('selected')}:`}</span>
              </div>
            }
            listItem={
              listDataSelected?.length
                ? listDataSelected?.map((i) => ({
                    label: i.name,
                    value: i.id,
                  }))
                : []
            }
            handelClearItem={(id) => handleSelectData(null, id)}
            handelClearAll={() => handleSelectData(true, 'all', true)}
          />
        </div> */}
        <AGGridModule
          loading={loading}
          params={params}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          hasRangePicker={false}
          columnDefs={columnDefs}
          dataFilter={null}
          pageSizeDefault={10}
          moduleTemplate={MODULE_TEMPLATE.modalSelectVessel}
          fileName="Report template"
          dataTable={dataTable}
          height="420px"
          getList={handleGetList}
          classNameHeader={styles.header}
          aggridId="ag-grid-table-1"
          colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
          rowSelection="multiple"
          suppressRowClickSelection
          onSelectionChanged={(event: SelectionChangedEvent) => {
            const selectedRows = event.api.getSelectedRows();
            setListDataSelected(selectedRows);
          }}
          onFirstDataRendered={(params) => {
            params.api.forEachNode((node) =>
              node.setSelected(
                listDataSelected.some((x) => x.id === node?.data?.id),
              ),
            );
          }}
        />
        <div className={cx(styles.footer)}>
          <GroupButton
            className={styles.GroupButton}
            handleCancel={handleCancel}
            handleSubmit={handleConfirm}
            txButtonRight={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS.Confirm,
            )}
            dynamicLabels={dynamicLabels}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalChooseDivision;
