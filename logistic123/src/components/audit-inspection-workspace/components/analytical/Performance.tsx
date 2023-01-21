import { FC, useState, useCallback, useEffect, useMemo } from 'react';
import images from 'assets/images/images';
import { Col, Row, Table } from 'reactstrap';
import isNaN from 'lodash/isNaN';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { getAnalyticalReportPerformanceAction } from 'store/audit-inspection-workspace/audit-inspection-workspace.action';
import cloneDeep from 'lodash/cloneDeep';
import NoDataImg from 'components/common/no-data/NoData';
import { addAnalyticalReportPerformanceAdjustedApi } from 'api/audit-inspection-workspace.api';
import { useSelector, useDispatch } from 'react-redux';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import Button, { ButtonType } from 'components/ui/button/Button';
import cx from 'classnames';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './analytical.module.scss';
import '../tab.scss';
import PotenitalRisk from './potential-risk/PotentialRisk';
import InspectionPerformance from '../inspection-performance/InspectionPerformance';

interface Props {
  activeTab?: string;
  idWorkspace?: string;
  isEdit?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const TypePerformance = {
  INSPECTION: 'inspection',
  VESSEL: 'vessel',
};

const Performance: FC<Props> = ({ idWorkspace, isEdit, dynamicLabels }) => {
  const [inspectionPerformanceData, setInspectionPerformanceData] = useState(
    [],
  );
  const { auditInspectionWorkspaceDetail } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );
  const [vesselPotentialRiskData, setVesselPotentialRiskData] = useState([]);
  const dispatch = useDispatch();

  const { analyticalReportInspection } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );

  useEffect(() => {
    if (analyticalReportInspection) {
      setInspectionPerformanceData(
        analyticalReportInspection?.analyticalReportConfigInspection || [],
      );
      setVesselPotentialRiskData(
        analyticalReportInspection?.analyticalReportConfigVessel || [],
      );
    }
  }, [analyticalReportInspection]);

  const onChangeValue = useCallback(
    (e?: any, id?: string, type?: string) => {
      const { value, name } = e?.target;
      if (type === TypePerformance.INSPECTION) {
        const newData = inspectionPerformanceData?.map((item) => {
          if (String(item.id) === id) {
            return {
              ...item,
              [name]: value,
            };
          }
          return item;
        });
        setInspectionPerformanceData(newData);
        return;
      }
      if (type === TypePerformance.VESSEL) {
        const newData = vesselPotentialRiskData?.map((item) => {
          if (String(item.id) === id) {
            return {
              ...item,
              [name]: value,
            };
          }
          return item;
        });
        setVesselPotentialRiskData(newData);
      }
    },
    [inspectionPerformanceData, vesselPotentialRiskData],
  );
  const addNewLine = useCallback(
    (type) => {
      if (type === TypePerformance.INSPECTION) {
        const newData = cloneDeep(inspectionPerformanceData);
        newData.push({
          id: newData?.length,
          percentOff: 0,
          reason: '',
          type: TypePerformance.INSPECTION,
        });
        setInspectionPerformanceData(newData);
      }
      if (type === TypePerformance.VESSEL) {
        const newData = cloneDeep(vesselPotentialRiskData);
        newData.push({
          id: newData?.length,
          percentOff: 0,
          reason: '',
          type: TypePerformance.VESSEL,
        });
        setVesselPotentialRiskData(newData);
      }
    },
    [inspectionPerformanceData, vesselPotentialRiskData],
  );
  const deletePerformanceValue = useCallback(
    (id?: string, type?: string) => {
      if (type === TypePerformance.INSPECTION) {
        const newData = inspectionPerformanceData?.filter(
          (item) => String(item.id) !== id,
        );
        setInspectionPerformanceData(newData || []);
        return;
      }
      if (type === TypePerformance.VESSEL) {
        const newData = vesselPotentialRiskData?.filter(
          (item) => String(item.id) !== id,
        );
        setVesselPotentialRiskData(newData || []);
      }
    },
    [inspectionPerformanceData, vesselPotentialRiskData],
  );

  const adjustedInspectionPerformance = useCallback(
    (data) => {
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
              isNaN(Number(b?.percentOff || 0))
                ? 0
                : Number(b?.percentOff || 0),
            ),
          0,
        ),
      );

      return percentOriginal + Number(additional / 100);
    },
    [analyticalReportInspection?.inspectionPerformanceRepeat],
  );

  const adjustedVesselRisk = useCallback(
    (data) => {
      if (!data) {
        return data;
      }
      return (
        Number(
          data?.reduce(
            (a, b) =>
              Number(a) +
              Number(isNaN(Number(b?.percentOff)) ? 0 : b.percentOff),
            0,
          ),
        ) + (analyticalReportInspection?.totalPotentialRisk || 0)
      );
    },
    [analyticalReportInspection?.totalPotentialRisk],
  );

  const applyAnalyticalReport = useCallback(() => {
    const listData = inspectionPerformanceData?.concat(vesselPotentialRiskData);
    const listInspectionPerformance = adjustedInspectionPerformance(
      inspectionPerformanceData,
    );

    if (listInspectionPerformance > 1 || listInspectionPerformance < 0) {
      toastError(
        'Please kindly re-adjust percent off or points off. The Inspection Performance and Vessel Potential Risk can not be over 100 and under 0',
      );
      return;
    }

    if (
      listData?.some(
        (item) =>
          item.percentOff < -99 ||
          item.percentOff > 99 ||
          item.percentOff === '',
      )
    ) {
      toastError('Percent off must be greater than -99 and smaller than 99.');
      return;
    }
    const body = {
      id: idWorkspace,
      analyticalReportConfigs: listData?.map((item) => ({
        percentOff: Number(item?.percentOff),
        type: item?.type,
        reason: item?.reason,
      })),
    };
    addAnalyticalReportPerformanceAdjustedApi(body)
      .then((res) => {
        toastSuccess('Update report config successfully.');
        dispatch(getAnalyticalReportPerformanceAction.request(idWorkspace));
      })
      .catch((err) => toastError(err));
  }, [
    adjustedInspectionPerformance,
    dispatch,
    idWorkspace,
    inspectionPerformanceData,
    vesselPotentialRiskData,
  ]);

  const renderValueLimit = useCallback((value) => {
    if (Number(value) > 100) {
      return '>100';
    }

    return Number(value)?.toFixed(0) || 0;
  }, []);

  const isOffice = useMemo(
    () => auditInspectionWorkspaceDetail?.entityType === 'Office',
    [auditInspectionWorkspaceDetail?.entityType],
  );

  const disableEditPerformance = useMemo(
    () =>
      !isEdit ||
      (inspectionPerformanceData?.length === 0 &&
        vesselPotentialRiskData?.length === 0 &&
        analyticalReportInspection?.analyticalReportConfigInspection?.length ===
          0 &&
        analyticalReportInspection?.analyticalReportConfigVessel?.length === 0),
    [
      analyticalReportInspection?.analyticalReportConfigInspection?.length,
      analyticalReportInspection?.analyticalReportConfigVessel?.length,
      inspectionPerformanceData?.length,
      isEdit,
      vesselPotentialRiskData?.length,
    ],
  );

  return (
    <div className={cx(styles.wrap)}>
      <Row>
        <Col xs={6}>
          <div className={styles.wrapCalculator}>
            {/* <div className={styles.percent}>25%</div>
            <div className={styles.name}>Inspection Performance</div> */}
            <div className={styles.wrapArt}>
              <div className={styles.art}>
                {/* <img src={images.icons.icBoat} alt="icBoat" /> */}
                <InspectionPerformance
                  isFlex={false}
                  entity={auditInspectionWorkspaceDetail?.entityType}
                  hideInspectionScore
                  customContainer={styles.customContainerInspection}
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
                  dynamicLabels={dynamicLabels}
                />
              </div>
              <div
                className={cx(
                  styles.wrapStatues,
                  'd-flex align-items-center justify-content-center',
                )}
              >
                <div className={styles.status}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Original,
                  )}{' '}
                  <b>
                    {renderValueLimit(
                      Number(
                        Number(
                          analyticalReportInspection?.inspectionPerformance ||
                            0,
                        ) * 100,
                      ) || 0,
                    )}
                    %
                  </b>
                </div>

                <div className={styles.status}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Adjusted,
                  )}{' '}
                  <b>
                    {renderValueLimit(
                      Number(
                        Number(
                          adjustedInspectionPerformance(
                            analyticalReportInspection?.analyticalReportConfigInspection,
                          ),
                        ) * 100,
                      ) || 0,
                    )}
                    %
                  </b>
                </div>
              </div>
            </div>
            <div className={styles.wrapTableSticky}>
              <Table hover className={styles.table}>
                <thead>
                  <tr className={styles.title}>
                    <th className="d-flex align-items-center">
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                          .Action,
                      )}{' '}
                      {isEdit && (
                        <div
                          onClick={() => addNewLine(TypePerformance.INSPECTION)}
                        >
                          <img
                            src={images.icons.icBlueAdd}
                            className={styles.icAdd}
                            alt="icBlueAdd"
                          />
                        </div>
                      )}
                    </th>
                    <th>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                          'S.No'
                        ],
                      )}
                    </th>
                    <th>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                          'Percent off'
                        ],
                      )}
                    </th>
                    <th>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                          .Reason,
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inspectionPerformanceData?.length
                    ? inspectionPerformanceData.map((item, index) => (
                        <tr key={String(`${item.id}ip`)}>
                          <td>
                            <div
                              className={styles.deleteIcon}
                              onClick={() =>
                                deletePerformanceValue(
                                  String(item.id),
                                  TypePerformance.INSPECTION,
                                )
                              }
                            >
                              <img src={images.icons.icRemove} alt="delete" />
                            </div>
                          </td>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              value={item.percentOff}
                              name="percentOff"
                              onChange={(e) => {
                                if (
                                  Number.isNaN(Number(e.target.value)) ||
                                  Number(e.target.value) < -99 ||
                                  Number(e.target.value) > 99 ||
                                  String(e.target.value)?.includes('.')
                                ) {
                                  return;
                                }
                                onChangeValue(
                                  e,
                                  String(item.id),
                                  TypePerformance.INSPECTION,
                                );
                              }}
                              disabled={!isEdit}
                              className={styles.customInput}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.reason}
                              name="reason"
                              disabled={!isEdit}
                              onChange={(e) =>
                                onChangeValue(
                                  e,
                                  String(item.id),
                                  TypePerformance.INSPECTION,
                                )
                              }
                              className={styles.customInput}
                            />
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </Table>
              {!inspectionPerformanceData?.length && <NoDataImg />}
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className={styles.wrapCalculator}>
            <div className={styles.wrapArt}>
              <div className={styles.art}>
                {/* <div className={styles.riskValue}>{adjustedVesselRisk}</div> */}
                <div className={styles.titleRisk}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                      `${!isOffice ? 'Vessel' : 'Office'} potential risk`
                    ],
                  )}
                </div>
                <PotenitalRisk
                  customWrapChart={styles.customWrapChart}
                  percent={
                    analyticalReportInspection?.potentialRiskRepeatPercentAbs
                  }
                  riskNumber={adjustedVesselRisk(
                    analyticalReportInspection?.analyticalReportConfigVessel,
                  )}
                  hideTitle
                  hideBadges
                />
              </div>
              <div
                className={cx(
                  styles.wrapStatues,
                  'd-flex align-items-center justify-content-center',
                )}
              >
                <div className={styles.status}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Original,
                  )}{' '}
                  <b>
                    {renderValueLimit(
                      analyticalReportInspection?.totalPotentialRisk?.toFixed(
                        0,
                      ) || 0,
                    )}
                  </b>
                </div>
                <div className={styles.status}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Adjusted,
                  )}{' '}
                  <b>
                    {renderValueLimit(
                      adjustedVesselRisk(
                        analyticalReportInspection?.analyticalReportConfigVessel,
                      ) || 0,
                    )}
                  </b>
                </div>
              </div>
            </div>

            <div className={styles.wrapTableSticky}>
              <Table hover className={styles.table}>
                <thead>
                  <tr className={styles.title}>
                    <th className="d-flex align-items-center">
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                          .Action,
                      )}{' '}
                      {isEdit && (
                        <div onClick={() => addNewLine(TypePerformance.VESSEL)}>
                          <img
                            src={images.icons.icBlueAdd}
                            className={styles.icAdd}
                            alt="icBlueAdd"
                          />
                        </div>
                      )}
                    </th>
                    <th>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                          'S.No'
                        ],
                      )}
                    </th>
                    <th>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                          'Points off'
                        ],
                      )}
                    </th>
                    <th>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                          .Reason,
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vesselPotentialRiskData.length
                    ? vesselPotentialRiskData.map((item, index) => (
                        <tr key={String(`${item.id}vessel`)}>
                          <td>
                            <div
                              className={styles.deleteIcon}
                              onClick={() =>
                                deletePerformanceValue(
                                  String(item.id),
                                  TypePerformance.VESSEL,
                                )
                              }
                            >
                              <img src={images.icons.icRemove} alt="delete" />
                            </div>
                          </td>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              value={item.percentOff}
                              name="percentOff"
                              disabled={!isEdit}
                              onChange={(e) => {
                                if (
                                  Number.isNaN(Number(e.target.value)) ||
                                  Number(e.target.value) < -99 ||
                                  Number(e.target.value) > 99 ||
                                  String(e.target.value)?.includes('.')
                                ) {
                                  return;
                                }
                                onChangeValue(
                                  e,
                                  String(item.id),
                                  TypePerformance.VESSEL,
                                );
                              }}
                              className={styles.customInput}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.reason}
                              name="reason"
                              disabled={!isEdit}
                              onChange={(e) =>
                                onChangeValue(
                                  e,
                                  String(item.id),
                                  TypePerformance.VESSEL,
                                )
                              }
                              className={styles.customInput}
                            />
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </Table>
              {!vesselPotentialRiskData?.length && <NoDataImg />}
            </div>
          </div>
        </Col>
        <div className={cx(styles.wrapBtn, 'd-flex justify-content-end')}>
          <Button
            buttonType={ButtonType.Primary}
            onClick={applyAnalyticalReport}
            disabledCss={disableEditPerformance}
            disabled={disableEditPerformance}
          >
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.Apply,
            )}
          </Button>
        </div>
      </Row>
    </div>
  );
};

export default Performance;
