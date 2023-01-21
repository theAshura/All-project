import {
  FC,
  useMemo,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import cx from 'classnames';
import { DataObj } from 'models/common.model';
import { useDispatch, useSelector } from 'react-redux';
import DetectEsc from 'components/common/modal/DetectEsc';
import { GroupButton } from 'components/ui/button/GroupButton';
import NoDataImg from 'components/common/no-data/NoData';
import CustomCheckbox from 'components/ui/checkbox/Checkbox';
import {
  getListTemplateActions,
  getListTemplateDictionaryActions,
  deleteTemplateActions,
} from 'store/template/template.action';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import CustomModalInside from 'components/ui/modal/custom-modal-inside/CustomModalInside';
import { RowModalComponent } from './row/RowModalCp';

import styles from './modal-list.module.scss';

export interface ModalProps {
  data: DataObj[];
  content?: string;
  isOpen: boolean;
  toggle: Dispatch<SetStateAction<boolean>>;
  templateModule: string;
  dynamicLabels?: IDynamicLabel;
}

const ModalList: FC<ModalProps> = ({
  data,
  isOpen,
  toggle,
  templateModule,
  dynamicLabels,
}) => {
  const rowLabels = [
    {
      label: 'checkbox',
      id: 'checkbox',
      width: 40,
    },
    {
      label: renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.TEMPLATES),
      id: 'templateName',
      width: '100%',
    },
  ];

  const dispatch = useDispatch();

  const [dataHolder, setDataHolder] = useState<DataObj[]>(data || []);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { loading } = useSelector((state) => state.template);

  const isDisable = (templateType: string) => {
    if (templateType !== 'global') return false;
    if (userInfo.roleScope !== 'Admin') return true;
    return false;
  };

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
        deleteTemplateActions.request({
          ids: newSelectedIds,
          getList: () => {
            dispatch(
              getListTemplateActions.request({
                content: templateModule,
              }),
            );
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
      <CustomModalInside
        isOpen={isOpen}
        toggle={handleCancel}
        modalClassName={cx(styles.wrapper, styles.customModalList)}
        title={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Delete template'],
        )}
        content={
          <div>
            <DetectEsc close={handleCancel} />
            <div className={cx(styles.container)}>
              <p className={cx('fw-bold mb-2', styles.titleTable)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['List of templates'],
                )}
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
                  txButtonRight={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Confirm,
                  )}
                >
                  <Button
                    buttonSize={ButtonSize.Medium}
                    buttonType={ButtonType.Dangerous}
                    className={cx(styles.buttonDelete)}
                    disabled={disable}
                    onClick={handleConfirm}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.Delete,
                    )}
                  </Button>
                </GroupButton>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ModalList;
