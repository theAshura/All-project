import { useEffect, useState, useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';

import PermissionCheck from 'hoc/withPermissionCheck';
import images from 'assets/images/images';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  updatePortStateControlActions,
  getPortStateControlDetailActions,
  deletePortStateControlActions,
} from 'store/port-state-control/port-state-control.action';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import useEffectOnce from 'hoc/useEffectOnce';
import history from 'helpers/history.helper';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import queryString from 'query-string';

import { useLocation, useParams } from 'react-router-dom';
import { AppRouteConst } from 'constants/route.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import { useTranslation } from 'react-i18next';
import { CreatePortStateControlParams } from 'models/api/port-state-control/port-state-control.model';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import styles from './detail.module.scss';
import IncidentForm from '../form';

const PSCDetail = () => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const { loading, portStateControlDetail } = useSelector(
    (state) => state.portStateControl,
  );

  const { search } = useLocation();
  const [modal, setModal] = useState(false);

  const { id: vesselRequestId } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();

  const { status, idSail } = useMemo(() => queryString.parse(search), [search]);

  const { userInfo } = useSelector((state) => state.authenticate);

  useEffect(() => {
    if (status !== 'edit') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [status]);

  const canCurrentUserEdit = useMemo(
    () =>
      portStateControlDetail
        ? checkDocHolderChartererVesselOwner(
            {
              createdAt: portStateControlDetail?.createdAt,
              vesselCharterers:
                portStateControlDetail?.vessel?.vesselCharterers || [],
              vesselDocHolders:
                portStateControlDetail?.vessel?.vesselOwners || [],
              vesselOwners:
                portStateControlDetail?.vessel?.vesselDocHolders || [],
            },
            userInfo,
          )
        : false,
    [portStateControlDetail, userInfo],
  );

  const handleSubmit = useCallback(
    (formData: CreatePortStateControlParams) => {
      dispatch(
        updatePortStateControlActions.request({
          id: idSail?.toString(),
          data: formData,
          handleSuccess: () => {
            history.push(
              `${AppRouteConst.getSailGeneralReportById(
                vesselRequestId,
              )}?tab=inspections&subTab=psc`,
            );
          },
        }),
      );
    },
    [dispatch, idSail, vesselRequestId],
  );

  useEffectOnce(() => {
    dispatch(
      getPortStateControlDetailActions.request({ id: idSail?.toString() }),
    );
    return () => {
      dispatch(getPortStateControlDetailActions.success(null));
    };
  });

  return (
    <div className={styles.container}>
      <div className={cx(styles.headers)}>
        <div className="d-flex justify-content-between">
          <div className="">
            <BreadCrumb
              current={
                status === 'edit'
                  ? BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_STATE_CONTROL_EDIT
                  : BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_STATE_CONTROL_DETAIL
              }
            />
            <div className={cx('fw-bold', styles.title)}>
              {t('portStateControl')}
            </div>
          </div>
          <div className="d-flex">
            {!isEdit && (
              <div>
                <Button
                  className={cx('me-2', styles.buttonFilter)}
                  buttonType={ButtonType.CancelOutline}
                  onClick={(e) => {
                    if (history?.length > 1 && history?.action === 'PUSH') {
                      return history.goBack();
                    }
                    if (history?.length > 1 && history?.action === 'POP') {
                      history.push(
                        `${AppRouteConst.getSailGeneralReportById(
                          vesselRequestId,
                        )}?tab=inspections&subTab=psc`,
                      );
                    }
                    return null;
                  }}
                >
                  <span className="pe-2">Back</span>
                </Button>
                <PermissionCheck
                  options={{
                    feature: Features.QUALITY_ASSURANCE,
                    subFeature: SubFeatures.SAIL_GENERAL_REPORT,
                    action: ActionTypeEnum.UPDATE,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission &&
                    canCurrentUserEdit && (
                      <Button
                        className={cx('me-1', styles.buttonFilter)}
                        onClick={(e) => {
                          history.push(
                            `${AppRouteConst.getInspectionPSCById(
                              vesselRequestId,
                            )}?tab=inspections&subTab=psc&status=edit&idSail=${idSail?.toString()}`,
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
                    feature: Features.QUALITY_ASSURANCE,
                    subFeature: SubFeatures.SAIL_GENERAL_REPORT,
                    action: ActionTypeEnum.DELETE,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission &&
                    canCurrentUserEdit && (
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
        </div>

        <div className={styles.refDetail}>
          {t('refID')}: <span>{portStateControlDetail?.refId}</span>
        </div>
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
            deletePortStateControlActions.request({
              id: idSail as string,
              isDetail: true,
              handleSuccess: () => {
                history.push(
                  `${AppRouteConst.getSailGeneralReportById(
                    vesselRequestId,
                  )}?tab=inspections&subTab=psc`,
                );
              },
            }),
          );
        }}
      />
      <div className={styles.wrapperForm}>
        <IncidentForm
          isEdit={isEdit}
          data={portStateControlDetail}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
export default PSCDetail;
