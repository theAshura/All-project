import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { I18nNamespace } from 'constants/i18n.const';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { SCREEN_STATUS } from 'constants/common.const';
import styles from './create.module.scss';
import { clearVesselScreeningErrorsReducer } from './store/action';
import FormVesselScreening from './forms/vessel-screening';

const SelfAssessmentPageCreate = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);

  useEffect(() => {
    dispatch(clearVesselScreeningErrorsReducer());
  }, [dispatch]);

  return (
    <>
      <div className={cx(styles.wrapHeader, 'd-flex justify-content-between')}>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.VESSEL_SCREENING_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('vesselScreening')}
          </div>
        </div>
      </div>
      <FormVesselScreening screen={SCREEN_STATUS.CREATE} />
    </>
  );
};

export default SelfAssessmentPageCreate;
