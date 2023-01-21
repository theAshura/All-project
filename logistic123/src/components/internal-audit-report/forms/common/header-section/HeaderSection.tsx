import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { CommonQuery } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import WatchListManagement from 'components/watch-list-icon/WatchListIcon';
import { WatchlistModuleEnum } from 'pages/watch-list/watch-list.const';
import StickyHeaderWrapper from 'components/ui/sticky-header-wrapper/StickyHeaderWrapper';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import IARActionButtonsSection from './ButtonSection';
import IARStatusSection from './StatusSection';
import styles from './header-section.module.scss';

const HeaderSection = () => {
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const { search } = useLocation();

  const breadCrumbs = useMemo(() => {
    if (search === CommonQuery.EDIT) {
      return BREAD_CRUMB.INTERNAL_AUDIT_REPORT_EDIT;
    }
    return BREAD_CRUMB.INTERNAL_AUDIT_REPORT_DETAIL;
  }, [search]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });

  const renderWatchIcon = useMemo(
    () => (
      <WatchListManagement
        dynamicLabels={dynamicLabels}
        referenceId={internalAuditReportDetail?.id}
        referenceModuleName={WatchlistModuleEnum.INSPECTION_REPORT}
        referenceRefId={internalAuditReportDetail?.refId}
      />
    ),
    [
      dynamicLabels,
      internalAuditReportDetail?.id,
      internalAuditReportDetail?.refId,
    ],
  );

  return (
    <StickyHeaderWrapper>
      <Container className={styles.headerContainer}>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={breadCrumbs} />
          <div className="d-flex justify-content-between">
            <div className={cx('fw-bold', styles.title)}>
              {renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.AuditInspectionInspectionReport,
              )}
            </div>
            <div className="d-flex align-items-center">
              {renderWatchIcon}
              <IARActionButtonsSection dynamicLabels={dynamicLabels} />
            </div>
          </div>
        </div>
        <div
          className={cx(
            styles.wrapInfoHeader,
            'd-flex align-items-center justify-content-end',
          )}
        >
          <div>
            <span className={styles.refTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Ref.ID'],
              )}
              :{' '}
            </span>{' '}
            <b className={styles.refValue}>
              {internalAuditReportDetail?.refId}
            </b>
          </div>
          <div className={styles.status}>
            <IARStatusSection dynamicLabels={dynamicLabels} />
          </div>
          <div className={cx(styles.globalStatus, 'd-flex align-items-center')}>
            <span className={styles.refTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Global status'],
              )}
              :{' '}
            </span>{' '}
            <b className={styles.refValue}>
              {internalAuditReportDetail?.reportFindingForm?.planningRequest
                ?.globalStatus || '-'}
            </b>
          </div>
        </div>
      </Container>
    </StickyHeaderWrapper>
  );
};
export default HeaderSection;
