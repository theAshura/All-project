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
  getShipDirectResponsibleDetailActions,
  updateShipDirectResponsibleActions,
  deleteShipDirectResponsibleActions,
} from 'store/ship-direct-responsible/ship-direct-responsible.action';
import { CreateShipDirectResponsibleParams } from 'models/api/ship-direct-responsible/ship-direct-responsible.model';
import { CommonQuery } from 'constants/common.const';
import Container from 'components/common/container/ContainerPage';
import history from 'helpers/history.helper';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import styles from './detail.module.scss';
import ShipDirectResponsibleForm from '../forms/ShipDirectResponsibleForm';

export default function ShipDirectResponsibleManagementDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { loading, shipDirectResponsibleDetail } = useSelector(
    (state) => state.shipDirectResponsible,
  );

  const { t } = useTranslation(I18nNamespace.SHIP_DIRECT_RESPONSIBLE);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  const handleSubmit = useCallback(
    (formData: CreateShipDirectResponsibleParams) => {
      dispatch(
        updateShipDirectResponsibleActions.request({ id, data: formData }),
      );
    },
    [dispatch, id],
  );

  useEffect(() => {
    dispatch(getShipDirectResponsibleDetailActions.request(id));
    return () => {
      dispatch(
        getShipDirectResponsibleDetailActions.success({
          id: '',
          code: '',
          name: '',
          scope: 'internal',
          status: 'active',
          shipRankId: '',
          deleted: false,
        }),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.SHIP_DIRECT_RESPONSIBLE,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.getShipDirectResponsibleById}>
            <Container>
              <div className="d-flex justify-content-between">
                <div className={styles.headers}>
                  <BreadCrumb
                    current={
                      search === CommonQuery.EDIT
                        ? BREAD_CRUMB.SHIP_DIRECT_RESPONSIBLE_EDIT
                        : BREAD_CRUMB.SHIP_DIRECT_RESPONSIBLE_DETAIL
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
                        subFeature: SubFeatures.SHIP_DIRECT_RESPONSIBLE,
                        action: ActionTypeEnum.UPDATE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('me-1', styles.buttonFilter)}
                            onClick={(e) => {
                              history.push(
                                `${AppRouteConst.getShipDirectResponsibleById(
                                  id,
                                )}${CommonQuery.EDIT}`,
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
                        subFeature: SubFeatures.SHIP_DIRECT_RESPONSIBLE,
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
                    deleteShipDirectResponsibleActions.request({
                      id,
                      isDetail: true,
                      getListShipDirectResponsible: () => {
                        history.push(AppRouteConst.SHIP_DIRECT_RESPONSIBLE);
                      },
                    }),
                  );
                }}
              />
              <ShipDirectResponsibleForm
                isEdit={isEdit}
                data={shipDirectResponsibleDetail}
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
