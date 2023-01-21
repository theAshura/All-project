import {
  FC,
  useMemo,
  useState,
  useEffect,
  useCallback,
  ReactElement,
} from 'react';
import omit from 'lodash/omit';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import cx from 'classnames';
import DetectEsc from 'components/common/modal/DetectEsc';
import { DataObj } from 'models/common.model';
import images from 'assets/images/images';
import Input from 'components/ui/input/Input';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import { Modal, Dropdown, DropdownToggle } from 'reactstrap';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import SelectResult, { Position } from '../select-result/SelectResult';
import CustomCheckbox from '../../ui/checkbox/Checkbox';
import { RowModalComponent } from './row/RowModalCp';
import NoDataImg from '../no-data/NoData';
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
  horizonResultClassName?: string;
  defaultSelectedId?: string[];
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
  title?: (() => ReactElement) | ReactElement | string;
  error?: string;
  content?: string;
  placeholder?: string;
  isTypeUpdate?: boolean;
  id?: string;
  disableCloseWhenClickOut?: boolean;
  descriptionSelect?: string;
  dynamicLabels?: IDynamicLabel;
}

const ModalList: FC<ModalProps> = ({
  data,
  rowLabels,
  labelSelect,
  isRequired = false,
  onChangeValues,
  disable,
  hiddenSelect = false,
  hiddenClear = false,
  verticalResultClassName,
  labelLeftSelect,
  values = [],
  error,
  isSubmit,
  title,
  id,
  isTypeUpdate,
  disableCloseWhenClickOut,
  descriptionSelect,
  placeholder,
  dynamicLabels,
  onSubmit,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [dataHolder, setDataHolder] = useState<DataObj[]>(data || []);
  const [isTouch, setIsTouch] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const { t } = useTranslation(I18nNamespace.COMMON);
  const [selectedId, setSelectedId] = useState<string[]>(values || []);
  const [selectedIdBeforeOpenModal, setSelectedIdBeforeOpenModal] = useState<
    string[]
  >(values || []);

  useEffect(() => {
    setDataHolder(data || []);
  }, [data]);

  const listResult = useMemo(() => {
    const filterData = selectedId?.map((id) => {
      const findItem = data?.find((item) => item.id === id && item.label);
      return { value: findItem?.id, label: findItem?.label };
    });
    return filterData;
  }, [data, selectedId]);
  useEffect(() => {
    setSelectedId(values);
  }, [values]);

  useEffect(() => {
    onChangeValues(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    setIsTouch(!!values?.length);
  }, [values?.length]);

  const handleCancel = useCallback(() => {
    if (modalOpen) {
      setSearchKeyword('');
      setIsTouch(true);
    }
    if (!disable) {
      setSelectedId(selectedIdBeforeOpenModal);
      setModalOpen((prevState) => !prevState);
      setDataHolder(data || []);
    }
  }, [data, disable, modalOpen, selectedIdBeforeOpenModal]);

  const handleConfirm = useCallback(() => {
    if (modalOpen) {
      setIsTouch(true);
      setSearchKeyword('');

      if (onSubmit) {
        onSubmit(selectedId);
      }
    }
    if (!disable) {
      setModalOpen((prevState) => !prevState);
      setDataHolder(data || []);
    }
  }, [data, disable, modalOpen, onSubmit, selectedId]);

  const handelClearItem = useCallback(
    (id: string) => {
      const newState = selectedId.filter((item) => item !== id);
      setSelectedId(newState);
    },
    [selectedId],
  );

  const handleChange = useCallback(
    (checked: boolean, id: string) => {
      if (checked && !selectedId?.includes(id)) {
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
      const rowId: string[] = dataHolder.map((item) => item.id);
      let status: boolean = false;
      const idsSelected: string[] = [...selectedId];
      if (!checked) {
        const newDataSelected = idsSelected.filter(
          (item) => !rowId.includes(item),
        );
        setSelectedId([...newDataSelected]);
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
    [dataHolder, selectedId],
  );

  const handleClearAll = useCallback(() => {
    setSelectedId([]);
  }, []);

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
      setDataHolder(newData || []);
    } else {
      setDataHolder(data || []);
    }
  }, [containKeyword, data, searchKeyword]);

  const renderRow = useCallback(
    (item: DataObj) => (
      <RowModalComponent
        key={item.id}
        id={item.id}
        checked={selectedId?.includes(item.id)}
        handleChecked={handleChange}
        data={item?.styleRow ? omit(item, ['styleRow']) : item}
        styleRow={item.styleRow || {}}
      />
    ),
    [handleChange, selectedId],
  );

  const checkedAll: boolean = useMemo(() => {
    let result = false;
    if (dataHolder?.length === 0) return false;

    const lengthRow: number = dataHolder?.length || 0;
    for (let i = 0; i < lengthRow; i += 1) {
      result = selectedId?.includes(dataHolder[i].id);
      if (!result) return false;
    }

    return true;
  }, [dataHolder, selectedId]);

  const handleOpenModel = useCallback(() => {
    if (!disable) {
      setModalOpen(!modalOpen);
      setSelectedIdBeforeOpenModal(selectedId);
    }
  }, [disable, modalOpen, selectedId]);

  const placeholderDisplay = useMemo(() => {
    if (disable) {
      return ' ';
    }
    return placeholder || t('placeHolder.txPleaseSelect');
  }, [disable, placeholder, t]);

  return (
    <div id={id}>
      {labelSelect && (
        <div className="d-flex align-items-start mg__b-1 w-100 justify-content-between">
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
          toggle={handleOpenModel}
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
            <span className={styles.placeHolder}>{placeholderDisplay}</span>
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
          maxWidth: '750px',
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
            <DetectEsc close={handleCancel} />
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
                className={cx(styles.searchInput, {
                  [styles.isTypeUpdate]: isTypeUpdate,
                })}
              />
              <Button
                className={cx(styles.btnSearch, {
                  [styles.isTypeUpdate]: isTypeUpdate,
                })}
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
              listItem={listResult}
              hiddenClear={hiddenClear}
              handelClearItem={handelClearItem}
              handelClearAll={handleClearAll}
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
                        <td
                          key={item.id}
                          style={{
                            width: item.width,
                          }}
                        />
                      ))}
                    </tr>
                    {dataHolder?.map((item) => renderRow(item))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <NoDataImg />
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
          {descriptionSelect && (
            <div className={styles.description}>
              <img src={images.icons.icInfoCircleBlue} alt="icInformation" />
              <span>{descriptionSelect}</span>
            </div>
          )}

          <SelectResult
            position={Position.VERTICAL}
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
            listItem={listResult}
            disabled={disable}
            verticalClassName={verticalResultClassName}
            hiddenClear={hiddenClear}
            handelClearItem={handelClearItem}
            handelClearAll={handleClearAll}
            messageError={isSubmit || isTouch ? error : ''}
            dynamicLabels={dynamicLabels}
          />
        </div>
      )}
    </div>
  );
};

export default ModalList;
