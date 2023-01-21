/* eslint-disable jsx-a11y/label-has-associated-control */
import images from 'assets/images/images';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/mailTemplate.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import cloneDeep from 'lodash/cloneDeep';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Modal } from 'reactstrap';
import useListMailUsers from '../../../hoc/useListMailUsers';
import SelectResult, {
  Position,
} from '../../common/select-result/SelectResult';
import Checkbox from '../../ui/checkbox/Checkbox';
import styles from './modal-choose-user.module.scss';

export interface RowLabelType {
  label: string;
  id: string;
  width: number | string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveData?: (data: any) => void;
  mailSelected?: any;
  autoResetData?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ModalChooseUser: FC<ModalProps> = ({
  isOpen,
  onClose,
  onSaveData,
  mailSelected,
  autoResetData,
  dynamicLabels,
}) => {
  const { listEmailUsers } = useListMailUsers();

  const [listDataSelected, setListDataSelected] = useState([]);
  const [listData, setListData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [search, setSearch] = useState('');

  const rowLabels = useMemo(
    () => [
      {
        label: renderDynamicLabel(
          dynamicLabels,
          MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Checkbox,
        ),
        id: 'checkbox',
        width: 80,
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Name,
        ),
        id: 'username',
        width: '30%',
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Mail address'],
        ),
        id: 'email',
        width: '30%',
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Job title'],
        ),
        id: 'jobTitle',
        width: '30%',
      },
    ],
    [dynamicLabels],
  );

  useEffect(() => {
    if (listEmailUsers) {
      setListData(listEmailUsers || []);
      setInitialData(listEmailUsers || []);
    }
  }, [listEmailUsers]);

  useEffect(() => {
    if (mailSelected && initialData?.length) {
      const dataSelect = initialData
        ?.map((item) => {
          if (mailSelected.find((i) => i.value === item?.email)) {
            return item;
          }
          return null;
        })
        ?.filter((i) => !!i);

      setListDataSelected(dataSelect || []);
    }
  }, [mailSelected, initialData]);

  const handleCancel = useCallback(() => {
    onClose();
    if (autoResetData) {
      setListDataSelected([]);
    }
  }, [autoResetData, onClose]);

  const handleConfirm = useCallback(() => {
    handleCancel();
    onSaveData(listDataSelected);
    setListDataSelected([]);
  }, [handleCancel, listDataSelected, onSaveData]);

  const handleSelectData = useCallback(
    (checked?: boolean, id?: string, clearAll?: boolean) => {
      if (clearAll) {
        setListDataSelected([]);
        return;
      }
      if (id === 'all') {
        if (listDataSelected?.length === listEmailUsers?.length) {
          setListDataSelected([]);
        } else {
          setListDataSelected(listEmailUsers);
        }
        return;
      }
      const existId = listDataSelected?.some((i) => i?.id === id);
      if (existId) {
        const newList = listDataSelected?.filter((i) => i.id !== id);
        setListDataSelected(newList);
      } else {
        const newList = cloneDeep(listDataSelected);
        const findingSelected = listEmailUsers?.find((i) => i.id === id);
        newList?.push(findingSelected);
        setListDataSelected(newList);
      }
    },
    [listEmailUsers, listDataSelected],
  );

  const handleFilterBySearch = useCallback(() => {
    if (!search) {
      setListData(initialData);
      return;
    }
    const result = initialData.filter(
      (i) =>
        i.username?.includes(search) ||
        i?.email?.includes(search) ||
        i.jobTitle?.includes(search),
    );
    setListData(result);
  }, [initialData, search]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {}}
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
          <div className={cx(styles.title)}>
            {renderDynamicLabel(
              dynamicLabels,
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Mail address'],
            )}
          </div>
          <div className={cx(styles.search)}>
            <Input
              placeholder={renderDynamicLabel(
                dynamicLabels,
                MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Search,
              )}
              renderPrefix={
                <img
                  src={images.icons.menu.icSearchInActive}
                  alt="buttonReset"
                />
              }
              autoFocus
              className={styles.searchInput}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <Button
              className={cx(styles.btnSearch)}
              buttonSize={ButtonSize.Medium}
              onClick={handleFilterBySearch}
            >
              {renderDynamicLabel(
                dynamicLabels,
                MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Search,
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
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Selected,
                )}:`}</span>
              </div>
            }
            listItem={
              listDataSelected?.length
                ? listDataSelected?.map((i) => ({
                    label: i.username,
                    value: i.id,
                  }))
                : []
            }
            handelClearItem={(id) => handleSelectData(null, id)}
            handelClearAll={() => handleSelectData(true, 'all', true)}
            dynamicLabels={dynamicLabels}
          />
        </div>
        {listData?.length ? (
          <div className={cx(styles.wrapperTable)}>
            <table className={styles.tableHeader}>
              <thead>
                <tr>
                  {rowLabels?.map((item) => (
                    <th key={item.id} style={{ width: item.width }}>
                      {item.id === 'checkbox' ? (
                        <Checkbox
                          checked={
                            listData?.length &&
                            listDataSelected?.length === listData?.length
                          }
                          onChange={(e) => handleSelectData(null, 'all')}
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
                  {listData?.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Checkbox
                          value={item.id}
                          checked={listDataSelected?.some(
                            (i) => i?.id === item?.id,
                          )}
                          onChange={(e) => {
                            handleSelectData(e.target.checked, item.id);
                          }}
                        />
                      </td>
                      <td>{item?.username}</td>
                      <td>{item?.email}</td>
                      <td>{item?.jobTitle}</td>
                    </tr>
                  ))}
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
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Confirm,
            )}
            txButtonLeft={renderDynamicLabel(
              dynamicLabels,
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Cancel,
            )}
            dynamicLabels={dynamicLabels}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalChooseUser;
