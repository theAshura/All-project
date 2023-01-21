import { FC, useCallback, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import WindRoseChartCustom from 'components/custom-chart/WindRoseChartCustom';
import RadarChartCustom from 'components/custom-chart/RadarChartCustom';
import BarChartHighChartCustom from 'components/custom-chart/BarChartHighChartCustom';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import LayoutTemplate from './layout-template/LayoutTemplate';
import styles from './template.module.scss';
import '../tab.scss';

interface Props {
  id?: string;
  findingData: any;
  dynamicLabels?: IDynamicLabel;
}

const TotalNumberOfFindings: FC<Props> = ({
  id,
  findingData,
  dynamicLabels,
}) => {
  const renderBarData = useCallback((data) => {
    const unassigned = {
      name: 'Unassigned',
      data: data?.map((item) =>
        Math.abs(
          (item?.criticalityGroup || item?.priorityGroup)?.find(
            (i) => i?.priority === 'Unassigned',
          )?.value || 0,
        ),
      ),
    };
    const negligible = {
      name: 'Negligible',
      data: data?.map((item) =>
        Math.abs(
          (item?.criticalityGroup || item?.priorityGroup)?.find(
            (i) => i?.priority === 'Negligible',
          )?.value || 0,
        ),
      ),
    };
    const low = {
      name: 'Low',
      data: data?.map((item) =>
        Math.abs(
          (item?.criticalityGroup || item?.priorityGroup)?.find(
            (i) => i?.priority === 'Low',
          )?.value || 0,
        ),
      ),
    };
    const medium = {
      name: 'Medium',
      data: data?.map((item) =>
        Math.abs(
          (item?.criticalityGroup || item?.priorityGroup)?.find(
            (i) => i?.priority === 'Medium',
          )?.value || 0,
        ),
      ),
    };
    const high = {
      name: 'High',
      data: data?.map((item) =>
        Math.abs(
          (item?.criticalityGroup || item?.priorityGroup)?.find(
            (i) => i?.priority === 'High',
          )?.value || 0,
        ),
      ),
    };
    return [high, medium, low, negligible, unassigned];
  }, []);

  const renderLabelsBarChart = useCallback(
    (data) => data?.map((item) => item.name),
    [],
  );

  const renderRadarData = useCallback((data, color) => {
    const categories = data?.map((item) => item.name || '');
    const values = data?.map((item) => Math.abs(item.value) || 0);

    return [
      {
        name: 'main data',
        data: values,
        categories,
        color,
      },
    ];
  }, []);

  const winroseMainCategoryData = useMemo(() => {
    const listMainCategoryTotalOf =
      findingData?.findingsQuantityByGroup?.findingMainCategory?.map((item) => [
        item.acronym,
        item.value,
      ]);
    const listMainCategoryTotalWs =
      findingData?.findingsWeightScoreByGroup?.weightScoreMainCategory?.map(
        (item) => [item.acronym, Math.abs(item.value)],
      );
    return [
      {
        name: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Weighted score'
          ],
        ),
        data: listMainCategoryTotalWs || [],
        color: '#0A84FF',
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Total findings'
          ],
        ),
        data: listMainCategoryTotalOf || [],
        color: '#5E5CE6',
      },
    ];
  }, [
    dynamicLabels,
    findingData?.findingsQuantityByGroup?.findingMainCategory,
    findingData?.findingsWeightScoreByGroup?.weightScoreMainCategory,
  ]);
  const winroseSecondCategoryData = useMemo(() => {
    const listMainCategoryTotalOf =
      findingData?.findingsQuantityByGroup?.findingSecondCategory?.map(
        (item) => [
          item.acronym,
          Math.abs(
            (item?.criticalityGroup || item?.priorityGroup)?.reduce(
              (a, b) => Number(a) + Number(b.value),
              0,
            ) || 0,
          ),
        ],
      );
    const listMainCategoryTotalWs =
      findingData?.findingsWeightScoreByGroup?.weightScoreSecondCategory?.map(
        (item) => [
          item.acronym,
          Math.abs(
            (item?.criticalityGroup || item?.priorityGroup)?.reduce(
              (a, b) => Number(a) + Number(b.value),
              0,
            ) || 0,
          ),
        ],
      );
    return [
      {
        name: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Weighted score'
          ],
        ),
        data: listMainCategoryTotalWs || [],
        color: '#30D158',
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Total findings'
          ],
        ),
        data: listMainCategoryTotalOf || [],
        color: '#66D4CF',
      },
    ];
  }, [
    dynamicLabels,
    findingData?.findingsQuantityByGroup?.findingSecondCategory,
    findingData?.findingsWeightScoreByGroup?.weightScoreSecondCategory,
  ]);
  const winroseLocationData = useMemo(() => {
    const listLocationTotalOf =
      findingData?.findingsQuantityByGroup?.findingLocation?.map((item) => [
        item.acronym,
        Math.abs(
          (item?.criticalityGroup || item?.priorityGroup)?.reduce(
            (a, b) => Number(a) + Number(b.value),
            0,
          ) || 0,
        ),
      ]);
    const listLocationTotalWs =
      findingData?.findingsWeightScoreByGroup?.weightScoreLocation?.map(
        (item) => [
          item.acronym,
          Math.abs(
            (item?.criticalityGroup || item?.priorityGroup)?.reduce(
              (a, b) => Number(a) + Number(b.value),
              0,
            ) || 0,
          ),
        ],
      );
    return [
      {
        name: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Weighted score'
          ],
        ),
        data: listLocationTotalWs || [],
        color: '#FF9F0A',
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Total findings'
          ],
        ),
        data: listLocationTotalOf || [],
        color: '#FF710A',
      },
    ];
  }, [
    dynamicLabels,
    findingData?.findingsQuantityByGroup?.findingLocation,
    findingData?.findingsWeightScoreByGroup?.weightScoreLocation,
  ]);

  return (
    <LayoutTemplate>
      <div className={cx(styles.tabContainer, 'mt-3')} id="capture">
        <div className={styles.wrapHeader}>
          <div className={styles.title}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                'Total number of findings'
              ],
            )}
          </div>
          <div className={styles.badges}>
            <div className={styles.badge}>
              <div className={styles.dotGray} />
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                    .Unassigned,
                )}
              </div>
            </div>
            <div className={styles.badge}>
              <div className={styles.dotGreen} />
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                    'Negligible risk'
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
                    'Low risk'
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
                    'Medium risk'
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
                    'High risk'
                  ],
                )}
              </div>
            </div>
          </div>
        </div>
        <Row>
          <Col xs={4}>
            <div className={styles.subTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Main category'
                ],
              )}
            </div>
            <div className={cx(styles.wrapChart)}>
              {findingData?.findingsQuantityByGroup?.findingMainCategory
                ?.length ? (
                <RadarChartCustom
                  series={renderRadarData(
                    findingData?.findingsQuantityByGroup?.findingMainCategory,
                    '#3B9FF3',
                  )}
                />
              ) : (
                <NoDataImg />
              )}
            </div>
          </Col>
          <Col xs={4} className="d-flex flex-column justify-content-start">
            <div className={cx(styles.barChartTitle, styles.subTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Second category'
                ],
              )}
            </div>
            <div className={cx(styles.wrapBarchart, styles.wrapChart)}>
              {findingData?.findingsQuantityByGroup?.findingSecondCategory
                ?.length ? (
                <BarChartHighChartCustom
                  data={renderBarData(
                    findingData?.findingsQuantityByGroup
                      ?.findingSecondCategory || [],
                  )}
                  labels={renderLabelsBarChart(
                    findingData?.findingsQuantityByGroup
                      ?.findingSecondCategory || [],
                  )}
                />
              ) : (
                <NoDataImg />
              )}
            </div>
          </Col>

          <Col xs={4} className="d-flex flex-column justify-content-start">
            <div className={cx(styles.barChartTitle, styles.subTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Location wise'
                ],
              )}
            </div>

            <div className={cx(styles.wrapBarchart, styles.wrapChart)}>
              {findingData?.findingsQuantityByGroup?.findingLocation?.length ? (
                <BarChartHighChartCustom
                  data={renderBarData(
                    findingData?.findingsQuantityByGroup?.findingLocation || [],
                  )}
                  labels={renderLabelsBarChart(
                    findingData?.findingsQuantityByGroup?.findingLocation || [],
                  )}
                />
              ) : (
                <NoDataImg />
              )}
            </div>
          </Col>
        </Row>
        <div className={styles.wrapHeader}>
          <div className={styles.wrapTitle}>
            <div className={styles.title}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Total weighted score'
                ],
              )}
            </div>
            <div className={styles.subTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  '(-ve signs for the weighted scores have been omitted for graphical representation on the below graphs)'
                ],
              )}
            </div>
          </div>
          <div className={styles.badges}>
            <div className={styles.badge}>
              <div className={styles.dotGray} />
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                    .Unassigned,
                )}
              </div>
            </div>
            <div className={styles.badge}>
              <div className={styles.dotGreen} />
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.Low,
                )}
              </div>
            </div>
            <div className={styles.badge}>
              <div className={styles.dotOrange} />
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.Medium,
                )}
              </div>
            </div>
            <div className={styles.badge}>
              <div className={styles.dotRed} />
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.High,
                )}
              </div>
            </div>
          </div>
        </div>

        <Row>
          <Col xs={4}>
            <div className={styles.subTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Main category'
                ],
              )}
            </div>
            <div>
              {findingData?.findingsWeightScoreByGroup?.weightScoreMainCategory
                ?.length ? (
                <RadarChartCustom
                  series={renderRadarData(
                    findingData?.findingsWeightScoreByGroup
                      ?.weightScoreMainCategory,
                    '#FF9F0A',
                  )}
                />
              ) : (
                <div className={cx(styles.wrapChart)}>
                  <NoDataImg />
                </div>
              )}
            </div>
          </Col>
          <Col xs={4} className="d-flex flex-column justify-content-center">
            <div className={cx(styles.subTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Second category'
                ],
              )}
            </div>
            <div className={cx(styles.wrapBarchart, styles.wrapChart)}>
              {findingData?.findingsWeightScoreByGroup
                ?.weightScoreSecondCategory?.length ? (
                <BarChartHighChartCustom
                  data={renderBarData(
                    findingData?.findingsWeightScoreByGroup
                      ?.weightScoreSecondCategory || [],
                  )}
                  labels={renderLabelsBarChart(
                    findingData?.findingsWeightScoreByGroup
                      ?.weightScoreSecondCategory || [],
                  )}
                />
              ) : (
                <NoDataImg />
              )}
            </div>
          </Col>
          <Col xs={4} className="d-flex flex-column justify-content-center">
            <div className={cx(styles.subTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Location wise'
                ],
              )}
            </div>
            <div className={cx(styles.wrapBarchart, styles.wrapChart)}>
              {findingData?.findingsWeightScoreByGroup?.weightScoreLocation
                ?.length ? (
                <BarChartHighChartCustom
                  data={renderBarData(
                    findingData?.findingsWeightScoreByGroup
                      ?.weightScoreLocation || [],
                  )}
                  labels={renderLabelsBarChart(
                    findingData?.findingsWeightScoreByGroup
                      ?.weightScoreLocation || [],
                  )}
                />
              ) : (
                <div className={cx(styles.wrapChart)}>
                  <NoDataImg />
                </div>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <div className={styles.subTitle}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Main category'
                ],
              )}
            </div>
            <div>
              {winroseMainCategoryData?.some((item) => item?.data?.length) ? (
                <WindRoseChartCustom
                  series={winroseMainCategoryData}
                  badges={[
                    {
                      name: renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                          'Weighted score'
                        ],
                      ),
                      color: '#0A84FF',
                    },
                    {
                      name: renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                          'Total findings'
                        ],
                      ),
                      color: '#5E5CE6',
                    },
                  ]}
                />
              ) : (
                <div className={cx(styles.wrapChart)}>
                  <NoDataImg />
                </div>
              )}
            </div>
          </Col>
          <Col xs={4} className="d-flex flex-column justify-content-center">
            <div className={cx(styles.subTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Second category'
                ],
              )}
            </div>
            <div>
              {winroseSecondCategoryData?.some((item) => item?.data?.length) ? (
                <WindRoseChartCustom
                  series={winroseSecondCategoryData}
                  badges={[
                    {
                      name: renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                          'Weighted score'
                        ],
                      ),
                      color: '#30D158',
                    },
                    {
                      name: renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                          'Total findings'
                        ],
                      ),
                      color: '#66D4CF',
                    },
                  ]}
                />
              ) : (
                <div className={cx(styles.wrapBarchart, styles.wrapChart)}>
                  <NoDataImg />
                </div>
              )}
            </div>
          </Col>

          <Col xs={4}>
            <div className={cx(styles.subTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Location wise'
                ],
              )}
            </div>
            <div>
              {winroseLocationData?.some((item) => item?.data?.length) ? (
                <WindRoseChartCustom
                  series={winroseLocationData}
                  badges={[
                    {
                      name: renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                          'Weighted score'
                        ],
                      ),
                      color: '#FF9F0A',
                    },
                    {
                      name: renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                          'Total findings'
                        ],
                      ),
                      color: '#FF710A',
                    },
                  ]}
                />
              ) : (
                <div className={cx(styles.wrapBarchart, styles.wrapChart)}>
                  <NoDataImg />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </LayoutTemplate>
  );
};

export default TotalNumberOfFindings;
