import cx from 'classnames';
import { useEffect } from 'react';
import '../custom-tabs.scss';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import styles from './common.module.scss';
import ListPortStateControl from '../forms/port-state-control/list-port-state-control';
import ListInternalInspection from '../forms/internal-inspection/list-internal-inpsection';
import ListExternalInspection from '../forms/external-inspection/list-external-inspection';
import SummarySection from '../components/summary-section/summary-section';
import useVesselObjectReview from '../utils/hooks/useVesselObjectReview';
import { OBJECT_REFERENCE, TAB_REFERENCE } from '../utils/constant';
import { clearAttachmentAndRemarksReducer } from '../store/vessel-summary.action';
import useVesselMetadata from '../utils/hooks/useVesselMetadata';

const defaultValues = {
  [OBJECT_REFERENCE.PORT_STATE_CONTROL]: {
    isExpanded: false,
  },
  [OBJECT_REFERENCE.INTERNAL_INSPECTIONS_AUDITS]: {
    isExpanded: false,
  },
  [OBJECT_REFERENCE.EXTERNAL_INSPECTIONS]: {
    isExpanded: false,
  },
};

const TabInspections = () => {
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
                  title={t('collapsesTitle.portStateControl')}
                  badges={renderBadge(OBJECT_REFERENCE.PORT_STATE_CONTROL)}
                  collapseClassName={styles.collapseWrapper}
                  collapseHeaderClassName={styles.collapseHeader}
                  isOpen={
                    expandState[OBJECT_REFERENCE.PORT_STATE_CONTROL]?.isExpanded
                  }
                  content={
                    <div className={styles.contentWrap}>
                      <ListPortStateControl
                        getObjectReview={getListByTable(
                          OBJECT_REFERENCE.PORT_STATE_CONTROL,
                          TAB_REFERENCE.INSPECTIONS,
                        )}
                        onObjectReviewFieldChange={onChange}
                      />
                    </div>
                  }
                  toggle={toggle(OBJECT_REFERENCE.PORT_STATE_CONTROL)}
                />
              </div>

              <div className="mb-3">
                <CollapseUI
                  title={t('collapsesTitle.externalInspection')}
                  badges={renderBadge(OBJECT_REFERENCE.EXTERNAL_INSPECTIONS)}
                  collapseClassName={styles.collapseWrapper}
                  collapseHeaderClassName={styles.collapseHeader}
                  isOpen={
                    expandState[OBJECT_REFERENCE.EXTERNAL_INSPECTIONS]
                      ?.isExpanded
                  }
                  content={
                    <div className={styles.contentWrap}>
                      <ListExternalInspection
                        onObjectReviewFieldChange={onChange}
                      />
                    </div>
                  }
                  toggle={toggle(OBJECT_REFERENCE.EXTERNAL_INSPECTIONS)}
                />
              </div>

              <div className="mb-3">
                <CollapseUI
                  title={t('collapsesTitle.internalInspection')}
                  badges={renderBadge(
                    OBJECT_REFERENCE.INTERNAL_INSPECTIONS_AUDITS,
                  )}
                  collapseClassName={styles.collapseWrapper}
                  collapseHeaderClassName={styles.collapseHeader}
                  isOpen={
                    expandState[OBJECT_REFERENCE.INTERNAL_INSPECTIONS_AUDITS]
                      ?.isExpanded
                  }
                  content={
                    <div className={styles.contentWrap}>
                      <ListInternalInspection
                        onObjectReviewFieldChange={onChange}
                      />
                    </div>
                  }
                  toggle={toggle(OBJECT_REFERENCE.INTERNAL_INSPECTIONS_AUDITS)}
                />
              </div>
            </div>
            <div className={styles.summaryWrapper}>
              <SummarySection
                tabName={TAB_REFERENCE.INSPECTIONS}
                tables={[
                  OBJECT_REFERENCE.PORT_STATE_CONTROL,
                  OBJECT_REFERENCE.INTERNAL_INSPECTIONS_AUDITS,
                  OBJECT_REFERENCE.EXTERNAL_INSPECTIONS,
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabInspections;
