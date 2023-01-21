import { useCallback, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import Button from 'components/ui/button/Button';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { useSelector } from 'react-redux';
import { getColorByName, populateStatus } from 'helpers/utils.helper';
import { formatDateNoTime } from 'helpers/date.helper';
import classes from '../tab.module.scss';
import styles from './summary.module.scss';

const ReportOfFindingSection = ({ isEntityVessel, dynamicLabels }) => {
  const { inspectionSummary } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );

  const renderInfo = useCallback(
    (info: any) => {
      if (!inspectionSummary?.reportOfFinding?.status) {
        return '-';
      }
      return info || '-';
    },
    [inspectionSummary?.reportOfFinding?.status],
  );

  const renderBadge = useMemo(() => {
    const status = inspectionSummary?.reportOfFinding?.status;
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
  }, [inspectionSummary?.reportOfFinding?.status, renderInfo]);

  return (
    <div className={cx(classes.contentWrapper, styles.rofWrap)}>
      <div className="d-flex align-items-center justify-content-between">
        <div className={cx(classes.headerTitle)}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
              'Report of finding'
            ],
          )}
        </div>
        <div className="d-flex align-items-center">
          {inspectionSummary?.reportOfFinding?.followUpId && (
            <Link
              to={`/inspection-follow-up/detail/${inspectionSummary?.reportOfFinding?.followUpId}`}
              target="_blank"
            >
              <Button className={cx(classes.btnDetail, 'mr-3')}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['CAR/CAP'],
                )}
              </Button>
            </Link>
          )}
          {inspectionSummary?.reportOfFinding?.rofId && (
            <Link
              to={`/report-of-finding-management/detail/${inspectionSummary?.reportOfFinding?.rofId}`}
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
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Total no of findings'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(inspectionSummary?.reportOfFinding?.totalNoOfFindings)}
          </div>
        </Col>
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Total no of NC/CAR'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(inspectionSummary?.reportOfFinding?.totalCar)}
          </div>
        </Col>
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'CAR issued date'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(
              formatDateNoTime(
                inspectionSummary?.reportOfFinding?.caIssuedDate,
              ),
            )}
          </div>
        </Col>
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'CAP received date'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(
              formatDateNoTime(
                inspectionSummary?.reportOfFinding?.capReceivedDate,
              ),
            )}
          </div>
        </Col>
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Total no of CAP'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(inspectionSummary?.reportOfFinding?.totalCap)}
          </div>
        </Col>
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Total no of open CAR'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(inspectionSummary?.reportOfFinding?.totalOpenCar)}
          </div>
        </Col>
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Total no of closed CAR'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(inspectionSummary?.reportOfFinding?.totalCloseCar)}
          </div>
        </Col>
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Total no of denied CAP'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(inspectionSummary?.reportOfFinding?.totalDeniedCar)}
          </div>
        </Col>
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Total no of accepted CAP'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(inspectionSummary?.reportOfFinding?.totalAcceptCar)}
          </div>
        </Col>
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Verification needed CAR'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(
              inspectionSummary?.reportOfFinding?.verificationNeededCar,
            )}
          </div>
        </Col>
        <Col xs={4} className={classes.wrapInfo}>
          <div className={cx(classes.text, classes.labelText)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                'Pending verification CAR'
              ],
            )}
          </div>
          <div className={cx(classes.text, classes.contentText)}>
            {renderInfo(
              inspectionSummary?.reportOfFinding?.pendingVerificationCar,
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ReportOfFindingSection;
