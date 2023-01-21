import {
  FC,
  useMemo,
  useState,
  useEffect,
  useCallback,
  ReactElement,
} from 'react';
import ModalComponent from 'components/ui/modal/Modal';
import cx from 'classnames';
import { DataObj } from 'models/common.model';
import DetectEsc from 'components/common/modal/DetectEsc';
import { MasterDataId } from 'constants/common.const';
import images from 'assets/images/images';
import Input from 'components/ui/input/Input';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import { Modal, Dropdown, DropdownToggle } from 'reactstrap';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import CustomCheckbox from 'components/ui/checkbox/Checkbox';
import SelectResult, { Position } from './select-result/SelectResult';
import { RowModalComponent } from './row/RowModalCp';
import styles from './modal-list.module.scss';

export interface RowLabelType {
  label: string;
  id: string;
  width: number | string;
}

export interface ModalProps {
  labelSelect?: (() => ReactElement) | ReactElement | string;
  labelLeftSelect?: (() => ReactElement) | ReactElement | string;
  isRequired?: boolean;
  hiddenClear?: boolean;
  verticalResultClassName?: string;
  defaultSelectedId?: string[];
  horizonResultClassName?: string;
  values?: string[];
  data: DataObj[];
  onChangeValues?: (data: string[]) => void;
  constraintDelete?: boolean;
  onSubmit?: (data) => void;
  isSubmit?: boolean;
  disable?: boolean;
  customDeleteHeader?: string;
  customDeletePopup?: string;
  rowLabels: RowLabelType[];
  hiddenSelect?: boolean;
  defaultHiddenClear?: boolean;
  title?: (() => ReactElement) | ReactElement | string;
  error?: string;
  content?: string;
  placeholder?: string;
  hasVesselType?: boolean;
  disableCloseWhenClickOut?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ModalList: FC<ModalProps> = ({
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
  constraintDelete = false,
  verticalResultClassName,
  defaultSelectedId = [],
  horizonResultClassName,
  labelLeftSelect,
  hasVesselType,
  values = [],
  error,
  isSubmit,
  title,
  disableCloseWhenClickOut,
  placeholder,
  dynamicLabels,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalConfirmDeleteOpen, setModalConfirmDeleteOpen] =
    useState<boolean>(false);
  const [modalConfirmChangeOpen, setModalConfirmChangeOpen] =
    useState<boolean>(false);
  const [dataHolder, setDataHolder] = useState<DataObj[]>(data || []);
  const [isTouch, setIsTouch] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string[]>(values || []);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<string>('');
  const [isDeleteAll, setIsDeleteAll] = useState<boolean>(false);
  const [temporarySelectedIds, setTemporarySelectedIds] =
    useState<string[]>(defaultSelectedId);
  const [defHiddenClear, setDefHiddenClear] = useState<boolean>(false);
  useEffect(() => {
    setDataHolder(data);
  }, [data]);

  const listResult = useMemo(() => {
    const filterData = selectedId?.map((id) => {
      const findItem = data?.find((item) => item.id === id);
      return {
        value: findItem?.id,
        label: findItem?.label,
        required: findItem?.required,
      };
    });
    return filterData;
  }, [selectedId, data]);

  useEffect(() => {
    setSelectedId(values);
  }, [values]);

  useEffect(() => {
    if (defaultHiddenClear) {
      const filterIds = dataHolder?.filter((i) => !i.required).map((i) => i.id);
      const currentSelected = selectedId.filter((i) => filterIds.includes(i));
      if (currentSelected.length === 0) {
        setDefHiddenClear(true);
      } else {
        setDefHiddenClear(false);
      }
    }
  }, [dataHolder, defaultHiddenClear, selectedId]);

  useEffect(() => {
    onChangeValues(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    setIsTouch(!!values?.length);
  }, [values]);

  const handleCancel = useCallback(() => {
    if (modalOpen) {
      setSearchKeyword('');
      setIsTouch(true);
    }
    if (!disable) {
      let oldSelectedIds = [...defaultSelectedId];
      if (hasVesselType) {
        oldSelectedIds =
          oldSelectedIds.filter((item) => item !== MasterDataId.DEPARTMENT) ||
          [];
      } else {
        oldSelectedIds =
          oldSelectedIds.filter((item) => item !== MasterDataId.VESSEL_TYPE) ||
          [];
      }

      setSelectedId(oldSelectedIds);
      setModalOpen((prevState) => !prevState);
      setDataHolder(data);
    }
  }, [data, disable, modalOpen, defaultSelectedId, hasVesselType]);

  const handleConfirm = useCallback(() => {
    if (modalOpen) {
      setSearchKeyword('');
      setIsTouch(true);
    }
    if (!disable) {
      if (constraintDelete && defaultSelectedId) {
        if (!temporarySelectedIds.every((item) => selectedId.includes(item))) {
          setModalConfirmChangeOpen(true);
        } else {
          const newSelectedIds = [...selectedId];
          setTemporarySelectedIds(newSelectedIds);
          setModalOpen((prevState) => !prevState);
          setDataHolder(data);
        }
      } else {
        const newSelectedIds = [...selectedId];
        setTemporarySelectedIds(newSelectedIds);
        setModalOpen((prevState) => !prevState);
        setDataHolder(data);
      }
    }
  }, [
    constraintDelete,
    data,
    disable,
    modalOpen,
    temporarySelectedIds,
    selectedId,
    defaultSelectedId,
  ]);

  const handelClearItem = useCallback(
    (id: string) => {
      const newState = selectedId.filter((item) => item !== id);
      setSelectedId(newState);
    },
    [selectedId],
  );

  const handleChange = useCallback(
    (checked: boolean, id: string) => {
      if (checked && !selectedId.includes(id)) {
        const newSelecteds = [...selectedId];
        newSelecteds.push(id);
        setSelectedId(newSelecteds);
      } else {
        const newState = selectedId.filter((item) => item !== id);
        setSelectedId(newState);
      }
    },
    [selectedId],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const rowId: string[] = dataHolder.map((item) => item.id);
      const rowIdRequired: string[] = dataHolder
        .filter((i) => i.required)
        .map((item) => item.id);

      let status: boolean = false;
      let idsSelected: string[] = [...selectedId];
      if (hasVesselType) {
        idsSelected =
          selectedId.filter((item) => item !== MasterDataId.DEPARTMENT) || [];
      } else {
        idsSelected =
          selectedId.filter((item) => item !== MasterDataId.VESSEL_TYPE) || [];
      }

      if (!checked) {
        const newDataSelected = idsSelected.filter(
          (item) => !rowId.includes(item),
        );
        const idRequired = rowIdRequired.filter(
          (item) => !newDataSelected.includes(item),
        );

        setSelectedId([...newDataSelected, ...idRequired]);
      } else {
        rowId.forEach((id) => {
          status = idsSelected.includes(id);
          if (!status) {
            idsSelected.push(id);
          }
        });
        setSelectedId([...idsSelected]);
      }
    },
    [dataHolder, hasVesselType, selectedId],
  );

  const checkedAll: boolean = useMemo(() => {
    let result = false;
    if (dataHolder?.length === 0) return false;

    const lengthRow: number = dataHolder.length;
    for (let i = 0; i < lengthRow; i += 1) {
      result = selectedId?.includes(dataHolder[i].id);
      if (!result) return false;
    }

    return true;
  }, [dataHolder, selectedId]);

  const handleClearAll = useCallback(
    (isHorizontal?: boolean) => {
      const filterIds = dataHolder?.filter((i) => i.required).map((i) => i.id);
      setSelectedId(filterIds || []);
      if (!isHorizontal) {
        setTemporarySelectedIds(filterIds || []);
      }
    },
    [dataHolder],
  );

  const containKeyword = useCallback(
    (item: DataObj) => {
      const isContained = Object.entries(item).filter(
        ([key, value]) =>
          key !== 'id' &&
          key !== 'label' &&
          value.toString().toLowerCase().includes(searchKeyword.toLowerCase()),
      );
      return isContained.length > 0;
    },
    [searchKeyword],
  );

  const handleSearch = useCallback(() => {
    if (searchKeyword) {
      const newData = data.filter(
        (i: DataObj) => containKeyword(i) || i.required,
      );
      setDataHolder(newData);
    } else {
      setDataHolder(data);
    }
  }, [containKeyword, data, searchKeyword]);

  const renderConfirmCategory = useCallback(
    () => (
      <>
        <p>
          {renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS[
              'Are you sure you want to proceed with this action? your change here will impact the references & category in all questions'
            ],
          )}
        </p>
        <div className="d-flex w-50 mx-auto mt-4">
          <Button
            className={cx('w-100 me-3')}
            buttonType={ButtonType.CancelOutline}
            onClick={() => {
              const oldSelectedIds = [...temporarySelectedIds];
              setSelectedId(oldSelectedIds);
              setModalConfirmChangeOpen(false);
            }}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            onClick={() => {
              const newSelectedIds = [...selectedId];
              setTemporarySelectedIds(newSelectedIds);
              setDataHolder(data);
              setModalOpen((prev) => !prev);
              setModalConfirmChangeOpen(false);
            }}
            buttonType={ButtonType.Primary}
            className={cx('w-100 ms-3')}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Confirm)}
          </Button>
        </div>
      </>
    ),
    [data, dynamicLabels, selectedId, temporarySelectedIds],
  );

  const renderDeleteCategory = useCallback(
    () => (
      <>
        <p>
          {renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS[
              'The references & category will be removed in all questions'
            ],
          )}
        </p>
        <div className="d-flex w-50 mx-auto mt-4">
          <Button
            className={cx('w-100 me-3')}
            buttonType={ButtonType.CancelOutline}
            onClick={() => {
              if (!isDeleteAll) {
                setSelectedDeleteItem('');
              } else {
                setIsDeleteAll(false);
              }
              setModalConfirmDeleteOpen(false);
            }}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            onClick={() => {
              if (isDeleteAll) {
                handleClearAll();
                setIsDeleteAll(false);
              } else {
                handelClearItem(selectedDeleteItem);
                setSelectedDeleteItem('');
              }
              setModalConfirmDeleteOpen(false);
            }}
            buttonType={ButtonType.Primary}
            className={cx('w-100 ms-3')}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Confirm)}
          </Button>
        </div>
      </>
    ),
    [
      dynamicLabels,
      handelClearItem,
      handleClearAll,
      isDeleteAll,
      selectedDeleteItem,
    ],
  );

  const onVerticalDeleteConfirm = useCallback(
    (id: string) => {
      if (values?.includes(id)) {
        setModalConfirmDeleteOpen(true);
        setSelectedDeleteItem(id);
      } else {
        handelClearItem(id);
      }
    },
    [handelClearItem, values],
  );

  const onVerticalDeleteAllConfirm = () => {
    setModalConfirmDeleteOpen(true);
    setIsDeleteAll(true);
  };

  const renderRow = useCallback(
    (item: DataObj) => {
      if (item.required !== true) {
        return (
          <RowModalComponent
            key={item.id}
            id={item.id}
            checked={selectedId?.includes(item.id)}
            handleChecked={handleChange}
            data={item}
          />
        );
      }
      return undefined;
    },
    [handleChange, selectedId],
  );

  const placeholderDisplay = useMemo(() => {
    if (disable) {
      return <span>&nbsp;</span>;
    }
    return (
      placeholder ||
      renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS['Please select'])
    );
  }, [disable, dynamicLabels, placeholder]);

  return (
    <>
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
      <div>
        <Dropdown
          isOpen={false}
          className={cx(styles.dropdown)}
          size="lg"
          toggle={() => setModalOpen(!modalOpen)}
          direction="down"
        >
          <DropdownToggle
            className={cx(
              styles.dropdownToggle,
              {
                [styles.dropdownToggleDisable]: disable,
              },
              'd-flex justify-content-between align-items-center',
            )}
          >
            {placeholderDisplay}
          </DropdownToggle>
        </Dropdown>
      </div>
      <Modal
        isOpen={modalOpen && !disable}
        toggle={() => {
          if (disableCloseWhenClickOut) {
            return;
          }
          handleCancel();
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
        <DetectEsc close={handleCancel} />
        <div className={cx(styles.container)}>
          <div className={cx(styles.header)}>
            <div className={cx(styles.title)}>{title}</div>
            <div className={cx(styles.search)}>
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
                className={styles.searchInput}
              />
              <Button
                className={styles.btnSearch}
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
                  <span>{`${renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Selected,
                  )}:`}</span>
                </div>
              }
              listItem={listResult}
              hiddenClear={hiddenClear || defHiddenClear}
              handelClearItem={handelClearItem}
              handelClearAll={() => handleClearAll(true)}
              dynamicLabels={dynamicLabels}
            />
          </div>
          {dataHolder?.length ? (
            <div className={cx(styles.wrapperTable)}>
              <table className={styles.tableHeader}>
                <thead>
                  <tr>
                    {rowLabels?.map((item) => (
                      <th key={item.id} style={{ width: item.width }}>
                        {item.id === 'checkbox' ? (
                          <CustomCheckbox
                            checked={checkedAll}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        ) : (
                          item.label
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <tbody className={cx(styles.wrapperBody)}>
                    <tr>
                      {rowLabels?.map((item) => (
                        <td key={item.id} style={{ width: item.width }} />
                      ))}
                    </tr>
                    {dataHolder?.map((item) => renderRow(item))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className={cx(styles.dataWrapperEmpty)}>
              <img
                src={images.icons.icNoData}
                className={styles.noData}
                alt="no data"
              />
            </div>
          )}
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
      {!hiddenSelect && (
        <div className={cx(styles.result)}>
          <SelectResult
            position={Position.VERTICAL}
            title={
              <div className={(cx(styles.titleSelect), 'd-flex')}>
                <span>{`${renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Selected,
                )}:`}</span>
              </div>
            }
            listItem={listResult}
            verticalClassName={verticalResultClassName}
            hiddenClear={hiddenClear || defHiddenClear}
            handelClearItem={
              constraintDelete && defaultSelectedId
                ? onVerticalDeleteConfirm
                : handelClearItem
            }
            disabled={disable}
            handelClearAll={
              constraintDelete && defaultSelectedId
                ? onVerticalDeleteAllConfirm
                : handleClearAll
            }
            messageError={isSubmit || isTouch ? error : ''}
            dynamicLabels={dynamicLabels}
          />
        </div>
      )}
      <ModalComponent
        isOpen={modalConfirmChangeOpen}
        title={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Confirmation,
        )}
        toggle={() => setModalConfirmChangeOpen(!modalConfirmChangeOpen)}
        content={renderConfirmCategory()}
        w="500px"
      />
      <ModalComponent
        isOpen={modalConfirmDeleteOpen}
        title={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Confirm deletion'],
        )}
        toggle={() => setModalConfirmDeleteOpen(!modalConfirmDeleteOpen)}
        content={renderDeleteCategory()}
        w="500px"
      />
    </>
  );
};

export default ModalList;
