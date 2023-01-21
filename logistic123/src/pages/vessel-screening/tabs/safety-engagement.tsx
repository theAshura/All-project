import cx from 'classnames';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { useEffect } from 'react';
import styles from './common.module.scss';
import SummarySection from '../components/summary-section/summary-section';
import ListSafetyEngagement from '../forms/safety-engagement/list-safety-engagement';
import useVesselObjectReview from '../utils/hooks/useVesselObjectReview';
import { OBJECT_REFERENCE, TAB_REFERENCE } from '../utils/constant';
import { clearAttachmentAndRemarksReducer } from '../store/vessel-summary.action';
import useVesselMetadata from '../utils/hooks/useVesselMetadata';

const defaultValues = {
  [OBJECT_REFERENCE.SAFETY_ENGAGEMENT]: {
    isExpanded: false,
  },
};

const TabSafetyEngagement = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const metadata = useVesselMetadata(undefined, true);

  const {
    expandState,
    toggle,
    onChange,
    renderBadge,
    getListByTable,
    getLists,
  } = useVesselObjectReview(defaultValues);

  useEffect(() => {
    getLists();
    return () => {
      dispatch(clearAttachmentAndRemarksReducer());
    };
  }, [dispatch, getLists]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={cx('card-container', 'pt-0')}>
          {metadata}
          <div className={styles.innerWrap}>
            <div className="d-flex">
              <div className={styles.tableWrapper}>
                <div className="mb-3">
                  <CollapseUI
                    title={t('collapsesTitle.safetyEngagement')}
                    badges={renderBadge(OBJECT_REFERENCE.SAFETY_ENGAGEMENT)}
                    collapseClassName={styles.collapseWrapper}
                    collapseHeaderClassName={styles.collapseHeader}
                    isOpen={
                      expandState[OBJECT_REFERENCE.SAFETY_ENGAGEMENT]
                        ?.isExpanded
                    }
                    content={
                      <div className={styles.contentWrap}>
                        <ListSafetyEngagement
                          getObjectReview={getListByTable(
                            OBJECT_REFERENCE.SAFETY_ENGAGEMENT,
                            TAB_REFERENCE.SAFETY_ENGAGEMENT,
                          )}
                          onObjectReviewFieldChange={onChange}
                        />
                      </div>
                    }
                    toggle={toggle(OBJECT_REFERENCE.SAFETY_ENGAGEMENT)}
                  />
                </div>
              </div>
              <div className={styles.summaryWrapper}>
                <SummarySection
                  tabName={TAB_REFERENCE.SAFETY_ENGAGEMENT}
                  tables={[OBJECT_REFERENCE.SAFETY_ENGAGEMENT]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabSafetyEngagement;
