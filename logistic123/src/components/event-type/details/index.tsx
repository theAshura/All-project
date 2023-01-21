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
  getEventTypeDetailActions,
  updateEventTypeActions,
  deleteEventTypeActions,
} from 'store/event-type/event-type.action';
import { CommonQuery } from 'constants/common.const';
import { CreateEventTypeParams } from 'models/api/event-type/event-type.model';
import Container from 'components/common/container/ContainerPage';
import history from 'helpers/history.helper';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import styles from './detail.module.scss';
import EventTypeForm from '../forms/EventTypeForm';

export default function EventTypeManagementDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { loading, EVentTypeDetail } = useSelector((state) => state.eventType);

  const { t } = useTranslation(I18nNamespace.EVENT_TYPE);
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
    (formData: CreateEventTypeParams) => {
      dispatch(updateEventTypeActions.request({ id, data: formData }));
    },
    [dispatch, id],
  );

  useEffect(() => {
    dispatch(getEventTypeDetailActions.request(id));
    return () => {
      dispatch(
        getEventTypeDetailActions.success({
          id: '',
          code: '',
          name: '',
          status: 'active',
          companyId: '',
          createdAt: null,
          updatedAt: null,
          createdBy: '',
          updatedBy: '',
        }),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.EVENT_TYPE,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.getAuditTypeById}>
            <Container>
              <div className="d-flex justify-content-between">
                <div className={styles.headers}>
                  <BreadCrumb
                    current={
                      search === CommonQuery.EDIT
                        ? BREAD_CRUMB.EVENT_TYPE_EDIT
                        : BREAD_CRUMB.EVENT_TYPE_DETAIL
                    }
                  />
                  <div className={cx('fw-bold', styles.title)}>
                    {t('eventTypeManagementTitle')}
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
                        subFeature: SubFeatures.EVENT_TYPE,
                        action: ActionTypeEnum.UPDATE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('me-1', styles.buttonFilter)}
                            onClick={(e) => {
                              history.push(
                                `${AppRouteConst.getEventTypeById(id)}${
                                  CommonQuery.EDIT
                                }`,
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
                        subFeature: SubFeatures.EVENT_TYPE,
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
                    deleteEventTypeActions.request({
                      id,
                      isDetail: true,
                      getListEventType: () => {
                        history.push(AppRouteConst.EVENT_TYPE);
                      },
                    }),
                  );
                }}
              />
              <EventTypeForm
                isEdit={isEdit}
                data={EVentTypeDetail}
                onSubmit={handleSubmit}
                loading={loading}
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
