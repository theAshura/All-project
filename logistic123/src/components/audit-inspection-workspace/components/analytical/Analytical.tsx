import { FC, useState, useCallback, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import images from 'assets/images/images';
import { toastError } from 'helpers/notification.helper';
import { useSelector, useDispatch } from 'react-redux';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import Tooltip from 'antd/lib/tooltip';
import Button from 'components/ui/button/Button';
import { getAnalyticalReportDetailMainSubcategoryWiseAction } from 'store/audit-inspection-workspace/audit-inspection-workspace.action';
import { DownloadOutlined } from '@ant-design/icons';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import styles from './analytical.module.scss';
import '../tab.scss';
import Performance from './Performance';
import ScoreTable from './ScoreTable/ScoreTable';
import ModalLoadTemplate from '../analytic-report-template/modal-load-template/ModalLoadTemplate';
import { hideShowAnalyticalReportApi } from '../../../../api/audit-inspection-workspace.api';

interface Props {
  loading: boolean;
  activeTab: string;
  disabled: boolean;
  isEdit?: boolean;
  id: string;
  dynamicLabels?: IDynamicLabel;
}

const AnalyticalTab: FC<Props> = ({
  loading,
  disabled,
  activeTab,
  id,
  isEdit,
  dynamicLabels,
}) => {
  const [modalExportVisible, setModalExportVisible] = useState(false);
  const [modalWarningVisible, setModalWarningVisible] = useState(false);
  const [firstTimeShowWarning, setFirstTimeShowWarning] = useState(true);
  const dispatch = useDispatch();
  const { auditInspectionWorkspaceDetail } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );
  const { analyticalReportInspection } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );

  useEffect(() => {
    dispatch(getAnalyticalReportDetailMainSubcategoryWiseAction.request(id));
  }, [dispatch, id]);

  useEffect(() => {
    const riskRate =
      Number(
        Number(analyticalReportInspection?.potentialRiskRepeatPercent) * 100,
      )?.toFixed(0) || 0;
    const inspectionPerf = Number(
      (analyticalReportInspection?.inspectionPerformanceRepeat || 0) * 100,
    );
    if (
      (inspectionPerf > 100 ||
        riskRate > 100 ||
        inspectionPerf < 0 ||
        riskRate < 0) &&
      firstTimeShowWarning &&
      auditInspectionWorkspaceDetail?.showPopupAnalyticalReport
    ) {
      setModalWarningVisible(true);
      setFirstTimeShowWarning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    analyticalReportInspection?.inspectionPerformanceRepeatAbs,
    firstTimeShowWarning,
  ]);

  const renderPotential = useCallback((value) => {
    if (value > 0 && value <= 19) {
      return <span className={styles.yellow}>Low</span>;
    }
    if (value >= 20 && value <= 49) {
      return <span className={styles.orange}>Medium</span>;
    }
    if (value >= 50) {
      return <span className={styles.red}>High</span>;
    }
    return <span className={styles.green}>Negligible</span>;
  }, []);

  const renderInspectionPerformance = useCallback((value) => {
    if (value >= 0 && value <= 50) {
      return <span className={styles.red}>{value}%</span>;
    }
    if (value >= 51 && value <= 70) {
      return <span className={styles.orange}>{value}%</span>;
    }
    if (value >= 71 && value <= 85) {
      return <span className={styles.yellow}>{value}%</span>;
    }
    if (value > 85) {
      return (
        <span className={styles.green}>{value > 100 ? '>100' : value}%</span>
      );
    }
    if (value < 0) {
      return <span className={styles.red}>{'<0%'}</span>;
    }
    return <span className={styles.red}>{value}%</span>;
  }, []);

  const renderValueLimit = useCallback((value) => {
    if (Number(value) > 100) {
      return '>100';
    }
    return Number(value)?.toFixed(0) || 0;
  }, []);

  return (
    <div className={styles.tabContainer}>
      <div className="d-flex justify-content-end">
        <Button
          disabled={false}
          onClick={() => setModalExportVisible(true)}
          className={styles.customExportBtn}
        >
          <span className="pe-2">
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.Export,
            )}
          </span>
          <DownloadOutlined />
        </Button>
      </div>
      <Row>
        <Col xs={5}>
          <div className={cx(styles.wrap, styles.wrapInspection)}>
            <div className={styles.title}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Inspection performance calculation'
                ],
              )}
            </div>
            <div className={styles.subTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Inspection performance range'
                ],
              )}
              :
            </div>
            <div
              className={cx(
                styles.wrapBadge,
                'd-flex align-items-center flex-wrap',
              )}
            >
              <div className={styles.badge}>
                <div className={styles.dot} />
                <span> Red (0-50)</span>
              </div>
              <div className={styles.badge}>
                <div className={cx(styles.orangeBg, styles.dot)} />
                <span> Orange (51-70)</span>
              </div>
              <div className={styles.badge}>
                <div className={cx(styles.yellowBg, styles.dot)} />
                <span> Yellow (71-85)</span>
              </div>
              <div className={styles.badge}>
                <div className={cx(styles.greenBg, styles.dot)} />
                <span> Green ({'>'} 85)</span>
              </div>
            </div>
            <div className={styles.lineInfo}>
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                    'Total questions'
                  ],
                )}
              </div>
              <div className={styles.value}>
                {analyticalReportInspection?.totalQuestions}
              </div>
            </div>
            <div className={styles.lineInfo}>
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                    'Question marked with value'
                  ],
                )}
              </div>
              <div className={styles.value}>
                {analyticalReportInspection?.totalQuestionsMarkedValue}
              </div>
            </div>
            <div className={styles.lineInfo}>
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                    'Total questions verified'
                  ],
                )}
              </div>
              <div className={styles.value}>
                {analyticalReportInspection?.totalQuestionsVerified}
              </div>
            </div>
            {/* <div className={styles.lineInfo}>
              <div className={styles.label}>Max score that can be achieved</div>
              <div className={styles.value}>
                {analyticalReportInspection?.totalQuestionsMarkedValue}
              </div>
            </div> */}
            <hr />
            <div className={styles.lineInfo}>
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                    'Inspection score'
                  ],
                )}
              </div>
              <div className={styles.value}>
                {Number(
                  analyticalReportInspection?.repeatedFindingScore
                    ?.inspectionScoreRepeatedFinding ||
                    analyticalReportInspection?.inspectionScore ||
                    0,
                )}
              </div>
            </div>
            <div className={styles.lineInfo}>
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                    'Inspection performance'
                  ],
                )}
              </div>
              <div className={styles.value}>
                {renderInspectionPerformance(
                  Number(
                    (analyticalReportInspection?.inspectionPerformanceRepeat +
                      analyticalReportInspection?.configInspectionPercentOff) *
                      100,
                  ).toFixed(0),
                )}
              </div>
            </div>
            <hr />
            <div className={styles.subTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Potential risks range'
                ],
              )}
            </div>
            <div
              className={cx(
                styles.wrapBadge,
                'd-flex align-items-center flex-wrap',
              )}
            >
              <div className={styles.badge}>
                <div className={cx(styles.greenBg, styles.dot)} />
                <span>Negligible (0)</span>
              </div>
              <div className={styles.badge}>
                <div className={cx(styles.yellowBg, styles.dot)} />
                <span>Low (1-19)</span>
              </div>
              <div className={styles.badge}>
                <div className={cx(styles.orangeBg, styles.dot)} />
                <span>Medium (20-49)</span>
              </div>
              <div className={styles.badge}>
                <div className={cx(styles.dot)} />
                <span>High ({'>'}=50)</span>
              </div>
            </div>
            <div className={styles.lineInfo}>
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                    'Potential risk'
                  ],
                )}
              </div>
              <div className={styles.value}>
                {renderPotential(
                  Math.abs(
                    analyticalReportInspection?.repeatedFindingScore
                      ?.totalPotentialRiskRepeatedFinding ||
                      analyticalReportInspection?.totalPotentialRisk,
                  ),
                )}
              </div>
            </div>
            <div className={styles.lineInfo}>
              <div className={styles.label}>
                <span className="mr-3">
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Risk rating'
                    ],
                  )}{' '}
                </span>
                <Tooltip
                  placement="bottom"
                  title={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Risk is represented as a value'
                    ],
                  )}
                  color="#1E62DC"
                >
                  <img
                    src={images.icons.icInfoCircleBlue}
                    alt="icInfoCircleBlue"
                  />
                </Tooltip>
              </div>
              <div className={styles.value}>
                {renderValueLimit(
                  Math.abs(
                    Number(
                      analyticalReportInspection?.potentialRiskRepeatPercentAbs,
                    ) * 100,
                  ) || 0,
                )}
                %
              </div>
            </div>
          </div>
        </Col>
        <Col xs={7}>
          <Performance
            idWorkspace={id}
            isEdit={isEdit}
            dynamicLabels={dynamicLabels}
          />
        </Col>
        <Col xs={12}>
          <ScoreTable
            idWorkspace={id}
            isEdit={isEdit}
            dynamicLabels={dynamicLabels}
          />
        </Col>
      </Row>
      <ModalLoadTemplate
        isOpen={modalExportVisible}
        onClose={() => setModalExportVisible(false)}
        dynamicLabels={dynamicLabels}
      />
      <ModalConfirm
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Incorrect checklist template'
          ],
        )}
        content={renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Please ensure that you are using correct Template Checklist while generating Analytical Report'
          ],
        )}
        disable={loading}
        toggle={() => setModalWarningVisible(!modalWarningVisible)}
        modal={modalWarningVisible}
        rightTxt={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Confirm,
        )}
        hideCancel
        handleSubmit={() => {
          hideShowAnalyticalReportApi(id, {
            showPopupAnalyticalReport: false,
          })
            .then((res) => {})
            .catch((err) => toastError(err));
          setModalWarningVisible(false);
        }}
      />
    </div>
  );
};

export default AnalyticalTab;
