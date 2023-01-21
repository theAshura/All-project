import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';

import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { CreateIncidentInvestigationParams } from 'models/api/incident-investigation/incident-investigation.model';
import {
  createIncidentInvestigationActions,
  clearIncidentInvestigationErrorsReducer,
} from 'store/incident-investigation/incident-investigation.action';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useParams } from 'react-router';
import Button, { ButtonType } from 'components/ui/button/Button';
import { useTranslation } from 'react-i18next';
import HeaderPage from 'components/common/header-page/HeaderPage';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import styles from './create.module.scss';
import IncidentForm from '../form';

const IncidentCreate = () => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const handleSubmit = useCallback(
    (formData: CreateIncidentInvestigationParams) => {
      dispatch(
        createIncidentInvestigationActions.request({
          ...formData,
          handleSuccess: () => {
            history.push(
              `${AppRouteConst.getSailGeneralReportById(
                vesselRequestId,
              )}?tab=safety-management&subTab=incident`,
            );
          },
        }),
      );
    },
    [dispatch, vesselRequestId],
  );

  useEffect(() => {
    dispatch(clearIncidentInvestigationErrorsReducer());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <HeaderPage
        titlePage={t('incident')}
        breadCrumb={BREAD_CRUMB.SAIL_GENERAL_REPORT_INCIDENT_CREATE}
        className="pb-2"
      >
        <Button
          className={cx('me-2')}
          buttonType={ButtonType.CancelOutline}
          onClick={(e) => {
            const toTab = `tab=safety-management&subTab=incident`;
            history.push(
              `${AppRouteConst.getSailGeneralReportById(id)}?${toTab}`,
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
export default IncidentCreate;
