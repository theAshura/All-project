import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import cx from 'classnames';
import InspectionHistory from 'components/common/inspection-history-ag-grid/InspectionHistory';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { CommonQuery, TOOLTIP_COLOR } from 'constants/common.const';
import { ENTITY_VESSEL } from 'constants/filter.const';
import { formatDateTimeDay } from 'helpers/utils.helper';
import capitalize from 'lodash/capitalize';
import { AuditInspectionWorkspaceDetailResponse } from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import moment from 'moment';
import { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useLocation } from 'react-router-dom';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { Col, Row } from 'reactstrap';
import {
  getAuditInspectionWorkspaceDetailActions,
  updateMasterChiefActions,
} from 'store/audit-inspection-workspace/audit-inspection-workspace.action';
import { PDFWrapper } from './Checklist';
import AuditLog from './summary/AuditLog';
import PotenitalRisk from './analytical/potential-risk/PotentialRisk';
import InspectionReportSection from './summary/InspectionReportSection';
import ReportOfFindingSection from './summary/ReportOfFindingSection';
import styles from './tab.module.scss';
import InspectionPerformance from './inspection-performance/InspectionPerformance';
import MasterModal from './summary/MasterModal';

// import ModalLoadTemplate from './analytic-report-template/modal-load-template/ModalLoadTemplate';

interface VesselInformationProps {
  data: AuditInspectionWorkspaceDetailResponse;
  loading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const VesselInformation: FC<VesselInformationProps> = ({
  data,
  dynamicLabels,
  loading,
}) => {
  const { analyticalReportInspection, auditInspectionWorkspaceDetail } =
    useSelector((state) => state.auditInspectionWorkspace);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalChief, setVisibleModalChief] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const isEdit = search === CommonQuery.EDIT;
  const { inspectionSummary } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );
  const isEntityVessel = useMemo(
    () => data?.entityType === ENTITY_VESSEL,
    [data],
  );

  const onSubmitForm = (formData) => {
    dispatch(
      updateMasterChiefActions.request({
        data: formData,
      }),
    );
    setVisibleModal(false);
    setVisibleModalChief(false);
    dispatch(getAuditInspectionWorkspaceDetailActions.request(id));
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <img
          src={images.common.loading}
          className={cx(styles.loading)}
          alt="loading"
        />
      </div>
    );
  }

  return (
    <div className={cx(styles.TabContainer, styles.vesselInfoWrap, 'd-block')}>
      <Row>
        <Col xs={12} className="d-flex justify-content-between">
          <div />
          <div className="d-flex align-items-center">
            <AuditLog dynamicLabels={dynamicLabels} />
            {data?.attachments?.length > 0 && (
              <PDFWrapper attachments={data?.attachments} />
            )}
          </div>
        </Col>

        <Col xs={12} xl={6}>
          <div
            className={cx(
              styles.contentWrapper,
              { [styles.officeInfo]: !isEntityVessel },
              'mt-0',
            )}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className={cx(styles.headerTitle)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                    `${data?.entityType} information`
                  ],
                )}
              </div>
              {inspectionSummary?.vesselInfo?.vesselId && (
                <Link
                  target="_blank"
                  to={`/vessel-management/detail/${inspectionSummary?.vesselInfo?.vesselId}`}
                >
                  <Button className={styles.btnDetail}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                        'View details'
                      ],
                    )}
                  </Button>
                </Link>
              )}
              {inspectionSummary?.vesselInfo?.companyId && (
                <Link
                  target="_blank"
                  to={`/company-management/detail/${inspectionSummary?.vesselInfo?.companyId}`}
                >
                  <Button className={styles.btnDetail}>
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
            {isEntityVessel ? (
              <Row className="pt-2">
                <Col xs={6} className={styles.wrapInfo}>
                  <div className={cx(styles.text, styles.labelText)}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                        'Vessel name'
                      ],
                    )}
                  </div>
                  <div className={cx(styles.text, styles.contentText)}>
                    {data?.vessel?.name || '-'}
                  </div>
                </Col>
                <Col xs={6} className={styles.wrapInfo}>
                  <div className={cx(styles.text, styles.labelText)}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                        'Vessel type'
                      ],
                    )}
                  </div>
                  <div className={cx(styles.text, styles.contentText)}>
                    {data?.vessel?.vesselType?.name || '-'}
                  </div>
                </Col>
                <Col xs={6} className={styles.wrapInfo}>
                  <div className={cx(styles.text, styles.labelText)}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Fleet,
                    )}
                  </div>
                  <div className={cx(styles.text, styles.contentText)}>
                    {data?.vessel?.fleet?.name || '-'}
                  </div>
                </Col>
                <Col xs={6} className={styles.wrapInfo}>
                  <div className={cx(styles.text, styles.labelText)}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                        'Vessel built on'
                      ],
                    )}
                  </div>
                  <div className={cx(styles.text, styles.contentText)}>
                    {formatDateTimeDay(data?.vessel?.buildDate) || '-'}
                  </div>
                </Col>
                <Col xs={6} className={styles.wrapInfo}>
                  <div className={cx(styles.text, styles.labelText)}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                        'Vessel current age'
                      ],
                    )}
                  </div>
                  <div className={cx(styles.text, styles.contentText)}>
                    {moment().diff(data?.vessel?.buildDate, 'years')}
                  </div>
                </Col>
                <Col xs={6} className={styles.wrapInfo}>
                  <div className={cx(styles.text, styles.labelText)}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                        'Ship manager name'
                      ],
                    )}
                  </div>
                  <div className={cx(styles.text, styles.contentText)}>
                    {inspectionSummary?.vesselInfo?.shipManagerName || '-'}
                  </div>
                </Col>
                <Col xs={6} className={styles.wrapInfo}>
                  <div className={styles.button}>
                    <div className={cx(styles.text, styles.labelText)}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary
                          .Master,
                      )}
                    </div>
                    {isEdit && (
                      <Button
                        onClick={() => {
                          setVisibleModal(true);
                        }}
                        buttonSize={ButtonSize.IconSmall2Action}
                        renderSuffix={
                          <img src={images.icons.icEdit} alt="edit" />
                        }
                      />
                    )}
                  </div>

                  <div
                    className={cx(
                      styles.text,
                      styles.contentText,
                      'limit-line-text',
                    )}
                  >
                    {auditInspectionWorkspaceDetail?.master || '-'}
                  </div>
                </Col>
                <Col xs={6} className={styles.wrapInfo}>
                  <div className={styles.button}>
                    <div className={cx(styles.text, styles.labelText)}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                          'Chief of engineer'
                        ],
                      )}
                    </div>
                    {isEdit && (
                      <Button
                        onClick={() => {
                          setVisibleModalChief(true);
                        }}
                        className={styles.editButton}
                        buttonSize={ButtonSize.IconSmall2Action}
                        renderSuffix={
                          <img src={images.icons.icEdit} alt="edit" />
                        }
                      />
                    )}
                  </div>

                  <div
                    className={cx(
                      styles.text,
                      styles.contentText,
                      'limit-line-text',
                    )}
                  >
                    {auditInspectionWorkspaceDetail?.chiefOfEngineer || '-'}
                  </div>
                </Col>
              </Row>
            ) : (
              <>
                <Row className="pt-2 mx-0">
                  <Col className={cx('p-0 me-3')}>
                    <div className={cx(styles.text, styles.labelText)}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                          'Company name'
                        ],
                      )}
                    </div>
                    <div className={cx(styles.text, styles.contentText)}>
                      {data?.planningRequest?.auditCompany?.name || '-'}
                    </div>
                  </Col>
                  <Col className={cx('p-0 ms-3')}>
                    <div className={cx(styles.text, styles.labelText)}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                          'Department name'
                        ],
                      )}
                    </div>
                    <div className={cx(styles.text, styles.contentText)}>
                      <Tooltip
                        placement="topLeft"
                        title={
                          data?.planningRequest?.departments
                            ?.map((i) => i.name)
                            .join(', ') || '-'
                        }
                        color={TOOLTIP_COLOR}
                      >
                        <div
                          className={cx(
                            'limit-line-text',
                            styles.departmentWrap,
                          )}
                        >
                          {data?.planningRequest?.departments
                            ?.map((i) => i.name)
                            .join(', ') || '-'}
                        </div>
                      </Tooltip>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </div>

          <div className={cx(styles.contentWrapper)}>
            <InspectionPerformance
              entity={auditInspectionWorkspaceDetail?.entityType}
              vesselType={
                auditInspectionWorkspaceDetail?.vessel?.vesselType?.icon
              }
              isFlex
              inspectionScore={analyticalReportInspection?.inspectionScore}
              percentPerformance={
                analyticalReportInspection?.inspectionPerformance
              }
              dynamicLabels={dynamicLabels}
            />
          </div>

          <div
            className={cx(styles.contentWrapper, {
              [styles.scheduleInfo]: !isEntityVessel,
            })}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className={cx(styles.headerTitle, 'pt-2')}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                    'Scheduler information'
                  ],
                )}
              </div>
              {inspectionSummary?.schedulerInfo?.planningRequestId && (
                <Link
                  target="_blank"
                  to={`/planning-and-request-management/detail/${inspectionSummary?.schedulerInfo?.planningRequestId}`}
                >
                  <Button className={styles.btnDetail}>
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

            <Row className="pt-2">
              <Col xs={6} className={styles.wrapInfo}>
                <div className={cx(styles.text, styles.labelText)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                      'Plan ID'
                    ],
                  )}
                </div>
                <div className={cx(styles.text, styles.contentText)}>
                  {data?.planningRequest?.auditNo || '-'}
                </div>
              </Col>
              <Col xs={6} className={styles.wrapInfo}>
                <div className={cx(styles.text, styles.labelText)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                      'Working type'
                    ],
                  )}
                </div>
                <div className={cx(styles.text, styles.contentText)}>
                  {data?.planningRequest?.workingType || '-'}
                </div>
              </Col>
              <Col xs={6} className={styles.wrapInfo}>
                <div className={cx(styles.text, styles.labelText)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                      'Visit type'
                    ],
                  )}
                </div>
                <div className={cx(styles.text, styles.contentText)}>
                  {capitalize(data?.planningRequest?.typeOfAudit) || '-'}
                </div>
              </Col>
              <Col xs={6} className={styles.wrapInfo}>
                <div className={cx(styles.text, styles.labelText)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                      'Inspector name'
                    ],
                  )}
                </div>
                <div className={cx(styles.text, styles.contentText)}>
                  <Tooltip
                    placement="topLeft"
                    title={
                      data?.planningRequest?.auditors
                        ?.map((i) => i.username)
                        .join(', ') || '-'
                    }
                    color={TOOLTIP_COLOR}
                  >
                    <span className={cx('limit-line-text')}>
                      {data?.planningRequest?.auditors
                        ?.map((i) => i.username)
                        .join(', ') || '-'}
                    </span>
                  </Tooltip>
                </div>
              </Col>

              <Col xs={6} className={styles.wrapInfo}>
                <div className={cx(styles.text, styles.labelText)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                      'Planned from'
                    ],
                  )}
                </div>
                <div className={cx(styles.text, styles.contentText)}>
                  {formatDateTimeDay(data?.planningRequest?.plannedFromDate) ||
                    '-'}
                </div>
              </Col>
              <Col xs={6} className={styles.wrapInfo}>
                <div className={cx(styles.text, styles.labelText)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                      'Planned to'
                    ],
                  )}
                </div>
                <div className={cx(styles.text, styles.contentText)}>
                  {formatDateTimeDay(data?.planningRequest?.plannedToDate) ||
                    '-'}
                </div>
              </Col>
              {isEntityVessel && (
                <>
                  <Col xs={6} className={styles.wrapInfo}>
                    <div className={cx(styles.text, styles.labelText)}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                          'Port from'
                        ],
                      )}
                    </div>
                    <div className={cx(styles.text, styles.contentText)}>
                      {data?.planningRequest?.fromPort?.name || '-'}
                    </div>
                  </Col>
                  <Col xs={6} className={styles.wrapInfo}>
                    <div className={cx(styles.text, styles.labelText)}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                          'Port to'
                        ],
                      )}
                    </div>
                    <div className={cx(styles.text, styles.contentText)}>
                      {data?.planningRequest?.toPort?.name || '-'}
                    </div>
                  </Col>
                </>
              )}

              <Col xs={6} className={styles.wrapInfo}>
                <div className={cx(styles.text, styles.labelText)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
                      'User memo'
                    ],
                  )}
                </div>
                <div className={cx(styles.text, styles.contentText)}>
                  {data?.planningRequest?.memo || '-'}
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col xs={12} xl={6}>
          <InspectionReportSection
            data={data}
            isEntityVessel={isEntityVessel}
            dynamicLabels={dynamicLabels}
          />
          <div className={cx(styles.contentWrapper)}>
            <PotenitalRisk
              percent={analyticalReportInspection?.potentialRiskPercentAbs}
              riskNumber={analyticalReportInspection?.totalPotentialRisk}
              isOffice={!isEntityVessel}
              dynamicLabels={dynamicLabels}
            />
          </div>
          <ReportOfFindingSection
            isEntityVessel={isEntityVessel}
            dynamicLabels={dynamicLabels}
          />
        </Col>
      </Row>
      <div className={styles.historyWrapper}>
        <InspectionHistory
          featurePage={Features.AUDIT_INSPECTION}
          subFeaturePage={SubFeatures.AUDIT_INSPECTION_WORKSPACE}
          title={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
              'Inspection history'
            ],
          )}
          vesselId={data?.planningRequest?.vesselId}
          departmentId={data?.planningRequest?.departmentId}
          entityType={data?.entityType}
          dynamicLabels={dynamicLabels}
        />
        <MasterModal
          title={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Master,
          )}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['Enter master'],
          )}
          data={auditInspectionWorkspaceDetail?.master}
          isOpen={visibleModal}
          loading={loading}
          disabled={!isEdit}
          toggle={() => {
            setVisibleModal((e) => !e);
          }}
          dynamicLabels={dynamicLabels}
          handleSubmitForm={onSubmitForm}
        />
        <MasterModal
          dynamicLabels={dynamicLabels}
          disabled={!isEdit}
          title={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
              'Chief of engineer'
            ],
          )}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
              'Enter chief of engineer'
            ],
          )}
          isOpen={visibleModalChief}
          data={auditInspectionWorkspaceDetail?.chiefOfEngineer}
          loading={loading}
          toggle={() => {
            setVisibleModalChief((e) => !e);
          }}
          handleSubmitForm={onSubmitForm}
        />
      </div>
      {/* <ModalLoadTemplate isOpen onClose={() => console.log('lol')} /> */}
    </div>
  );
};

export default VesselInformation;
