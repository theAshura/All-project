import cx from 'classnames';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS } from 'constants/dynamic/role-and-permission.const';
import { statusOptions } from 'constants/filter.const';
import { FIXED_ROLE_NAME } from 'constants/roleAndPermission.const';
import { RoleContext } from 'contexts/role/RoleContext';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { useContext, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Input from '../../ui/input/Input';
import Select from '../../ui/select/Select';

import styles from './common-detail.module.scss';

const RoleAndPermissionDetailFilter = ({ dynamicLabels }) => {
  const { content, isEdit, isShowError, setDataContent } =
    useContext(RoleContext);

  const { errorList, rolePermissionDetail } = useSelector(
    (state) => state.roleAndPermission,
  );

  const scrollToView = useCallback((id: string) => {
    const el = document.querySelector(id);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  const error = useMemo(() => {
    if (content?.name === '' && isShowError) {
      scrollToView('#role-management-role-name');
      return renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['This field is required'],
      );
    }
    if (errorList?.length) {
      scrollToView('#role-management-role-name');
      return renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['The role name is existed'],
      );
    }

    return '';
  }, [
    content?.name,
    isShowError,
    errorList?.length,
    scrollToView,
    dynamicLabels,
  ]);

  return (
    <div className={cx('pb-4', styles.wrapperFilter)}>
      <div className={styles.title}>
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS['General information'],
        )}
      </div>
      <div className={styles.wrapperInput}>
        <Input
          label={renderDynamicLabel(
            dynamicLabels,
            DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS['Role name'],
          )}
          disabled={
            !isEdit ||
            rolePermissionDetail?.name === FIXED_ROLE_NAME.AUDITEE ||
            rolePermissionDetail?.name === FIXED_ROLE_NAME.INSPECTOR ||
            rolePermissionDetail?.name === FIXED_ROLE_NAME.PILOT
          }
          placeholder={renderDynamicLabel(
            dynamicLabels,
            DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS['Enter role name'],
          )}
          isRequired
          id="role-management-role-name"
          value={content?.name}
          messageRequired={error}
          className={cx(styles.inputRole)}
          maxLength={128}
          onChange={(e) => setDataContent('name', e.target.value)}
        />
        <Input
          label={renderDynamicLabel(
            dynamicLabels,
            DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS.Description,
          )}
          className={cx(styles.inputRole)}
          maxLength={128}
          value={content?.description}
          placeholder={
            isEdit &&
            renderDynamicLabel(
              dynamicLabels,
              DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS['Enter description'],
            )
          }
          disabled={!isEdit}
          onChange={(e) => setDataContent('description', e.target.value)}
        />
        <div className={styles.wrapSelect}>
          <div className="d-flex align-items-start pb-1">
            <span className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS.Status,
              )}
            </span>
          </div>

          <Select
            disabled={!isEdit}
            data={statusOptions}
            className={cx(styles.inputSelect, {
              [styles.wrapSelectError]: isShowError && !content?.status?.trim(),
            })}
            // sizes="large"
            value={content.status}
            onChange={(value) => setDataContent('status', value)}
          />
          {isShowError && !content?.status?.trim() && (
            <div className={cx('mt-2', styles.errorSelect)}>
              {renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['This field is required'],
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleAndPermissionDetailFilter;
