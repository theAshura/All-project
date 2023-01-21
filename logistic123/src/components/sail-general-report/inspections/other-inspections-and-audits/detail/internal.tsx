import { AppRouteConst } from 'constants/route.const';
import images from 'assets/images/images';
import { useEffect, useState, useCallback, useMemo } from 'react';
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
import history from 'helpers/history.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import InternalForm from 'components/sail-general-report/inspections/form/InternalForm';
import { CreateSailReportInspectionInternalParams } from 'models/api/sail-report-inspection-internal/sail-report-inspection-internal.model';
import queryString from 'query-string';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import {
  deleteSailReportInspectionInternalActions,
  getSailReportInspectionInternalDetailActions,
  updateSailReportInspectionInternalActions,
} from 'store/sail-report-inspection-internal/sail-report-inspection-internal.action';
import HeaderPage from 'components/common/header-page/HeaderPage';
import useEffectOnce from 'hoc/useEffectOnce';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import styles from './detail-internal.module.scss';

export default function InternalInpectionDetail() {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { loading, sailReportInspectionInternalDetail } = useSelector(
    (state) => state.sailReportInspectionInternal,
  );

  const { userInfo } = useSelector((state) => state.authenticate);

  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const { id: vesselRequestId } = useParams<{ id: string }>();

  const parsedQueries = useMemo(() => queryString.parse(search), [search]);

  useEffect(() => {
    if (parsedQueries?.status !== 'edit') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [parsedQueries?.status]);

  const handleSubmit = useCallback(
    (formData: CreateSailReportInspectionInternalParams) => {
      dispatch(
        updateSailReportInspectionInternalActions.request({
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
    dispatch(
      getSailReportInspectionInternalDetailActions.request(
        parsedQueries?.idSail?.toString(),
      ),
    );
    return () => {
      dispatch(getSailReportInspectionInternalDetailActions.success(null));
    };
  });

  const isCurrentDoc = useMemo(
    (): boolean =>
      checkDocHolderChartererVesselOwner(
        {
          vesselDocHolders:
            sailReportInspectionInternalDetail?.vessel?.vesselDocHolders,
          vesselCharterers:
            sailReportInspectionInternalDetail?.vessel?.vesselCharterers,
          vesselOwners:
            sailReportInspectionInternalDetail?.vessel?.vesselOwners,
          createdAt: sailReportInspectionInternalDetail?.createdAt,
          entityType: sailReportInspectionInternalDetail?.vessel?.entityType,
        },
        userInfo,
      ),
    [
      sailReportInspectionInternalDetail?.createdAt,
      sailReportInspectionInternalDetail?.vessel?.entityType,
      sailReportInspectionInternalDetail?.vessel?.vesselCharterers,
      sailReportInspectionInternalDetail?.vessel?.vesselDocHolders,
      sailReportInspectionInternalDetail?.vessel?.vesselOwners,
      userInfo,
    ],
  );

  const isShowButtonEdit = useMemo(() => {
    if (isEdit) {
      return false;
    }

    return isCurrentDoc;
  }, [isCurrentDoc, isEdit]);

  return (
    <PermissionCheck
      options={{
        feature: Features.QUALITY_ASSURANCE,
        subFeature: SubFeatures.SAIL_GENERAL_REPORT,
        action:
          parsedQueries?.status === 'edit'
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.internalInspectionDetailWrapper}>
            <HeaderPage
              breadCrumb={
                parsedQueries?.status === 'edit'
                  ? BREAD_CRUMB.SAIL_GENERAL_REPORT_INTERNAL_INPECTIONS_AUDIT_EDIT
                  : BREAD_CRUMB.SAIL_GENERAL_REPORT_INTERNAL_INPECTIONS_AUDIT_DETAIL
              }
              titlePage={t('internalInspectionsAudit')}
            >
              <div className="d-flex flex-column justify-content-between">
                <div>
                  {!isEdit && (
                    <>
                      <Button
                        className={cx('me-2', styles.buttonFilter)}
                        buttonType={ButtonType.CancelOutline}
                        onClick={() => {
                          if (history?.length > 1) {
                            return history.goBack();
                          }
                          const idSail = parsedQueries?.idSail?.toString();
                          if (idSail) {
                            history.push(
                              `${AppRouteConst.getSailGeneralReportById(
                                idSail,
                              )}?tab=${
                                parsedQueries?.tab || 'inspections'
                              }&subTab=${
                                parsedQueries?.subTab ||
                                'other-inspections-audit'
                              }`,
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
                          isShowButtonEdit && (
                            <Button
                              className={cx('me-1', styles.buttonFilter)}
                              onClick={(e) => {
                                history.push(
                                  `${AppRouteConst.getSailReportInspectionInternalById(
                                    vesselRequestId,
                                  )}?status=edit&idSail=${parsedQueries?.idSail?.toString()}&tab=${
                                    parsedQueries?.tab || 'inspections'
                                  }&subTab=${
                                    parsedQueries?.subTab ||
                                    'other-inspections-audit'
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
                          hasPermission &&
                          isCurrentDoc && (
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
                  {t('refID')}:{' '}
                  <span>{sailReportInspectionInternalDetail?.refId}</span>
                </div>
              </div>
            </HeaderPage>
            <ModalConfirm
              title={t('deleteTitle')}
              content={t('deleteMessage')}
              isDelete
              disable={loading}
              toggle={() => setModal(!modal)}
              modal={modal}
              handleSubmit={() => {
                dispatch(
                  deleteSailReportInspectionInternalActions.request({
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
              <InternalForm
                isEdit={isEdit}
                data={sailReportInspectionInternalDetail}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
