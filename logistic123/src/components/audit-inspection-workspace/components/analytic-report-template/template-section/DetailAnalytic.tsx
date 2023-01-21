import { useState, Fragment, useEffect } from 'react';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { Col, Row, Table } from 'reactstrap';
import { getAnalyticalReportDetailSubcategoryApi } from 'api/audit-inspection-workspace.api';
import { toastError } from 'helpers/notification.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import styles from './template-section.module.scss';
import LayoutTemplate from '../layout-template/LayoutTemplate';

const DetailAnalyticReport = ({ id, dynamicLabels }) => {
  const [listData, setListData] = useState<any>(null);

  useEffect(() => {
    getAnalyticalReportDetailSubcategoryApi(id)
      .then((res) => {
        setListData(res?.data || []);
      })
      .catch((err) => toastError(err));
  }, [id]);

  return (
    <LayoutTemplate>
      <div className={cx(styles.pdfWrap)}>
        <Row>
          <Col xs={12} className="d-flex justify-content-between">
            <p className={cx(styles.titleHeader)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                  'Detailed analytic report'
                ],
              )}
            </p>

            <div className={styles.badges}>
              <div className={styles.titleBadge}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                    'Potential risks range'
                  ],
                )}
              </div>
              <div className={styles.badge}>
                <div className={styles.dotGreen} />
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                      .Negligible,
                  )}
                </div>
              </div>
              <div className={styles.badge}>
                <div className={styles.dotYellow} />
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
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                      .Medium,
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
          </Col>
          <Col xs={12}>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th
                    className={cx(
                      styles.alignTableCell,
                      styles.customBorderRight,
                    )}
                    rowSpan={2}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'DETAILED SUB CATEGORY WISE'
                      ],
                    )}
                  </th>
                  <th
                    className={cx(
                      styles.headerPotential,
                      styles.customBorderBottom,
                      'text-center',
                    )}
                    colSpan={5}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'POTENTIAL RISKS FINDING COUNT'
                      ],
                    )}
                  </th>
                  <th
                    className={cx(
                      styles.customBorderLeft,
                      styles.alignTableCell,
                    )}
                    rowSpan={2}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'WEIGHTED SCORE'
                      ],
                    )}{' '}
                  </th>
                </tr>
                <tr>
                  <th className="text-center">
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .UNASSIGNED,
                    )}{' '}
                  </th>
                  <th className="text-center">
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .NEGLIGIBLE,
                    )}{' '}
                  </th>
                  <th className="text-center">
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.LOW,
                    )}{' '}
                  </th>
                  <th className="text-center">
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .MEDIUM,
                    )}{' '}
                  </th>
                  <th className="text-center">
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .HIGH,
                    )}{' '}
                  </th>
                </tr>
              </thead>

              <tbody>
                {listData?.length ? (
                  listData?.map((item, index) => (
                    <Fragment key={String(item.code + index)}>
                      <tr className={styles.mainCategory}>
                        <td className={cx(styles.inputDetail)}>
                          <div className="d-flex align-items-center justify-content-between">
                            <b>{item?.name || 'N/A'}</b>
                            <b>{item?.code}</b>
                          </div>
                        </td>
                        <td className={cx('text-center', styles.unassigned)} />
                        <td className={cx('text-center', styles.negligible)} />
                        <td className={cx('text-center', styles.low)} />
                        <td className={cx('text-center', styles.medium)} />
                        <td className={cx('text-center', styles.high)} />
                        <td className={cx('text-center', styles.weightScore)} />
                      </tr>

                      {item?.detailedSubCategoryWise?.map((item, subIndex) => (
                        <tr key={String(item.code + subIndex)}>
                          <td className={cx(styles.inputDetail)}>
                            <div className="d-flex align-items-center justify-content-between">
                              <div>{item?.name || '-'}</div>
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
                          <td className={cx('text-center', styles.weightScore)}>
                            {item?.weightedScore || '-'}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <NoDataImg />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    </LayoutTemplate>
  );
};

export default DetailAnalyticReport;
