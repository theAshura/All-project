import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import cx from 'classnames';
import { DataObj } from 'models/common.model';
import { useDispatch, useSelector } from 'react-redux';
import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import NoDataImg from 'components/common/no-data/NoData';
import { Modal } from 'reactstrap';
import CustomCheckbox from 'components/ui/checkbox/Checkbox';
import {
  getListTemplateDictionaryActions,
  deleteTemplateDictionaryActions,
} from 'store/template/template.action';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';

import { RowModalComponent } from './row/RowModalCp';

import styles from './modal-list.module.scss';

export interface IProps {
  data: DataObj[];
  content?: string;
  isOpen: boolean;
  toggle: Dispatch<SetStateAction<boolean>>;
  templateModule: string;
}

const rowLabels = [
  {
    label: 'checkbox',
    id: 'checkbox',
    width: 40,
  },
  {
    label: 'TEMPLATES',
    id: 'templateName',
    width: '100%',
  },
];

const ModalDeleteTemplate = ({
  data,
  isOpen,
  toggle,
  templateModule,
}: IProps) => {
  const dispatch = useDispatch();

  const [dataHolder, setDataHolder] = useState<DataObj[]>(data || []);
  const { t } = useTranslation(I18nNamespace.COMMON);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { loading } = useSelector((state) => state.template);

  const isDisable = useCallback(
    (templateType: string) => {
      if (templateType !== 'global') return false;
      if (userInfo.roleScope !== 'Admin') return true;
      return false;
    },
    [userInfo.roleScope],
  );

  useEffect(() => {
    if (!isOpen) {
      setSelectedId([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const newData = data?.map((item) => ({
      id: item.id,
      name: item.name,
      label: item.name,
      disable: isDisable(item.type),
    }));
    setDataHolder(newData || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, userInfo]);

  const handleCancel = useCallback(() => {
    toggle(false);
    setSelectedId([]);
  }, [toggle]);

  const disable = useMemo(
    () => loading || selectedId?.length === 0,
    [selectedId, loading],
  );

  const handleConfirm = useCallback(() => {
    if (!disable) {
      const newSelectedIds = [...selectedId];
      dispatch(
        deleteTemplateDictionaryActions.request({
          ids: newSelectedIds,
          getList: () => {
            dispatch(
              getListTemplateDictionaryActions.request({
                content: templateModule,
              }),
            );
            setDataHolder(data || []);
            toggle(false);
          },
        }),
      );
    }
  }, [data, disable, dispatch, selectedId, templateModule, toggle]);

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
      const rowId: string[] = dataHolder
        .filter((i) => !i.disable)
        .map((item) => item.id);
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

  const renderRow = useCallback(
    (item: DataObj) => (
      <RowModalComponent
        key={item.id}
        id={item.id}
        checked={selectedId.includes(item.id)}
        handleChecked={handleChange}
        data={item}
        hideCheckBox={item.disable}
      />
    ),
    [handleChange, selectedId],
  );

  const checkedAll: boolean = useMemo(() => {
    let result = false;
    const newDataHolder = dataHolder.filter((item) => !item.disable);
    if (newDataHolder?.length === 0) return false;
    const lengthRow: number = newDataHolder?.length || 0;
    for (let i = 0; i < lengthRow; i += 1) {
      result = selectedId.includes(newDataHolder[i].id);
      if (!result) return false;
    }

    return true;
  }, [dataHolder, selectedId]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={handleCancel}
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
        <div>
          <div className={styles.header}>
            <span className="fw-bold">Delete template</span>
            <div className={styles.icClose} onClick={() => toggle(false)}>
              <img src={images.icons.icClose} alt="ic-close-modal" />
            </div>
          </div>
          <div className={cx(styles.container)}>
            <p className={cx('fw-bold mb-2', styles.titleTable)}>
              List of templates
            </p>
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
                              onChange={(e) =>
                                handleSelectAll(e.target.checked)
                              }
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
              <NoDataImg />
            )}
            <div className={cx(styles.footer)}>
              <GroupButton
                className={styles.GroupButton}
                handleCancel={handleCancel}
                visibleSaveBtn={false}
                handleSubmit={handleConfirm}
                txButtonRight={t('buttons.confirm')}
              >
                <Button
                  buttonSize={ButtonSize.Medium}
                  buttonType={ButtonType.Dangerous}
                  className={cx(styles.buttonDelete)}
                  disabled={disable}
                  onClick={handleConfirm}
                >
                  Delete
                </Button>
              </GroupButton>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalDeleteTemplate;
