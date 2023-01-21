/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useCallback, useMemo } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import isNil from 'lodash/isNil';
import { financial } from 'helpers/utils.helper';
import Checkbox from 'components/ui/checkbox/Checkbox';

import Table from 'antd/lib/table';

import { getRiskLevel } from 'pages/vessel-screening/utils/functions';
import { RISK_LEVEL } from 'pages/sail-general-report/utils/constant';
import images from 'assets/images/images';
import styles from './form.module.scss';
import { PilotTerminalFeedbackChecklist } from '../utils/models/common.model';
import {
  CHECKLISTS_PILOT_TERMINAL_FEEDBACK,
  QUESTION_CONVERT_FEEDBACK,
  QUESTION_FEEDBACK,
} from './contants';

interface ChecklistPilotTerminalFeedbackProps {
  lengthPilotChecklist?: any;
  errors?: any;
  isRequired?: boolean;
  isEdit: boolean;
  loading?: boolean;
  value: PilotTerminalFeedbackChecklist[];
  onChange: (value: PilotTerminalFeedbackChecklist[]) => void;
}

const ChecklistPilotTerminalFeedback: FC<ChecklistPilotTerminalFeedbackProps> =
  ({
    isEdit,
    loading,
    value,
    onChange,
    isRequired,
    errors,
    lengthPilotChecklist,
  }) => {
    const { t } = useTranslation(I18nNamespace.PILOT_TERMINAL_FEEDBACK);

    const dataSource = useMemo(
      () =>
        CHECKLISTS_PILOT_TERMINAL_FEEDBACK?.map((question, index) => {
          const questionNo1 = index + 1;
          const dataQuestion = value?.find((i) => questionNo1 === i.questionNo);

          return {
            id: dataQuestion?.id || '',
            key: question,
            questionNo: questionNo1,
            checkListValue: dataQuestion?.checkListValue || '',
            question,
            excellent:
              dataQuestion?.checkListValue === QUESTION_FEEDBACK.EXCELLENT,
            good: dataQuestion?.checkListValue === QUESTION_FEEDBACK.GOOD,
            average: dataQuestion?.checkListValue === QUESTION_FEEDBACK.AVERAGE,
            poor: dataQuestion?.checkListValue === QUESTION_FEEDBACK.LOW,
            notApplicable:
              dataQuestion?.checkListValue === QUESTION_FEEDBACK.NOT_APPLICABLE,
          };
        }),
      [value],
    );

    const onChangeChecklist = useCallback(
      (checked: boolean, indexTable: number, feedback: QUESTION_FEEDBACK) => {
        const checklistFinding = value?.find(
          (i) => i.questionNo === indexTable + 1,
        );

        let params: PilotTerminalFeedbackChecklist = {
          checkListValue: feedback,
          questionNo: indexTable + 1,
        };
        if (checklistFinding?.id) {
          params = { ...params, id: checklistFinding?.id };
        }

        const newValue: PilotTerminalFeedbackChecklist[] =
          CHECKLISTS_PILOT_TERMINAL_FEEDBACK?.map((question, indexQuestion) => {
            const valueQuestionNumber = value?.find(
              (i) => indexQuestion === i.questionNo - 1,
            );

            if (indexTable === indexQuestion) {
              return checked
                ? {
                    ...params,
                  }
                : null;
            }
            return valueQuestionNumber;
          });

        onChange(newValue?.filter((i) => i));
      },
      [onChange, value],
    );

    const columns = useMemo(
      () => [
        {
          title: t('table.sNo'),
          dataIndex: 'questionNo',
          width: 60,
        },
        {
          title: t('table.question'),
          dataIndex: 'question',
          width: 300,
        },
        {
          title: t('table.excellent'),
          dataIndex: 'excellent',
          width: 100,
          render: (value, record, index) => (
            <Checkbox
              checked={value}
              disabled={!isEdit}
              onChange={(e) =>
                onChangeChecklist(
                  e.target.checked,
                  index,
                  QUESTION_FEEDBACK.EXCELLENT,
                )
              }
              checkMarkClassName={styles.checkMark}
            />
          ),
        },
        {
          title: t('table.good'),
          dataIndex: 'good',
          width: 100,
          render: (value, record, index) => (
            <Checkbox
              checked={value}
              disabled={!isEdit}
              onChange={(e) =>
                onChangeChecklist(
                  e.target.checked,
                  index,
                  QUESTION_FEEDBACK.GOOD,
                )
              }
              checkMarkClassName={styles.checkMark}
            />
          ),
        },
        {
          title: t('table.average'),
          dataIndex: 'average',
          width: 100,
          render: (value, record, index) => (
            <Checkbox
              checked={value}
              disabled={!isEdit}
              onChange={(e) =>
                onChangeChecklist(
                  e.target.checked,
                  index,
                  QUESTION_FEEDBACK.AVERAGE,
                )
              }
              checkMarkClassName={styles.checkMark}
            />
          ),
        },
        {
          title: t('table.poor'),
          dataIndex: 'poor',
          width: 100,
          render: (value, record, index) => (
            <Checkbox
              checked={value}
              disabled={!isEdit}
              onChange={(e) =>
                onChangeChecklist(
                  e.target.checked,
                  index,
                  QUESTION_FEEDBACK.LOW,
                )
              }
              checkMarkClassName={styles.checkMark}
            />
          ),
        },
        {
          title: t('table.notApplicable'),
          dataIndex: 'notApplicable',
          width: 100,
          render: (value, record, index) => (
            <Checkbox
              checked={value}
              disabled={!isEdit}
              onChange={(e) =>
                onChangeChecklist(
                  e.target.checked,
                  index,
                  QUESTION_FEEDBACK.NOT_APPLICABLE,
                )
              }
              checkMarkClassName={styles.checkMark}
            />
          ),
        },
      ],
      [isEdit, onChangeChecklist, t],
    );
    const scoreInfo = useMemo(() => {
      let total = 0;
      let isAllNullable = true;
      let length = value?.length;

      value?.forEach((item) => {
        const score = QUESTION_CONVERT_FEEDBACK[item?.checkListValue];
        if (!isNil(score)) {
          isAllNullable = false;
          total += score;
        } else {
          length -= 1;
        }
      });

      return {
        value: isAllNullable ? 0 : total / length,
        isAllNullable,
      };
    }, [value]);

    return (
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.containerForm)}>
          <div className="d-flex justify-content-between align-items-center pb-2">
            <div className={cx('fw-bold ', styles.labelHeader)}>
              {t('checklist')}
              {isRequired && (
                <img
                  className={cx(styles.checklistRequired)}
                  src={images.icons.icRequiredAsterisk}
                  alt="required"
                />
              )}
            </div>
            <div
              className={cx(styles.score, {
                [styles.negligible]:
                  getRiskLevel(scoreInfo.value) === RISK_LEVEL.NEGLIGIBLE,
                [styles.low]: getRiskLevel(scoreInfo.value) === RISK_LEVEL.LOW,
                [styles.medium]:
                  getRiskLevel(scoreInfo.value) === RISK_LEVEL.MEDIUM,
                [styles.high]:
                  !scoreInfo.isAllNullable &&
                  getRiskLevel(scoreInfo.value) === RISK_LEVEL.HIGH,
              })}
            >
              <span className={styles.scoreLabel}>Score:</span>{' '}
              {financial(scoreInfo.value)}
            </div>
          </div>
          <Table
            columns={columns}
            className={cx(styles.tableWrapper)}
            dataSource={dataSource}
            scroll={{ x: 'max-content' }}
            pagination={false}
            rowClassName={styles.rowWrapper}
          />
          {lengthPilotChecklist < CHECKLISTS_PILOT_TERMINAL_FEEDBACK.length && (
            <div className="message-required mt-2">
              {errors?.pilotTerminalFeedbackChecklists?.message || ''}
            </div>
          )}
        </div>
      </div>
    );
  };

export default ChecklistPilotTerminalFeedback;
