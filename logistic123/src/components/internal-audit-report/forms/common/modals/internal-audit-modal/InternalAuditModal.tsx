/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  forwardRef,
  useState,
  useImperativeHandle,
  createRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { useSelector } from 'react-redux';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { GroupButton } from 'components/ui/button/GroupButton';
import { RowModalComponent } from 'components/common/modal-list/row/RowModalCp';
import {
  getListFindingItemsOfIAR,
  verifyIARItem,
  getListPreviousInternalAuditReportsActionsApi,
} from 'api/internal-audit-report.api';
import {
  FindingItemsOfIAR,
  PreviousInternalAuditReport,
} from 'models/api/internal-audit-report/internal-audit-report.model';
import {
  FindingStatus,
  InternalAuditReportFormContext,
} from 'contexts/internal-audit-report/IARFormContext';
import { IARVerificationStatus } from 'components/internal-audit-report/forms/safety-management-system-related';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { TOOLTIP_COLOR, CommonQuery } from 'constants/common.const';
import { useLocation } from 'react-router-dom';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import Tooltip from 'antd/lib/tooltip';
import cx from 'classnames';
import moment from 'moment';
import Checkbox from 'components/ui/checkbox/Checkbox';
import Input from 'components/ui/input/Input';
import images from 'assets/images/images';
import styles from 'components/internal-audit-report/forms/form.module.scss';
import 'components/internal-audit-report/forms/form.scss';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface InternalAuditModalData {
  isEdit: boolean;
  IAR: PreviousInternalAuditReport;
}

const verificationStatus = [
  {
    isVerify: true,
    name: IARVerificationStatus.VERIFIED,
    color: '#18BA92',
  },
  {
    isVerify: false,
    name: IARVerificationStatus.YET_TO_VERIFIED,
    color: '#F42829',
  },
];

const findingStatus = [
  { name: FindingStatus.OPENED, color: '#3B9FF3' },
  { name: FindingStatus.CLOSED, color: '#F76969' },
];

const InternalAuditModalComponent = forwardRef((_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [IAR, setIAR] = useState<PreviousInternalAuditReport>(undefined);
  const [findingItemList, setFindingItemList] = useState<FindingItemsOfIAR[]>(
    [],
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const toggle = () => {
    setVisible((prev) => !prev);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { handleSetListPreviousIAR } = useContext(
    InternalAuditReportFormContext,
  );
  const { search } = useLocation();
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });

  const checkedAll: boolean = useMemo(() => {
    let result = false;
    if (findingItemList.length === 0) return false;
    const unVerifiedItem = findingItemList.filter((i) => !i.isVerify);
    if (unVerifiedItem?.length === 0) {
      return false;
    }
    const lengthRow: number = unVerifiedItem?.length || 0;
    for (let i = 0; i < lengthRow; i += 1) {
      result = selectedIds.includes(unVerifiedItem[i].id);
      if (!result) return false;
    }

    return true;
  }, [findingItemList, selectedIds]);

  const close = () => {
    setIAR(undefined);
    setFindingItemList([]);
    setSelectedIds([]);
    setSubmitLoading(false);
    setLoading(false);
    toggle();
  };

  useImperativeHandle(ref, () => ({
    showInternalAuditModal: (data: InternalAuditModalData) => {
      setVisible(true);
      setIsEdit(data.isEdit);
      setLoading(true);
      setIAR(data.IAR);
      getListFindingItemsOfIAR({
        id: data.IAR?.internalAuditReport_id,
        pageSize: -1,
        status: 'active',
      })
        .then((r) => {
          setFindingItemList(r.data.data);
        })
        .catch((e) => {
          toastError(e);
        })
        .finally(() => setLoading(false));
      // call api to get finding items
    },
  }));

  const rowLabels = [
    {
      label: 'checkbox',
      id: 'checkbox',
      width: 50,
    },
    {
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Nature of findings'],
      ),
      id: 'natureOfFinding',
      width: 150,
    },
    {
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS.Findings,
      ),
      id: 'findings',
      width: 200,
    },
    {
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Verification status'],
      ),
      id: 'verificationStatus',
      width: 160,
    },
    {
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Verified in this visit'],
      ),
      id: 'verifiedInThisVisit',
      width: 150,
    },
    {
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Verified user'],
      ),
      id: 'verifiedUser',
      width: 120,
    },
    {
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Verified date'],
      ),
      id: 'verifiedDate',
      width: 140,
    },
    {
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Finding status'],
      ),
      id: 'findingStatus',
      width: 140,
    },
  ];

  const handleSelectAll = (checked: boolean) => {
    const rowId: string[] = findingItemList.map((item) => item.id);
    let status: boolean = false;
    const idsSelected: string[] = [...selectedIds];
    if (!checked) {
      const newDataSelected = idsSelected.filter(
        (item) => !rowId.includes(item),
      );
      setSelectedIds([...newDataSelected]);
    } else {
      rowId.forEach((id) => {
        status = idsSelected.includes(id);
        if (!status) {
          idsSelected.push(id);
        }
      });
      setSelectedIds([...idsSelected]);
    }
  };

  const handleChange = useCallback(
    (checked: boolean, id: string) => {
      if (checked && !selectedIds.includes(id)) {
        const newSelecteds = [...selectedIds];
        newSelecteds.push(id);
        setSelectedIds(newSelecteds);
      } else {
        const newState = selectedIds.filter((item) => item !== id);
        setSelectedIds(newState);
      }
    },
    [selectedIds],
  );

  const handleVerify = () => {
    if (selectedIds.length > 0) {
      setSubmitLoading(true);
      verifyIARItem({
        internalAuditReportId: IAR.internalAuditReport_id,
        iarItemIds: selectedIds,
        planningRequestId: internalAuditReportDetail?.planningRequestId,
      })
        .then((r) => {
          toastSuccess('You have verified successffully');
        })
        .catch((e) =>
          toastError(`An error occurred while verifying item: ${e}`),
        )
        .finally(() => {
          getListPreviousInternalAuditReportsActionsApi({
            id: internalAuditReportDetail?.id,
            page: 1,
            pageSize: -1,
          })
            .then((r) => handleSetListPreviousIAR(r?.data))
            .catch((e) => toastError(e))
            .finally(() => close());
        });
    }
  };

  const displayCheckBoxAll = useMemo(
    () => findingItemList.some((item) => item.isVerify === false),
    [findingItemList],
  );

  const sanitizeData = useCallback((item: FindingItemsOfIAR) => {
    const thisVerificationStatus = verificationStatus.find(
      (i) => i.isVerify === item?.isVerify,
    );
    const thisFindingStatus = findingStatus.find(
      (i) => i.name === item?.findingStatus,
    );
    const finalData = {
      natureOfFinding: item?.natureFinding?.name,
      findings: (
        <Tooltip
          placement="topLeft"
          title={item?.findingComment}
          color={TOOLTIP_COLOR}
        >
          <span className="limit-line-text">{item?.findingComment}</span>
        </Tooltip>
      ),
      verificationStatus: (
        <span style={{ color: thisVerificationStatus.color }}>
          {thisVerificationStatus.name}
        </span>
      ),
      verifiedInThisVisit:
        thisVerificationStatus.name === 'Verified' ? 'Yes' : '',
      verifiedUser: item?.verifiedUser?.username,
      verifiedDate: moment(item?.verifiedDate).isValid()
        ? moment.utc(item?.verifiedDate).format('DD/MM/YYYY')
        : null,
      findingStatus: (
        <span style={{ color: thisFindingStatus.color }}>
          {thisFindingStatus.name}
        </span>
      ),
    };
    return finalData;
  }, []);

  const renderRow = useCallback(
    (item: FindingItemsOfIAR) => {
      const finalData = sanitizeData(item);
      return (
        <RowModalComponent
          key={item?.id}
          id={item?.id}
          checked={item?.isVerify || selectedIds.includes(item?.id)}
          hideCheckBox={item?.isVerify}
          handleChecked={(checked) => {
            if (!submitLoading && !item?.isVerify && isEdit) {
              handleChange(checked, item?.id);
            }
          }}
          data={finalData}
        />
      );
    },
    [sanitizeData, selectedIds, submitLoading, isEdit, handleChange],
  );
  return (
    <Modal
      isOpen={visible}
      title="Verification"
      modalType={ModalType.NORMAL}
      w={1150}
      toggle={submitLoading ? null : close}
      content={
        <>
          {loading ? (
            <div className="d-flex justify-content-center">
              <img
                src={images.common.loading}
                className={styles.loading}
                alt="loading"
              />
            </div>
          ) : (
            <div className={styles.internalAuditModal}>
              <div className={cx(styles.container)}>
                <div className={styles.displayData}>
                  <Input
                    label={renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS['Inspection number'],
                    )}
                    readOnly
                    isRequired
                    value={IAR?.prAuditNo || ''}
                    className={styles.disabledInput}
                  />
                  <Input
                    label={renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
                    )}
                    readOnly
                    isRequired
                    value={IAR?.iarAuditTypes_auditTypeName || ''}
                    style={{ width: 462 }}
                    className={styles.disabledInput}
                  />
                </div>
                <div className={cx(styles.header)}>
                  <div className={cx(styles.title)}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS['List of findings'],
                    )}
                  </div>
                </div>
                {findingItemList?.length > 0 ? (
                  <div className={cx(styles.wrapperTable)}>
                    <table className={styles.tableHeader}>
                      <thead>
                        <tr>
                          {rowLabels?.map((item) => (
                            <th key={item.id} style={{ width: item.width }}>
                              {item.id === 'checkbox' ? (
                                displayCheckBoxAll ? (
                                  <Checkbox
                                    checked={checkedAll}
                                    onChange={(e) => {
                                      if (!submitLoading && isEdit) {
                                        handleSelectAll(e.target.checked);
                                      }
                                    }}
                                  />
                                ) : (
                                  <div style={{ width: 28 }} />
                                )
                              ) : (
                                item.label
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    </table>
                    <div className={styles.tableScroll}>
                      <table className={styles.table}>
                        <tbody className={cx(styles.wrapperBody)}>
                          <tr>
                            {rowLabels?.map((item) => (
                              <td key={item.id} style={{ width: item.width }} />
                            ))}
                          </tr>
                          {findingItemList?.map((item) => renderRow(item))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className={cx(styles.dataWrapperEmpty)}>
                    <img
                      src={images.icons.icNoData}
                      className={styles.noData}
                      alt="no data"
                    />
                  </div>
                )}
                {isEdit &&
                findingItemList?.filter((i) => !i.isVerify)?.length > 0 ? (
                  <div className={cx(styles.footer)}>
                    <GroupButton
                      className={styles.GroupButton}
                      handleCancel={toggle}
                      handleSubmit={handleVerify}
                      txButtonBetween={renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS.Verify,
                      )}
                      disable={submitLoading}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </>
      }
    />
  );
});

type ModalRef = {
  showInternalAuditModal: (data: InternalAuditModalData) => void;
};
const modalRef = createRef<ModalRef>();
export const InternalAuditModal = () => (
  <InternalAuditModalComponent ref={modalRef} />
);
export const showInternalAuditModal = (data: InternalAuditModalData) => {
  modalRef.current?.showInternalAuditModal(data);
};
