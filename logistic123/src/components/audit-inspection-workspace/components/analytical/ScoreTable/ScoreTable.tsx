import { useState, useEffect, useCallback } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Button, { ButtonType } from 'components/ui/button/Button';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { formatDateLocalNoTime } from 'helpers/date.helper';
import { useDispatch } from 'react-redux';
import { getAnalyticalReportPerformanceAction } from 'store/audit-inspection-workspace/audit-inspection-workspace.action';
import NoDataImg from 'components/common/no-data/NoData';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import {
  getAnalyticalReportRepeatedFindingApi,
  updateAnalyticalReportRepeatedFindingApi,
} from 'api/audit-inspection-workspace.api';
import { Col, Row, Table } from 'reactstrap';
import styles from './score.module.scss';

const ScoreTable = ({ idWorkspace, isEdit, dynamicLabels }) => {
  const [repeatFindingData, setRepeatFindingData] = useState<any>([]);
  const [repeatCompanyData, setRepeatCompanyData] = useState<any>([]);
  const dispatch = useDispatch();

  const getRepeatFinding = useCallback(() => {
    dispatch(getAnalyticalReportPerformanceAction.request(idWorkspace));
    getAnalyticalReportRepeatedFindingApi(idWorkspace)
      .then((res) => {
        setRepeatFindingData(
          res?.data?.listRepeatedFinding?.map((item, index) => ({
            ...item,
            id: `finding${index}`,
          })) || [],
        );
        setRepeatCompanyData(
          res?.data?.listRepeatedFindingCompany?.map((item, index) => ({
            ...item,
            id: `company${index}`,
          })) || [],
        );
      })
      .catch((err) => toastError(err));
  }, [dispatch, idWorkspace]);

  useEffect(() => {
    getRepeatFinding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRepeatedFinding = useCallback(() => {
    const repeatFindingPopulated =
      repeatFindingData?.map((item) => ({
        // id: item?.id,
        chkQuestionId: item?.chkQuestionId,
        statusButton: item?.statusButton,
        timeOfRepeating: item?.timeOfRepeating,
        suggestedValue: item?.suggestedValue,
      })) || [];
    const repeatCompanyPopulated =
      repeatCompanyData?.map((item) => ({
        // id: item?.id,
        chkQuestionId: item?.chkQuestionId,
        statusButton: item?.statusButton,
        timeOfRepeating: item?.timeOfRepeating,
        suggestedValue: item?.suggestedValue,
      })) || [];
    updateAnalyticalReportRepeatedFindingApi(idWorkspace, {
      analyticalReportRepeatedFinding: repeatFindingPopulated?.concat(
        repeatCompanyPopulated,
      ),
    })
      .then((res) => {
        toastSuccess('You have updated successfully.');
        getRepeatFinding();
      })
      .catch((err) => {
        toastError(err);
        getRepeatFinding();
      });
  }, [getRepeatFinding, idWorkspace, repeatCompanyData, repeatFindingData]);

  const changeStatus = useCallback(
    (id, status: string, type?: string) => {
      if (type === 'finding') {
        const newData = repeatFindingData?.map((item) =>
          item.id === id
            ? {
                ...item,
                statusButton: status,
              }
            : item,
        );
        setRepeatFindingData(newData);
        return;
      }
      const newData = repeatCompanyData?.map((item) =>
        item.id === id
          ? {
              ...item,
              statusButton: status,
            }
          : item,
      );
      setRepeatCompanyData(newData);
    },
    [repeatCompanyData, repeatFindingData],
  );

  return (
    <div className={cx(styles.scoreWrap)}>
      <p className={styles.titleHeader}>
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Score adjustment'
          ],
        )}
      </p>
      <p className={styles.subTitle}>
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Repeated findings'
          ],
        )}
      </p>
      <Row>
        <Col xs={12}>
          <div className={styles.tableContainer}>
            <Table hover className={styles.table}>
              <thead>
                <tr className={styles.title}>
                  <th>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'S.No'
                      ],
                    )}
                  </th>
                  <th className={styles.suggestedValue}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'Question code'
                      ],
                    )}
                  </th>
                  <th className={styles.refId}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'Ref.ID'
                      ],
                    )}
                  </th>
                  <th className={styles.suggestedValue}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'Date of inspection'
                      ],
                    )}
                  </th>
                  <th>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .Item,
                    )}
                  </th>
                  <th className={styles.suggestedValue}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'Original value'
                      ],
                    )}
                  </th>
                  <th className={styles.suggestedValue}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'Suggested value'
                      ],
                    )}
                  </th>
                  <th> </th>
                </tr>
              </thead>

              <tbody>
                {repeatFindingData?.length
                  ? repeatFindingData?.map((item, index) => (
                      <tr key={`${item.id + index}`}>
                        <td className={cx(styles.inputNo)}>{index + 1}</td>
                        <td className={styles.inputQuestion}>
                          {item.questionCode}
                        </td>
                        <td className={styles.inputQuestion}>
                          <Link
                            to={`/planning-and-request-management/detail/${item?.planningRequestId}`}
                            className={styles.refId}
                          >
                            {item.planningRequestRefId}
                          </Link>
                        </td>
                        <td className={styles.inputQuestion}>
                          {formatDateLocalNoTime(
                            item.planningRequestDateOfInspection,
                          )}
                        </td>
                        <td className={cx(styles.inputItem)}>
                          <p>
                            <span className={cx(styles.highLight)}>
                              {item?.mainCategoryName}
                            </span>
                          </p>
                          <p>
                            <span className={cx(styles.highLight)}>Q: </span>
                            <span>{item?.question}</span>
                            <p>
                              <span className={cx(styles.highLight)}>
                                {renderDynamicLabel(
                                  dynamicLabels,
                                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS
                                    .Analytical.Finding,
                                )}
                                :{' '}
                              </span>
                              {item.findingComment}
                            </p>
                          </p>
                        </td>
                        <td className={cx(styles.inputValue)}>
                          <p>{item?.originalValue}</p>
                        </td>
                        <td className={cx(styles.inputValue)}>
                          {item.suggestedValue || item.suggestedValue === 0
                            ? item.suggestedValue
                            : '-'}
                        </td>
                        <td className={cx(styles.inputButton)}>
                          <div className={cx(styles.wrapButton)}>
                            <button
                              className={
                                item?.statusButton === 'accept'
                                  ? styles.greenButton
                                  : ''
                              }
                              disabled={
                                !(
                                  item.suggestedValue ||
                                  item.suggestedValue === 0
                                )
                              }
                              onClick={() =>
                                changeStatus(item.id, 'accept', 'finding')
                              }
                            >
                              {renderDynamicLabel(
                                dynamicLabels,
                                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS
                                  .Analytical.Accept,
                              )}
                            </button>
                            <button
                              className={
                                item?.statusButton === 'reject'
                                  ? styles.redButton
                                  : ''
                              }
                              disabled={
                                !(
                                  item.suggestedValue ||
                                  item.suggestedValue === 0
                                )
                              }
                              onClick={() =>
                                changeStatus(item.id, 'reject', 'finding')
                              }
                            >
                              {renderDynamicLabel(
                                dynamicLabels,
                                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS
                                  .Analytical.Reject,
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>

            {!repeatFindingData?.length && <NoDataImg />}
          </div>
        </Col>
      </Row>
      <p className={styles.subTitle}>
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
            'Repeated company findings'
          ],
        )}
      </p>
      <Row>
        <Col xs={12}>
          <div className={styles.tableContainer}>
            <Table hover className={styles.table}>
              <thead>
                <tr className={styles.title}>
                  <th>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'S.No'
                      ],
                    )}
                  </th>
                  <th className={styles.suggestedValue}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'Question code'
                      ],
                    )}
                  </th>
                  <th className={styles.refId}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'Ref.ID'
                      ],
                    )}
                  </th>
                  <th className={styles.suggestedValue}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'Date of inspection'
                      ],
                    )}
                  </th>
                  <th>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                        .Item,
                    )}
                  </th>
                  <th className={styles.suggestedValue}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'Original value'
                      ],
                    )}
                  </th>
                  <th className={styles.suggestedValue}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
                        'Suggested value'
                      ],
                    )}
                  </th>
                  <th> </th>
                </tr>
              </thead>

              <tbody>
                {repeatCompanyData?.length
                  ? repeatCompanyData?.map((item, index) => (
                      <tr key={`${item.id + index}`}>
                        <td className={cx(styles.inputNo)}>{index + 1}</td>
                        <td className={cx(styles.inputQuestion)}>
                          {item.questionCode}
                        </td>
                        <td className={styles.inputQuestion}>
                          <Link
                            to={`/planning-and-request-management/detail/${item?.planningRequestId}`}
                            className={styles.refId}
                          >
                            {item.planningRequestRefId}
                          </Link>
                        </td>
                        <td className={styles.inputQuestion}>
                          {formatDateLocalNoTime(
                            item.planningRequestDateOfInspection,
                          )}
                        </td>
                        <td className={cx(styles.inputItem)}>
                          <p>
                            <span className={cx(styles.highLight)}>
                              {item?.mainCategoryName}
                            </span>
                          </p>
                          <p>
                            <span className={cx(styles.highLight)}>
                              {renderDynamicLabel(
                                dynamicLabels,
                                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS
                                  .Analytical.Q,
                              )}
                              :{' '}
                            </span>
                            <span>{item?.question}</span>
                            <p>
                              <span className={cx(styles.highLight)}>
                                {renderDynamicLabel(
                                  dynamicLabels,
                                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS
                                    .Analytical.Finding,
                                )}
                                :{' '}
                              </span>
                              {item.findingComment}
                            </p>
                          </p>
                        </td>
                        <td className={cx(styles.inputValue)}>
                          <p>{item?.originalValue}</p>
                        </td>
                        <td className={cx(styles.inputValue)}>
                          {item.suggestedValue || item.suggestedValue === 0
                            ? item.suggestedValue
                            : '-'}
                        </td>
                        <td className={cx(styles.inputButton)}>
                          <div className={cx(styles.wrapButton)}>
                            <button
                              className={
                                item?.statusButton === 'accept'
                                  ? styles.greenButton
                                  : ''
                              }
                              disabled={
                                !(
                                  item.suggestedValue ||
                                  item.suggestedValue === 0
                                )
                              }
                              onClick={() => changeStatus(item.id, 'accept')}
                            >
                              {renderDynamicLabel(
                                dynamicLabels,
                                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS
                                  .Analytical.Accept,
                              )}
                            </button>
                            <button
                              className={
                                item?.statusButton === 'reject'
                                  ? styles.redButton
                                  : ''
                              }
                              disabled={
                                !(
                                  item.suggestedValue ||
                                  item.suggestedValue === 0
                                )
                              }
                              onClick={() => changeStatus(item.id, 'reject')}
                            >
                              {renderDynamicLabel(
                                dynamicLabels,
                                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS
                                  .Analytical.Reject,
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
            {!repeatCompanyData?.length && <NoDataImg />}
          </div>
        </Col>
      </Row>
      <div className={cx(styles.wrapBtn, 'd-flex justify-content-end')}>
        <Button
          buttonType={ButtonType.Primary}
          onClick={updateRepeatedFinding}
          disabledCss={
            !isEdit ||
            (repeatCompanyData?.length === 0 && repeatFindingData?.length === 0)
          }
          disabled={
            !isEdit ||
            (repeatCompanyData?.length === 0 && repeatFindingData?.length === 0)
          }
        >
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.Apply,
          )}
        </Button>
      </div>
    </div>
  );
};

export default ScoreTable;
