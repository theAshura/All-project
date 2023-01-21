import cx from 'classnames';
import { FC } from 'react';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import TableAntd, {
  ColumnTableType,
} from 'components/common/table-antd/TableAntd';
// import SelectUI, { OptionProp } from 'components/ui/select/Select';
// import Button, { ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import { Row, Col } from 'reactstrap';
import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';

import styles from './modal.module.scss';
import TimeFilter from '../time-filter/TimeFilter';

export interface DataDetailModal {
  vesselCode: string;
  vesselName: string;
  labelTotal: string;
  auditCompanyName?: string;
}
export interface ModalTableProps {
  isOpen: boolean;
  title: string;
  dataDetailModal: DataDetailModal;
  subTitle?: string;
  dataSource: any[];
  timeModal?: TrendOfTime;
  setTimeModal?: (time: TrendOfTime) => void;
  columns: ColumnTableType[];
  handleClick?: (data) => void;
  toggle?: () => void;
  handleBack?: () => void;
  w?: string | number;
  h?: string | number;
  onSort?: (value: string) => void;
  sort?: string;
  isDetail?: boolean;
  scroll?: { x?: string | number | true; y?: string | number };
  titleClassName?: string;
  hasTimerFilter?: boolean;
  calendarMode?: boolean;
  setTimeUpcomingInspectionPlan?: any;
  timeUpcomingInspectionPlan?: TrendOfTime;
  hasVesselName: boolean;
}

const ModalDouble: FC<ModalTableProps> = ({
  isOpen,
  toggle,
  title,
  subTitle,
  dataSource,
  handleClick,
  handleBack,
  columns,
  w,
  h,
  onSort,
  scroll,
  isDetail,
  sort,
  dataDetailModal,
  titleClassName = '',
  calendarMode,
  setTimeUpcomingInspectionPlan,
  timeUpcomingInspectionPlan,
  hasVesselName,
  // timeModal,
  // setTimeModal,
}) => (
  <Modal
    isOpen={isOpen}
    title={<span className={titleClassName}>{title}</span>}
    toggle={toggle}
    bodyClassName={cx(styles.bodyModal)}
    w={w || 800}
    h={h}
    headerDouble={
      isDetail && (
        <div className={styles.titleWrapper}>
          <div className={styles.icBack} onClick={handleBack}>
            <img src={images.icons.icArrowChevronBack} alt="ic-back-modal" />
          </div>
          <div className={cx(styles.titleModalDetail, titleClassName)}>
            {title}
          </div>
        </div>
      )
    }
    content={
      <div className={cx(styles.contentWrapper)}>
        {isDetail ? (
          <>
            <Row className="mb-2">
              {!hasVesselName && (
                <Col sm={3} lg={3}>
                  <span className="fw-bold">Vessel code</span>
                </Col>
              )}
              <Col sm={5} lg={5}>
                <span className="fw-bold">
                  {dataDetailModal?.vesselName ? 'Vessel name' : 'Company name'}
                </span>
              </Col>

              <Col sm={4} lg={4}>
                <span className="fw-bold">{dataDetailModal?.labelTotal}</span>
              </Col>
            </Row>
            <Row className="mb-3">
              {!hasVesselName && (
                <Col sm={3} lg={3}>
                  {dataDetailModal?.vesselCode}
                </Col>
              )}
              <Col sm={5} lg={5}>
                {dataDetailModal?.vesselName ||
                  dataDetailModal?.auditCompanyName}
              </Col>
              <Col sm={4} lg={4}>
                {dataSource?.length}
              </Col>
            </Row>
          </>
        ) : (
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="fw-bold">{subTitle}</div>
            <div className="d-flex justify-content-end">
              {!calendarMode && (
                <TimeFilter
                  calendarMode={calendarMode}
                  setTimeUpcomingInspectionPlan={setTimeUpcomingInspectionPlan}
                  timeUpcomingInspectionPlan={timeUpcomingInspectionPlan}
                />
              )}
              {/* pending
              <Button
                className={styles.btnTimeModal}
                buttonType={
                  timeModal === TrendOfTime.W
                    ? ButtonType.BlueChart
                    : ButtonType.CancelOutline
                }
                onClick={() => setTimeModal(TrendOfTime.W)}
              >
                1W
              </Button>
              <Button
                className={styles.btnTimeModal}
                buttonType={
                  timeModal === TrendOfTime.M
                    ? ButtonType.BlueChart
                    : ButtonType.CancelOutline
                }
                onClick={() => setTimeModal(TrendOfTime.M)}
              >
                1M
              </Button>
              <Button
                className={styles.btnTimeModal}
                buttonType={
                  timeModal === TrendOfTime.M3
                    ? ButtonType.BlueChart
                    : ButtonType.CancelOutline
                }
                onClick={() => setTimeModal(TrendOfTime.M3)}
              >
                3M
              </Button>
              <Button
                className={styles.btnTimeModal}
                buttonType={
                  timeModal === TrendOfTime.Y
                    ? ButtonType.BlueChart
                    : ButtonType.CancelOutline
                }
                onClick={() => setTimeModal(TrendOfTime.Y)}
              >
                1Y
              </Button> */}
            </div>
          </div>
        )}

        <div className={styles.table}>
          <TableAntd
            columns={columns}
            dataSource={dataSource}
            handleClick={handleClick}
            sort={sort}
            onSort={onSort}
            scroll={scroll || { x: 'max-content', y: 360 }}
          />
        </div>
      </div>
    }
    modalType={ModalType.LARGE}
  />
);

export default ModalDouble;
