import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';

import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { CreatePortStateControlParams } from 'models/api/port-state-control/port-state-control.model';
import {
  createPortStateControlActions,
  clearPortStateControlErrorsReducer,
} from 'store/port-state-control/port-state-control.action';
import cx from 'classnames';

import { useParams } from 'react-router';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import history from 'helpers/history.helper';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonType } from 'components/ui/button/Button';
import { AppRouteConst } from 'constants/route.const';
import styles from './create.module.scss';
import IncidentForm from '../form';

const IncidentCreate = () => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreatePortStateControlParams) => {
      dispatch(
        createPortStateControlActions.request({
          ...formData,
          handleSuccess: () => {
            if (vesselRequestId) {
              history.push(
                `${AppRouteConst.getSailGeneralReportById(
                  vesselRequestId,
                )}?tab=inspections&subTab=psc`,
              );
            }
          },
        }),
      );
    },
    [dispatch, vesselRequestId],
  );

  useEffect(() => {
    dispatch(clearPortStateControlErrorsReducer());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <HeaderPage
        titlePage={t('portStateControl')}
        breadCrumb={BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_STATE_CONTROL_CREATE}
        className="pb-2"
      >
        <Button
          className={cx('me-2')}
          buttonType={ButtonType.CancelOutline}
          onClick={(e) => {
            const toTab = `tab=inspections&subTab=psc`;
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
