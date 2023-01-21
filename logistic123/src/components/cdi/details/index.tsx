import { AppRouteConst } from 'constants/route.const';
import images from 'assets/images/images';
import { useEffect, useState, useCallback } from 'react';
import cx from 'classnames';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import NoPermission from 'containers/no-permission';
import {
  getCDIDetailActions,
  updateCDIActions,
  deleteCDIActions,
} from 'store/cdi/cdi.action';
import { CreateCDIParams } from 'models/api/cdi/cdi.model';
import Container from 'components/common/container/ContainerPage';
import history from 'helpers/history.helper';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import styles from './detail.module.scss';
import CDIForm from '../forms/CDIForm';

export default function CDIDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { loading, CDIDetail } = useSelector((state) => state.cdi);

  const { t } = useTranslation(I18nNamespace.CDI);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (search !== '?edit') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  const handleSubmit = useCallback(
    (formData: CreateCDIParams) => {
      dispatch(updateCDIActions.request({ id, data: formData }));
    },
    [dispatch, id],
  );

  useEffect(() => {
    dispatch(getCDIDetailActions.request(id));
    return () => {
      dispatch(
        getCDIDetailActions.success({
          id: '',
          code: '',
          name: '',
          description: '',
          status: 'active',
          deleted: false,
        }),
      );
    };
  }, [dispatch, id]);

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.CDI,
        action:
          search === '?edit' ? ActionTypeEnum.UPDATE : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.CDIDetail}>
            <Container>
              <div className="d-flex justify-content-between">
                <div className={styles.headers}>
                  <BreadCrumb
                    current={
                      search === '?edit'
                        ? BREAD_CRUMB.CDI_EDIT
                        : BREAD_CRUMB.CDI_DETAIL
                    }
                  />
                  <div className={cx('fw-bold', styles.title)}>
                    {t('headPageTitle')}
                  </div>
                </div>
                {!isEdit && (
                  <div>
                    <Button
                      className={cx('me-2', styles.buttonFilter)}
                      buttonType={ButtonType.CancelOutline}
                      onClick={(e) => {
                        history.goBack();
                      }}
                    >
                      <span className="pe-2">Back</span>
                    </Button>
                    <PermissionCheck
                      options={{
                        feature: Features.CONFIGURATION,
                        subFeature: SubFeatures.CDI,
                        action: ActionTypeEnum.UPDATE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('me-1', styles.buttonFilter)}
                            onClick={(e) => {
                              history.push(
                                `${AppRouteConst.getCDIById(id)}?edit`,
                              );
                            }}
                          >
                            <span className="pe-2">Edit</span>
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
                        subFeature: SubFeatures.CDI,
                        action: ActionTypeEnum.DELETE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('ms-1', styles.buttonFilter)}
                            buttonType={ButtonType.Orange}
                            onClick={(e) => setModal(true)}
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
              </div>
              <ModalConfirm
                title={t('deleteTitle')}
                content={t('deleteMessage')}
                isDelete
                disable={loading}
                toggle={() => setModal(!modal)}
                modal={modal}
                handleSubmit={() => {
                  dispatch(
                    deleteCDIActions.request({
                      id,
                      isDetail: true,
                      getListCDI: () => {
                        history.push(AppRouteConst.CDI);
                      },
                    }),
                  );
                }}
              />
              <CDIForm
                isEdit={isEdit}
                data={CDIDetail}
                onSubmit={handleSubmit}
              />
            </Container>
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
