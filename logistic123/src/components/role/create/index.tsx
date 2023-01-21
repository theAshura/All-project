import { useEffect, useContext, useState, useCallback } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import useEffectOnce from 'hoc/useEffectOnce';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { RoleContext, DefaultValue } from 'contexts/role/RoleContext';
import {
  ActionTypeEnum,
  RoleScope,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import Button, { ButtonSize } from 'components/ui/button/Button';
import HeaderPage from 'components/common/header-page/HeaderPage';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';
import { toastError } from 'helpers/notification.helper';
import { getRolePermissionDetailApi } from 'api/role.api';
import {
  getPermissionsActions,
  clearRolesErrorsReducer,
  getAllActions,
} from 'store/role/role.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS } from 'constants/dynamic/role-and-permission.const';
import styles from './create.module.scss';
import { TableRoleAndPermissionDetail } from '../comon-components/TableRoleAndPermissionDetail';
import RoleAndPermissionDetailFilter from '../comon-components/RoleAndPermissionDetailFilter';
import ModalDefautRole from '../comon-components/modal-default-role/ModalDefautRole';

export default function RoleAndPermissionUpdate() {
  const [modalDefaultRoleVisible, setModalDefaultRoleVisible] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const dispatch = useDispatch();
  const { listActions, listPermission } = useSelector(
    (state) => state.roleAndPermission,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const { userInfo } = useSelector((state) => state.authenticate);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.UserRolesRoleAndPermission,
    modulePage: ModulePage.Create,
  });

  const {
    setDataPermissions,
    setDataActions,
    setDataIsCreate,
    setDataContent,
    setDataPermissionAllIDs,
    setDataDefaultValue,
  } = useContext(RoleContext);

  useEffectOnce(() => {
    setDataIsCreate(true);
    dispatch(getAllActions.request());
    dispatch(
      getPermissionsActions.request({
        pageSize: -1,
      }),
    );
    setDataContent('status', 'active');
    return () => {
      dispatch(clearRolesErrorsReducer());
    };
  });

  useEffect(() => {
    setDataActions(listActions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listActions]);

  useEffect(() => {
    setDataPermissions(listPermission);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPermission]);

  const handleDefaultRole = useCallback(
    (role) => {
      setInternalLoading(true);
      getRolePermissionDetailApi(role?.id)
        .then((res) => {
          const listID: string[] =
            res?.data?.rolePermissions?.map((item) => item?.permissionId) || [];

          const listPermissionDefault: DefaultValue[] =
            res?.data?.rolePermissions || [];
          setDataPermissionAllIDs(listID);
          setDataDefaultValue(listPermissionDefault);
        })
        .catch((err) => toastError(err))
        .finally(() => {
          setInternalLoading(false);
        });
    },
    [setDataDefaultValue, setDataPermissionAllIDs],
  );

  return (
    <PermissionCheck
      options={{
        feature: Features.USER_ROLE,
        subFeature: SubFeatures.ROLE_AND_PERMISSION,
        action: ActionTypeEnum.CREATE,
      }}
    >
      {({ hasPermission }) =>
        hasPermission && userInfo?.roleScope !== RoleScope.SuperAdmin ? (
          <div className={styles.wrapper}>
            <div
              className={cx(
                'd-flex align-items-center justify-content-between',
                styles.wrapHeader,
              )}
            >
              <HeaderPage
                breadCrumb={BREAD_CRUMB.ROLE_AND_PERMISSION_CREATE}
                titlePage={renderDynamicModuleLabel(
                  listModuleDynamicLabels,
                  DynamicLabelModuleName.UserRolesRoleAndPermission,
                )}
              />
              <Button
                onClick={() => setModalDefaultRoleVisible(true)}
                buttonSize={ButtonSize.Medium}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS['Choose template'],
                )}
              </Button>
            </div>
            <ModalDefautRole
              onSave={handleDefaultRole}
              isOpen={modalDefaultRoleVisible}
              loading={internalLoading}
              dynamicLabels={dynamicLabels}
              toggle={() => setModalDefaultRoleVisible(false)}
            />
            <div className={cx(styles.wrapperScroll)}>
              <RoleAndPermissionDetailFilter dynamicLabels={dynamicLabels} />
              <TableRoleAndPermissionDetail />
            </div>
          </div>
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
}
