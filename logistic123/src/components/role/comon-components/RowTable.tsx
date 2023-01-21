import CheckBox from 'components/ui/checkbox/Checkbox';
import { Datum, Permission } from 'models/api/role/role.model';
import {
  useContext,
  FC,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import cx from 'classnames';
import { RoleContext } from '../../../contexts/role/RoleContext';
import styles from './common-detail.module.scss';

export interface ActionPermission {
  id?: string;
  name?: string;
}

interface RowTableProps {
  item: Datum;
  isChildren?: boolean;
  hiddenCheckBox?: boolean;
  actionItem?: ActionPermission[];
}
const RowTable: FC<RowTableProps> = (props) => {
  const { item, actionItem, isChildren, hiddenCheckBox } = props;
  const [selectedAll, setSelectedAll] = useState<boolean>(false);

  const {
    isEdit,
    permissionIDs,
    setDataPermissionIDs,
    setDataPermissionAllIDs,
  } = useContext(RoleContext);

  const listIdAction = useMemo(
    () => item?.permissions?.map((item) => item.id),
    [item?.permissions],
  );
  const viewAction: Permission = useMemo(
    () => item?.permissions?.find((item) => item?.action?.name === 'View'),
    [item?.permissions],
  );

  const listIdActionSelected = useMemo(
    () => permissionIDs.filter((item) => listIdAction.includes(item)),
    [permissionIDs, listIdAction],
  );

  const idActionsRestrictedFeedback = useMemo(() => {
    if (
      item?.name ===
      'Quality Assurance::Pilot/Terminal Feedback::Pilot/Terminal Feedback'
    ) {
      return item?.permissions?.find(
        (itemPermission) => itemPermission?.action?.name === 'Restricted',
      )?.id;
    }
    return '';
  }, [item]);

  const idActionsRestrictedIncidents = useMemo(() => {
    if (item?.name === 'Quality Assurance::Incidents::Incidents') {
      return item?.permissions?.find(
        (itemPermission) => itemPermission?.action?.name === 'Restricted',
      )?.id;
    }
    return '';
  }, [item]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedAll(checked);

      if (!checked) {
        const newPermisson = permissionIDs.filter(
          (item) => !listIdAction.includes(item),
        );

        setDataPermissionAllIDs(newPermisson);
      }
    },
    [listIdAction, permissionIDs, setDataPermissionAllIDs],
  );

  useEffect(() => {
    const hasCheckAction =
      listIdAction?.includes(idActionsRestrictedIncidents) ||
      listIdAction?.includes(idActionsRestrictedFeedback);
    const hasCheckedAction =
      listIdActionSelected?.includes(idActionsRestrictedIncidents) ||
      listIdActionSelected?.includes(idActionsRestrictedFeedback);

    if (hasCheckAction) {
      if (hasCheckedAction) {
        if (listIdAction.length > listIdActionSelected.length) {
          setSelectedAll(false);
        } else if (
          listIdAction.length === listIdActionSelected.length &&
          listIdAction.length
        ) {
          setSelectedAll(true);
        }
      } else if (listIdAction.length - 1 > listIdActionSelected.length) {
        setSelectedAll(false);
      } else if (
        listIdAction.length - 1 === listIdActionSelected.length &&
        listIdAction.length
      ) {
        setSelectedAll(true);
      }
    } else if (listIdAction.length > listIdActionSelected.length) {
      setSelectedAll(false);
    } else if (
      listIdAction.length === listIdActionSelected.length &&
      listIdAction.length
    ) {
      setSelectedAll(true);
    }
  }, [
    permissionIDs,
    listIdAction,
    listIdActionSelected,
    idActionsRestrictedIncidents,
    idActionsRestrictedFeedback,
  ]);

  useEffect(() => {
    if (selectedAll) {
      let newPermisson = permissionIDs;

      listIdAction.forEach((itemActions) => {
        if (
          !permissionIDs.includes(itemActions) &&
          idActionsRestrictedIncidents !== itemActions &&
          idActionsRestrictedFeedback !== itemActions
        ) {
          newPermisson = [...newPermisson, itemActions];
        }
      });

      setDataPermissionAllIDs(newPermisson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAll, listIdAction]);

  const hanleChecked = useCallback(
    (checked: boolean, id: string, itemAction: ActionPermission) => {
      const isExistView = permissionIDs.includes(viewAction?.id);
      const isExist = permissionIDs.includes(id);
      switch (itemAction.name) {
        case 'View':
          if (!checked) {
            handleSelectAll(false);
          } else {
            setDataPermissionIDs(id);
          }
          break;
        default:
          if (!isExistView) {
            let newPermisson = permissionIDs.filter((item) => item !== id);
            if (!isExist) {
              newPermisson = [...newPermisson, id, viewAction.id];
            } else {
              newPermisson = [...permissionIDs, viewAction.id];
            }
            setDataPermissionAllIDs(newPermisson);
          } else {
            setDataPermissionIDs(id);
          }

          break;
      }
    },
    [
      permissionIDs,
      viewAction?.id,
      handleSelectAll,
      setDataPermissionIDs,
      setDataPermissionAllIDs,
    ],
  );

  const renderTD = (itemAction: ActionPermission, itemRow: Datum) => {
    let idSelect: string = '';
    let isChecked: boolean = false;
    itemRow?.permissions?.forEach((i) => {
      if (itemAction.id === i?.action?.id) {
        idSelect = i.id;
        permissionIDs.forEach((itemValue) => {
          if (itemValue === i?.id) {
            isChecked = true;
          }
        });
      }

      return i?.action?.id;
    });

    if (idSelect.length === 0) {
      return (
        <td className={cx(styles.subTitle2)}>
          {/* <CheckBox checked={isChecked} disabled /> */}
        </td>
      );
    }

    return (
      <td className={cx(styles.subTitle2, 'text-center')}>
        <CheckBox
          checked={isChecked}
          disabled={idSelect.length === 0 || !isEdit}
          onChange={(e) => hanleChecked(e.target.checked, idSelect, itemAction)}
        />
      </td>
    );
  };

  return (
    <>
      <tr className={styles.rowTitle}>
        <td className={styles.subTitleName}>
          <div className={cx(styles.titleLeft, { 'ms-4': isChildren })}>
            {item?.description}
          </div>
        </td>
        <td>
          {!hiddenCheckBox && (
            <CheckBox
              checked={selectedAll}
              disabled={!isEdit || !actionItem.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          )}
        </td>
        {actionItem?.map((itemAction) => renderTD(itemAction, item))}
        <td> </td>
      </tr>
    </>
  );
};

export default RowTable;
