import { FC, useState } from 'react';
import cx from 'classnames';
import Popover from 'antd/lib/popover';
import { CloseCircleOutlined } from '@ant-design/icons';
import LineStepCP, { Item } from 'components/common/step-line/lineStepInfoCP';
import Button, { ButtonType } from 'components/ui/button/Button';
import { populateStatus } from 'helpers/utils.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './modal-status.module.scss';

interface Props {
  header?: string;
  status: string;
  stepStatusItems: Item[];
  className?: string;
  labelClassName?: string;
  lineStepStyle?: string;
  dynamicLabels?: IDynamicLabel;
}

const PopoverStatus: FC<Props> = (props) => {
  const {
    header,
    stepStatusItems,
    status,
    className,
    lineStepStyle,
    labelClassName,
    dynamicLabels,
  } = props;
  const [visible, setVisible] = useState(false);

  const content = (
    <div className={cx(styles.content, 'px-3', className)}>
      <div
        className={cx(styles.header, 'pb-4  d-flex justify-content-between')}
      >
        <div className={cx(styles.title)}>{header}</div>
        <CloseCircleOutlined
          onClick={() => setVisible(false)}
          style={{ fontSize: 20, color: '#41A2F3' }}
        />
      </div>
      <div>
        <LineStepCP
          status={status}
          items={stepStatusItems}
          lineStepStyle={lineStepStyle}
        />
      </div>
    </div>
  );

  return status ? (
    <div className={cx(styles.info, 'd-flex align-items-center ')}>
      <span className={cx(styles.titleStatus)}>
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS.Status,
        )}
        :{' '}
      </span>

      <Popover
        placement="bottomRight"
        title={null}
        getPopupContainer={(trigger) => trigger.parentElement}
        visible={visible}
        onVisibleChange={setVisible}
        content={content}
        trigger="click"
      >
        <Button
          className={cx(styles.btn, 'ps-1', labelClassName)}
          buttonType={ButtonType.UnderLineDangerous}
        >
          {populateStatus(status)}
        </Button>
      </Popover>
    </div>
  ) : null;
};

export default PopoverStatus;
