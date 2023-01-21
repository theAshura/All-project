import cx from 'classnames';
import { useEffect } from 'react';
import '../custom-tabs.scss';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import styles from './common.module.scss';
import SummarySection from '../components/summary-section/summary-section';
import ListIncidentSafety from '../forms/incident-safety/list-incident-safety';
import ListInjuries from '../forms/injuries/list-injuries';
import ListOtherSMSRecords from '../forms/other-sms-records/list-other-sms-records';
import useVesselObjectReview from '../utils/hooks/useVesselObjectReview';
import { OBJECT_REFERENCE, TAB_REFERENCE } from '../utils/constant';
import { clearAttachmentAndRemarksReducer } from '../store/vessel-summary.action';
import useVesselMetadata from '../utils/hooks/useVesselMetadata';

const defaultValues = {
  [OBJECT_REFERENCE.INCIDENTS]: {
    isExpanded: false,
  },
  [OBJECT_REFERENCE.INJURIES]: {
    isExpanded: false,
  },
  [OBJECT_REFERENCE.OTHER_SMS_RECORDS]: {
    isExpanded: false,
  },
};

const TabSafetyManagement = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const metadata = useVesselMetadata(undefined, true);

  const {
    expandState,
    getLists,
    toggle,
    onChange,
    renderBadge,
    getListByTable,
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
                    title={t('collapsesTitle.incidents')}
                    badges={renderBadge(OBJECT_REFERENCE.INCIDENTS)}
                    collapseClassName={styles.collapseWrapper}
                    collapseHeaderClassName={styles.collapseHeader}
                    isOpen={expandState[OBJECT_REFERENCE.INCIDENTS]?.isExpanded}
                    content={
                      <div className={styles.contentWrap}>
                        <ListIncidentSafety
                          getObjectReview={getListByTable(
                            OBJECT_REFERENCE.INCIDENTS,
                            TAB_REFERENCE.SAFETY_MANAGEMENT,
                          )}
                          onObjectReviewFieldChange={onChange}
                        />
                      </div>
                    }
                    toggle={toggle(OBJECT_REFERENCE.INCIDENTS)}
                  />
                </div>

                <div className="mb-3">
                  <CollapseUI
                    title={t('collapsesTitle.injuries')}
                    badges={renderBadge(OBJECT_REFERENCE.INJURIES)}
                    collapseClassName={styles.collapseWrapper}
                    collapseHeaderClassName={styles.collapseHeader}
                    isOpen={expandState[OBJECT_REFERENCE.INJURIES]?.isExpanded}
                    content={
                      <div className={styles.contentWrap}>
                        <ListInjuries
                          getObjectReview={getListByTable(
                            OBJECT_REFERENCE.INJURIES,
                            TAB_REFERENCE.SAFETY_MANAGEMENT,
                          )}
                          onObjectReviewFieldChange={onChange}
                        />
                      </div>
                    }
                    toggle={toggle(OBJECT_REFERENCE.INJURIES)}
                  />
                </div>

                <div className="mb-3">
                  <CollapseUI
                    title={t('collapsesTitle.sms')}
                    badges={renderBadge(OBJECT_REFERENCE.OTHER_SMS_RECORDS)}
                    collapseClassName={styles.collapseWrapper}
                    collapseHeaderClassName={styles.collapseHeader}
                    isOpen={
                      expandState[OBJECT_REFERENCE.OTHER_SMS_RECORDS]
                        ?.isExpanded
                    }
                    content={
                      <div className={styles.contentWrap}>
                        <ListOtherSMSRecords
                          onObjectReviewFieldChange={onChange}
                        />
                      </div>
                    }
                    toggle={toggle(OBJECT_REFERENCE.OTHER_SMS_RECORDS)}
                  />
                </div>
              </div>
              <div className={styles.summaryWrapper}>
                <SummarySection
                  tabName={TAB_REFERENCE.SAFETY_MANAGEMENT}
                  tables={[
                    OBJECT_REFERENCE.INCIDENTS,
                    OBJECT_REFERENCE.INJURIES,
                    OBJECT_REFERENCE.OTHER_SMS_RECORDS,
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabSafetyManagement;
