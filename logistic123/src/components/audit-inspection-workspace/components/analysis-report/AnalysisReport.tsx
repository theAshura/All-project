import { downloadAnalysisExcel } from 'api/audit-inspection-workspace.api';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { toastError } from 'helpers/notification.helper';
import { websiteLinkByEnv } from 'helpers/utils.helper';
import { AuditInspectionWorkspaceDetailResponse } from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import moment from 'moment';
import queryString from 'query-string';
import { FC, useCallback, useMemo } from 'react';
import images from '../../../../assets/images/images';
import classes from '../tab.module.scss';
import '../tab.scss';
import styles from './analysis-report.module.scss';

interface Prop {
  data: AuditInspectionWorkspaceDetailResponse;
}

const AnalysisReport: FC<Prop> = ({ data }) => {
  const reportLink = useMemo(() => {
    const dataParams = {
      vesselName: data?.vessel?.name,
      vesselType: data?.vessel?.vesselType?.name,
      inspectorName:
        data?.planningRequest?.auditors?.map((i) => i.username).join(', ') ||
        '',
      dateOfInspection: data?.planningRequest?.plannedFromDate
        ? moment(data?.planningRequest?.plannedFromDate).format('D MMM yy')
        : '',
      imoNumber: data?.vessel?.imoNumber,
      portOfInspection: data?.planningRequest?.fromPort?.name,
    };
    const params = queryString.stringify(dataParams);
    const link = `${websiteLinkByEnv()}/audit-inspection-workspace/analytic-report/?${params}`;
    return link;
  }, [data]);

  const downloadTemplate = useCallback(() => {
    downloadAnalysisExcel()
      .then((res) => {
        const link = document.createElement('a');
        link.href = res?.data[0];

        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          }),
        );
      })
      .catch((err) => toastError(err));
  }, []);
  return (
    <div className={classes.TabContainer}>
      <div className={styles.wrap}>
        <div className="d-flex align-items-center justify-content-between">
          <div className={styles.card}>
            <div className={styles.label}>Analysis report: </div>
            <a target="_blank" href={reportLink} rel="noreferrer">
              {websiteLinkByEnv()}/audit-inspection-workspace/analytic-report
            </a>
          </div>
          {/* <a
            href="/files/Analysis_report_template.xlsx"
            target="_blank"
            download="Analysis Report Template.xlsx"
          > */}
          <Button
            buttonType={ButtonType.Primary}
            className={styles.customBtn}
            buttonSize={ButtonSize.Medium}
            onClick={downloadTemplate}
          >
            <img src={images.icons.icDownloadWhite} alt="icDownloadWhite" />
            Download analysis excel
          </Button>
          {/* </a> */}
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
