import { AppRouteConst } from 'constants/route.const';
import images from 'assets/images/images';
import { useEffect, useState, useCallback } from 'react';
import cx from 'classnames';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import {
  getCompanyManagementDetailActions,
  updateCompanyManagementActions,
  updateParamsActions,
} from 'store/company/company.action';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
  RoleScope,
} from 'constants/roleAndPermission.const';
import history from 'helpers/history.helper';
import { CommonQuery } from 'constants/common.const';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { deleteCompanyManagementApi } from 'api/company.api';
import { toastError } from 'helpers/notification.helper';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import Button, { ButtonType } from 'components/ui/button/Button';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { CreateManagementParams } from 'models/store/company/company.model';
import CompanyManagementForm from '../forms/CompanyForm';
import styles from './detail.module.scss';

const CompanyManagementDetailContainer = () => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const [isView, setIsView] = useState(false);

  const [modal, setModal] = useState(false);
  const { id } = useParams<{ id: string }>();

  const { loading, getCompanyById, params, listCompanyManagementTypes } =
    useSelector((state) => state.companyManagement);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const { userInfo } = useSelector((state) => state.authenticate);

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsView(true);
    } else {
      setIsView(false);
    }
  }, [search]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.GroupCompanyCompany,
    modulePage: getCurrentModulePageByStatus(!isView, false),
  });

  useEffect(() => {
    dispatch(getCompanyManagementDetailActions.request(id));
    return () => {
      dispatch(getCompanyManagementDetailActions.success(null));
    };
  }, [dispatch, id]);

  const handleEditData = useCallback(
    (dataParams: CreateManagementParams) => {
      const data = { ...dataParams };
      if (data.phone === '') {
        delete data?.phone;
      }
      dispatch(updateCompanyManagementActions.request({ id, data }));
    },
    [dispatch, id],
  );

  const handleDeleteCompany = async () => {
    try {
      await deleteCompanyManagementApi(id);
      if (listCompanyManagementTypes.data.length === 1) {
        let newParams = { ...params };
        if (params.page > 1) {
          newParams = {
            ...params,
            page: params.page - 1,
          };
          dispatch(updateParamsActions(newParams));
        } else {
          dispatch(updateParamsActions(params));
        }
      }
      history.push(AppRouteConst.COMPANY);
      setModal(false);
    } catch (e) {
      toastError(e);
      setModal(false);
    }
  };

  return (
    <PermissionCheck
      options={{
        feature: Features.GROUP_COMPANY,
        subFeature: SubFeatures.COMPANY,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission && (
          <div className={styles.companyManagement}>
            <HeaderPage
              breadCrumb={
                search === CommonQuery.EDIT
                  ? BREAD_CRUMB.COMPANY_EDIT
                  : BREAD_CRUMB.COMPANY_DETAIL
              }
              titlePage={renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.GroupCompanyCompany,
              )}
            >
              {isView && (
                <div>
                  <Button
                    className={cx('me-2', styles.buttonFilter)}
                    buttonType={ButtonType.CancelOutline}
                    onClick={(e) => {
                      history.push(AppRouteConst.COMPANY);
                    }}
                  >
                    <span>
                      {renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS.Back,
                      )}
                    </span>
                  </Button>
                  <PermissionCheck
                    options={{
                      feature: Features.GROUP_COMPANY,
                      subFeature: SubFeatures.COMPANY,
                      action: ActionTypeEnum.UPDATE,
                    }}
                  >
                    {({ hasPermission }) =>
                      hasPermission &&
                      userInfo?.roleScope !== RoleScope.User && (
                        <Button
                          className={cx('me-1', styles.buttonFilter)}
                          onClick={(e) => {
                            history.push(
                              `${AppRouteConst.getCompanyById(id)}${
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
                      feature: Features.GROUP_COMPANY,
                      subFeature: SubFeatures.COMPANY,
                      action: ActionTypeEnum.DELETE,
                    }}
                  >
                    {({ hasPermission }) =>
                      hasPermission &&
                      userInfo?.roleScope !== RoleScope.User && (
                        <Button
                          className={cx('ms-1', styles.buttonFilter)}
                          buttonType={ButtonType.Orange}
                          onClick={(e) => setModal(true)}
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
              isDelete
              disable={loading}
              toggle={() => setModal(!modal)}
              modal={modal}
              handleSubmit={handleDeleteCompany}
              cancelTxt={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Cancel,
              )}
              rightTxt={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Delete,
              )}
            />
            <CompanyManagementForm
              isView={isView}
              data={getCompanyById}
              onSubmit={handleEditData}
              loading={loading}
            />
          </div>
        )
      }
    </PermissionCheck>
  );
};

export default CompanyManagementDetailContainer;
