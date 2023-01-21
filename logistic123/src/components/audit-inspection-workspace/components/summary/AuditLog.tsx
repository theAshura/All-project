import cx from 'classnames';
import Button, { ButtonType } from 'components/ui/button/Button';
import { useSelector } from 'react-redux';
import NoDataImg from 'components/common/no-data/NoData';
import { useState } from 'react';
import DetectEsc from 'components/common/modal/DetectEsc';
import { getColorByName } from 'helpers/utils.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import styles from './summary.module.scss';

const AuditLog = ({ dynamicLabels }) => {
  const { planningAuditLog } = useSelector((state) => state.planningAndRequest);
  const [auditLogVisible, setAuditLogVisible] = useState(false);

  return (
    <div className={styles.auditLog}>
      {auditLogVisible && <DetectEsc close={() => setAuditLogVisible(false)} />}
      <div
        className={styles.auditLogBtn}
        onClick={() => setAuditLogVisible(true)}
      >
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['Audit log'],
        )}
      </div>
      <div
        className={cx(styles.auditLogWrap, {
          [styles.auditLogHide]: !auditLogVisible,
        })}
      >
        <div className={styles.header}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['Audit log'],
          )}
        </div>
        <div className={styles.content}>
          {planningAuditLog?.data?.length ? (
            planningAuditLog?.data?.map((i, index) => (
              <div key={String(i.id + index)} className={styles.wrapLog}>
                <div
                  className={styles.stepLine}
                  style={{ background: getColorByName(i?.activity)?.color }}
                />
                <div className={styles.info}>
                  <div
                    className={styles.status}
                    style={{ color: getColorByName(i?.activity)?.color }}
                  >
                    {i?.activity}
                  </div>
                  <div className={styles.name}>
                    <b>{i?.createdUser?.username}</b> |{' '}
                    <span>{i?.createdUser?.jobTitle}</span>
                  </div>
                  <div className={styles.page}>{i?.module}</div>
                  <div className={styles.date}>
                    {formatDateLocalWithTime(i?.createdAt)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoDataImg />
          )}
        </div>
        <div className={styles.footer}>
          <Button
            buttonType={ButtonType.CancelOutline}
            onClick={() => setAuditLogVisible(false)}
          >
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Close,
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
