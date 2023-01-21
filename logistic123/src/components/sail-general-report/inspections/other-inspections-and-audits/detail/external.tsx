import { useEffect, useState, useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';

import PermissionCheck from 'hoc/withPermissionCheck';
import images from 'assets/images/images';
import Button, { ButtonType } from 'components/ui/button/Button';
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
import { useLocation, useParams } from 'react-router-dom';
import { AppRouteConst } from 'constants/route.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { CreateExternalParams } from 'models/api/external/external.model';
import {
  deleteExternalActions,
  getDetailExternal,
  updateExternalActions,
} from 'store/external/external.action';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import styles from './detail.module.scss';
import ExternalForm from '../form';

const IncidentDetail = () => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { loading, detailExternal } = useSelector((state) => state.external);
  const { search } = useLocation();
  const [modal, setModal] = useState(false);

  const { id: vesselRequestId } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();

  const parsedQueries = useMemo(() => queryString.parse(search), [search]);
  const { userInfo } = useSelector((state) => state.authenticate);

  const canUserEdit = useMemo(() => {
    if (!detailExternal) {
      return false;
    }

    return checkDocHolderChartererVesselOwner(
      {
        createdAt: detailExternal?.createdAt,
        vesselCharterers: detailExternal?.vessel?.vesselCharterers,
        vesselDocHolders: detailExternal?.vessel?.vesselDocHolders,
        vesselOwners: detailExternal?.vessel?.vesselOwners,
      },
      userInfo,
    );
  }, [userInfo, detailExternal]);

  useEffect(() => {
    if (parsedQueries?.status !== 'edit') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [parsedQueries?.status]);

  const handleSubmit = useCallback(
    (formData: CreateExternalParams) => {
      dispatch(
        updateExternalActions.request({
          id: parsedQueries?.idSail?.toString(),
          data: formData,
          handleSuccess: () => {
            history.push(
              `${AppRouteConst.getSailGeneralReportById(
                vesselRequestId,
              )}?tab=inspections&subTab=other-inspections-audit`,
            );
          },
        }),
      );
    },
    [dispatch, parsedQueries?.idSail, vesselRequestId],
  );

  useEffectOnce(() => {
    dispatch(getDetailExternal.request(parsedQueries?.idSail?.toString()));
    return () => {
      dispatch(getDetailExternal.success(null));
    };
  });

  return (
    <div className={styles.container}>
      <div className={cx(styles.headers)}>
        <div className="d-flex justify-content-between">
          <div className="">
            <BreadCrumb
              current={
                parsedQueries?.status === 'edit'
                  ? BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_OTHER_INSPECTIONS_EDIT
                  : BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_OTHER_INSPECTIONS_DETAIL
              }
            />
            <div className={cx('fw-bold', styles.title)}>
              {t('otherInspectionAudit')}
            </div>
          </div>
          <div className="d-flex flex-column justify-content-between">
            <div
              className={cx({
                [styles.btnGroupWithoutEditPermission]: !canUserEdit,
              })}
            >
              {!isEdit && (
                <>
                  <Button
                    className={cx('me-2', styles.buttonFilter)}
                    buttonType={ButtonType.CancelOutline}
                    onClick={() => {
                      if (history?.length > 1 && history?.action === 'PUSH') {
                        return history.goBack();
                      }
                      const idSail = parsedQueries?.idSail?.toString();

                      if (history?.length > 1 && history?.action === 'POP') {
                        history.push(
                          `${AppRouteConst.getSailGeneralReportById(
                            idSail,
                          )}?tab=${parsedQueries?.tab || 'inspections'}`,
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
                      canUserEdit && (
                        <Button
                          className={cx('me-1', styles.buttonFilter)}
                          onClick={(e) => {
                            history.push(
                              `${AppRouteConst.getExternalInspectionById(
                                vesselRequestId,
                              )}?status=edit&idSail=${parsedQueries?.idSail?.toString()}`,
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
                      canUserEdit && (
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
                </>
              )}
            </div>

            <div className={styles.refDetail}>
              {t('refID')}: <span>{detailExternal?.refId}</span>
            </div>
          </div>
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
            deleteExternalActions.request({
              id: parsedQueries?.idSail?.toString(),
              isDetail: true,
              handleSuccess: () => {
                history.push(
                  `${AppRouteConst.getSailGeneralReportById(
                    vesselRequestId,
                  )}?tab=inspections&subTab=other-inspections-audit`,
                );
              },
            }),
          );
        }}
      />
      <div className={styles.wrapperForm}>
        <ExternalForm
          isEdit={isEdit}
          data={detailExternal}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
export default IncidentDetail;
