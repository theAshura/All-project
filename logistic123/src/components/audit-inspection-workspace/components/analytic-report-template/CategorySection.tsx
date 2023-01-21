import { useCallback, useEffect, useState, useMemo } from 'react';
import { Col, Row, Table } from 'reactstrap';
import NoDataImg from 'components/common/no-data/NoData';
import cx from 'classnames';
import moment from 'moment';
import isNaN from 'lodash/isNaN';
import images from 'assets/images/images';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { convertToAgeDecimal } from 'helpers/utils.helper';
import Tooltip from 'antd/lib/tooltip';
import { toastError } from 'helpers/notification.helper';
import { getAnalyticalReportMainSecondCategoryLocationApi } from 'api/audit-inspection-workspace.api';
import { useSelector } from 'react-redux';
import styles from './template.module.scss';
import BubbleChartCustom from '../../../custom-chart/BubbleChartCustom';
import PotenitalRisk from '../analytical/potential-risk/PotentialRisk';
import LayoutTemplate from './layout-template/LayoutTemplate';
import InspectionPerformance from '../inspection-performance/InspectionPerformance';

const CategorySection = ({ id, findingData, dynamicLabels }) => {
  const [categoryLocationOverview, setCategoryLocationOverview] =
    useState(null);

  const { auditInspectionWorkspaceDetail, analyticalReportInspection } =
    useSelector((state) => state.auditInspectionWorkspace);

  useEffect(() => {
    getAnalyticalReportMainSecondCategoryLocationApi(id)
      .then((res) => {
        setCategoryLocationOverview(res?.data || []);
      })
      .catch((err) => toastError(err));
  }, [id]);

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
      return <span className={styles.green}>{value}%</span>;
    }
    if (value > 100) {
      return <span className={styles.green}>{'>100'}%</span>;
    }

    return <span className={styles.red}>{value < 0 ? '<0%' : value}</span>;
  }, []);

  const renderValueLimit = useCallback((value) => {
    if (Number(value) > 100) {
      return '>100';
    }
    return Number(value)?.toFixed(0) || 0;
  }, []);

  const categoryOverviewAnalytic = useMemo(() => {
    if (!findingData) {
      return [];
    }
    const listCategory =
      findingData?.findingsWeightScoreByGroup?.weightScoreMainCategory?.map(
        (item) => ({
          x: Math.abs(item?.value || 0),
          y: Math.abs(
            findingData?.findingsQuantityByGroup?.findingMainCategory?.find(
              (i) => i.name === item.name,
            )?.value || 0,
          ),
          // z: 13.8,
          name: item?.acronym,
          color: '#52e93a',
        }),
      );
    const listSecondCategory =
      findingData?.findingsWeightScoreByGroup?.weightScoreSecondCategory?.map(
        (item) => {
          const valueY =
            findingData?.findingsQuantityByGroup?.findingSecondCategory?.find(
              (i) => i.name === item.name,
            );
          const x =
            (item?.criticalityGroup || item?.priorityGroup)?.reduce(
              (a, b) => Number(a) + Number(b.value),
              0,
            ) || 0;

          const y =
            (valueY?.criticalityGroup || valueY?.priorityGroup)?.reduce(
              (a, b) => Number(a) + Number(b.value),
              0,
            ) || 0;

          return {
            x: Math.abs(x),
            y: Math.abs(y),
            // z: 13.8,
            name: item?.acronym,
            color: '#ff9f0a',
          };
        },
      );
    const listLocationOverviews =
      findingData?.findingsWeightScoreByGroup?.weightScoreLocation?.map(
        (item) => {
          const valueFinding =
            findingData?.findingsQuantityByGroup?.findingLocation?.find(
              (i) => i.name === item.name,
            );
          const x =
            (item?.criticalityGroup || item?.priorityGroup)?.reduce(
              (a, b) => Number(a) + Number(b.value),
              0,
            ) || 0;
          const y =
            (
              valueFinding?.criticalityGroup || valueFinding?.priorityGroup
            )?.reduce((a, b) => Number(a) + Number(b.value), 0) || 0;

          return {
            x: Math.abs(x),
            y: Math.abs(y),
            // z: 13.8,
            name: item?.acronym,
            color: '#0a84ff',
          };
        },
      );

    return listCategory
      ?.concat(listSecondCategory || [])
      ?.concat(listLocationOverviews || []);
  }, [findingData]);

  const isOffice = useMemo(
    () => auditInspectionWorkspaceDetail?.entityType === 'Office',
    [auditInspectionWorkspaceDetail?.entityType],
  );

  const renderHeader = useMemo(() => {
    if (isOffice) {
      return (
        <>
          <div className={styles.title}>
            {auditInspectionWorkspaceDetail?.planningRequest?.auditCompany
              ?.name || '-'}
          </div>
          <div className={cx(styles.imoTitle, 'mb-3')}>
            IMO{' '}
            {auditInspectionWorkspaceDetail?.planningRequest?.auditCompany
              ?.companyIMO || '-'}
            {/* <span className={styles.company}>
              {userInfo?.companyLevel || '-'}
            </span> */}
          </div>
        </>
      );
    }
    return (
      <>
        <div className={styles.title}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
              'Vessel name'
            ],
          )}{' '}
          {auditInspectionWorkspaceDetail?.vessel?.name || '-'}
        </div>
        <div className={cx(styles.imoTitle, 'mb-3')}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.IMO,
          )}{' '}
          {auditInspectionWorkspaceDetail?.vessel?.imoNumber || '-'}
        </div>
      </>
    );
  }, [
    auditInspectionWorkspaceDetail?.planningRequest?.auditCompany?.companyIMO,
    auditInspectionWorkspaceDetail?.planningRequest?.auditCompany?.name,
    auditInspectionWorkspaceDetail?.vessel?.imoNumber,
    auditInspectionWorkspaceDetail?.vessel?.name,
    dynamicLabels,
    isOffice,
  ]);

  const renderLineInfo = (label, value) => (
    <div className={styles.lineInfo}>
      <div className={styles.label}>
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[label],
        )}
        :
      </div>
      <div className={styles.value}>{value || '-'}</div>
    </div>
  );

  const adjustedInspectionPerformance = (data) => {
    const percentOriginal = Number(
      analyticalReportInspection?.inspectionPerformanceRepeat || 0,
    );

    if (!data) {
      return percentOriginal;
    }
    const additional = Number(
      data?.reduce(
        (a, b) =>
          Number(a || 0) +
          Number(
            isNaN(Number(b?.percentOff || 0)) ? 0 : Number(b?.percentOff || 0),
          ),
        0,
      ),
    );
    return percentOriginal + Number(additional / 100);
  };

  const adjustedVesselRisk = (data) => {
    if (!data) {
      return data;
    }
    return (
      Number(
        data?.reduce(
          (a, b) =>
            Number(a) + Number(isNaN(Number(b?.percentOff)) ? 0 : b.percentOff),
          0,
        ),
      ) + (analyticalReportInspection?.totalPotentialRisk || 0)
    );
  };

  return (
    <LayoutTemplate>
      <div className={styles.tabContainer}>
        <Row>
          <Col xs={6}>
            {renderHeader}
            <Row className="mt-3">
              <Col xs={6}>
                {!isOffice &&
                  renderLineInfo(
                    'Master',
                    auditInspectionWorkspaceDetail?.master,
                  )}

                {!isOffice &&
                  renderLineInfo(
                    'Chief engineer',
                    auditInspectionWorkspaceDetail?.chiefOfEngineer,
                  )}
                {renderLineInfo(
                  'Date of inspection',
                  auditInspectionWorkspaceDetail?.planningRequest
                    ?.plannedFromDate
                    ? moment(
                        auditInspectionWorkspaceDetail?.planningRequest
                          ?.plannedFromDate,
                      )
                        ?.local()
                        ?.format('D MMM YY')
                    : '-',
                )}
                {!isOffice &&
                  renderLineInfo(
                    'Port of inspection',
                    auditInspectionWorkspaceDetail?.planningRequest?.fromPort
                      ?.name,
                  )}
                {renderLineInfo(
                  'Inspector name',
                  auditInspectionWorkspaceDetail?.planningRequest?.auditors
                    ?.length
                    ? auditInspectionWorkspaceDetail?.planningRequest?.auditors
                        ?.map((item) => item?.username)
                        ?.join(', ')
                    : '-',
                )}
              </Col>
              <Col xs={6}>
                {!isOffice &&
                  renderLineInfo(
                    'Vessel type',
                    auditInspectionWorkspaceDetail?.vessel?.vesselType?.name,
                  )}
                {isOffice &&
                  renderLineInfo(
                    'Company type',
                    auditInspectionWorkspaceDetail?.planningRequest
                      ?.auditCompany?.companyTypes
                      ? auditInspectionWorkspaceDetail?.planningRequest?.auditCompany?.companyTypes
                          ?.map((item) => item?.companyType)
                          ?.join(', ')
                      : '-',
                  )}
                {!isOffice &&
                  renderLineInfo(
                    'Age (YY.MM)',
                    convertToAgeDecimal(
                      auditInspectionWorkspaceDetail?.vessel?.buildDate,
                    ),
                  )}
                {!isOffice &&
                  renderLineInfo(
                    'Ship yard',
                    auditInspectionWorkspaceDetail?.vessel?.shipyardName,
                  )}
                {!isOffice &&
                  renderLineInfo(
                    'Shipyard country',
                    auditInspectionWorkspaceDetail?.vessel?.shipyardCountry,
                  )}
                {!isOffice &&
                  renderLineInfo(
                    'Size (GRT)',
                    auditInspectionWorkspaceDetail?.vessel?.grt,
                  )}

                {isOffice &&
                  renderLineInfo(
                    'Place of inspection',
                    auditInspectionWorkspaceDetail?.company?.address,
                  )}
                {isOffice &&
                  renderLineInfo(
                    'Department ',
                    auditInspectionWorkspaceDetail?.planningRequest?.departments
                      ?.map((i) => i.name)
                      .join(', ') || '-',
                  )}
              </Col>
            </Row>
          </Col>
          <Col xs={6}>
            <Row>
              <Col xs={6}>
                <InspectionPerformance
                  entity={auditInspectionWorkspaceDetail?.entityType}
                  dynamicLabels={dynamicLabels}
                  inspectionScore={
                    analyticalReportInspection?.repeatedFindingScore
                      ?.inspectionScoreRepeatedFinding &&
                    analyticalReportInspection?.repeatedFindingScore
                      ?.inspectionScoreRepeatedFinding !== 0
                      ? analyticalReportInspection?.repeatedFindingScore
                          ?.inspectionScoreRepeatedFinding
                      : analyticalReportInspection?.inspectionScore
                  }
                  percentPerformance={
                    adjustedInspectionPerformance(
                      analyticalReportInspection?.analyticalReportConfigInspection,
                    ) || 0
                  }
                  vesselType={
                    auditInspectionWorkspaceDetail?.vessel?.vesselType?.icon
                  }
                />
              </Col>

              <Col xs={6}>
                <PotenitalRisk
                  dynamicLabels={dynamicLabels}
                  percent={
                    analyticalReportInspection?.potentialRiskRepeatPercentAbs
                  }
                  riskNumber={adjustedVesselRisk(
                    analyticalReportInspection?.analyticalReportConfigVessel,
                  )}
                  isOffice={isOffice}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={6}>
            <div className={styles.subTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Category overview'
                ],
              )}
            </div>
            <Table>
              <thead>
                <tr>
                  <th rowSpan={2} className={styles.customBorderRight}>
                    <div className={cx(styles.twoRowSpan)}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                          .CATEGORY,
                      )}
                    </div>
                  </th>
                  <th colSpan={6} className={cx('text-center')}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'POTENTIAL RISKS FINDING COUNT'
                      ],
                    )}{' '}
                  </th>
                </tr>
                <tr>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .UNASSIGNED,
                    )}
                  </th>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .NEGLIGIBLE,
                    )}
                  </th>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.LOW,
                    )}
                  </th>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .MEDIUM,
                    )}
                  </th>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .HIGH,
                    )}
                  </th>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .TOTAL,
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryLocationOverview?.categoryOverviews?.length ? (
                  categoryLocationOverview?.categoryOverviews?.map((item) => (
                    <tr key={item.code}>
                      <td>
                        <div className="w-100 d-flex align-items-center justify-content-between">
                          <div className={styles.codeName}>{item?.name}</div>
                          <div>{item?.code}</div>
                        </div>
                      </td>
                      <td className={cx('text-center', styles.unassigned)}>
                        {item?.unassigned || '-'}
                      </td>
                      <td className={cx('text-center', styles.negligible)}>
                        {item?.negligible || '-'}
                      </td>
                      <td className={cx('text-center', styles.low)}>
                        {item?.low || '-'}
                      </td>
                      <td className={cx('text-center', styles.medium)}>
                        {item?.medium || '-'}
                      </td>
                      <td className={cx('text-center', styles.high)}>
                        {item?.high || '-'}
                      </td>
                      <td className={cx('text-center', styles.total)}>
                        {item?.total || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <NoDataImg />
                    </td>
                  </tr>
                )}
                {categoryLocationOverview?.categoryOverviews?.length && (
                  <tr className={styles.wrapTotal}>
                    <td>
                      <div className="w-100 d-flex align-items-center justify-content-between">
                        <div className="font-weight-bold">
                          {renderDynamicLabel(
                            dynamicLabels,
                            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS
                              .Analytical['Grand total'],
                          )}
                        </div>
                        <div />
                      </div>
                    </td>
                    <td className={cx('text-center', styles.unassigned)}>
                      {categoryLocationOverview?.categoryOverviews?.reduce(
                        (a, b) => a + Number(b.unassigned),
                        0,
                      ) || '-'}
                    </td>
                    <td className={cx('text-center', styles.negligible)}>
                      {categoryLocationOverview?.categoryOverviews?.reduce(
                        (a, b) => a + Number(b.negligible),
                        0,
                      ) || '-'}
                    </td>
                    <td className={cx('text-center', styles.low)}>
                      {categoryLocationOverview?.categoryOverviews?.reduce(
                        (a, b) => a + Number(b.low),
                        0,
                      ) || '-'}
                    </td>
                    <td className={cx('text-center', styles.medium)}>
                      {categoryLocationOverview?.categoryOverviews?.reduce(
                        (a, b) => a + Number(b.medium),
                        0,
                      ) || '-'}
                    </td>
                    <td className={cx('text-center', styles.high)}>
                      {categoryLocationOverview?.categoryOverviews?.reduce(
                        (a, b) => a + Number(b.high),
                        0,
                      ) || '-'}
                    </td>
                    <td className={cx('text-center', styles.total)}>
                      {categoryLocationOverview?.categoryOverviews?.reduce(
                        (a, b) => a + Number(b.total),
                        0,
                      ) || '-'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
          <Col xs={6}>
            <div className={styles.subTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Location overview'
                ],
              )}
            </div>
            <Table>
              <thead>
                <tr>
                  <th rowSpan={2} className={styles.customBorderRight}>
                    <div className={cx(styles.twoRowSpan)}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                          .CATEGORY,
                      )}
                    </div>
                  </th>
                  <th colSpan={6} className={cx('text-center')}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'POTENTIAL RISKS FINDING COUNT'
                      ],
                    )}
                  </th>
                </tr>
                <tr>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .UNASSIGNED,
                    )}
                  </th>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .NEGLIGIBLE,
                    )}
                  </th>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.LOW,
                    )}
                  </th>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .MEDIUM,
                    )}
                  </th>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .HIGH,
                    )}
                  </th>
                  <th
                    className={cx(
                      'text-center',
                      styles.customBorderBottom,
                      styles.alginTableCell,
                    )}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .TOTAL,
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryLocationOverview?.locationOverviews?.length ? (
                  categoryLocationOverview?.locationOverviews?.map((item) => (
                    <tr key={item.code}>
                      <td>
                        <div className="w-100 d-flex align-items-center justify-content-between">
                          <div className={styles.codeName}>{item?.name}</div>
                          <div>{item?.code}</div>
                        </div>
                      </td>
                      <td className={cx('text-center', styles.unassigned)}>
                        {item?.unassigned || '-'}
                      </td>
                      <td className={cx('text-center', styles.negligible)}>
                        {item?.negligible || '-'}
                      </td>
                      <td className={cx('text-center', styles.low)}>
                        {item?.low || '-'}
                      </td>
                      <td className={cx('text-center', styles.medium)}>
                        {item?.medium || '-'}
                      </td>
                      <td className={cx('text-center', styles.high)}>
                        {item?.high || '-'}
                      </td>
                      <td className={cx('text-center', styles.total)}>
                        {item?.total || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <NoDataImg />
                    </td>
                  </tr>
                )}
                {categoryLocationOverview?.locationOverviews?.length && (
                  <tr className={styles.wrapTotal}>
                    <td>
                      <div className="w-100 d-flex align-items-center justify-content-between">
                        <div className="font-weight-bold">
                          {renderDynamicLabel(
                            dynamicLabels,
                            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS
                              .Analytical['Grand total'],
                          )}
                        </div>
                        <div />
                      </div>
                    </td>
                    <td className={cx('text-center', styles.unassigned)}>
                      {categoryLocationOverview?.categoryOverviews?.reduce(
                        (a, b) => a + Number(b.unassigned),
                        0,
                      ) || '-'}
                    </td>
                    <td className={cx('text-center', styles.negligible)}>
                      {categoryLocationOverview?.locationOverviews?.reduce(
                        (a, b) => a + Number(b?.negligible),
                        0,
                      ) || '-'}
                    </td>
                    <td className={cx('text-center', styles.low)}>
                      {categoryLocationOverview?.locationOverviews?.reduce(
                        (a, b) => a + Number(b?.low),
                        0,
                      ) || '-'}
                    </td>
                    <td className={cx('text-center', styles.medium)}>
                      {categoryLocationOverview?.locationOverviews?.reduce(
                        (a, b) => a + Number(b?.medium),
                        0,
                      ) || '-'}
                    </td>
                    <td className={cx('text-center', styles.high)}>
                      {categoryLocationOverview?.locationOverviews?.reduce(
                        (a, b) => a + Number(b?.high),
                        0,
                      ) || '-'}
                    </td>
                    <td className={cx('text-center', styles.total)}>
                      {categoryLocationOverview?.locationOverviews?.reduce(
                        (a, b) => a + Number(b?.total),
                        0,
                      ) || '-'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={6}>
            <div className={styles.subTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Category overview'
                ],
              )}
            </div>
            <div className={styles.badges}>
              <div className={styles.badge}>
                <div className={styles.dotGreen} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Main category'
                    ],
                  )}
                </div>
              </div>
              <div className={styles.badge}>
                <div className={styles.dotOrange} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Second category'
                    ],
                  )}
                </div>
              </div>
              <div className={styles.badge}>
                <div className={styles.dotBlue} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                      .Location,
                  )}
                </div>
              </div>
            </div>
            {categoryOverviewAnalytic?.length ? (
              <BubbleChartCustom
                data={categoryOverviewAnalytic}
                dynamicLabels={dynamicLabels}
              />
            ) : (
              <div className="text-center h-100 d-flex align-items-center justify-content-center">
                <NoDataImg />
              </div>
            )}
          </Col>
          <Col xs={6} className={styles.wrapInspectionPerformance}>
            <img
              src={images.icons.icHandPoint}
              alt="icHandPoint"
              className={styles.handIc}
            />
            <div className={styles.subTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Inspection performance calculation'
                ],
              )}
            </div>
            <div className="mb-3">
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Inspection performance range'
                ],
              )}
              :
            </div>
            <div className={cx('mb-3', styles.badges)}>
              <div className={styles.badge}>
                <div className={styles.dotRed} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Red (0-50)'
                    ],
                  )}
                </div>
              </div>
              <div className={styles.badge}>
                <div className={styles.dotOrange} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Orange (51-70)'
                    ],
                  )}
                </div>
              </div>
              <div className={styles.badge}>
                <div className={styles.dotYellow} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Yellow (71-85)'
                    ],
                  )}
                </div>
              </div>
              <div className={styles.badge}>
                <div className={styles.dotGreen} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Green (> 85)'
                    ],
                  )}
                </div>
              </div>
            </div>
            <div className={styles.lineInfo}>
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                    'Total checklist items'
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
                    'Verified items'
                  ],
                )}
              </div>
              <div className={styles.value}>
                {analyticalReportInspection?.totalQuestionsVerified}
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
            <div className="mb-3">
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Potential risks range'
                ],
              )}
            </div>
            <div className={cx('mb-3', styles.badges)}>
              <div className={styles.badge}>
                <div className={styles.dotGreen} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Negligible (0)'
                    ],
                  )}
                </div>
              </div>
              <div className={styles.badge}>
                <div className={styles.dotYellow} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Low (1-19)'
                    ],
                  )}
                </div>
              </div>
              <div className={styles.badge}>
                <div className={styles.dotOrange} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'Medium (20-49)'
                    ],
                  )}
                </div>
              </div>
              <div className={styles.badge}>
                <div className={styles.dotRed} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      'High (>=50)'
                    ],
                  )}
                </div>
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
          </Col>
        </Row>
      </div>
    </LayoutTemplate>
  );
};

export default CategorySection;
