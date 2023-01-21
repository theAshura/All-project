import Table, { ColumnsType } from 'antd/lib/table';
import images from 'assets/images/images';
import cx from 'classnames';
import SelectResult, {
  Position,
} from 'components/common/select-result/SelectResult';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import CustomCheckbox from 'components/ui/checkbox/Checkbox';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import DetectEsc from 'components/common/modal/DetectEsc';
import Input from 'components/ui/input/Input';
import SelectUI from 'components/ui/select/Select';
import { ENTITY_OPTIONS } from 'constants/filter.const';
import cloneDeep from 'lodash/cloneDeep';
import { DataObj } from 'models/common.model';
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { Modal } from 'reactstrap';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import NoDataImg from '../no-data/NoData';
import styles from './modal-list-table.module.scss';

export interface RowLabelType {
  title: string;
  dataIndex: string;
  width: number;
}

export interface ModalProps {
  labelSelect?: (() => ReactElement) | ReactElement | string;
  labelLeftSelect?: (() => ReactElement) | ReactElement | string;
  isRequired?: boolean;
  hiddenClear?: boolean;
  verticalResultClassName?: string;
  horizonResultClassName?: string;
  values?: string[];
  data: DataObj[];
  onChangeValues?: (data: string[]) => void;
  onSubmit?: (data) => void;
  isSubmit?: boolean;
  disable?: boolean;
  rowLabels: RowLabelType[];
  hiddenSelect?: boolean;
  defaultHiddenClear?: boolean;
  title?: (() => ReactElement) | ReactElement | string;
  error?: string;
  content?: string;
  id?: string;
  buttonOpen?: (() => ReactElement) | ReactElement;
  textBtn?: string;
  isTypeUpdate?: boolean;
  disableCloseWhenClickOut?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ModalListTable: FC<ModalProps> = ({
  onSubmit,
  data,
  rowLabels,
  labelSelect,
  isRequired,
  onChangeValues,
  disable,
  hiddenSelect = false,
  hiddenClear = false,
  defaultHiddenClear = false,
  verticalResultClassName,
  horizonResultClassName,
  labelLeftSelect,
  values = [],
  error,
  isSubmit,
  textBtn,
  title,
  id,
  buttonOpen,
  isTypeUpdate,
  disableCloseWhenClickOut,
  dynamicLabels,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [dataHolder, setDataHolder] = useState<DataObj[]>(data || []);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [entityFilter, setEntityFilter] = useState(null);
  const [selectedId, setSelectedId] = useState<string[]>(values);

  const listId = useMemo(
    () => dataHolder?.map((item) => item.id),
    [dataHolder],
  );

  const listResult = useMemo(() => {
    const filterData = selectedId?.map((id) => {
      const findItem = data?.find((item) => item.id === id);
      return { value: findItem?.id, label: findItem?.label };
    });
    return filterData;
  }, [selectedId, data]);

  useEffect(() => {
    setSelectedId(values);
  }, [values]);

  // useEffect(() => {
  //   onChangeValues(selectedId);
  // }, [selectedId]);

  useEffect(() => {
    setDataHolder(data);
  }, [data]);

  // useEffect(() => {
  //   setIsTouch(!!values.length);
  // }, [values]);

  const toggle = () => {
    if (modalOpen) {
      // setIsTouch(true);
    }
    if (!disable) {
      setModalOpen((prevState) => !prevState);
      setDataHolder(data);
      setSearchKeyword('');
      setEntityFilter(null);
    }
  };

  const handelClearItem = (id: string) => {
    const newState = selectedId.filter((item) => item !== id);
    setSelectedId(newState);
  };

  const handleChange = useCallback(
    (checked: boolean, id: string) => {
      if (checked && !selectedId.includes(id)) {
        const newSelected = [...selectedId];
        newSelected.push(id);
        setSelectedId(newSelected);
      } else {
        const newState = selectedId.filter((item) => item !== id);
        setSelectedId(newState);
      }
    },
    [selectedId],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!checked) {
        const newSelectedIds: string[] = [];
        data?.forEach((i) => {
          if (i.required) {
            newSelectedIds.push(i.id);
          }
        });
        setSelectedId(newSelectedIds);
      } else {
        setSelectedId(listId);
      }
    },
    [data, listId],
  );

  const containKeyword = useCallback(
    (item: DataObj) => {
      const isContained = Object.entries(item).filter(
        ([key, value]) =>
          key !== 'id' &&
          key !== 'label' &&
          value
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchKeyword.toLowerCase()),
      );
      return isContained?.length > 0;
    },
    [searchKeyword],
  );

  const handleSearch = useCallback(() => {
    let newData = cloneDeep(data);
    if (searchKeyword) {
      newData = data.filter((i: DataObj) => containKeyword(i) || i.required);
    }
    if (entityFilter) {
      newData = newData.filter((i: DataObj) => i.auditEntity === entityFilter);
    }
    setDataHolder(newData);
  }, [containKeyword, data, searchKeyword, entityFilter]);

  const columns: ColumnsType = useMemo(() => {
    const columnList: ColumnsType = [
      {
        title: (
          <div className={styles.checkboxWrapper}>
            <CustomCheckbox
              checked={listId?.every((i) => selectedId.includes(i))}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </div>
        ),
        width: 60,
        fixed: 'left',
        dataIndex: 'id',
        render: (text) => (
          <div className={styles.checkboxWrapper}>
            <CustomCheckbox
              value={text}
              checked={selectedId.includes(text)}
              onChange={(e) => {
                handleChange(e.target.checked, text);
              }}
            />
          </div>
        ),
      },
    ];
    rowLabels.forEach((item) => {
      columnList.push({
        title: item.title,
        width: item.width,
        dataIndex: item.dataIndex,
        key: item.dataIndex,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      });
    });
    return columnList;
  }, [listId, rowLabels, selectedId, handleSelectAll, handleChange]);

  return (
    <div id={id}>
      {labelSelect && (
        <div className="d-flex align-items-start pb-1 w-100 justify-content-between">
          <div className={cx(styles.labelSelect)}>
            {labelSelect}
            {isRequired && (
              <img
                src={images.icons.icRequiredAsterisk}
                className={cx(styles.imgRequired)}
                alt="required"
              />
            )}
          </div>
          <div className="">{labelLeftSelect}</div>
        </div>
      )}
      {buttonOpen ? (
        <div
          onClick={() => {
            if (!disable) {
              setModalOpen(!modalOpen);
            }
          }}
          className={styles.buttonOpen}
        >
          {buttonOpen}
        </div>
      ) : (
        <div>
          <Button
            buttonSize={ButtonSize.Medium}
            renderSuffix={
              <img src={images.icons.icAddCircle} className="ps-1" alt="plus" />
            }
            disabled={disable}
            onClick={() => setModalOpen(!modalOpen)}
          >
            {textBtn || ' Add More'}
          </Button>
        </div>
      )}

      <Modal
        isOpen={modalOpen && !disable}
        toggle={() => {
          if (disableCloseWhenClickOut) {
            return;
          }
          toggle();
        }}
        size="lg"
        style={{
          maxWidth: '850px',
          width: '100%',
          minHeight: '100vh',
          margin: '0 auto',
          position: 'relative',
        }}
        modalClassName={cx(styles.wrapper)}
        contentClassName={cx(styles.content)}
        fade={false}
      >
        <div className={cx(styles.container)}>
          <div className={cx(styles.header)}>
            <div className={cx(styles.title)}>{title}</div>
            <DetectEsc close={toggle} />
            <div className={cx(styles.search)}>
              <div className={styles.wrapSelect}>
                <SelectUI
                  data={[
                    {
                      label: renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS['Select all'],
                      ),
                      value: null,
                    },
                  ].concat(ENTITY_OPTIONS)}
                  isRequired
                  value={entityFilter}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Select all'],
                  )}
                  name="entityType"
                  id="entityType"
                  onChange={(e) => setEntityFilter(e)}
                  className={cx(styles.inputSelect, 'w-100')}
                  notAllowSortData
                  dynamicLabels={dynamicLabels}
                />
              </div>
              <Input
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Search,
                )}
                renderPrefix={
                  <img
                    src={images.icons.menu.icSearchInActive}
                    alt="buttonReset"
                  />
                }
                autoFocus
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                }}
                className={cx(styles.searchInput)}
              />
              <Button
                className={cx(styles.btnSearch)}
                buttonSize={ButtonSize.Medium}
                onClick={handleSearch}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Search,
                )}
              </Button>
            </div>
          </div>
          <div className={cx(styles.multiSelect)}>
            <SelectResult
              position={Position.HORIZON}
              title={
                <div className={(cx(styles.titleSelect), 'd-flex')}>
                  <span>
                    {renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.Selected,
                    )}
                  </span>
                </div>
              }
              collapse
              listItem={listResult}
              hiddenClear={hiddenClear}
              handelClearItem={handelClearItem}
              handelClearAll={() => {
                const filterIds = dataHolder
                  ?.filter((i) => i.required)
                  .map((i) => i.id);
                setSelectedId(filterIds || []);
              }}
              dynamicLabels={dynamicLabels}
            />
          </div>
          <div className={cx(styles.wrapperTable, 'mt-4')}>
            {dataHolder?.length ? (
              <Table
                columns={columns}
                className={cx(styles.tableWrapper)}
                dataSource={dataHolder}
                scroll={{ x: 1000, y: 290 }}
                pagination={false}
                rowKey={(item, index) => String(index)}
                rowClassName={styles.rowWrapper}
              />
            ) : (
              <NoDataImg />
            )}
          </div>

          <div className={cx(styles.footer)}>
            <GroupButton
              className={styles.GroupButton}
              handleCancel={toggle}
              handleSubmit={() => {
                onChangeValues(selectedId);
                toggle();
              }}
              txButtonRight={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              txButtonLeft={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Cancel,
              )}
              dynamicLabels={dynamicLabels}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalListTable;
