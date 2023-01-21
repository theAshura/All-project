import Tooltip from 'antd/lib/tooltip';
import { getDetailParGroupByAuditor } from 'api/planning-and-request.api';
import images from 'assets/images/images';
import cx from 'classnames';
import capitalize from 'lodash/capitalize';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { TOOLTIP_COLOR } from 'constants/common.const';
import { toastError } from 'helpers/notification.helper';
import { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Modal, ModalProps, Row } from 'reactstrap';
import { formatDateNoTime } from '../../../../helpers/date.helper';
import styles from './modal-schedule.module.scss';

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  parId: string;
}

const ModalSchedule: FC<ModalComponentProps> = ({
  isOpen,
  classesName,
  modalClassName,
  contentClassName,
  title,
  onClose,
  content,
  onConfirm,
  parId,
  ...other
}) => {
  const [data, setData] = useState(null);

  const closeAndClearData = useCallback(() => {
    setData(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen && parId) {
      getDetailParGroupByAuditor(parId)
        .then((res) => {
          setData(res?.data);
        })
        .catch((err) => toastError(err));
    }
  }, [isOpen, parId]);
  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div className={styles.header}>
        <div>{data?.entityType} schedule</div>
        <div className={styles.closeBtn} onClick={closeAndClearData}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <div className={styles.content}>
        <Row>
          <Col xs={6} className={styles.wrapInfo}>
            <div className={styles.label}>Inspection No</div>
            <div className={styles.value}>{data?.auditNo}</div>
          </Col>
          <Col xs={6} className={styles.wrapInfo}>
            <div className={styles.label}>Ref.ID</div>
            <div className={styles.value}>
              <Link
                to={`/planning-and-request-management/detail/${data?.id}`}
                target="_blank"
              >
                {data?.refId}
              </Link>
            </div>
          </Col>
          <Col xs={6} className={styles.wrapInfo}>
            <div className={styles.label}>Entity</div>
            <div className={styles.value}>{data?.entityType || '-'}</div>
          </Col>
          {data?.entityType === 'Office' && (
            <Col xs={6} className={styles.wrapInfo}>
              <div className={styles.label}>Company name</div>
              <div className={styles.value}>
                {data?.auditCompany?.name || '-'}
              </div>
            </Col>
          )}
          {data?.entityType === 'Office' && (
            <Col xs={6} className={styles.wrapInfo}>
              <div className={styles.label}>Department </div>
              <div className={styles.value}>
                {data?.departments?.map((i) => i?.name)?.join(', ') || '-'}
              </div>
            </Col>
          )}
          {data?.entityType === 'Vessel' && (
            <Col xs={6} className={styles.wrapInfo}>
              <div className={styles.label}>Vessel name</div>
              <div className={styles.value}>{data?.vessel?.name || '-'}</div>
            </Col>
          )}
          {data?.entityType === 'Vessel' && (
            <Col xs={6} className={styles.wrapInfo}>
              <div className={styles.label}>Vessel type </div>
              <div className={styles.value}>
                {data?.vessel?.vesselType?.name || '-'}
              </div>
            </Col>
          )}
          {data?.entityType === 'Vessel' && (
            <Col xs={6} className={styles.wrapInfo}>
              <div className={styles.label}>Fleet</div>
              <div className={styles.value}>
                {data?.vessel?.fleet?.name || '-'}
              </div>
            </Col>
          )}
          <Col xs={6} className={styles.wrapInfo}>
            <div className={styles.label}>Visit type </div>
            <div className={styles.value}>
              {data?.typeOfAudit ? capitalize(data?.typeOfAudit) : '-'}
            </div>
          </Col>
          <Col xs={6} className={styles.wrapInfo}>
            <div className={styles.label}>Inspection type</div>
            <Tooltip
              placement="top"
              title={data?.auditTypes?.map((i) => i?.name)?.join(', ') || '-'}
              color={TOOLTIP_COLOR}
            >
              <div className={cx(styles.value, 'limit-line-text')}>
                {data?.auditTypes?.map((i) => i?.name)?.join(', ') || '-'}
              </div>
            </Tooltip>
          </Col>
          <Col xs={6} className={styles.wrapInfo}>
            <div className={styles.label}>Planned from date</div>
            <div className={styles.value}>
              {formatDateNoTime(data?.plannedFromDate)}
            </div>
          </Col>
          <Col xs={6} className={styles.wrapInfo}>
            <div className={styles.label}>Planned to date </div>
            <div className={styles.value}>
              {formatDateNoTime(data?.plannedToDate) || '-'}
            </div>
          </Col>
          <Col xs={6} className={styles.wrapInfo}>
            <div className={styles.label}>Name of inspector</div>
            <Tooltip
              placement="top"
              title={data?.auditors?.map((i) => i?.username)?.join(', ') || '-'}
              color={TOOLTIP_COLOR}
            >
              <div className={cx(styles.value, 'limit-line-text')}>
                {data?.auditors?.map((i) => i?.username)?.join(', ') || '-'}
              </div>
            </Tooltip>
          </Col>
          <Col xs={6} className={styles.wrapInfo}>
            <div className={styles.label}>Lead inspector</div>
            <div className={styles.value}>
              {data?.leadAuditor?.username || '-'}
            </div>
          </Col>
          <Col xs={6} className={styles.wrapInfo}>
            <div className={styles.label}>Working type</div>
            <div className={styles.value}>{data?.workingType || '-'}</div>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <Button
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Primary}
            onClick={closeAndClearData}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSchedule;
