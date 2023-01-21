import { deleteCarApiRequest, getListCarApiRequest } from 'api/car.api';
import images from 'assets/images/images';
import ModalCARCreation from 'components/car-creation/ModalCarCreation';
import NoDataImg from 'components/common/no-data/NoData';
import StatusBadge from 'components/common/status-badge/StatusBadge';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import { ButtonType } from 'components/ui/button/Button';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { canCurrentUserEditCarCap } from 'helpers/carCapFilter.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { populateStatus } from 'helpers/utils.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action } from 'models/common.model';
import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { CAR_STATUS } from 'constants/car.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { useSelector } from 'react-redux';
import { WorkFlowType } from 'constants/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import useWorkflowPermission from 'hoc/useWorkflowPermission';
import { InternalAuditReportFormContext } from '../../../../contexts/internal-audit-report/IARFormContext';
import styles from './car-cap.module.scss';

export interface TableProps {
  disabled?: boolean;
  handleGetList?: () => void;
  dynamicLabels?: IDynamicLabel;
}

const CarCapDetail: FC<TableProps> = ({
  disabled,
  handleGetList,
  dynamicLabels,
}) => {
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { setListCarCap } = useContext(InternalAuditReportFormContext);

  const [modalCARVisible, setModalCARVisible] = useState(false);
  const [listCar, setListCar] = useState([]);
  const [carId, setCarId] = useState(null);
  const [sNo, setSno] = useState(null);
  const [isEditCar, setEditCar] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const planningAndRequestId = useMemo(
    () => internalAuditReportDetail?.planningRequestId,
    [internalAuditReportDetail?.planningRequestId],
  );
  const rofId = useMemo(
    () => internalAuditReportDetail?.reportFindingFormId,
    [internalAuditReportDetail?.reportFindingFormId],
  );

  const workflow = useWorkflowPermission(WorkFlowType.CAR_CAP);

  const rowLabels = [
    {
      id: 'action',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS.Action,
      ),
      sort: false,
      minWidth: 100,
      width: '100',
    },
    {
      id: 'car',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS.CAR,
      ),
      sort: true,
      minWidth: 100,
      width: '100',
    },
    {
      id: 'carStatus',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['CAR status'],
      ),
      sort: true,
      minWidth: 300,
    },
    {
      id: 'cap',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS.CAP,
      ),
      sort: true,
      minWidth: 300,
    },
    {
      id: 'capStatus',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['CAP status'],
      ),
      sort: true,
      minWidth: 300,
    },
    {
      id: 'verifyStatus',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Verification status'],
      ),
      sort: true,
    },
  ];

  const handleGetListCar = useCallback(() => {
    if (planningAndRequestId) {
      getListCarApiRequest({
        pageSize: -1,
        planningRequestId: planningAndRequestId,
      })
        .then((res) => {
          setListCar(res?.data?.data || []);
          setListCarCap(res?.data?.data || []);
        })
        .catch((err) => toastError(err));
    }
  }, [planningAndRequestId, setListCarCap]);

  useEffectOnce(() => {
    handleGetListCar();
  });

  const sanitizeData = (data) => {
    const finalData = {
      id: data?.id,
      car: data?.actionRequest || '',
      carStatus: <StatusBadge name={data.status} />,
      cap: data?.cap?.planAction || '',
      capStatus: <StatusBadge name={data?.cap?.status || 'Waiting'} />,
      verifyStatus: data?.cARVerification?.status ? (
        <StatusBadge name={populateStatus(data?.cARVerification?.status)} />
      ) : (
        ''
      ),
    };
    return finalData;
  };

  const handleDeleteCar = useCallback(
    (id) => {
      deleteCarApiRequest(id)
        .then((res) => {
          toastSuccess('Delete CAR successfully');
          handleGetListCar();
        })
        .catch((err) => toastError(err));
    },
    [handleGetListCar],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (listCar?.length <= 0) {
        return null;
      }
      return (
        <tbody>
          {listCar?.map((item, index) => {
            const finalData = sanitizeData(item);
            const disableDelete = true;
            const allowEdit =
              item.status !== CAR_STATUS.Closed &&
              item?.cARVerification?.status !== CAR_STATUS.Pending &&
              item?.cARVerification?.status !== CAR_STATUS.Holding;
            const checkEditByStatus = canCurrentUserEditCarCap(
              workflow || [],
              item?.cap?.status || CAR_STATUS.Open,
            );

            const verificationEdit = () => {
              if (allowEdit && checkEditByStatus) {
                return true;
              }
              return false;
            };

            const actions: Action[] = [
              {
                img: images.icons.icViewDetail,
                function: () => {
                  setModalCARVisible(true);
                  setCarId(item.id);
                  setSno(index + 1);
                },
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.REPORT_OF_FINDING,
                action: ActionTypeEnum.UPDATE,
                buttonType: ButtonType.Blue,
                disable: disabled,
              },
              {
                img: images.icons.icEdit,
                function: () => {
                  setModalCARVisible(true);
                  setCarId(item.id);
                  setSno(index + 1);
                  setEditCar(true);
                },
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.REPORT_OF_FINDING,
                action: ActionTypeEnum.UPDATE,
                disable: disabled || !verificationEdit(),
                cssClass: 'ms-1',
              },
              {
                img: images.icons.icRemove,
                function: () => handleDeleteCar(item.id),
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.REPORT_OF_FINDING,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                disable: disableDelete || disabled,
                cssClass: 'ms-1',
              },
            ];

            return (
              <PermissionCheck
                options={{
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.REPORT_OF_FINDING,
                  action: ActionTypeEnum.UPDATE,
                }}
                key={String(JSON.stringify(item) + index)}
              >
                {({ hasPermission }) => (
                  <RowComponent
                    isScrollable={isScrollable}
                    data={finalData}
                    actionList={actions}
                    validWordFlow
                    onClickRow={() => {}}
                  />
                )}
              </PermissionCheck>
            );
          })}
        </tbody>
      );
    },
    [listCar, workflow, disabled, handleDeleteCar],
  );

  const handleCloseModal = useCallback(
    (isReGetDetail?: boolean) => {
      setModalCARVisible(false);
      handleGetListCar();
      setEditCar(false);
      setCarId(null);
      setSno(1);
      if (handleGetList && isReGetDetail) {
        handleGetList();
      }
    },
    [handleGetList, handleGetListCar],
  );

  return (
    <CollapseUI
      title={renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['CAR/CAP details'],
      )}
      collapseClassName={styles.collapse}
      isOpen={isOpen}
      content={
        <>
          <div className={styles.wrap}>
            {listCar.length ? (
              <TableCp
                rowLabels={rowLabels}
                renderRow={renderRow}
                loading={false}
                isEmpty={undefined}
              />
            ) : (
              <NoDataImg />
            )}
            <ModalCARCreation
              dynamicLabels={dynamicLabels}
              featurePage={Features.AUDIT_INSPECTION}
              subFeaturePage={SubFeatures.INTERNAL_AUDIT_REPORT}
              isOpen={modalCARVisible}
              planningAndRequestId={planningAndRequestId}
              onClose={handleCloseModal}
              carId={carId}
              sNo={sNo}
              isEdit={isEditCar}
              rofId={rofId}
            />
          </div>
        </>
      }
      toggle={() => setIsOpen((prev) => !prev)}
    />
  );
};

export default CarCapDetail;
