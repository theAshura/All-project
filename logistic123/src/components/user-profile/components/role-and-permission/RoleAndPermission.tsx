import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import cx from 'classnames';
import {
  RoleScope,
  Features,
  SubFeatures,
  LIST_INSPECTORS,
} from 'constants/roleAndPermission.const';
import { FC, useContext, useMemo, useState, useCallback } from 'react';
import { StatusPage, UserContext } from 'contexts/user-profile/UserContext';
import { useSelector } from 'react-redux';
import ModalConfirm from 'components/role/modal/ModalConfirm';
import history from 'helpers/history.helper';
import { useFormContext, Controller } from 'react-hook-form';
import { permissionCheck } from 'helpers/permissionCheck.helper';
import isEmpty from 'lodash/isEmpty';
import images from 'assets/images/images';
import { AppRouteConst } from 'constants/route.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import Container from 'components/common/container/Container';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './role-and-permission.module.scss';

interface RoleAndPermissionProps {
  onSubmit?: (
    data,
    keepCurrentPage?: boolean,
    tab?: string,
    containInspector?: boolean,
  ) => void;
  dynamicLabels?: IDynamicLabel;
}

const RoleAndPermission: FC<RoleAndPermissionProps> = ({
  onSubmit,
  dynamicLabels,
}) => {
  const { statusPage } = useContext(UserContext);
  const [modal, setModal] = useState(false);
  const { userInfo } = useSelector((state) => state.authenticate);

  const {
    watch,
    handleSubmit,
    getValues,
    formState: { errors },
    control,
  } = useFormContext();

  const { listRolePermissionDetail, disable } = useSelector(
    (state) => state.user,
  );

  const disabledAction = useMemo(() => {
    if (statusPage === StatusPage.VIEW) {
      return true;
    }
    if (
      !permissionCheck(userInfo, {
        feature: Features.USER_ROLE,
        subFeature: SubFeatures.USER,
      })
    ) {
      return true;
    }
    return false;
  }, [statusPage, userInfo]);

  const roleAndPermissionOptionsSelect = useMemo(
    () =>
      listRolePermissionDetail?.filter((i) => {
        if (userInfo.roleScope === RoleScope.SuperAdmin) return true;
        if (
          statusPage !== StatusPage.VIEW &&
          userInfo?.mainCompanyId &&
          i.name === 'Admin'
        )
          return false;
        return i.name !== RoleScope.SuperAdmin;
      }),
    [listRolePermissionDetail, statusPage, userInfo],
  );

  const listRoleSelected = useCallback(
    (values: string[]) => {
      const convertSelected = values?.map((roleId) => {
        const roleInfo = roleAndPermissionOptionsSelect?.find(
          (item) => item?.id === roleId,
        );
        return roleInfo
          ? {
              value: roleInfo?.id,
              label: roleInfo?.name,
            }
          : null;
      });
      return convertSelected?.filter((item) => item);
    },
    [roleAndPermissionOptionsSelect],
  );

  const handleSelect = (
    id: string,
    values: string[],
    onChange: (values) => void,
  ) => {
    let newRoles = values?.length ? [...values] : [];
    if (newRoles.includes(id)) {
      newRoles = newRoles?.filter((item) => item !== id);
    } else {
      newRoles.push(id);
    }
    onChange(newRoles);
  };

  const handleSubmitFn = (dataForm) => {
    const containInspector = listRoleSelected(getValues('roles'))?.some(
      (item) => LIST_INSPECTORS.includes(item.label),
    );
    onSubmit(
      {
        ...dataForm,
      },
      false,
      null,
      containInspector,
    );
  };

  return (
    <div className={styles.wrapRoleAndPermission}>
      <Controller
        control={control}
        name="roles"
        render={({ field: { value, onChange } }) => (
          <Container>
            <div className={styles.roleAndPermission}>
              {statusPage !== StatusPage.VIEW && (
                <div className={cx('d-flex', styles.selectedRole)}>
                  <div>
                    <div className={styles.titleSelectRole}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Selected role'],
                      )}
                      :
                    </div>
                  </div>

                  <div className="flex-grow-1 d-flex flex-wrap mb-2">
                    {listRoleSelected(value)?.map((item) => (
                      <Button
                        className="ms-3 mt-2"
                        key={item?.value}
                        onClick={() => {
                          handleSelect(item.value, value, onChange);
                        }}
                        size={ButtonSize.XSmall}
                        disabled={disabledAction}
                        renderSuffix={
                          !disabledAction && (
                            <img
                              src={images.icons.icX}
                              className={styles.icXResult}
                              alt="result"
                            />
                          )
                        }
                      >
                        {item?.label}
                      </Button>
                    ))}
                  </div>
                  {value?.length !== 0 && (
                    <Button
                      onClick={() => {
                        onChange([]);
                      }}
                      className={cx('ms-3 mt-2', styles.btnClearAll)}
                      size={ButtonSize.XSmall}
                      buttonType={ButtonType.Dangerous}
                      renderSuffix={<img src={images.icons.icX} alt="result" />}
                    >
                      {renderDynamicLabel(
                        dynamicLabels,
                        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Clear all'],
                      )}
                    </Button>
                  )}
                </div>
              )}
              {errors?.roles?.message && !disabledAction && (
                <div className={cx('pt-2', styles.required)}>
                  {errors?.roles?.message}
                </div>
              )}

              <div className={cx('d-flex mt-2', styles.wrapRole)}>
                <div className="d-flex position-relative">
                  <div className={styles.titleRole}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                        'Role and permission'
                      ],
                    )}
                  </div>
                  {statusPage === StatusPage.CREATE && (
                    <img
                      src={images.icons.icRequiredAsterisk}
                      className={cx('position-absolute', styles.icRequired)}
                      alt="required"
                    />
                  )}
                </div>

                <div>
                  {roleAndPermissionOptionsSelect
                    ?.filter((item) =>
                      !disabledAction ? true : value?.includes(item?.id),
                    )
                    ?.map((item) => (
                      <Button
                        className="ms-3 mb-3"
                        key={item?.id}
                        disabled={disabledAction}
                        onClick={() => handleSelect(item.id, value, onChange)}
                        buttonType={
                          value?.includes(item?.id)
                            ? ButtonType.Outline
                            : ButtonType.OutlineGray
                        }
                        size={ButtonSize.XSmall}
                      >
                        {item?.name}
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          </Container>
        )}
      />

      {!disabledAction && (
        <div className={cx('d-flex justify-content-end pt-3', styles.wrapBtn)}>
          <Button
            className="me-3"
            buttonType={ButtonType.Select}
            buttonSize={ButtonSize.Small}
            onClick={() => setModal(true)}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            buttonSize={ButtonSize.Small}
            loading={disable}
            onClick={
              isEmpty(errors.roles)
                ? handleSubmit(handleSubmitFn, (err) => {
                    const watchForm = watch();
                    const watchRoles = watch('roles');
                    if (isEmpty(err?.roles)) {
                      handleSubmitFn({
                        ...watchForm,
                        roles: watchRoles,
                      });
                    }
                  })
                : null
            }
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
          </Button>
        </div>
      )}

      <ModalConfirm
        toggle={() => setModal(!modal)}
        modal={modal}
        handleSubmit={() => history.push(AppRouteConst.USER)}
        title={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Cancel?'],
        )}
        content={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        )}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default RoleAndPermission;
