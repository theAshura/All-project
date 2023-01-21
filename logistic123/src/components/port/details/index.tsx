import images from 'assets/images/images';
import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { CommonQuery } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Port, UpdatePortParams } from 'models/api/port/port.model';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  deletePortActions,
  getPortDetailActions,
  updatePortActions,
} from 'store/port/port.action';

import PortForm from '../forms/PortForm';
import styles from './detail.module.scss';

export default function PortDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { portDetail } = useSelector((state) => state.port);
  const { userInfo } = useSelector((state) => state.authenticate);

  const { t } = useTranslation([I18nNamespace.PORT, I18nNamespace.COMMON]);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);

  const onDeletePort = () => {
    dispatch(
      deletePortActions.request({
        id,
        isDetail: true,
        getListPort: () => {
          history.push(AppRouteConst.PORT);
        },
      }),
    );
  };

  const handleSubmit = useCallback(
    (formData: Port) => {
      const finalParams: UpdatePortParams = {
        id,
        body: { ...formData, portType: formData.portType || undefined },
      };
      dispatch(updatePortActions.request(finalParams));
    },
    [dispatch, id],
  );

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: onDeletePort,
    });
  };

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  useEffect(() => {
    dispatch(getPortDetailActions.request(id));
    return () => {
      dispatch(
        getPortDetailActions.success({
          id: '',
          code: '',
          name: '',
          status: 'active',
          description: '',
        }),
      );
    };
  }, [dispatch, id]);

  // render
  return (
    <div className={styles.portDetail}>
      <HeaderPage
        breadCrumb={
          search === CommonQuery.EDIT
            ? BREAD_CRUMB.PORT_EDIT
            : BREAD_CRUMB.PORT_DETAIL
        }
        titlePage={t('txPort')}
      >
        {!isEdit && userInfo?.mainCompanyId === portDetail?.companyId && (
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
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.PORT_MASTER,
                action: ActionTypeEnum.UPDATE,
              }}
            >
              {({ hasPermission }) =>
                hasPermission && (
                  <Button
                    className={cx('me-1', styles.buttonFilter)}
                    onClick={(e) => {
                      history.push(
                        `${AppRouteConst.getPortById(portDetail?.id)}${
                          CommonQuery.EDIT
                        }`,
                      );
                    }}
                  >
                    <span className="pe-2">{t('buttons.txEdit')}</span>
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
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.PORT_MASTER,
                action: ActionTypeEnum.DELETE,
              }}
            >
              {({ hasPermission }) =>
                hasPermission && (
                  <Button
                    className={cx('ms-1', styles.buttonFilter)}
                    buttonType={ButtonType.Orange}
                    onClick={handleDelete}
                  >
                    <span className="pe-2">Delete</span>
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

      <PortForm isEdit={isEdit} data={portDetail} onSubmit={handleSubmit} />
    </div>
  );
}
