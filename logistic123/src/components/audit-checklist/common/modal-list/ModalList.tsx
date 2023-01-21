import images from 'assets/images/images';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import SelectResult, {
  Position,
} from 'components/common/select-result/SelectResult';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { KeyPress } from 'constants/common.const';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { DataObj } from 'models/common.model';
import DetectEsc from 'components/common/modal/DetectEsc';
import {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Modal } from 'reactstrap';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { AnswerOptionValueModel } from '../../forms/AuditCheckListQuestionListForm';
import styles from './modal-list.module.scss';
import { RowModalComponent } from './row/RowModalCp';

export interface RowLabelType {
  label: string;
  id: string;
  width: number | string;
}

export interface ModalProps {
  horizonResultClassName?: string;
  defaultSelectedId?: string[];
  data?: AnswerOptionValueModel[];
  onChangeValues?: (data: string[]) => void;
  constraintDelete?: boolean;
  onSubmit?: (data) => void;
  disable?: boolean;
  customDeleteHeader?: string;
  customDeletePopup?: string;
  title?: (() => ReactElement) | ReactElement | string;
  content?: string;
  isTypeUpdate?: boolean;
  disableCloseWhenClickOut?: boolean;
  isOpenModalValues: boolean;
  setIsOpenModalValues: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
  dynamicLabel: IDynamicLabel;
}

const ModalList: FC<ModalProps> = ({
  onSubmit,
  data,
  disable,
  title,
  isTypeUpdate,
  isOpenModalValues,
  setIsOpenModalValues,
  disabled,
  dynamicLabel,
}) => {
  const [dataCurrent, setDataCurrent] = useState<AnswerOptionValueModel[]>(
    data || [],
  );
  const [dataHolder, setDataHolder] = useState<AnswerOptionValueModel[]>(
    data || [],
  );
  const [firstError, setFirstError] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const rowLabels = useMemo(
    () => [
      {
        label: renderDynamicLabel(
          dynamicLabel,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList['S.No'],
        ),
        id: 'indexItem',
        width: 50,
      },
      {
        label: renderDynamicLabel(
          dynamicLabel,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Answer option'
          ],
        ),
        id: 'value',
        width: 500,
      },
      {
        label: renderDynamicLabel(
          dynamicLabel,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList.Value,
        ),
        id: 'natureOfFinding',
        width: 250,
      },
    ],
    [dynamicLabel],
  );

  useEffect(() => {
    setDataHolder(data || []);
    setDataCurrent(data || []);
  }, [data]);

  const listResult = useMemo(() => {
    const filterData = dataCurrent
      ?.filter((i) => i?.idValue)
      ?.map((item) => ({ value: item?.id, label: item?.value }));
    return filterData;
  }, [dataCurrent]);

  const handleCancel = useCallback(() => {
    if (isOpenModalValues) {
      setSearchKeyword('');
      setFirstError(false);
    }
    if (!disable) {
      setIsOpenModalValues((prevState) => !prevState);
      setDataCurrent(data || []);
      setDataHolder(data || []);
    }
  }, [data, disable, isOpenModalValues, setIsOpenModalValues]);

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
      const newData = dataCurrent.filter(
        (i: DataObj) => containKeyword(i) || i.required,
      );
      setDataHolder(newData || []);
    } else {
      setDataHolder(dataCurrent || []);
    }
  }, [containKeyword, dataCurrent, searchKeyword]);

  const handleShowAllData = useCallback(() => {
    setSearchKeyword('');
    setDataHolder(dataCurrent || []);
  }, [dataCurrent]);

  const checkErr = useCallback(
    async (indexItem) => {
      await handleShowAllData();
      if (
        document &&
        document.querySelector &&
        typeof document.querySelector === 'function'
      ) {
        const el = document?.querySelector(`#form_value #value_${indexItem}`);
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setDataHolder(dataCurrent || []);
    },
    [dataCurrent, handleShowAllData],
  );

  const handleConfirm = useCallback(() => {
    setFirstError(true);
    let indexItem = -1;
    const checkIdValue = dataCurrent?.find((i, index) => {
      if (!i?.idValue) {
        indexItem = index;
        return true;
      }
      return false;
    });
    if (checkIdValue) {
      checkErr(indexItem);

      return null;
    }
    if (isOpenModalValues) {
      setSearchKeyword('');
    }
    if (!disable) {
      setIsOpenModalValues((prevState) => !prevState);
      setDataHolder(dataCurrent || []);
      onSubmit(dataCurrent || []);
    }
    return null;
  }, [
    checkErr,
    dataCurrent,
    disable,
    isOpenModalValues,
    onSubmit,
    setIsOpenModalValues,
  ]);

  const handelClearItem = useCallback(
    (id: string) => {
      const newDataCurrent = dataCurrent.map((item) => {
        if (item.id === id) {
          return { ...item, idValue: '' };
        }
        return item;
      });

      const newDataHolder = dataHolder.map((item) => {
        if (item.id === id) {
          return { ...item, idValue: '' };
        }
        return item;
      });

      setDataCurrent(newDataCurrent);
      setDataHolder(newDataHolder);
    },
    [dataCurrent, dataHolder],
  );

  const handleClearAll = useCallback(() => {
    const newDataCurrent = dataCurrent.map((item) => ({
      ...item,
      idValue: '',
    }));

    const newDataHolder = dataHolder.map((item) => ({
      ...item,
      idValue: '',
    }));

    setDataCurrent(newDataCurrent);
    setDataHolder(newDataHolder);
  }, [dataCurrent, dataHolder]);

  const onKeyUp = useCallback(
    (e) => {
      if (e.keyCode === KeyPress.ENTER) {
        handleSearch();
      }
    },
    [handleSearch],
  );

  const renderRow = useCallback(
    (item: DataObj, index: number) => (
      <RowModalComponent
        key={item.id}
        firstError={firstError}
        indexItem={index}
        rowLabels={rowLabels}
        id={item.id}
        dynamicLabels={dynamicLabel}
        data={item}
        disabled={disabled}
        styleRow={item.styleRow || {}}
        handleConfirm={(dataValue: NewAsyncOptions[]) => {
          const newDataCurrent: AnswerOptionValueModel[] = dataCurrent?.map(
            (i) => {
              if (i.id === item.id && dataValue?.length > 0) {
                return { ...i, idValue: dataValue[0]?.value?.toString() };
              }
              return i;
            },
          );

          const newDataHolder: AnswerOptionValueModel[] = dataHolder?.map(
            (i) => {
              if (i.id === item.id) {
                return { ...i, idValue: dataValue[0]?.value?.toString() };
              }
              return i;
            },
          );
          setDataCurrent(newDataCurrent);
          setDataHolder(newDataHolder);
        }}
      />
    ),
    [dataCurrent, dataHolder, disabled, dynamicLabel, firstError, rowLabels],
  );

  return (
    <Modal
      isOpen={isOpenModalValues && !disable}
      size="lg"
      style={{
        maxWidth: '950px',
        width: '100%',
        minHeight: '100vh',
        margin: '0 auto',
        position: 'relative',
      }}
      modalClassName={cx(styles.wrapper)}
      contentClassName={cx(styles.content)}
      fade={false}
    >
      <div id="form_value" className={cx(styles.container)}>
        <div className={cx(styles.header, 'pb-3')}>
          <div className={cx(styles.title)}>{title}</div>
          <DetectEsc close={handleCancel} />
          <div className={cx(styles.search)}>
            <Input
              placeholder={renderDynamicLabel(
                dynamicLabel,
                COMMON_DYNAMIC_FIELDS.Search,
              )}
              renderPrefix={
                <img
                  src={images.icons.menu.icSearchInActive}
                  alt="buttonReset"
                />
              }
              onKeyUp={onKeyUp}
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
              {renderDynamicLabel(dynamicLabel, COMMON_DYNAMIC_FIELDS.Search)}
            </Button>
          </div>
        </div>
        <div className={cx(styles.multiSelect)}>
          <SelectResult
            position={Position.HORIZON}
            title={
              <div className={(cx(styles.titleSelect), 'd-flex')}>
                <span>{`${renderDynamicLabel(
                  dynamicLabel,
                  COMMON_DYNAMIC_FIELDS.Select,
                )}:`}</span>
              </div>
            }
            disabled={disabled}
            dynamicLabels={dynamicLabel}
            listItem={listResult}
            handelClearItem={(value) => {
              if (!disabled) {
                handelClearItem(value);
              }
            }}
            handelClearAll={handleClearAll}
          />
        </div>

        {dataHolder?.length ? (
          <div className={cx(styles.wrapperTable)}>
            <div
              className={cx(styles.tableHeader, 'd-flex align-items-center')}
            >
              {rowLabels?.map((item) => (
                <div
                  key={item.id}
                  style={{ width: item.width }}
                  className={cx('ps-3')}
                >
                  {item.label}
                </div>
              ))}
            </div>
            <div
              className={cx(styles.table, {
                [styles.tableScroll]: dataHolder?.length > 12,
              })}
            >
              {dataHolder?.map((item, index) => renderRow(item, index))}
            </div>
          </div>
        ) : (
          <NoDataImg />
        )}
        <div className={cx(styles.footer)}>
          <GroupButton
            className={styles.GroupButton}
            hideBtnSave={disabled}
            handleCancel={handleCancel}
            dynamicLabels={dynamicLabel}
            handleSubmit={handleConfirm}
            txButtonRight={renderDynamicLabel(
              dynamicLabel,
              COMMON_DYNAMIC_FIELDS.Confirm,
            )}
            txButtonLeft={renderDynamicLabel(
              dynamicLabel,
              COMMON_DYNAMIC_FIELDS.Cancel,
            )}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalList;
