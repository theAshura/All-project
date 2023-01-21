import { useCallback, useState, useEffect, useMemo } from 'react';
import ModalComponent from 'components/ui/modal/Modal';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import cx from 'classnames';
import { toastError } from 'helpers/notification.helper';
import { getListRoleTemplate } from 'api/role.api';
import NoDataImg from 'components/common/no-data/NoData';
import Radio from 'components/ui/radio/Radio';
import Input from 'components/ui/input/Input';
import images from 'assets/images/images';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS } from 'constants/dynamic/role-and-permission.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './modal-default-role.module.scss';

const ModalDefaultRole = ({
  isOpen,
  loading,
  toggle,
  onSave,
  dynamicLabels,
}) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [listDefaultRole, setListDefaultRole] = useState([]);
  const [roleSelected, selectRole] = useState(null);

  useEffect(() => {
    getListRoleTemplate({
      pageSize: -1,
      isDefault: true,
    })
      .then((res) => setListDefaultRole(res?.data?.data || []))
      .catch((err) => toastError(err));
  }, []);

  const onClose = useCallback(() => {
    setSearchKeyword('');
    selectRole(null);
    toggle();
  }, [toggle]);

  const handleCheckRole = useCallback(() => {
    onSave(roleSelected);
    onClose();
  }, [onClose, onSave, roleSelected]);

  const dataRender = useMemo(
    () =>
      listDefaultRole?.filter((item) =>
        String(item?.name)
          .toLocaleLowerCase()
          ?.includes(String(searchKeyword)?.toLocaleLowerCase()),
      ),
    [listDefaultRole, searchKeyword],
  );

  return (
    <ModalComponent
      w={599}
      hiddenHeader
      isOpen={isOpen}
      toggle={onClose}
      content={
        <div className={styles.wrap}>
          <div className={styles.header}>
            <div className={styles.title}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS['Default role'],
              )}
            </div>
            <div>
              <Input
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Search,
                )}
                className={styles.searchInput}
                renderPrefix={
                  <img
                    src={images.icons.menu.icSearchInActive}
                    alt="buttonsearch"
                  />
                }
                // onKeyUp={onKeyUp}
                autoFocus
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={styles.content}>
            {dataRender?.length ? (
              dataRender?.map((role) => (
                <div
                  key={role.id}
                  onClick={() => {
                    selectRole(role);
                  }}
                  className={cx(
                    'd-flex align-items-center justify-content-between',
                    styles.lineRole,
                  )}
                >
                  <div className={styles.name}>{role?.name}</div>
                  <Radio
                    className={styles.checkBoxItem}
                    value={role?.id}
                    readOnly
                    checked={role?.id === roleSelected?.id}
                  />
                </div>
              ))
            ) : (
              <NoDataImg />
            )}
          </div>
          <div
            className={cx(
              styles.footer,
              'd-flex align-items-center justify-content-end',
            )}
          >
            <Button
              onClick={onClose}
              className={styles.cancelBtn}
              buttonSize={ButtonSize.Medium}
              buttonType={ButtonType.Cancel}
            >
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
            </Button>
            <Button
              disabled={!roleSelected || loading}
              disabledCss={!roleSelected || loading}
              onClick={handleCheckRole}
              buttonSize={ButtonSize.Medium}
            >
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Confirm)}
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default ModalDefaultRole;
