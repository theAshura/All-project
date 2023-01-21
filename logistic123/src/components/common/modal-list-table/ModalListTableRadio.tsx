import Table, { ColumnsType } from 'antd/lib/table';
import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import cx from 'classnames';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import Radio from 'components/ui/radio/Radio';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { DataObj } from 'models/common.model';
import {
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Modal } from 'reactstrap';
import NoDataImg from '../no-data/NoData';
import styles from './modal-list-table.module.scss';

export interface RowLabelType {
  title: string;
  dataIndex: string;
  width: number;
  tooltip?: boolean;
}

export interface ModalPropsRadio {
  labelSelect?: (() => ReactElement) | ReactElement | string;
  labelLeftSelect?: (() => ReactElement) | ReactElement | string;
  isRequired?: boolean;
  values?: string;
  data: DataObj[];
  onChangeValues?: (data: string) => void;
  onSubmit?: (data) => void;
  onCancel?: (params?: any) => void;
  isSubmit?: boolean;
  buttonName?: (() => ReactElement) | ReactElement | string;
  buttonClassName?: string;
  renderPrefix?: (() => ReactElement) | ReactElement;
  renderSuffix?: (() => ReactElement) | ReactElement;
  classPrefix?: string;
  classSuffix?: string;
  disable?: boolean;
  id?: string;
  size?: string;
  rowLabels: RowLabelType[];
  title?: (() => ReactElement) | ReactElement | string;
  subHeader?: ReactNode;
  scroll?: { x?: string | number | true; y?: string | number };
  dynamicLabels?: IDynamicLabel;
}

const ModalListTableRadio: FC<ModalPropsRadio> = ({
  data,
  rowLabels,
  labelSelect,
  buttonName,
  isRequired,
  onChangeValues,
  disable,
  labelLeftSelect,
  values,
  title,
  id,
  size,
  subHeader,
  buttonClassName,
  scroll,
  renderPrefix,
  renderSuffix,
  classPrefix,
  classSuffix,
  onCancel,
  dynamicLabels,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [dataHolder, setDataHolder] = useState<DataObj[]>(data || []);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>(values);

  useEffect(() => {
    setSelectedId(values);
  }, [values]);

  const handleClearSearchKeyword = useCallback(() => {
    if (!searchKeyword) {
      setSearchKeyword('');
    }
  }, [searchKeyword]);

  useEffect(() => {
    setDataHolder(data);
    handleClearSearchKeyword();
  }, [data, handleClearSearchKeyword]);

  const toggle = useCallback(() => {
    if (!disable) {
      setModalOpen((prevState) => !prevState);
      setDataHolder(data);
      setSearchKeyword(undefined);
      onCancel?.();
    }
  }, [disable, data, onCancel]);

  const handleChange = useCallback(
    (checked: boolean, id: string) => {
      if (checked && selectedId !== id) {
        setSelectedId(id);
      } else {
        setSelectedId('');
      }
    },
    [selectedId],
  );

  const containKeyword = useCallback(
    (item: DataObj) => {
      const isContained = Object.entries(item).filter(([key, value]) => {
        if (
          key !== 'id' &&
          key !== 'label' &&
          value
            ?.toString()
            .toLowerCase()
            .includes(searchKeyword.trim().toLowerCase())
        ) {
          return true;
        }
        return false;
      });
      return isContained?.length > 0;
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

  const columns: ColumnsType = useMemo(() => {
    const columnList: ColumnsType = [
      {
        title: '',
        width: 60,
        fixed: 'left',
        dataIndex: 'id',
        render: (text) => (
          <div className={styles.checkboxWrapper}>
            <Radio
              className={styles.checkBoxItem}
              value={text}
              checked={selectedId === text}
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
        render: (text) =>
          item?.tooltip ? (
            <Tooltip placement="top" title={text} color="#3B9FF3">
              <span className={cx(styles.textContent, 'limit-line-text')}>
                {text}
              </span>
            </Tooltip>
          ) : (
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          ),
      });
    });
    return columnList;
  }, [rowLabels, selectedId, handleChange]);

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
      <div>
        <Button
          className={cx(buttonClassName)}
          buttonSize={ButtonSize.Medium}
          onClick={() => setModalOpen(!modalOpen)}
          disabled={disable}
          disabledCss={disable}
          renderPrefix={renderPrefix}
          renderSuffix={renderSuffix}
          classPrefix={classPrefix}
          classSuffix={classSuffix}
        >
          <div>{buttonName}</div>
        </Button>
      </div>
      <Modal
        isOpen={modalOpen && !disable}
        toggle={toggle}
        size={size || 'lg'}
        style={{
          // maxWidth: '850px',
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

          {subHeader && <div>{subHeader}</div>}

          <div className={cx(styles.wrapperTable, 'mt-4')}>
            {dataHolder?.length ? (
              <Table
                columns={columns}
                className={cx(styles.tableWrapper)}
                dataSource={dataHolder}
                scroll={scroll || { x: 1000, y: 290 }}
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
              dynamicLabels={dynamicLabels}
              handleSubmit={() => {
                onChangeValues(selectedId);
                toggle();
              }}
              txButtonLeft={
                renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Cancel,
                ) || 'Cancel'
              }
              txButtonRight={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              disable={!dataHolder?.length}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalListTableRadio;
