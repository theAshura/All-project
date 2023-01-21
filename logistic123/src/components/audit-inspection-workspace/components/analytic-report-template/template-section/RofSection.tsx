import { useEffect, useState } from 'react';
import cx from 'classnames';
import { toastError } from 'helpers/notification.helper';
import { getAnalyticalReportQuestionReportOfFindingApi } from 'api/audit-inspection-workspace.api';
import { Col, Row, Table } from 'reactstrap';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import NoDataImg from 'components/common/no-data/NoData';
import styles from './template-section.module.scss';
import LayoutTemplate from '../layout-template/LayoutTemplate';

const RofSection = ({ id, dynamicLabels }) => {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    getAnalyticalReportQuestionReportOfFindingApi(id)
      .then((res) => {
        setListData(res?.data || []);
      })
      .catch((err) => toastError(err));
  }, [id]);

  return (
    <LayoutTemplate>
      <div className={cx(styles.pdfWrap)}>
        <p className={styles.titleHeader}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
              'Report of finding'
            ],
          )}
        </p>
        <Row>
          <Col xs={12}>
            <Table hover className={styles.table}>
              <thead>
                <tr className={styles.title}>
                  <th>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .CODE,
                    )}
                  </th>
                  <th>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .ITEM,
                    )}
                  </th>
                  <th>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .FINDING,
                    )}
                  </th>
                  <th>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'RECTIEFIED ON BOARD'
                      ],
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {listData.length ? (
                  listData.map((item, index) => (
                    <tr key={String(`rof-${item.code}`)}>
                      <td className={cx(styles.inputCode)}>{item?.code}</td>
                      <td>
                        <p className="mb-3">
                          <b>{item?.mainCategoryName}</b>
                        </p>
                        <b>Q: </b>
                        {item?.question}
                      </td>
                      <td>{item?.findingComment}</td>
                      <td>{item?.rectifiedOnBoard}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
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

export default RofSection;
