import { useCallback, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import Button from 'components/ui/button/Button';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import capitalize from 'lodash/capitalize';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import {
  // websiteLinkByEnv,
  getColorByName,
  populateStatus,
} from 'helpers/utils.helper';
// import { toastError } from 'helpers/notification.helper';
// import moment from 'moment';
// import queryString from 'query-string';
// import InvisibleBackdrop from 'components/common/backdrop/InvisibleBackdrop';
// import { downloadAnalysisExcelFillChecklist } from 'api/audit-inspection-workspace.api';
// import images from 'assets/images/images';
import { formatDateNoTime } from 'helpers/date.helper';
import cx from 'classnames';
import classes from '../tab.module.scss';
import styles from './summary.module.scss';
import ModalFindingCorrective from './FindingCorrectiveModal';

const InspectionReportSection = ({ isEntityVessel, data, dynamicLabels }) => {
  const [modalCorrectiveVisible, setModalCorrectiveVisible] = useState(false);
  // const [analyticalReportDropDown, setAnalyticalReportDropDown] =
  //   useState(false);
  const { inspectionSummary } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );

  // const reportLink = useMemo(() => {
  //   const dataParams = {
  //     vesselName: data?.vessel?.name,
  //     vesselType: data?.vessel?.vesselType?.name,
  //     inspectorName:
  //       data?.planningRequest?.auditors?.map((i) => i.username).join(', ') ||
  //       '',
  //     dateOfInspection: data?.planningRequest?.plannedFromDate
  //       ? moment(data?.planningRequest?.plannedFromDate).format('D MMM yy')
  //       : '',
  //     imoNumber: data?.vessel?.imoNumber,
  //     portOfInspection: data?.planningRequest?.fromPort?.name,
  //     shipManager: inspectionSummary?.vesselInfo?.shipManagerName,
  //     dateOfDelivery: data?.vessel?.buildDate
  //       ? moment(data?.vessel?.buildDate).format('D MMM yy')
  //       : '',
  //     sizeGrt: data?.vessel?.deadWeightTonnage,
  //   };
  //   const params = queryString.stringify(dataParams);
  //   const link = `${websiteLinkByEnv()}/audit-inspection-workspace/analytic-report/?${params}`;
  //   return link;
  // }, [
  //   data?.planningRequest?.auditors,
  //   data?.planningRequest?.fromPort?.name,
  //   data?.planningRequest?.plannedFromDate,
  //   data?.vessel?.buildDate,
  //   data?.vessel?.deadWeightTonnage,
  //   data?.vessel?.imoNumber,
  //   data?.vessel?.name,
  //   data?.vessel?.vesselType?.name,
  //   inspectionSummary?.vesselInfo?.shipManagerName,
  // ]);

  const renderInfo = useCallback(
    (info: any) => {
      if (!inspectionSummary?.reportOfFinding?.status) {
        return '-';
      }
      return info || '-';
    },
    [inspectionSummary?.reportOfFinding?.status],
  );

  // const downloadTemplate = useCallback(() => {
  //   setAnalyticalReportDropDown(false);
  //   downloadAnalysisExcelFillChecklist(data?.id)
  //     .then((res) => {
  //       const filename =
  //         res?.headers['content-disposition']?.split('filename=')?.[1];
  //       const blob = res.data;
  //       const link = window.document.createElement('a');
  //       link.href = window.URL.createObjectURL(
  //         new Blob([blob], {
  //           type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //         }),
  //       );
  //       link.download = filename || 'Analysis Report Template.xlsx';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     })
  //     .catch((err) => toastError(err));
  // }, [data?.id]);

  const renderBadge = useMemo(() => {
    const status = capitalize(inspectionSummary?.inspectionReport?.status);
    const colors = getColorByName(status);
    return (
      <div
        className={styles.badge}
        style={{
          color: colors.color,
          borderColor: colors.border,
          background: colors.background,
        }}
      >
        {renderInfo(populateStatus(status))}
      </div>
    );
  }, [inspectionSummary?.inspectionReport?.status, renderInfo]);

  return (
    <div
      className={cx(classes.contentWrapper, {
        [styles.inspectionForm]: isEntityVessel,
      })}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className={cx(classes.headerTitle)}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
              'Inspection report'
            ],
          )}
        </div>
        <div className={cx(styles.wrapBtns, 'd-flex align-items-center')}>
          <Button
            className={cx(classes.btnDetail, 'mr-3')}
            onClick={() => setModalCorrectiveVisible(true)}
          >
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Summary,
            )}
          </Button>

          {/* <div className="position-relative">
            {isEntityVessel && (
              <Button
                className={cx(classes.btnDetail, 'mr-3')}
                onClick={(e) => {
                  e.stopPropagation();
                  setAnalyticalReportDropDown((prev) => !prev);
                }}
              >
                Analytical report
              </Button>
            )}
            {analyticalReportDropDown && (
              <InvisibleBackdrop
                onClick={() => setAnalyticalReportDropDown(false)}
              >
                <div className={styles.analyticalDropdown}>
                  <div className={styles.item} onClick={downloadTemplate}>
                    <img
                      src={images.icons.icDownloadGray}
                      className="me-2"
                      alt="icDownloadGray"
                    />
                    Download analysis excel
                  </div>
                  <a target="_blank" href={reportLink} rel="noreferrer">
                    <div className={styles.item}>
                      <img
                        src={images.icons.icFileFind}
                        className="me-2"
                        alt="icFileFind"
                      />
                      Analysis report
                    </div>
                  </a>
                </div>
              </InvisibleBackdrop>
            )}
          </div> */}

          {inspectionSummary?.inspectionReport?.iarId && (
            <Link
              to={`/internal-audit-report/detail/${inspectionSummary?.inspectionReport?.iarId}`}
              target="_blank"
            >
              <Button className={classes.btnDetail}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                    'View details'
                  ],
                )}
              </Button>
            </Link>
          )}
        </div>
      </div>
      <Row className="pt-2">
        <Col
          xs={12}
          className={cx(classes.wrapInfo, 'd-flex align-items-center')}
        >
          <div>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Status,
            )}
            :
          </div>
          {renderBadge}
        </Col>
        <Col xs={6} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Date of initiating report'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(
              formatDateNoTime(
                inspectionSummary?.inspectionReport?.dateOfInitiatingReport,
              ),
            )}
          </div>
        </Col>
        <Col xs={6} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Date of 1st submission'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(
              formatDateNoTime(
                inspectionSummary?.inspectionReport?.dateOf1stSubmission,
              ),
            )}
          </div>
        </Col>
        <Col xs={6} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Date of report approval'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(
              formatDateNoTime(
                inspectionSummary?.inspectionReport?.dateOfReportApproval,
              ),
            )}
          </div>
        </Col>
        <Col xs={6} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Date of report dispatched'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(
              formatDateNoTime(
                inspectionSummary?.inspectionReport?.dateOfReportDispatched,
              ),
            )}
          </div>
        </Col>
      </Row>
      <ModalFindingCorrective
        isOpen={modalCorrectiveVisible}
        onClose={() => setModalCorrectiveVisible(false)}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default InspectionReportSection;
