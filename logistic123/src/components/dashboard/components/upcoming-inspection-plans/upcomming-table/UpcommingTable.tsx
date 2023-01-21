import TableAntd from 'components/common/table-antd/TableAntd';
import TimeFilter from '../../time-filter/TimeFilter';
import { ModalType } from '../UpcomingInspectionPlan';

const UpcommingTable = ({
  calendarMode,
  setTimeUpcomingInspectionPlan,
  timeUpcomingInspectionPlan,
  globalFilter,
  setTimeFilter,
  columnUpcomingInspectionPlans,
  dataSource,
  openNewPage,
  setModal,
  dynamicLabels,
  renderModalTable,
}) => (
  <div>
    <TimeFilter
      calendarMode={calendarMode}
      setTimeUpcomingInspectionPlan={setTimeUpcomingInspectionPlan}
      timeUpcomingInspectionPlan={timeUpcomingInspectionPlan}
      globalFilter={globalFilter}
      setTimeFilter={setTimeFilter}
      dynamicLabels={dynamicLabels}
    />
    <TableAntd
      columns={columnUpcomingInspectionPlans()}
      dynamicLabels={dynamicLabels}
      dataSource={dataSource?.slice(0, 4) || []}
      scroll={{ x: 'max-content', y: 360 }}
      isViewMore={dataSource?.length > 4}
      onViewMore={() => {
        setModal(ModalType.UPCOMING_INSPECTION_PLANS_LIST);
      }}
      isUpcomingInspectionPlanList
    />
    {renderModalTable()}
  </div>
);

export default UpcommingTable;
