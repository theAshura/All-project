import HeaderPage from 'components/common/header-page/HeaderPage';

import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import history from 'helpers/history.helper';
import cx from 'classnames';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AppRouteConst } from 'constants/route.const';
import styles from './create.module.scss';

import FormPilotTerminalFeedback from './form/pilotTerminalFeedback';
import { createPilotTerminalFeedbackActions } from './store/action';

const PagePilotTerminalFeedbackCreate = () => {
  const { t } = useTranslation(I18nNamespace.PILOT_TERMINAL_FEEDBACK);
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (dataForm) => {
      dispatch(
        createPilotTerminalFeedbackActions.request({
          ...dataForm,
          handleSuccess: () => {
            history.push(AppRouteConst.PILOT_TERMINAL_FEEDBACK);
          },
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className={styles.container}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.PILOT_TERMINAL_FEEDBACK_CREATE}
        titlePage={t('pilotTerminalFeedback')}
      />

      <div className={cx(styles.wrapperForm, 'pt-2')}>
        <FormPilotTerminalFeedback
          data={null}
          screen="create"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default PagePilotTerminalFeedbackCreate;
