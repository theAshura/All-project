import images from 'assets/images/images';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
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
import NoPermission from 'containers/no-permission';
import history from 'helpers/history.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { PSCDeficiency } from 'models/api/psc-deficiency/psc-deficiency.model';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  deletePSCDeficiencyActions,
  getPSCDeficiencyDetailActions,
  updatePSCDeficiencyActions,
} from 'store/psc-deficiency/psc-deficiency.action';

import PSCDeficiencyForm from '../forms/PSCDeficiencyForm';
import styles from './detail.module.scss';

export default function PSCDeficiencyManagementDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { pscDeficiencyDetail } = useSelector((state) => state.pscDeficiency);

  const { t } = useTranslation(I18nNamespace.PSC_DEFICIENCY);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: () => {
        dispatch(
          deletePSCDeficiencyActions.request({
            id,
            isDetail: true,
            getListPSCDeficiency: () => {
              history.push(AppRouteConst.PSC_DEFICIENCY);
            },
          }),
        );
      },
    });
  };

  const handleSubmit = useCallback(
    (formData: PSCDeficiency) => {
      dispatch(updatePSCDeficiencyActions.request({ id, body: formData }));
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
    dispatch(getPSCDeficiencyDetailActions.request(id));
    return () => {
      dispatch(
        getPSCDeficiencyDetailActions.success({
          id: '',
          code: '',
          name: '',
          scope: 'internal',
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
        subFeature: SubFeatures.CHARTER_OWNER,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.psc}>
            <Container>
              <div className="d-flex justify-content-between">
                <div className={styles.headers}>
                  <BreadCrumb
                    current={
                      search === CommonQuery.EDIT
                        ? BREAD_CRUMB.PSC_DEFICIENCY_EDIT
                        : BREAD_CRUMB.PSC_DEFICIENCY_DETAIL
                    }
                  />
                  <div className={cx('fw-bold', styles.title)}>
                    {t('txPSC')}
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
                        subFeature: SubFeatures.CHARTER_OWNER,
                        action: ActionTypeEnum.UPDATE,
                      }}
                    >
                      {({ hasPermission }) =>
                        hasPermission && (
                          <Button
                            className={cx('me-1', styles.buttonFilter)}
                            onClick={() => {
                              history.push(
                                `${AppRouteConst.getPSCDeficiencyById(id)}${
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
                        subFeature: SubFeatures.CHARTER_OWNER,
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
              </div>

              <PSCDeficiencyForm
                isEdit={isEdit}
                data={pscDeficiencyDetail}
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
