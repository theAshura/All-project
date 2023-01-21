import cx from 'classnames';
import { FC, useCallback, useState, useEffect } from 'react';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { ReferencesQuestion } from 'models/api/audit-checklist/audit-checklist.model';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Tooltip from 'antd/lib/tooltip';
import { getQuestionReferencesDetailApi } from 'api/audit-checklist.api';
import { QuestionChecklist } from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import isEmpty from 'lodash/isEmpty';
import upperCase from 'lodash/upperCase';
import upperFirst from 'lodash/upperFirst';
import NoDataImg from 'components/common/no-data/NoData';

import styles from './modal.module.scss';

interface ModalFindingProps {
  isOpen: boolean;
  title: string;
  isAdd?: boolean;
  data?: QuestionChecklist;
  toggle?: () => void;
  w?: string | number;
  h?: string | number;
}
const ModalReferencesAndCategories: FC<ModalFindingProps> = ({
  isOpen,
  toggle,
  title,
  data,
  w,
  h,
}) => {
  const [dataReferences, setDataReferences] = useState<ReferencesQuestion>({});

  const convertName = (name: string) => {
    if (name === 'viq' || name === 'cdi' || name === 'sms')
      return upperCase(name);
    return upperFirst(name.replaceAll('_', ' '));
  };
  const renderValues = useCallback((value) => {
    if (value?.location) {
      return value?.location;
    }
    if (value?.mainCategory) {
      return value?.mainCategory;
    }
    if (value?.secondCategory) {
      return value?.secondCategory;
    }
    return value;
  }, []);

  useEffect(() => {
    if (data && isOpen) {
      getQuestionReferencesDetailApi({
        idAuditChecklist: data?.chkQuestion?.auditChecklistId,
        idQuestion: data?.chkQuestion?.id,
      }).then((res) => {
        setDataReferences(res?.data);
      });
    } else {
      setDataReferences({});
    }
  }, [data, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      toggle={toggle}
      hiddenFooter
      bodyClassName={styles.bodyModal}
      content={
        <div className={cx(styles.modalReferencesAndCategories)}>
          {isEmpty(dataReferences) ? (
            <div className={styles.dataWrapperEmpty}>
              <NoDataImg />
            </div>
          ) : (
            Object.entries(dataReferences).map(([key, value], index) => (
              <Row
                className={cx(styles.colItem, {
                  [styles.odd]: index % 2,
                })}
                key={key}
              >
                <Col span={6} className={cx('', styles.textLabel)}>
                  {convertName(key)}
                </Col>
                <Col span={18} className={cx(styles.textContent)}>
                  <Tooltip
                    placement="topRight"
                    title={renderValues(value)}
                    color="#3B9FF3"
                  >
                    <span className={cx('limit-line-text')}>
                      {renderValues(value)}
                    </span>
                  </Tooltip>
                </Col>
              </Row>
            ))
          )}
        </div>
      }
      w={800}
      modalType={ModalType.CENTER}
    />
  );
};

export default ModalReferencesAndCategories;
