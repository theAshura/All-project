import { FC, useState, useCallback, useEffect, useMemo } from 'react';
import { deleteCarApiRequest, getListCarApiRequest } from 'api/car.api';
import images from 'assets/images/images';
import cx from 'classnames';
import uniq from 'lodash/uniq';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import ModalCARCreation from 'components/car-creation/ModalCarCreation';
import StatusBadge from 'components/common/status-badge/StatusBadge';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { Action } from 'models/common.model';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { CAR_STATUS } from 'constants/car.const';
import {
  MODULE_TEMPLATE,
  DEFAULT_COL_DEF_TYPE_FLEX,
} from 'constants/components/ag-grid.const';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { checkAllStepPermission } from 'helpers/carCapFilter.helper';
import useWorkflowPermission from 'hoc/useWorkflowPermission';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { WorkFlowType } from 'constants/common.const';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { useSelector, useDispatch } from 'react-redux';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import styles from './car.module.scss';

export interface TableProps {
  disabled?: boolean;
  disabledDelete?: boolean;
  isEditCapOnly?: boolean;
  planningAndRequestId: string;
  handleGetList?: () => void;
  dynamicLabels?: IDynamicLabel;
}

const CarActionReqTable: FC<TableProps> = ({
  planningAndRequestId,
  disabled,
  disabledDelete,
  isEditCapOnly,
  handleGetList,
  dynamicLabels,
}) => {
  const dispatch = useDispatch();
  const { workFlowActiveUserPermission } = useSelector(
    (store) => store.workFlow,
  );

  const workflowCap = useWorkflowPermission(WorkFlowType.CAR_CAP);
  const [modalCARVisible, setModalCARVisible] = useState(false);
  const [listCar, setListCar] = useState([]);
  const [carId, setCarId] = useState(null);
  const [sNo, setSno] = useState(null);
  const [isEditCar, setEditCar] = useState(false);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const { ReportOfFindingDetail, loading } = useSelector(
    (state) => state.reportOfFinding,
  );

  const handleGetListCar = useCallback(() => {
    if (planningAndRequestId) {
      getListCarApiRequest({
        pageSize: -1,
        planningRequestId: planningAndRequestId,
      })
        .then((res) => {
          setListCar(res?.data?.data || []);
        })
        .catch((err) => toastError(err));
    }
  }, [planningAndRequestId]);

  useEffect(() => {
    handleGetListCar();
  }, [handleGetListCar]);

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

  const checkWorkflow = useCallback(
    (item, index) => {
      const disableDelete =
        item.carStatus !== CAR_STATUS.Open || isEditCapOnly || disabledDelete;
      const allowEdit = item.carStatus !== 'Closed';
      // have active step2 but don't have permission
      const disableAllSteps = checkAllStepPermission(
        workFlowActiveUserPermission,
        workflowCap,
        {
          cap: item?.cap,
          status: item?.carStatus,
        },
      );

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
          action: ActionTypeEnum.EXECUTE,
          buttonType: ButtonType.Blue,
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
          action: ActionTypeEnum.EXECUTE,
          disable: disabled || !allowEdit || disableAllSteps,
          cssClass: 'ms-1',
        },
        {
          img: images.icons.icRemove,
          function: () => handleDeleteCar(item.id),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.REPORT_OF_FINDING,
          action: ActionTypeEnum.EXECUTE,
          buttonType: ButtonType.Orange,
          disable: disableDelete || disabled,
          cssClass: 'ms-1',
        },
      ];
      return actions;
    },
    [
      disabled,
      disabledDelete,
      handleDeleteCar,
      isEditCapOnly,
      workflowCap,
      workFlowActiveUserPermission,
    ],
  );
  const dataTable = useMemo(
    () =>
      listCar?.map((data, index) => ({
        id: data?.id,
        refNo: index + 1,
        reference: data?.reportFindingItems?.length
          ? uniq(data?.reportFindingItems?.map((i) => i?.reference))?.join(';')
          : '',
        car: data.actionRequest,
        carStatus: data.status,
        capStatus: data?.cap?.status || 'Waiting',
        capTargetDate: `${data?.capTargetPeriod} ${String(
          data?.periodType,
        ).toLowerCase()}${data?.capTargetPeriod > 1 ? 's' : ''}`,
        cap: data?.cap,
      })) || [],
    [listCar],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data, rowIndex } = params;
          let actions = checkWorkflow(data, rowIndex);
          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'refNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['CAR S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'reference',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['CAR reference'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'car',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.CAR,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'carStatus',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['CAR status'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: (params) => {
          const { data } = params;
          return <StatusBadge name={data?.carStatus} />;
        },
      },
      {
        field: 'capStatus',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['CAP status'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: (params) => {
          const { data } = params;
          return <StatusBadge name={data?.capStatus} />;
        },
      },
      {
        field: 'capTargetDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['CAP target date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, checkWorkflow],
  );

  const getList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: MODULE_TEMPLATE.carActionReqTable,
      }),
    );
  }, [dispatch]);

  return (
    <div className={cx(styles.wrap, styles.wrapperContainer)}>
      <div className={cx(styles.header)}>
        <div>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
              'Corrective action request'
            ],
          )}
        </div>
        <Button
          disabled={
            disabled ||
            ReportOfFindingDetail?.reportFindingItems?.length === 0 ||
            isEditCapOnly ||
            ReportOfFindingDetail?.status !== 'Draft'
          }
          disabledCss={
            disabled ||
            ReportOfFindingDetail?.reportFindingItems?.length === 0 ||
            isEditCapOnly ||
            ReportOfFindingDetail?.status !== 'Draft'
          }
          onClick={() => {
            setModalCARVisible(true);
            setSno(listCar?.length + 1);
            setEditCar(true);
          }}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Primary}
          className={cx('mt-auto ', styles.button)}
          renderSuffix={
            <img
              src={images.icons.icAddCircle}
              alt="createNew"
              className={cx(styles.icButton)}
            />
          }
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Add)}
        </Button>
      </div>
      <AGGridModule
        loading={loading}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        pageSizeDefault={5}
        moduleTemplate={MODULE_TEMPLATE.carActionReqTable}
        fileName={renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Car action request table'],
        )}
        dataTable={dataTable}
        height="275px"
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        getList={getList}
        classNameHeader={styles.header}
        aggridId="ag-grid-table-2"
      />
      <ModalCARCreation
        featurePage={Features.AUDIT_INSPECTION}
        subFeaturePage={SubFeatures.REPORT_OF_FINDING}
        isOpen={modalCARVisible}
        planningAndRequestId={planningAndRequestId}
        onClose={handleCloseModal}
        carId={carId}
        sNo={sNo}
        isEdit={isEditCar}
        capOnly={isEditCapOnly}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default CarActionReqTable;
