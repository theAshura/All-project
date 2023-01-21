import cx from 'classnames';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Col, Row } from 'reactstrap';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import isNil from 'lodash/isNil';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { MatrixCompliance, SelfAssessmentMatrixCell } from '../utils/model';
import styles from './matrix.module.scss';
import { HEX_COLORS, MATRIX_DEVIDERS } from '../utils/constant';
import { getSelfAssessmentMatrixActions } from '../store/action';
import { pickTextColorByBackgroundColor } from '../utils/functions';

interface MatrixProps {
  className?: any;
  useDefaultScoreStyle?: boolean;
  showScore?: boolean;
}

const STAGE_LIMIT = 2;

const COLORS = {
  init: '#fff8dd',
  full: '#feeaea',
};

const Matrix = ({
  className,
  useDefaultScoreStyle,
  showScore,
}: MatrixProps) => {
  const stageBreakRef = useRef({});
  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.SELF_ASSESSMENT,
    I18nNamespace.COMMON,
  ]);
  const { selfAssessmentMatrix } = useSelector((state) => state.selfAssessment);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      dispatch(
        getSelfAssessmentMatrixActions.request({
          selfAssessmentId: id,
        }),
      );
    }
  }, [dispatch, id]);

  const sortedComplianceByValue = useMemo(
    () =>
      selfAssessmentMatrix?.compliances.sort(
        (a: MatrixCompliance, b: MatrixCompliance) =>
          a?.compliance - b?.compliance,
      ),
    [selfAssessmentMatrix?.compliances],
  );

  const getComplianceByScore = useCallback(
    (score: number) => {
      const len = sortedComplianceByValue.length;

      for (let i = 0; i < len; i += 1) {
        const compliance = sortedComplianceByValue[i];
        if (compliance.compliance === score) {
          return sortedComplianceByValue[i];
        }
        if (compliance.compliance > score) {
          return sortedComplianceByValue[i - 1];
        }
      }
      return null;
    },
    [sortedComplianceByValue],
  );

  const sanitizedData = useMemo(() => {
    const dictionizedData = {};
    const listHeader = [];
    const listAvailableStageRow = [];
    const stageQuestionNumberCellCount = {};
    const isAllInStageSubmitted = {};

    selfAssessmentMatrix?.selfDeclarations?.forEach(
      (cellData: SelfAssessmentMatrixCell) => {
        const rowCoordinate = `${cellData.elementMaster.stage}${MATRIX_DEVIDERS.element}${cellData.elementMaster.questionNumber}`;
        const colCoordinate = `${cellData.elementMaster.code}${MATRIX_DEVIDERS.element}${cellData.elementMaster.number}`;
        const coordinate = `${rowCoordinate}${MATRIX_DEVIDERS.coordinate}${colCoordinate}`;
        dictionizedData[coordinate] = cellData;

        if (!listHeader.includes(colCoordinate)) {
          listHeader.push(colCoordinate);
        }

        if (!listAvailableStageRow.includes(rowCoordinate)) {
          listAvailableStageRow.push(rowCoordinate);
        }

        if (!stageQuestionNumberCellCount[rowCoordinate]) {
          stageQuestionNumberCellCount[rowCoordinate] = 1;
        } else {
          stageQuestionNumberCellCount[rowCoordinate] += 1;
        }

        if (isNil(isAllInStageSubmitted[cellData.elementMaster.stage])) {
          isAllInStageSubmitted[cellData.elementMaster.stage] = true;
        }

        isAllInStageSubmitted[cellData.elementMaster.stage] =
          cellData.status === 'Pending'
            ? false
            : isAllInStageSubmitted[cellData.elementMaster.stage];
      },
    );

    return {
      dictionizedData,
      listHeader,
      listAvailableStageRow,
      stageQuestionNumberCellCount,
      isAllInStageSubmitted,
    };
  }, [selfAssessmentMatrix?.selfDeclarations]);

  const listStageRow = useMemo(() => {
    let result = [];
    selfAssessmentMatrix?.stages?.forEach((stage: string) => {
      const items = sanitizedData?.listAvailableStageRow.filter((el) => {
        const [s] = el.split(MATRIX_DEVIDERS.element);
        return s === stage;
      });
      if (!items.length) {
        result.push(`${stage}${MATRIX_DEVIDERS.element}`);
      } else {
        result = [...result, ...items];
      }
    });
    return result;
  }, [sanitizedData?.listAvailableStageRow, selfAssessmentMatrix?.stages]);

  const maxtrixHead = useMemo(() => {
    const result = sanitizedData.listHeader.map(
      (elementAttr: string, index: number) => {
        const [elementCode, elementNumber] = elementAttr.split(
          MATRIX_DEVIDERS.element,
        );
        const lastItem = sanitizedData.listHeader[index - 1];
        let isSameCodeWithPrevOne: boolean;

        if (!lastItem) {
          isSameCodeWithPrevOne = false;
        } else {
          const [prevElementCode] = lastItem.split(MATRIX_DEVIDERS.element);
          isSameCodeWithPrevOne = elementCode === prevElementCode;
        }

        return (
          <Col className="p-0" key={`head-${elementAttr}`}>
            <div className={cx(styles.box, styles.headWrap)}>
              <div className={styles.headBox}>
                {isSameCodeWithPrevOne ? '' : elementCode}
              </div>
              <div className={styles.headBox}>{elementNumber}</div>
            </div>
          </Col>
        );
      },
    );

    return (
      <Row className={cx('mx-0', styles.headRow)}>
        <Col className="p-0">
          <div
            className={cx(
              'd-flex align-items-center ',
              styles.box,
              styles.stageBox,
            )}
          >
            {t('table.stage')}
          </div>
        </Col>
        {result}
        <Col className="p-0">
          <div
            className={cx(
              'd-flex align-items-center ',
              styles.box,
              styles.totalBox,
            )}
          >
            {t('total')}
          </div>
        </Col>
        {showScore && (
          <Col className="p-0">
            <div
              className={cx(
                'd-flex align-items-center justify-content-center',
                styles.box,
                styles.scoreBox,
              )}
            >
              {t('score')}
            </div>
          </Col>
        )}
      </Row>
    );
  }, [sanitizedData.listHeader, showScore, t]);

  const redirectToSelfDeclaration = useCallback(
    (declarationId: string) => {
      if (id && declarationId) {
        history.push(
          `${AppRouteConst.getSelfAssessmentDeclarationById(
            declarationId,
          )}?selfAssessmentId=${id}`,
        );
      }
    },
    [id],
  );

  const renderRow = useCallback(
    (
      stage: string,
      questionNumber: string | number,
      index: number,
      numberQuestionsOfStage: number,
      indexTable: number,
    ) => {
      let numberOfCellInRow = 0;
      let totalOfCellInRow = 0;
      let mergedScore = 0;
      let stageScore = 0;
      let stageScoreStr = '';

      const cellDatas = sanitizedData.listHeader.map((elementAttr: string) => {
        const elementNumber = elementAttr.split(MATRIX_DEVIDERS.element)?.[1];
        const coordinate = `${stage}${MATRIX_DEVIDERS.element}${questionNumber}${MATRIX_DEVIDERS.coordinate}${elementAttr}`;
        const data = sanitizedData.dictionizedData[coordinate];
        const complianceValue = data?.compliance?.compliance;
        const bgColor = data?.compliance?.colour;
        const textColor = pickTextColorByBackgroundColor(bgColor);
        let boxContent: string | number;
        if (!data) {
          boxContent = '';
        } else if (!complianceValue) {
          boxContent = `${elementNumber}.${questionNumber}`;
          numberOfCellInRow += 1;
          totalOfCellInRow += 0;
        } else {
          boxContent = `${elementNumber}.${questionNumber}`;
          numberOfCellInRow += 1;
          totalOfCellInRow += complianceValue;
        }

        return (
          <Col
            className={cx(
              'p-0',
              styles.col,
              boxContent && styles.cursorPointer,
            )}
            key={`row-${coordinate}`}
            onClick={() => {
              if (boxContent) {
                redirectToSelfDeclaration(data.id);
              }
            }}
          >
            <div
              className={cx(styles.box, {
                [styles.noQuestion]: !data,
                [styles.initial]: !complianceValue,
              })}
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {boxContent}
            </div>
          </Col>
        );
      });

      const mergedCellStyle = {
        height: `calc(${
          100 * numberQuestionsOfStage
        }% + ${numberQuestionsOfStage}px)`,
        backgroundColor: COLORS.full,
      };

      const mergedScoreCellStyle = {
        height: `calc(${
          100 * numberQuestionsOfStage
        }% + ${numberQuestionsOfStage}px)`,
        backgroundColor: COLORS.init,
        color: HEX_COLORS.light,
      };

      // Calculate score of stage
      if (!index) {
        const filteredKeys = Object.keys(sanitizedData.dictionizedData).filter(
          (key: string) => {
            const [s] = key.split(MATRIX_DEVIDERS.element);
            return s === stage;
          },
        );
        filteredKeys.forEach((key: string) => {
          const val =
            sanitizedData.dictionizedData[key]?.compliance?.compliance;
          mergedScore += val ?? 0;
        });
        stageScore = mergedScore / filteredKeys.length;
        stageScoreStr = numberOfCellInRow
          ? Number.parseFloat(stageScore.toString()).toFixed(2)
          : '0.00';

        if (useDefaultScoreStyle) {
          mergedScoreCellStyle.backgroundColor =
            sortedComplianceByValue?.[0]?.colour;
        } else {
          const scoreCompliance = getComplianceByScore(stageScore);

          mergedScoreCellStyle.backgroundColor = scoreCompliance?.colour
            ? scoreCompliance?.colour
            : mergedScoreCellStyle.backgroundColor;
        }

        if (!sanitizedData.isAllInStageSubmitted[stage]) {
          mergedScoreCellStyle.backgroundColor = COLORS.init;
        }

        mergedScoreCellStyle.color = pickTextColorByBackgroundColor(
          mergedScoreCellStyle.backgroundColor,
        );
      }

      return (
        <Row className={cx('mx-0', styles.row)}>
          <Col className={cx('p-0', styles.pinkCell, styles.stageBox)}>
            <div
              className={cx(
                styles.box,
                !index ? styles.mergedBox : styles.hiddendBox,
              )}
              style={!index ? mergedCellStyle : {}}
            >
              <div className={styles.ellipsisBox}>{!index ? stage : ''}</div>
            </div>
          </Col>
          {cellDatas}
          <Col className={cx('p-0')}>
            <div className={cx(styles.box, styles.totalBox)}>
              {`${totalOfCellInRow / 100}/${numberOfCellInRow}`}
            </div>
          </Col>
          {showScore && (
            <Col className={cx('p-0')}>
              <div
                className={cx(
                  styles.box,
                  styles.scoreBox,
                  !index ? styles.mergedBox : styles.hiddendBox,
                )}
                style={!index ? mergedScoreCellStyle : {}}
              >
                {!index ? (
                  <div className="d-flex flex-column">
                    <span className={styles.scoreText}>{stageScoreStr}</span>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </Col>
          )}
        </Row>
      );
    },
    [
      getComplianceByScore,
      redirectToSelfDeclaration,
      sanitizedData.dictionizedData,
      sanitizedData.isAllInStageSubmitted,
      sanitizedData.listHeader,
      showScore,
      sortedComplianceByValue,
      useDefaultScoreStyle,
    ],
  );

  const renderStageRowGroup = useCallback(
    (stage: string, indexTable: number) => {
      const filteredItems = listStageRow
        .filter((stageQuestion) => {
          const [s] = stageQuestion.split(MATRIX_DEVIDERS.element);
          return s === stage;
        })
        .sort((firstStageQuestion: string, secondStageQuestion: string) => {
          const firstNum =
            sanitizedData.stageQuestionNumberCellCount[secondStageQuestion];
          const secondNum =
            sanitizedData.stageQuestionNumberCellCount[firstStageQuestion];

          if (firstNum > secondNum) {
            return 1;
          }
          if (firstNum < secondNum) {
            return -1;
          }
          return firstStageQuestion > secondStageQuestion ? 1 : -1;
        });

      const result = filteredItems.map(
        (stageQuestion: string, index: number) => {
          const [, question] = stageQuestion.split(MATRIX_DEVIDERS.element);
          return renderRow(
            stage,
            question,
            index,
            filteredItems.length,
            indexTable,
          );
        },
      );

      return result;
    },
    [listStageRow, renderRow, sanitizedData.stageQuestionNumberCellCount],
  );

  const renderAverageRow = useCallback(
    (stage?: string, index?: number) => {
      const cellDatas = sanitizedData.listHeader.map(
        (codeAndNumber: string) => {
          let average = 0;
          let hasNoQuestion = true;
          let content = '';
          let cellCount = 0;

          const filteredKeys = Object.keys(
            sanitizedData.dictionizedData,
          ).filter((k: string) => {
            const [s] = k.split(MATRIX_DEVIDERS.element);
            const [, cn] = k.split(MATRIX_DEVIDERS.coordinate);
            return s === stage && cn === codeAndNumber;
          });

          filteredKeys.forEach((key: string) => {
            let val = 0;
            if (sanitizedData.dictionizedData[key]) {
              hasNoQuestion = false;

              if (!sanitizedData.dictionizedData[key]?.compliance?.compliance) {
                // Compliance null, default value is 0
                val = 0;
                cellCount += 1;
              } else {
                cellCount += 1;
                val =
                  sanitizedData.dictionizedData[key]?.compliance?.compliance;
              }
              average += val;
            }
          });

          if (hasNoQuestion) {
            const firstCellHasValueIndex = stageBreakRef.current[codeAndNumber];
            if (index > firstCellHasValueIndex) {
              if (firstCellHasValueIndex >= STAGE_LIMIT) {
                content = '100';
              } else {
                content = '5';
              }
            } else {
              content = '100';
            }
          } else {
            content = cellCount
              ? Number(average / cellCount).toFixed(2)
              : `${average}`;
            stageBreakRef.current[codeAndNumber] = index;
          }

          return (
            <Col
              className={cx('p-0', styles.col)}
              key={`average-row-${codeAndNumber}`}
            >
              <div className={cx(styles.box)}>{content}</div>
            </Col>
          );
        },
      );

      let mergedScore = 0;
      const cellInStage = Object.keys(sanitizedData.dictionizedData).filter(
        (key: string) => {
          const [s] = key.split(MATRIX_DEVIDERS.element);
          return s === stage;
        },
      );
      cellInStage.forEach((key: string) => {
        const val = sanitizedData.dictionizedData[key]?.compliance?.compliance;
        mergedScore += val ?? 0;
      });
      const stageScoreStr = `${mergedScore / 100}/${cellInStage.length}`;

      return (
        <Row className={cx('mx-0', styles.row)}>
          <Col className={cx('p-0')}>
            <div className={(styles.box, styles.stageBox)} />
          </Col>
          {cellDatas}
          <Col className={cx('p-0')}>
            <div className={cx(styles.box, styles.pinkCell, styles.totalBox)}>
              {stageScoreStr}
            </div>
          </Col>
          {showScore && (
            <Col className={cx('p-0')}>
              <div className={cx(styles.box, styles.scoreBox)} />
            </Col>
          )}
        </Row>
      );
    },
    [sanitizedData.dictionizedData, sanitizedData.listHeader, showScore],
  );

  const renderMatrixContent = useMemo(
    () =>
      selfAssessmentMatrix?.stages.map((stage: string, index: number) => (
        <>
          {renderStageRowGroup(stage, index)}
          {renderAverageRow(stage, index)}
        </>
      )),
    [renderAverageRow, renderStageRowGroup, selfAssessmentMatrix?.stages],
  );

  const listLabel = useMemo(
    () =>
      selfAssessmentMatrix?.compliances.map((compliance) => (
        <div className={cx(styles.label1)} key={`label-${compliance?.colour}`}>
          <div
            className={styles.labelBox}
            style={{ backgroundColor: compliance.colour }}
          />
          {`${compliance.compliance}%`}
        </div>
      )),
    [selfAssessmentMatrix?.compliances],
  );

  const lastRow = useMemo(() => {
    const cellDatas = sanitizedData.listHeader.map((codeAndNumber: string) => {
      const items = Object.keys(sanitizedData.dictionizedData).filter(
        (key: string) => {
          const [, codeAndNum] = key.split(MATRIX_DEVIDERS.coordinate);
          return codeAndNum === codeAndNumber;
        },
      );
      return (
        <Col
          className={cx('p-0', styles.col)}
          key={`last-row-${codeAndNumber}`}
        >
          <div className={cx(styles.box)}>{items.length}</div>
        </Col>
      );
    });

    const totalItems = Object.keys(sanitizedData.dictionizedData);

    return (
      <Row className={cx('mx-0', styles.row)}>
        <Col className={cx('p-0')}>
          <div className={cx(styles.box, styles.stageBox)} />
        </Col>
        {cellDatas}
        <Col className={cx('p-0')}>
          <div className={cx(styles.box, styles.totalBox)}>
            {totalItems.length}
          </div>
        </Col>
        {showScore && (
          <Col className={cx('p-0')}>
            <div className={cx(styles.box, styles.scoreBox)} />
          </Col>
        )}
      </Row>
    );
  }, [sanitizedData.dictionizedData, sanitizedData.listHeader, showScore]);

  return (
    <div className={className}>
      <div className="d-flex mb-3">
        {listLabel}
        <div className={cx(styles.label1)}>
          <div className={cx(styles.labelBox, styles.initial)} />
          {t('initiatedOrInProgress')}
        </div>
        <div className={styles.label1}>
          <div className={cx(styles.labelBox, styles.noQuestion)} />
          {t('noQuestion')}
        </div>
      </div>

      <div className={styles.wrap}>
        {maxtrixHead}
        {renderMatrixContent}
        {lastRow}
      </div>
    </div>
  );
};

export default Matrix;
