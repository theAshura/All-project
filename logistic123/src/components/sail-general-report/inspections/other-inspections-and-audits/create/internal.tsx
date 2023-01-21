import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { CreateSailReportInspectionInternalParams } from 'models/api/sail-report-inspection-internal/sail-report-inspection-internal.model';
import {
  clearInternalInspectionsErrorsReducer,
  createSailReportInspectionInternalActions,
} from 'store/sail-report-inspection-internal/sail-report-inspection-internal.action';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonType } from 'components/ui/button/Button';
import PermissionCheck from 'hoc/withPermissionCheck';
import NoPermission from 'components/no-permission';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useParams } from 'react-router';
import styles from './create.module.scss';
import InternalForm from '../../form/InternalForm';

const InternalInpectionCreate = () => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const dispatch = useDispatch();
  const { id: vesselRequestId } = useParams<{ id: string }>();

  const handleSubmit = useCallback(
    (formData: CreateSailReportInspectionInternalParams) => {
      dispatch(
        createSailReportInspectionInternalActions.request({
          ...formData,
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
    [dispatch, vesselRequestId],
  );

  useEffect(() => {
    dispatch(clearInternalInspectionsErrorsReducer());
  }, [dispatch]);

  return (
    <PermissionCheck
      options={{
        feature: Features.QUALITY_ASSURANCE,
        subFeature: SubFeatures.SAIL_GENERAL_REPORT,
        action: ActionTypeEnum.CREATE,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.container}>
            <HeaderPage
              titlePage={t('internalInspectionsAudit')}
              breadCrumb={
                BREAD_CRUMB.SAIL_GENERAL_REPORT_INTERNAL_INSPECTIONS_AUDIT_CREATE
              }
              className="pb-2"
            >
              <Button
                className={cx('me-2')}
                buttonType={ButtonType.CancelOutline}
                onClick={(e) => {
                  const toTab = `tab=inspections&subTab=other-inspections-audit`;
                  history.push(
                    `${AppRouteConst.getSailGeneralReportById(
                      vesselRequestId,
                    )}?${toTab}`,
                  );
                }}
              >
                <span>Back</span>
              </Button>
            </HeaderPage>

            <div className={styles.wrapperForm}>
              <InternalForm
                isEdit
                data={null}
                isCreate
                onSubmit={handleSubmit}
                loading={false}
              />
            </div>
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
};

export default InternalInpectionCreate;
