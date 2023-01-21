import { DataDetailModal } from 'components/dashboard/components/modal-double/ModalDouble';
import { useDispatch } from 'react-redux';
import { Dispatch, FC, useCallback, SetStateAction } from 'react';
import {
  getCompanyOpenFindingObservationByVesselActions,
  getCompanyOpenNonConformityByVesselActions,
} from 'store/dashboard/dashboard.action';
import { openNewPage } from 'helpers/utils.helper';
import { AppRouteConst } from 'constants/route.const';
import ModalDoubleAGGrid from 'components/dashboard/components/modal-double/ModalDoubleAGGrid';
import ModalTableAGGrid from 'components/dashboard/components/modal/ModalTableAGGrid';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import { ModalDashboardType } from '../../constants/company.const';
import styles from './out-standing-issue-modal.module.scss';

interface OutStandingIssueModalProps {
  modalType: ModalDashboardType;
  data: Array<any>;
  handleToggleModal: () => void;
  subTitle?: string;
  sort: string;
  handleSort: (value: string) => void;
  columns: Array<any>;
  isDetail?: boolean;
  title: string;
  setIsDetailModal: Dispatch<SetStateAction<boolean>>;
  dataDetailModal: DataDetailModal;
  setDataDetailModal: Dispatch<SetStateAction<DataDetailModal>>;
  moduleTemplate?: string;
  fileName?: string;
  aggridId?: string;
  w?: string;
  setIsMultiColumnFilter?: Dispatch<SetStateAction<boolean>>;
  hasVesselName?: boolean;
}

const OutStandingIssueModal: FC<OutStandingIssueModalProps> = ({
  modalType,
  handleToggleModal,
  data,
  subTitle,
  sort,
  handleSort,
  columns,
  isDetail,
  setIsDetailModal,
  title,
  dataDetailModal,
  setDataDetailModal,
  aggridId,
  fileName,
  moduleTemplate,
  setIsMultiColumnFilter,
  hasVesselName,
}) => {
  const dispatch = useDispatch();
  const renderModalWidth = useCallback(
    (currentModalType: ModalDashboardType) => {
      switch (currentModalType) {
        case ModalDashboardType.NUMBER_AUDIT_TIME_TABLE:
        case ModalDashboardType.NUMBER_REPORT_OF_FINDING:
        case ModalDashboardType.NUMBER_INTERNAL_AUDIT_REPORT:
          return 1400;
        default:
          return 970;
      }
    },
    [],
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const handleGetDataModalDetail = useCallback(
    (modal: ModalDashboardType, id: string, data: DataDetailModal) => {
      switch (modal) {
        case ModalDashboardType.NON_CONFORMITY: {
          dispatch(
            getCompanyOpenNonConformityByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }
        case ModalDashboardType.OBSERVATIONS: {
          dispatch(
            getCompanyOpenFindingObservationByVesselActions.request({
              id,
              handleSuccess: () => {
                setIsDetailModal(true);
              },
            }),
          );
          break;
        }

        default:
          break;
      }
      setDataDetailModal(data);
    },
    [dispatch, setIsDetailModal, setDataDetailModal],
  );

  const handleClickOnModalDouble = useCallback(
    (data) => {
      if (!isDetail) {
        switch (modalType) {
          case ModalDashboardType.NON_CONFORMITY: {
            handleGetDataModalDetail(
              modalType,
              data?.vesselId || data?.auditCompanyId,
              {
                vesselCode: data?.vesselCode,
                vesselName: data?.vesselName,
                auditCompanyName: data?.auditCompanyName || '',
                labelTotal: renderDynamicLabel(
                  dynamicLabels,
                  MAIN_DASHBOARD_DYNAMIC_FIELDS[
                    'Total non-conformity findings'
                  ],
                ),
              },
            );
            break;
          }
          case ModalDashboardType.OBSERVATIONS: {
            handleGetDataModalDetail(
              modalType,
              data?.vesselId || data?.auditCompanyId,
              {
                vesselCode: data?.vesselCode,
                vesselName: data?.vesselName,
                auditCompanyName: data?.auditCompanyName || '',
                labelTotal: renderDynamicLabel(
                  dynamicLabels,
                  MAIN_DASHBOARD_DYNAMIC_FIELDS['Total open observations'],
                ),
              },
            );
            break;
          }

          default:
            break;
        }
      } else {
        switch (modalType) {
          case ModalDashboardType.NON_CONFORMITY:
          case ModalDashboardType.OBSERVATIONS: {
            openNewPage(AppRouteConst.getInternalAuditReportById(data?.iarId));
            break;
          }
          default:
            break;
        }
      }
    },
    [dynamicLabels, handleGetDataModalDetail, isDetail, modalType],
  );

  const handleClickOnModal = useCallback(
    (data) => {
      switch (modalType) {
        case ModalDashboardType.NUMBER_INTERNAL_AUDIT_REPORT:
          return (
            data?.id &&
            openNewPage(AppRouteConst.getInternalAuditReportById(data?.id))
          );
        case ModalDashboardType.NUMBER_AUDIT_TIME_TABLE:
          return (
            data?.auditTimeTableId &&
            openNewPage(
              AppRouteConst.getAuditTimeTableById(data?.auditTimeTableId),
            )
          );
        default:
          break;
      }
      return null;
    },
    [modalType],
  );

  if (
    modalType === ModalDashboardType.NON_CONFORMITY ||
    modalType === ModalDashboardType.OBSERVATIONS
  ) {
    return (
      <ModalDoubleAGGrid
        isOpen
        dataSource={[...data]}
        toggle={() => {
          handleToggleModal();
          setDataDetailModal(null);
          setIsDetailModal(false);
        }}
        dataDetailModal={dataDetailModal}
        columns={columns}
        handleBack={() => setIsDetailModal(false)}
        isDetail={isDetail}
        subTitle={subTitle}
        handleClick={handleClickOnModalDouble}
        w={renderModalWidth(modalType)}
        title={title}
        titleClassName={styles.titleBold}
        aggridId={aggridId}
        moduleTemplate={moduleTemplate}
        fileName={fileName}
        hasVesselName={hasVesselName}
        companyNameTitle={renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Company name'],
        )}
        vesselNameTitle={renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel name'],
        )}
        dynamicLabels={dynamicLabels}
        // className={styles.customModalTable}
      />
    );
  }

  return (
    <ModalTableAGGrid
      scroll={{ x: 'max-content', y: 265 }}
      isOpen
      dataSource={[...data]}
      toggle={handleToggleModal}
      columns={columns}
      sort={sort}
      onSort={handleSort}
      handleClick={handleClickOnModal}
      w={renderModalWidth(modalType)}
      title={title}
      titleClasseName={styles.titleBold}
      aggridId={aggridId}
      fileName={fileName}
      moduleTemplate={moduleTemplate}
      setIsMultiColumnFilter={setIsMultiColumnFilter}
      className={styles.customModalTable}
    />
  );
};

export default OutStandingIssueModal;
