import cx from 'classnames';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import styles from './common.module.scss';
import SummarySection from '../components/summary-section/summary-section';
import ListConditionOfClassDispensation from '../forms/condition-class-dispensation/list-condition-class-dispensation';
import ListSurveyClassInfo from '../forms/survey-class-info/list-survey-class-info';
import ListMaintenancePerformance from '../forms/maintenance-performance/list-maintenance-performance';
import ListOtherTechnicalRecords from '../forms/other-technical-records/list-other-technical-records';
import ListDryDocking from '../forms/dry-docking/list-dry-docking';
import { OBJECT_REFERENCE, TAB_REFERENCE } from '../utils/constant';
import useVesselObjectReview from '../utils/hooks/useVesselObjectReview';
import { clearAttachmentAndRemarksReducer } from '../store/vessel-summary.action';
import useVesselMetadata from '../utils/hooks/useVesselMetadata';

const defaultValues = {
  [OBJECT_REFERENCE.CONDITION_OF_CLASS_DISPENSATIONS]: {
    isExpanded: false,
  },
  [OBJECT_REFERENCE.SURVEY_CLASS_INFO]: {
    isExpanded: false,
  },
  [OBJECT_REFERENCE.MAINTENANCE_PERFORMANCE]: {
    isExpanded: false,
  },
  [OBJECT_REFERENCE.OTHER_TECHNICAL_RECORDS]: {
    isExpanded: false,
  },
  [OBJECT_REFERENCE.DRY_DOCKING]: {
    isExpanded: false,
  },
};

const TabTechnical = () => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const dispatch = useDispatch();
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
    <div className={styles.wrapper}>
      <div className={cx('card-container', 'pt-0')}>
        {metadata}
        <div className={styles.innerWrap}>
          <div className="d-flex">
            <div className={styles.tableWrapper}>
              <div className="mb-3">
                <CollapseUI
                  title={t('collapsesTitle.conditionClassDispensation')}
                  badges={renderBadge(
                    OBJECT_REFERENCE.CONDITION_OF_CLASS_DISPENSATIONS,
                  )}
                  collapseClassName={styles.collapseWrapper}
                  collapseHeaderClassName={styles.collapseHeader}
                  isOpen={
                    expandState[
                      OBJECT_REFERENCE.CONDITION_OF_CLASS_DISPENSATIONS
                    ]?.isExpanded
                  }
                  content={
                    <div className={styles.contentWrap}>
                      <ListConditionOfClassDispensation
                        getObjectReview={getListByTable(
                          OBJECT_REFERENCE.CONDITION_OF_CLASS_DISPENSATIONS,
                          TAB_REFERENCE.TECHNICAL,
                        )}
                        onObjectReviewFieldChange={onChange}
                      />
                    </div>
                  }
                  toggle={toggle(
                    OBJECT_REFERENCE.CONDITION_OF_CLASS_DISPENSATIONS,
                  )}
                />
              </div>

              <div className="mb-3">
                <CollapseUI
                  title={t('collapsesTitle.surveyClassInfo')}
                  badges={renderBadge(OBJECT_REFERENCE.SURVEY_CLASS_INFO)}
                  collapseClassName={styles.collapseWrapper}
                  collapseHeaderClassName={styles.collapseHeader}
                  isOpen={
                    expandState[OBJECT_REFERENCE.SURVEY_CLASS_INFO]?.isExpanded
                  }
                  content={
                    <div className={styles.contentWrap}>
                      <ListSurveyClassInfo
                        getObjectReview={getListByTable(
                          OBJECT_REFERENCE.SURVEY_CLASS_INFO,
                          TAB_REFERENCE.TECHNICAL,
                        )}
                        onObjectReviewFieldChange={onChange}
                      />
                    </div>
                  }
                  toggle={toggle(OBJECT_REFERENCE.SURVEY_CLASS_INFO)}
                />
              </div>

              <div className="mb-3">
                <CollapseUI
                  title={t('collapsesTitle.maintenancePerformance')}
                  badges={renderBadge(OBJECT_REFERENCE.MAINTENANCE_PERFORMANCE)}
                  collapseClassName={styles.collapseWrapper}
                  collapseHeaderClassName={styles.collapseHeader}
                  isOpen={
                    expandState[OBJECT_REFERENCE.MAINTENANCE_PERFORMANCE]
                      ?.isExpanded
                  }
                  content={
                    <div className={styles.contentWrap}>
                      <ListMaintenancePerformance
                        onObjectReviewFieldChange={onChange}
                      />
                    </div>
                  }
                  toggle={toggle(OBJECT_REFERENCE.MAINTENANCE_PERFORMANCE)}
                />
              </div>

              <div className="mb-3">
                <CollapseUI
                  title={t('collapsesTitle.otherTechnicalRecords')}
                  badges={renderBadge(OBJECT_REFERENCE.OTHER_TECHNICAL_RECORDS)}
                  collapseClassName={styles.collapseWrapper}
                  collapseHeaderClassName={styles.collapseHeader}
                  isOpen={
                    expandState[OBJECT_REFERENCE.OTHER_TECHNICAL_RECORDS]
                      ?.isExpanded
                  }
                  content={
                    <div className={styles.contentWrap}>
                      <ListOtherTechnicalRecords
                        onObjectReviewFieldChange={onChange}
                      />
                    </div>
                  }
                  toggle={toggle(OBJECT_REFERENCE.OTHER_TECHNICAL_RECORDS)}
                />
              </div>

              <div className="mb-3">
                <CollapseUI
                  title={t('collapsesTitle.dryDocking')}
                  badges={renderBadge(OBJECT_REFERENCE.DRY_DOCKING)}
                  collapseClassName={styles.collapseWrapper}
                  collapseHeaderClassName={styles.collapseHeader}
                  isOpen={expandState[OBJECT_REFERENCE.DRY_DOCKING]?.isExpanded}
                  content={
                    <div className={styles.contentWrap}>
                      <ListDryDocking onObjectReviewFieldChange={onChange} />
                    </div>
                  }
                  toggle={toggle(OBJECT_REFERENCE.DRY_DOCKING)}
                />
              </div>
            </div>
            <div className={styles.summaryWrapper}>
              <SummarySection
                tabName={TAB_REFERENCE.TECHNICAL}
                tables={[
                  OBJECT_REFERENCE.CONDITION_OF_CLASS_DISPENSATIONS,
                  OBJECT_REFERENCE.SURVEY_CLASS_INFO,
                  OBJECT_REFERENCE.MAINTENANCE_PERFORMANCE,
                  OBJECT_REFERENCE.OTHER_TECHNICAL_RECORDS,
                  OBJECT_REFERENCE.DRY_DOCKING,
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabTechnical;
