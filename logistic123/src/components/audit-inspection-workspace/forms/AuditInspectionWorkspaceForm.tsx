import cx from 'classnames';
import { FC, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Tabs from 'antd/lib/tabs';
import { useLocation } from 'react-router-dom';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import {
  clearMainCategoryReducer,
  getListMainCategoryActions,
} from 'store/main-category/main-category.action';
import {
  clearSecondCategoryReducer,
  getListSecondCategoryActions,
} from 'store/second-category/second-category.action';
import {
  clearThirdCategoryReducer,
  getListThirdCategoryActions,
} from 'store/third-category/third-category.action';
import {
  clearNatureOfFindingsMasterReducer,
  getListNatureOfFindingsMasterActions,
} from 'store/nature-of-findings-master/nature-of-findings-master.action';
import { CommonQuery, AuditWorkspaceStatus } from 'constants/common.const';
import { clearAuditTypeReducer } from 'store/role/role.action';
import { clearTemplateReducer } from 'store/template/template.action';
import images from 'assets/images/images';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import {
  AuditInspectionChecklistResponse,
  AuditInspectionWorkspaceDetailResponse,
} from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import ChecklistInformation from '../components/Checklist';
import VesselInformation from '../components/VesselInformation';
import FindingSummary from '../components/FindingSummary';
// import AnalysisReport from '../components/analysis-report/AnalysisReport';
import AnalysisGuideModal from '../components/analysis-guide-modal/AnalysisGuideModal';
import RemarksTab from '../components/Remarks';
import AnalyticalTab from '../components/analytical/Analytical';
import styles from './form.module.scss';
import HeaderInfo from '../components/HeaderInfo';

interface AuditInspectionWorkspaceFormProps {
  data: AuditInspectionWorkspaceDetailResponse;
  checklists: AuditInspectionChecklistResponse[];
  isEdit: boolean;
  isAuditor: boolean;
  id: string;
  isEditRemark: boolean;
  dynamicLabels?: IDynamicLabel;
}

const { TabPane } = Tabs;

const AuditInspectionWorkspaceForm: FC<AuditInspectionWorkspaceFormProps> = ({
  data,
  checklists,
  isEdit,
  isAuditor,
  id,
  isEditRemark,
  dynamicLabels,
}) => {
  const { search } = useLocation();
  const [activeTab, setActiveTab] = useState<string>('Vessel');
  const [firstTimeVisited, setFirstTimeVisited] = useState<boolean>(false);
  const [analysisGuildModalVisible, setAnalysisGuildModalVisible] =
    useState<boolean>(false);

  const { listSummary, loading } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getListMainCategoryActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
        status: 'active',
      }),
    );
    dispatch(
      getListSecondCategoryActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );
    dispatch(
      getListThirdCategoryActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );
  }, [
    dispatch,
    data,
    userInfo.parentCompanyId,
    userInfo.companyId,
    userInfo?.mainCompanyId,
  ]);

  useEffect(() => {
    if (data?.planningRequestId) {
      dispatch(
        getListNatureOfFindingsMasterActions.request({
          pageSize: -1,
          planningRequestId: data?.planningRequestId,
          workSpace: true,
          companyId: userInfo?.mainCompanyId,
        }),
      );
      dispatch(
        getListAuditTypeActions.request({
          pageSize: -1,
          planningRequestId: data?.planningRequestId,
          companyId: userInfo?.mainCompanyId,
        }),
      );
    }

    return () => {
      dispatch(clearTemplateReducer());
      dispatch(clearAuditTypeReducer());
      dispatch(clearMainCategoryReducer());
      dispatch(clearSecondCategoryReducer());
      dispatch(clearThirdCategoryReducer());
      dispatch(clearNatureOfFindingsMasterReducer());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, data]);

  const checkSeenFirstTime = useCallback(
    () => data?.seenUsers?.some((i) => i === userInfo?.id),
    [data?.seenUsers, userInfo?.id],
  );

  useEffect(() => {
    if (
      !checkSeenFirstTime() &&
      userInfo &&
      activeTab === 'analysisReport' &&
      !firstTimeVisited
    ) {
      setAnalysisGuildModalVisible(true);
      setFirstTimeVisited(true);
    }
  }, [checkSeenFirstTime, userInfo, activeTab, firstTimeVisited]);

  return (
    <div className={cx(styles.wrapperContainer)}>
      <Tabs
        activeKey={activeTab}
        tabBarStyle={{ margin: '0 20px', borderBottom: '1px solid #D2D1D4' }}
        onChange={setActiveTab}
      >
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'Vessel',
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Summary,
              )}
            </div>
          }
          key="Vessel"
        >
          <VesselInformation
            dynamicLabels={dynamicLabels}
            loading={loading}
            data={data}
          />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'Checklist',
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                  'Checklist information'
                ]['Checklist information'],
              )}
            </div>
          }
          key="Checklist"
        >
          <ChecklistInformation
            disabled={!(isEdit && isAuditor)}
            checklists={checklists}
            data={data}
            loading={loading}
            isAuditor={isAuditor}
            activeTab={activeTab}
            dynamicLabels={dynamicLabels}
          />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'FindingSummary',
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                  'Finding summary'
                ],
              )}
            </div>
          }
          key="FindingSummary"
        >
          <FindingSummary
            disabled={!(isEdit && isAuditor)}
            summaryData={listSummary?.data}
            data={data}
            loading={loading}
            dynamicLabels={dynamicLabels}
          />
        </TabPane>
        {/* <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'analysisReport',
              })}
            >
              Analysis Report
            </div>
          }
          key="analysisReport"
        >
          <AnalysisReport
            // disabled={!(isEdit && isAuditor)}
            // summaryData={listSummary?.data}
            data={data}
            // loading={loading}
          />
        </TabPane> */}

        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'Remarks',
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Remarks,
              )}
            </div>
          }
          key="Remarks"
        >
          <RemarksTab
            loading={loading}
            disabled={!isEditRemark}
            activeTab={activeTab}
            id={id}
            dynamicLabels={dynamicLabels}
          />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'Analytical',
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical
                  .Analytical,
              )}
            </div>
          }
          key="Analytical"
        >
          <AnalyticalTab
            loading={loading}
            disabled={!isEditRemark}
            activeTab={activeTab}
            isEdit={
              search === CommonQuery.EDIT &&
              data?.status === AuditWorkspaceStatus.FINAL
            }
            id={id}
            dynamicLabels={dynamicLabels}
          />
        </TabPane>
      </Tabs>
      {activeTab === 'analysisReport' && (
        <div
          className={styles.guide}
          onClick={() => setAnalysisGuildModalVisible(true)}
        >
          <img src={images.icons.icInfoCircle} alt="icInfoCircle" />
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Guideline,
          )}
        </div>
      )}
      <div className={styles.wrapHeaderInfo}>
        <HeaderInfo data={data} dynamicLabels={dynamicLabels} />
      </div>
      <AnalysisGuideModal
        data={data}
        isOpen={analysisGuildModalVisible}
        onClose={() => setAnalysisGuildModalVisible(false)}
      />
    </div>
  );
};

export default AuditInspectionWorkspaceForm;
