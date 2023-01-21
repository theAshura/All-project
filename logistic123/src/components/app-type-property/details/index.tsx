import images from 'assets/images/images';
import cx from 'classnames';
import Button, { ButtonType } from 'components/ui/button/Button';
import { CommonQuery } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import HeaderPage from 'components/common/header-page/HeaderPage';
import NoPermission from 'containers/no-permission';
import history from 'helpers/history.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { AppTypeProperty } from 'models/api/app-type-property/app-type-property.model';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  getAppTypePropertyDetailActions,
  updateAppTypePropertyActions,
} from 'store/app-type-property/app-type-property.action';

import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD } from 'constants/dynamic/appTypeProperty.const';
import AppTypePropertyForm from '../forms/AppTypePropertyForm';
import styles from './detail.module.scss';

export default function AppTypePropertyDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { appTypePropertyDetail } = useSelector(
    (state) => state.appTypeProperty,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAppTypeProperty,
    modulePage: getCurrentModulePageByStatus(isEdit, false),
  });

  const handleSubmit = useCallback(
    (formData: AppTypeProperty) => {
      dispatch(updateAppTypePropertyActions.request({ id, body: formData }));
    },
    [dispatch, id],
  );

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  useEffect(() => {
    dispatch(getAppTypePropertyDetailActions.request(id));
    return () => {
      dispatch(
        getAppTypePropertyDetailActions.success({
          id: '',
          code: '',
          name: '',
          deleted: false,
        }),
      );
    };
  }, [dispatch, id]);

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.APP_TYPE_PROPERTY,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.psc}>
            <HeaderPage
              breadCrumb={
                search === CommonQuery.EDIT
                  ? BREAD_CRUMB.APP_TYPE_PROPERTY_EDIT
                  : BREAD_CRUMB.APP_TYPE_PROPERTY_DETAIL
              }
              titlePage={renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.ConfigurationInspectionAppTypeProperty,
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
                    <span className="pe-2">
                      {renderDynamicLabel(
                        dynamicLabels,
                        APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD.Back,
                      )}
                    </span>
                  </Button>
                  {userInfo?.mainCompanyId ===
                    appTypePropertyDetail?.companyId && (
                    <PermissionCheck
                      options={{
                        feature: Features.CONFIGURATION,
                        subFeature: SubFeatures.APP_TYPE_PROPERTY,
                        action: ActionTypeEnum.UPDATE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('me-1', styles.buttonFilter)}
                            onClick={() => {
                              history.push(
                                `${AppRouteConst.getAppTypePropertyById(id)}${
                                  CommonQuery.EDIT
                                }`,
                              );
                            }}
                          >
                            <span className="pe-2">
                              {renderDynamicLabel(
                                dynamicLabels,
                                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD.Edit,
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
                  )}
                </div>
              )}
            </HeaderPage>
            <AppTypePropertyForm
              isEdit={isEdit}
              data={appTypePropertyDetail}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
