import { AppRouteConst } from 'constants/route.const';
import images from 'assets/images/images';
import cx from 'classnames';
import { useLocation, useParams } from 'react-router-dom';
import history from 'helpers/history.helper';
import Button, { ButtonType } from 'components/ui/button/Button';
import { useEffect, useContext, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useEffectOnce from 'hoc/useEffectOnce';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { CommonQuery } from 'constants/common.const';
import { RoleContext, DefaultValue } from 'contexts/role/RoleContext';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  RoleScope,
  SubFeatures,
  ActionTypeEnum,
  FIXED_ROLE_NAME,
} from 'constants/roleAndPermission.const';
import NoPermission from 'containers/no-permission';
import {
  getPermissionsActions,
  getAllActions,
  getRolePermissionDetailActions,
  deleteRoleActions,
  clearRolesErrorsReducer,
} from 'store/role/role.action';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { TableRoleAndPermissionDetail } from '../comon-components/TableRoleAndPermissionDetail';
import RoleAndPermissionDetailFilter from '../comon-components/RoleAndPermissionDetailFilter';
import styles from './detail.module.scss';

export default function RoleAndPermissionDetailContainer() {
  const { search } = useLocation();
  const [modal, setModal] = useState(false);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authenticate);

  const { loading, listActions, listPermission, rolePermissionDetail } =
    useSelector((state) => state.roleAndPermission);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const {
    setDataPermissions,
    setDataActions,
    isEdit,
    setDataIsEdit,
    setDataAllContent,
    setDataPermissionAllIDs,
    setDataDefaultValue,
  } = useContext(RoleContext);
  const { id } = useParams<{ id: string }>();
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.UserRolesRoleAndPermission,
    modulePage: isEdit ? ModulePage.Edit : ModulePage.View,
  });

  useEffectOnce(() => {
    dispatch(getRolePermissionDetailActions.request(id));
    dispatch(getAllActions.request());
    dispatch(
      getPermissionsActions.request({
        pageSize: -1,
      }),
    );
    return () => {
      dispatch(clearRolesErrorsReducer());
      dispatch(
        getRolePermissionDetailActions.success({
          id: '',
          name: '',
          description: '',
          status: '',
          rolePermissions: [],
        }),
      );
    };
  });

  useEffect(() => {
    setDataActions(listActions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listActions]);

  useEffect(() => {
    setDataAllContent({
      name: rolePermissionDetail?.name,
      description: rolePermissionDetail?.description,
      status: rolePermissionDetail?.status,
    });

    const listID: string[] =
      rolePermissionDetail?.rolePermissions?.map(
        (item) => item?.permissionId,
      ) || [];

    const listPermissionDefault: DefaultValue[] =
      rolePermissionDetail?.rolePermissions || [];
    setDataPermissionAllIDs(listID);
    setDataDefaultValue(listPermissionDefault);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolePermissionDetail]);

  useEffect(() => {
    setDataPermissions(listPermission);
  }, [listPermission, setDataPermissions]);

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setDataIsEdit(false);
    } else {
      setDataIsEdit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const allowDelete = useMemo(() => {
    if (rolePermissionDetail?.isDefault) {
      return false;
    }
    if (
      rolePermissionDetail?.name !== FIXED_ROLE_NAME.AUDITEE &&
      rolePermissionDetail?.name !== FIXED_ROLE_NAME.INSPECTOR &&
      rolePermissionDetail?.name !== FIXED_ROLE_NAME.PILOT
    ) {
      return true;
    }
    return false;
  }, [rolePermissionDetail?.isDefault, rolePermissionDetail?.name]);

  return (
    <PermissionCheck
      options={{
        feature: Features.USER_ROLE,
        subFeature: SubFeatures.ROLE_AND_PERMISSION,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission && userInfo?.roleScope !== RoleScope.SuperAdmin ? (
          <div className={styles.wrapper}>
            <HeaderPage
              breadCrumb={
                search === CommonQuery.EDIT
                  ? BREAD_CRUMB.ROLE_AND_PERMISSION_EDIT
                  : BREAD_CRUMB.ROLE_AND_PERMISSION_DETAIL
              }
              titlePage={renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.UserRolesRoleAndPermission,
              )}
            >
              {!isEdit && (
                <div>
                  <Button
                    className={cx('me-2', styles.buttonFilter)}
                    buttonType={ButtonType.CancelOutline}
                    onClick={(e) => {
                      history.goBack();
                    }}
                  >
                    <span>Back</span>
                  </Button>
                  <PermissionCheck
                    options={{
                      feature: Features.USER_ROLE,
                      subFeature: SubFeatures.ROLE_AND_PERMISSION,
                      action: ActionTypeEnum.UPDATE,
                    }}
                  >
                    {({ hasPermission }) =>
                      hasPermission &&
                      !rolePermissionDetail?.isDefault && (
                        <Button
                          className={cx('me-1', styles.buttonFilter)}
                          onClick={(e) => {
                            history.push(
                              `${AppRouteConst.getRoleAndPermissionById(id)}${
                                CommonQuery.EDIT
                              }`,
                            );
                          }}
                        >
                          <span className="pe-2">
                            {renderDynamicLabel(
                              dynamicLabels,
                              COMMON_DYNAMIC_FIELDS.Edit,
                            )}
                          </span>
                          <img
                            src={images.icons.icEdit}
                            alt="edit"
                            className={styles.icEdit}
                          />
                        </Button>
                      )
                    }
                  </PermissionCheck>

                  <PermissionCheck
                    options={{
                      feature: Features.USER_ROLE,
                      subFeature: SubFeatures.ROLE_AND_PERMISSION,
                      action: ActionTypeEnum.DELETE,
                    }}
                  >
                    {({ hasPermission }) =>
                      hasPermission &&
                      allowDelete && (
                        <Button
                          className={cx('ms-1', styles.buttonFilter)}
                          buttonType={ButtonType.Orange}
                          onClick={(e) => {
                            setModal(true);
                          }}
                        >
                          <span className="pe-2">
                            {renderDynamicLabel(
                              dynamicLabels,
                              COMMON_DYNAMIC_FIELDS.Delete,
                            )}
                          </span>
                          <img
                            src={images.icons.icRemove}
                            alt="remove"
                            className={styles.icRemove}
                          />
                        </Button>
                      )
                    }
                  </PermissionCheck>
                </div>
              )}
            </HeaderPage>

            <ModalConfirm
              title={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Delete?'],
              )}
              content={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS[
                  'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
                ],
              )}
              dynamicLabels={dynamicLabels}
              isDelete
              disable={loading}
              toggle={() => setModal(!modal)}
              modal={modal}
              handleSubmit={() =>
                dispatch(
                  deleteRoleActions.request({
                    id,
                    isDetail: true,
                    getListRole: () => {
                      history.push(AppRouteConst.ROLE);
                    },
                  }),
                )
              }
            />
            <div className={cx(styles.wrapperScroll)}>
              <RoleAndPermissionDetailFilter dynamicLabels={dynamicLabels} />
              <TableRoleAndPermissionDetail
                dynamicLabels={dynamicLabels}
                id={id}
              />
            </div>
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
