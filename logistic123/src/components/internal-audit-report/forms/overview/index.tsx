import { FC, useState, useContext, useMemo } from 'react';
import {
  InternalAuditReportFormContext,
  ReportHeaderTopics,
} from 'contexts/internal-audit-report/IARFormContext';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { IARReportHeaders } from 'models/api/internal-audit-report/internal-audit-report.model';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { useSelector } from 'react-redux';
import CkEditorClassic from 'components/common/ck-editor/CkEditorBuildClassic';
import styles from '../form.module.scss';
import '../form.scss';

interface Props {
  isEdit: boolean;
  headerItem?: IARReportHeaders;
}

const Overview: FC<Props> = ({ isEdit, headerItem }) => {
  const { t } = useTranslation([
    I18nNamespace.INTERNAL_AUDIT_REPORT,
    I18nNamespace.COMMON,
  ]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { handleGetOverview, handleChangeOverview, setTouched } = useContext(
    InternalAuditReportFormContext,
  );
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const renderInspectionType = useMemo(() => {
    const overviewHeader = internalAuditReportDetail?.IARReportHeaders?.find(
      (i) => i.topic === ReportHeaderTopics.OVERVIEW.toString(),
    );

    if (!overviewHeader?.auditTypes?.length) {
      return null;
    }
    const listAuditTypes = [];

    overviewHeader?.auditTypes?.forEach((item) => {
      const auditFound = internalAuditReportDetail?.iarAuditTypes?.find(
        (i) => String(i.auditTypeId) === String(item),
      );
      if (auditFound) {
        listAuditTypes.push(auditFound?.auditTypeName);
      }
    });

    return listAuditTypes?.length
      ? listAuditTypes?.map((i) => (
          <div key={i} className={styles.inspectionType}>
            {i}
          </div>
        ))
      : null;
  }, [
    internalAuditReportDetail?.IARReportHeaders,
    internalAuditReportDetail?.iarAuditTypes,
  ]);

  return useMemo(
    () => (
      <CollapseUI
        title={`${t('overview')}`}
        badges={renderInspectionType}
        collapseClassName={styles.collapse}
        collapseHeaderClassName={styles.wrapCollapse}
        isOpen={isOpen}
        content={
          <>
            <div className={styles.comment}>
              <h6 className="mb-1">Overview</h6>
              {/* <Input
                disabled={!isEdit}
                placeholder={isEdit ? 'Enter overview' : ''}
                value={handleGetOverview() || ''}
                onChange={(e) => {

                  handleChangeOverview(e.target.value);
                }}
              /> */}
            </div>
            {isOpen && (
              <CkEditorClassic
                data={handleGetOverview(headerItem?.id)}
                disabled={!isEdit}
                onChange={(e) => {
                  handleChangeOverview(e?.data, headerItem?.id);
                  setTouched(true);
                }}
              />
            )}
          </>
        }
        toggle={() => setIsOpen((prev) => !prev)}
      />
    ),
    [
      t,
      renderInspectionType,
      isOpen,
      handleGetOverview,
      isEdit,
      handleChangeOverview,
      headerItem?.id,
      setTouched,
    ],
  );
};

export default Overview;
