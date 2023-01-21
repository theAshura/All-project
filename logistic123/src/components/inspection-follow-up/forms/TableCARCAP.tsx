import { deleteCarApiRequest } from 'api/car.api';
import images from 'assets/images/images';
import cx from 'classnames';
import ModalCARCreation from 'components/car-creation/ModalCarCreation';
import NoDataImg from 'components/common/no-data/NoData';
import StatusBadge from 'components/common/status-badge/StatusBadge';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import { ButtonType } from 'components/ui/button/Button';
import { CAR_STATUS } from 'constants/car.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-follow-up.const';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action } from 'models/common.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useCallback, useState, useMemo } from 'react';
// import { useSelector } from 'react-redux';
import styles from './car-cap.module.scss';

export interface TableProps {
  disabled?: boolean;
  planningAndRequestId: string;
  handleGetList?: () => void;
  justCap?: boolean;
  rofId?: string;
  handleGetListCar?: () => void;
  listCar?: any;
  disabledAllDelete?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const TableCARCAP: FC<TableProps> = ({
  planningAndRequestId,
  disabled,
  handleGetList,
  justCap,
  rofId,
  listCar,
  handleGetListCar,
  disabledAllDelete,
  dynamicLabels,
}) => {
  // const { listUser } = useSelector((state) => state.user);
  // const { userInfo } = useSelector((state) => state.authenticate);

  const [modalCARVisible, setModalCARVisible] = useState(false);
  const [carId, setCarId] = useState(null);
  const [sNo, setSno] = useState(null);
  const [isEditCar, setEditCar] = useState(false);

  const rowLabels = [
    {
      id: 'action',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.Action,
      ),
      sort: false,
      minWidth: 100,
      width: '100',
    },
    {
      id: 'refNo',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['CAR S.No'],
      ),
      sort: false,
      minWidth: 100,
      width: '100',
    },
    !justCap && {
      id: 'actionRequest',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['CAR comment'],
      ),
      sort: true,
      minWidth: 200,
      width: '200',
    },
    !justCap && {
      id: 'carStatus',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['CAR status'],
      ),
      sort: true,
      minWidth: 200,
      width: '200',
    },
    justCap && {
      id: 'planAction',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.CAP,
      ),
      sort: true,
      minWidth: 200,
      width: '200',
    },
    justCap && {
      id: 'picCap',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['CAP PIC'],
      ),
      sort: true,
      minWidth: 200,
      width: '200',
    },
    justCap && {
      id: 'capStatus',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['CAP status'],
      ),
      sort: true,
      minWidth: 200,
      width: '200',
    },
    justCap && {
      id: 'rootCause',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Root cause'],
      ),
      sort: true,
      minWidth: 200,
      width: '200',
    },
    justCap && {
      id: 'preventiveAction',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Preventive action'],
      ),
      sort: true,
      minWidth: 200,
      width: '200',
    },
  ]?.filter((i) => !!i);

  const sanitizeData = useCallback(
    (data: any, index: any) => {
      if (justCap) {
        return {
          id: data?.id,
          refNo: index + 1 || '',
          planAction: data?.cap?.planAction || '',
          picCap: data?.cap?.picCap || '',
          capStatus: <StatusBadge name={data?.cap?.status || ''} />,
          rootCause: data?.cap?.rootCause || '',
          preventiveAction: data?.cap?.preventiveAction || '',
        };
      }
      return {
        id: data?.id,
        refNo: index + 1,
        actionRequest: data?.actionRequest,
        carStatus: <StatusBadge name={data.status} />,
      };
    },
    [justCap],
  );

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
  const listData = useMemo(() => {
    if (justCap) {
      return listCar?.filter((i) => !!i?.cap?.id);
    }
    return listCar;
  }, [justCap, listCar]);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (listData?.length <= 0) {
        return null;
      }
      return (
        <tbody>
          {listData?.map((item, index) => {
            const finalData = sanitizeData(item, index);
            const disableDelete = !!item?.cap?.id;

            const allowEdit =
              item.status !== CAR_STATUS.Closed &&
              item?.cARVerification?.status !== CAR_STATUS.Pending &&
              item?.cARVerification?.status !== CAR_STATUS.Holding;
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
                buttonType: ButtonType.Blue,
                action: ActionTypeEnum.UPDATE,
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
                disable: disabled || !allowEdit,
                cssClass: 'ms-1',
              },
              {
                img: images.icons.icRemove,
                function: () => handleDeleteCar(item.id),
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.REPORT_OF_FINDING,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                disable: disableDelete || disabled || disabledAllDelete,
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
                    key={(String(justCap) + index).toString()}
                    onClickRow={() => {}}
                  />
                )}
              </PermissionCheck>
            );
          })}
        </tbody>
      );
    },
    [
      listData,
      sanitizeData,
      disabled,
      disabledAllDelete,
      handleDeleteCar,
      justCap,
    ],
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
    <div
      className={styles.wrap}
      key={String(`${String(justCap)} car-cap table`)}
    >
      <div className={cx(styles.header)}>
        <div>
          {justCap
            ? renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                  'CAP (Corrective action plan)'
                ],
              )
            : renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                  'CAR (Corrective action request)'
                ],
              )}
        </div>
      </div>
      {listData.length ? (
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
        featurePage={Features.AUDIT_INSPECTION}
        subFeaturePage={SubFeatures.INSPECTION_FOLLOW_UP}
        isOpen={modalCARVisible}
        planningAndRequestId={planningAndRequestId}
        dynamicLabels={dynamicLabels}
        onClose={handleCloseModal}
        carId={carId}
        sNo={sNo}
        isEdit={isEditCar}
        capOnly={justCap}
        rofId={rofId}
      />
    </div>
  );
};

export default TableCARCAP;
