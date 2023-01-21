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
import {
  getStandardMasterDetailActions,
  updateStandardMasterActions,
  deleteStandardMasterActions,
} from 'store/standard-master/standard-master.action';
import { CreateStandardMasterParams } from 'models/api/standard-master/standard-master.model';
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
import StandardMasterForm from '../forms';

export default function StandardMasterManagementDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { loading, standardMasterDetail } = useSelector(
    (state) => state.standardMaster,
  );

  const { t } = useTranslation(I18nNamespace.STANDARD_MASTER);
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
    (formData: CreateStandardMasterParams) => {
      dispatch(updateStandardMasterActions.request({ id, data: formData }));
    },
    [dispatch, id],
  );

  useEffect(() => {
    dispatch(getStandardMasterDetailActions.request(id));
    return () => {
      dispatch(getStandardMasterDetailActions.success(null));
    };
  }, [dispatch, id]);

  return (
    <div className={styles.detailWrapper}>
      <Container>
        <div className="d-flex justify-content-between">
          <div className={styles.headers}>
            <BreadCrumb
              current={
                search === CommonQuery.EDIT
                  ? BREAD_CRUMB.STANDARD_MASTER_EDIT
                  : BREAD_CRUMB.STANDARD_MASTER_DETAIL
              }
            />
            <div className={cx('fw-bold', styles.title)}>
              {t('standardMaster')}
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
              {standardMasterDetail?.createdUserId && (
                <PermissionCheck
                  options={{
                    feature: Features.QUALITY_ASSURANCE,
                    subFeature: SubFeatures.STANDARD_MASTER,
                    action: ActionTypeEnum.UPDATE,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission && (
                      <Button
                        className={cx('me-1', styles.buttonFilter)}
                        onClick={(e) => {
                          history.push(
                            `${AppRouteConst.getStandardMasterById(id)}${
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
              )}

              {standardMasterDetail?.createdUserId && (
                <PermissionCheck
                  options={{
                    feature: Features.QUALITY_ASSURANCE,
                    subFeature: SubFeatures.STANDARD_MASTER,
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
              )}
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
              deleteStandardMasterActions.request({
                id,
                isDetail: true,
                handleSuccess: () => {
                  history.push(AppRouteConst.STANDARD_MASTER);
                },
              }),
            );
          }}
        />
        <StandardMasterForm
          isEdit={isEdit}
          data={standardMasterDetail}
          onSubmit={handleSubmit}
        />
      </Container>
    </div>
  );
}
