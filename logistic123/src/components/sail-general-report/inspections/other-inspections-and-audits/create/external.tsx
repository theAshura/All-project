import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';

import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { CreateExternalParams } from 'models/api/external/external.model';
import {
  clearExternalErrorsReducer,
  createExternalActions,
} from 'store/external/external.action';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonType } from 'components/ui/button/Button';
import { useParams } from 'react-router';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import styles from './create.module.scss';
import IncidentForm from '../form';

const ExternalInspectionsCreate = () => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateExternalParams) => {
      dispatch(
        createExternalActions.request({
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
    dispatch(clearExternalErrorsReducer());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <HeaderPage
        titlePage={t('otherInspectionAudit')}
        breadCrumb={
          BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_OTHER_INSPECTIONS_CREATE
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
        <IncidentForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </div>
    </div>
  );
};
export default ExternalInspectionsCreate;
