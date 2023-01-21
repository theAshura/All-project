import { useEffect, useState, useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';

import PermissionCheck from 'hoc/withPermissionCheck';
import images from 'assets/images/images';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  updateIncidentInvestigationActions,
  getIncidentInvestigationDetailActions,
  deleteIncidentInvestigationActions,
} from 'store/incident-investigation/incident-investigation.action';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import useEffectOnce from 'hoc/useEffectOnce';
import history from 'helpers/history.helper';
import cx from 'classnames';
import queryString from 'query-string';

import { I18nNamespace } from 'constants/i18n.const';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { useLocation, useParams } from 'react-router-dom';
import { AppRouteConst } from 'constants/route.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import { useTranslation } from 'react-i18next';
import { CreateIncidentInvestigationParams } from 'models/api/incident-investigation/incident-investigation.model';
import styles from './detail.module.scss';
import IncidentForm from '../form';

const IncidentDetail = () => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { loading, incidentInvestigationDetail } = useSelector(
    (state) => state.incidentInvestigation,
  );
  const { search } = useLocation();
  const [modal, setModal] = useState(false);

  const { id: vesselRequestId } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();

  const { status, idSail, tab } = useMemo(
    () => queryString.parse(search),
    [search],
  );

  useEffect(() => {
    if (status !== 'edit') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [status]);

  const handleSubmit = useCallback(
    (formData: CreateIncidentInvestigationParams) => {
      dispatch(
        updateIncidentInvestigationActions.request({
          id: idSail?.toString(),
          data: formData,
          handleSuccess: () => {
            history.push(
              `${AppRouteConst.getSailGeneralReportById(vesselRequestId)}?tab=${
                tab || 'incident'
              }`,
            );
          },
        }),
      );
    },
    [dispatch, idSail, tab, vesselRequestId],
  );

  useEffectOnce(() => {
    dispatch(getIncidentInvestigationDetailActions.request(idSail?.toString()));
    return () => {
      dispatch(getIncidentInvestigationDetailActions.success(null));
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
                  ? BREAD_CRUMB.SAIL_GENERAL_REPORT_INCIDENT_EDIT
                  : BREAD_CRUMB.SAIL_GENERAL_REPORT_INCIDENT_DETAIL
              }
            />
            <div className={cx('fw-bold', styles.title)}>{t('incident')}</div>
          </div>
          <div className="d-flex">
            {!isEdit && (
              <div>
                <Button
                  className={cx('me-2', styles.buttonFilter)}
                  buttonType={ButtonType.CancelOutline}
                  onClick={(e) => {
                    if (history?.length > 1) {
                      return history.goBack();
                    }
                    history.push(
                      `${AppRouteConst.getSailGeneralReportById(
                        idSail?.toString(),
                      )}?tab=${tab || 'incident'}`,
                    );

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
                    hasPermission && (
                      <Button
                        className={cx('me-1', styles.buttonFilter)}
                        onClick={(e) => {
                          history.push(
                            `${AppRouteConst.getSailGeneralReportIncidentById(
                              vesselRequestId,
                            )}?status=edit&idSail=${idSail?.toString()}&tab=${
                              tab || 'incident'
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
                    feature: Features.QUALITY_ASSURANCE,
                    subFeature: SubFeatures.SAIL_GENERAL_REPORT,
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
        </div>

        <div className={styles.refDetail}>
          {t('refId')}: <span>{incidentInvestigationDetail?.refId}</span>
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
            deleteIncidentInvestigationActions.request({
              id: idSail as string,
              isDetail: true,
              handleSuccess: () => {
                history.push(
                  `${AppRouteConst.getSailGeneralReportById(
                    vesselRequestId,
                  )}?tab=${tab || 'incident'}`,
                );
              },
            }),
          );
        }}
      />
      <div className={styles.wrapperForm}>
        <IncidentForm
          isEdit={isEdit}
          data={incidentInvestigationDetail}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default IncidentDetail;
