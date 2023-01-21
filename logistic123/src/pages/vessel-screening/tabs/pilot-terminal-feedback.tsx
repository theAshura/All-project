import cx from 'classnames';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { useEffect } from 'react';
import styles from './common.module.scss';
import SummarySection from '../components/summary-section/summary-section';
import ListPilotTerminalFeedback from '../forms/pilot-terminal-feedback/list-pilot-terminal-feedback';
import useVesselObjectReview from '../utils/hooks/useVesselObjectReview';
import { OBJECT_REFERENCE, TAB_REFERENCE } from '../utils/constant';
import { clearAttachmentAndRemarksReducer } from '../store/vessel-summary.action';
import useVesselMetadata from '../utils/hooks/useVesselMetadata';

const defaultValues = {
  [OBJECT_REFERENCE.PILOT_TERMINAL_FEEDBACK]: {
    isExpanded: false,
  },
};

const TabPilotTerminalFeedback = () => {
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
                    title={t('collapsesTitle.pilotTerminalFeedback')}
                    badges={renderBadge(
                      OBJECT_REFERENCE.PILOT_TERMINAL_FEEDBACK,
                    )}
                    collapseClassName={styles.collapseWrapper}
                    collapseHeaderClassName={styles.collapseHeader}
                    isOpen={
                      expandState[OBJECT_REFERENCE.PILOT_TERMINAL_FEEDBACK]
                        ?.isExpanded
                    }
                    content={
                      <div className={styles.contentWrap}>
                        <ListPilotTerminalFeedback
                          getObjectReview={getListByTable(
                            OBJECT_REFERENCE.PILOT_TERMINAL_FEEDBACK,
                            TAB_REFERENCE.PILOT_TERMINAL_FEEDBACK,
                          )}
                          onObjectReviewFieldChange={onChange}
                        />
                      </div>
                    }
                    toggle={toggle(OBJECT_REFERENCE.PILOT_TERMINAL_FEEDBACK)}
                  />
                </div>
              </div>
              <div className={styles.summaryWrapper}>
                <SummarySection
                  tabName={TAB_REFERENCE.PILOT_TERMINAL_FEEDBACK}
                  tables={[OBJECT_REFERENCE.PILOT_TERMINAL_FEEDBACK]}
                  isReverted
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabPilotTerminalFeedback;
