import HeaderPage from 'components/common/header-page/HeaderPage';

import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import history from 'helpers/history.helper';
import cx from 'classnames';
import { IncidentsStatuses } from 'constants/components/incidents.const';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AppRouteConst } from 'constants/route.const';
import styles from './create.module.scss';

import FormIncidents from './form/index';
import { createIncidentActions } from './store/action';

const ListIncidentDetail = () => {
  const { t } = useTranslation(I18nNamespace.INCIDENTS);
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (dataForm) => {
      dispatch(
        createIncidentActions.request({
          ...dataForm,
          status: IncidentsStatuses.Draft,
          handleSuccess: () => {
            history.push(AppRouteConst.INCIDENTS);
          },
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className={styles.container}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.INCIDENTS_CREATE}
        titlePage={t('incidents')}
      />

      <div className={cx(styles.wrapperForm, 'pt-2')}>
        <FormIncidents isEdit data={null} isCreate onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ListIncidentDetail;
