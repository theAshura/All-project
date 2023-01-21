import Tabs from 'antd/lib/tabs';
import cx from 'classnames';
import TableAntd from 'components/common/table-antd/TableAntd';
import {
  columnReportOfFindingTab,
  columnAuditChecklistTemplates,
  columnInternalAuditReportTab,
  columnPlanningAndRequest,
} from 'components/dashboard/constants/company.const';
import { AppRouteConst } from 'constants/route.const';
import { openNewPage } from 'helpers/utils.helper';
import { OverviewTaskResponse } from 'models/api/dashboard/dashboard.model';
import { FC, useCallback, useMemo, useState } from 'react';
import ModalTable from '../../modal/ModalTable';
import styles from './list-of-review.module.scss';

interface Props {
  title: string;
  className?: string;
  data: OverviewTaskResponse;
  containerWidth?: number | string;
}

enum ModalTabType {
  AUDIT_CHECKLIST_TEMPLATES = 'AUDIT_CHECKLIST_TEMPLATES',
  PLANNING_AND_REQUEST = 'PLANNING_AND_REQUEST',
  REPORT_OF_FINDING = 'REPORT_OF_FINDING',
  INTERNAL_AUDIT_REPORT = 'INTERNAL_AUDIT_REPORT',

  HIDDEN = 'HIDDEN',
}

const ListOfItemReview: FC<Props> = ({
  title,
  className,
  data,
  containerWidth,
}) => {
  const [activeTab, setActiveTab] = useState<string>('AuditChecklistTemplates');
  const [modal, setModal] = useState<ModalTabType>(ModalTabType.HIDDEN);

  const renderModalWidth = (modalType: ModalTabType) => {
    switch (modalType) {
      case ModalTabType.PLANNING_AND_REQUEST:
      case ModalTabType.REPORT_OF_FINDING:
      case ModalTabType.INTERNAL_AUDIT_REPORT:
        return 1200;
      default:
        return 970;
    }
  };

  const dataIAR = useMemo(
    () =>
      data?.overviewInternalAuditReport?.map((itemIAR) => ({
        ...itemIAR,
        status: itemIAR.status.includes('reviewed')
          ? 'reviewed'
          : itemIAR.status,
      })),
    [data?.overviewInternalAuditReport],
  );

  const renderModalTable = useCallback(() => {
    let title = '';
    let columns = [];
    let dataTable = [];
    if (modal === ModalTabType.HIDDEN) {
      return null;
    }
    switch (modal) {
      case ModalTabType.REPORT_OF_FINDING:
        title = 'Report of Findings';
        columns = columnReportOfFindingTab;
        dataTable = data?.overviewReportFindingForm || [];
        break;
      case ModalTabType.INTERNAL_AUDIT_REPORT:
        title = 'Inspection reports';
        columns = columnInternalAuditReportTab;
        dataTable = dataIAR || [];
        break;
      case ModalTabType.PLANNING_AND_REQUEST:
        title = 'Planning ';
        columns = columnPlanningAndRequest;
        dataTable = data?.overviewDashboard || [];
        break;
      case ModalTabType.AUDIT_CHECKLIST_TEMPLATES:
        title = 'Inspection Checklist Templates';
        columns = columnAuditChecklistTemplates;
        dataTable = data?.overviewChecklist || [];
        break;
      default:
        break;
    }

    return (
      <ModalTable
        isOpen
        scroll={{ x: 'max-content', y: 360 }}
        dataSource={dataTable}
        toggle={() => setModal(ModalTabType.HIDDEN)}
        columns={columns}
        title={title}
        handleClick={(data) => {
          switch (modal) {
            case ModalTabType.AUDIT_CHECKLIST_TEMPLATES:
              return openNewPage(AppRouteConst.auditCheckListDetail(data?.id));
            case ModalTabType.PLANNING_AND_REQUEST:
              return openNewPage(
                AppRouteConst.getPlanningAndRequestById(data?.id),
              );
            case ModalTabType.INTERNAL_AUDIT_REPORT:
              return openNewPage(
                AppRouteConst.getInternalAuditReportById(data?.id),
              );
            case ModalTabType.REPORT_OF_FINDING:
              return openNewPage(
                AppRouteConst.getReportOfFindingById(data?.id),
              );
            default:
              break;
          }
          return null;
        }}
        w={renderModalWidth(modal)}
      />
    );
  }, [
    modal,
    data?.overviewReportFindingForm,
    data?.overviewDashboard,
    data?.overviewChecklist,
    dataIAR,
  ]);

  const overviewData = (listData) => listData?.slice(0, 3) || [];

  return (
    <div
      className={cx(styles.block, className)}
      style={{
        width: containerWidth || 'auto',
      }}
    >
      <div className={styles.title}>{title}</div>
      <Tabs
        activeKey={activeTab}
        tabBarStyle={{ borderBottom: '1px solid #D2D1D4' }}
        onChange={setActiveTab}
        className={cx(styles.flexGrow1, 'full-height-child-tab')}
      >
        <Tabs.TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'AuditChecklistTemplates',
              })}
            >
              Inspection checklist templates
            </div>
          }
          key="AuditChecklistTemplates"
        >
          <TableAntd
            columns={columnAuditChecklistTemplates}
            handleClick={(data) => {
              openNewPage(AppRouteConst.auditCheckListDetail(data?.id));
            }}
            dataSource={overviewData(data?.overviewChecklist)}
            isViewMore={data?.overviewChecklist?.length > 3}
            onViewMore={() => {
              setModal(ModalTabType.AUDIT_CHECKLIST_TEMPLATES);
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'PlanningAndRequest',
              })}
            >
              Planning
            </div>
          }
          key="PlanningAndRequest"
        >
          <TableAntd
            columns={columnPlanningAndRequest}
            dataSource={overviewData(data?.overviewDashboard)}
            handleClick={(data) => {
              openNewPage(AppRouteConst.getPlanningAndRequestById(data?.id));
            }}
            isViewMore={data?.overviewDashboard?.length > 3}
            onViewMore={() => {
              setModal(ModalTabType.PLANNING_AND_REQUEST);
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'ReportOfFindings',
              })}
            >
              Report of findings
            </div>
          }
          key="ReportOfFindings"
        >
          <TableAntd
            columns={columnReportOfFindingTab}
            dataSource={overviewData(data?.overviewReportFindingForm)}
            isViewMore={data?.overviewReportFindingForm?.length > 3}
            onViewMore={() => {
              setModal(ModalTabType.REPORT_OF_FINDING);
            }}
            handleClick={(data) => {
              openNewPage(AppRouteConst.getReportOfFindingById(data?.id));
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'InternalAuditReports',
              })}
            >
              Inspection reports
            </div>
          }
          key="InternalAuditReports"
        >
          <TableAntd
            columns={columnInternalAuditReportTab}
            dataSource={overviewData(dataIAR)}
            handleClick={(data) => {
              openNewPage(AppRouteConst.getInternalAuditReportById(data?.id));
            }}
            isViewMore={dataIAR?.length > 3}
            onViewMore={() => {
              setModal(ModalTabType.INTERNAL_AUDIT_REPORT);
            }}
          />
        </Tabs.TabPane>
      </Tabs>
      {renderModalTable()}
    </div>
  );
};

export default ListOfItemReview;
