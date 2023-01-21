import Tabs from 'antd/lib/tabs';
import Tooltip from 'antd/lib/tooltip';
import {
  getListStaticFindingItemActionsApi,
  getListStaticFindingItemManualActionsApi,
} from 'api/internal-audit-report.api';
import images from 'assets/images/images';
import cx from 'classnames';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import TableCp from 'components/common/table/TableCp';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import Input from 'components/ui/input/Input';
import {
  InternalAuditReportFormContext,
  ReportHeaderTopics,
} from 'contexts/internal-audit-report/IARFormContext';
import { formatDateNoTime } from 'helpers/date.helper';
import { toastError } from 'helpers/notification.helper';
import { Action } from 'models/common.model';
import moment from 'moment';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { useDispatch, useSelector } from 'react-redux';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import { v4 } from 'uuid';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from '../form.module.scss';
import '../form.scss';
import IHASList from './IHASList';
import ManuallyCreatedRecordTable from './ManuallyCreatedRecordTable';
import ModalEditHistoryAndStatus from './ModalEditHistoryAndStatus';

interface Props {
  isEdit: boolean;
  dynamicLabels?: IDynamicLabel;
}

export const HISTORY_TABS = {
  AUTO: 'Automation',
  MANUAL: 'Manual',
};

const InspectionHistoryAndStatus: FC<Props> = ({ isEdit, dynamicLabels }) => {
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [findingChecked, setFindingChecked] = useState<string>(null);
  const [isCreateFinding, setCreateFinding] = useState<boolean>(false);
  const [isEditFinding, setEditFinding] = useState<boolean>(false);
  const [modalHistoryAndStatusVisible, setModalHistoryAndStatusVisible] =
    useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>(HISTORY_TABS.AUTO);

  const dispatch = useDispatch();

  const {
    IHASListofItems,
    handleGetIHASComment,
    handleSetIHASComment,
    handleSetIHASListofItems,
    setTouched,
    IHASListofItemsManual,
    handleSetIHASListOfItemsManual,
  } = useContext(InternalAuditReportFormContext);
  const defaultValues = {
    fromDate: moment().startOf('month'),
    toDate: moment().endOf('month'),
  };
  const { watch, control } = useForm<FieldValues>({
    mode: 'onSubmit',
    defaultValues,
  });

  const fromDate = watch('fromDate');
  const toDate = watch('toDate');

  const allowEdit =
    internalAuditReportDetail?.status === InternalAuditReportStatus.DRAFT;

  const handleGetListFinding = useCallback(() => {
    if (fromDate && toDate && internalAuditReportDetail?.vesselId) {
      getListStaticFindingItemActionsApi({
        vesselId: internalAuditReportDetail?.vesselId,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      })
        .then((r) => {
          handleSetIHASListofItems(r?.data);
        })
        .catch((e) => toastError(`${e} while fetching List of Items`));
    }
  }, [
    fromDate,
    handleSetIHASListofItems,
    internalAuditReportDetail?.vesselId,
    toDate,
  ]);

  const handleGetListFindingManual = useCallback(() => {
    if (fromDate && toDate && internalAuditReportDetail?.id) {
      getListStaticFindingItemManualActionsApi({
        internalAuditReportId: internalAuditReportDetail?.id,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      })
        .then((r: any) => {
          handleSetIHASListOfItemsManual(r.data?.data);
        })
        .catch((e) => toastError(e?.message));
    }
  }, [
    fromDate,
    handleSetIHASListOfItemsManual,
    internalAuditReportDetail?.id,
    toDate,
  ]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (
        value.fromDate &&
        value.toDate &&
        internalAuditReportDetail?.vesselId
      ) {
        handleGetListFinding();
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, internalAuditReportDetail]);

  useEffect(() => {
    handleGetListFindingManual();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, internalAuditReportDetail?.vesselId]);

  useEffect(() => {
    dispatch(
      getListAuditTypeActions.request({
        pageSize: -1,
        status: 'active',
        companyId: userInfo?.mainCompanyId,
        // planningRequestId: internalAuditReportDetail?.planningRequestId,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalAuditReportDetail?.planningRequestId]);

  const columns = useMemo(
    () => [
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Action,
        ),
        dataIndex: 'action',
        key: 'action',
        width: 100,
        render: (text, record) => {
          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setFindingChecked(record);
                setModalHistoryAndStatusVisible(true);
              },
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
              action: ActionTypeEnum.UPDATE,
              buttonType: ButtonType.Blue,
              disable: false,
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setFindingChecked(record);
                setEditFinding(true);
                setModalHistoryAndStatusVisible(true);
              },
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
              action: ActionTypeEnum.UPDATE,
              disable: !allowEdit || !isEdit,
              cssClass: 'ms-1',
            },
          ];

          return (
            <div className={cx(styles.action, 'd-flex')}>
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Inspection date'],
        ),
        dataIndex: 'inspectionDate',
        key: 'inspectionDate',
        width: 170,
        // minWidth: 170,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
        ),
        dataIndex: 'auditType',
        key: 'auditType',
        width: 170,
        // minWidth: 170,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Total number of findings'],
        ),
        children: [
          {
            title: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS.Total,
            ),
            dataIndex: 'totalOfFinding',
            key: 'totalOfFinding',
            width: 80,
            minWidth: 80,
            className: cx(styles.primaryChild),
          },
          {
            title: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS.Open,
            ),
            dataIndex: 'openFinding',
            key: 'openFinding',
            width: 80,
            minWidth: 80,
            className: cx(styles.primaryChild),
          },
          {
            title: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS.Close,
            ),
            dataIndex: 'closeFinding',
            key: 'closeFinding',
            width: 80,
            minWidth: 80,
            // className: cx(styles.bRight),
          },
        ],
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Remark,
        ),
        dataIndex: 'remark',
        key: 'remark',
        width: 250,
        render: (text) => (
          <Tooltip
            placement="topLeft"
            destroyTooltipOnHide
            title={text}
            color="#3B9FF3"
          >
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
    ],
    [allowEdit, dynamicLabels, isEdit],
  );

  const dataItemList = useMemo(
    () =>
      IHASListofItems.map((i) => ({
        key: v4(),
        id: i?.id,
        inspectionDate: formatDateNoTime(i.inspectionDate),
        auditType: i?.auditType,
        auditTypeId: i.auditTypeId,
        openFinding: i.totalOpenItems,
        closeFinding: i.totalCloseItems,
        totalOfFinding: i.totalOpenItems,
        remark: i.statisticItemsRemark || '',
      })),
    [IHASListofItems],
  );

  const renderInspectionType = useMemo(() => {
    const iar = internalAuditReportDetail?.IARReportHeaders?.find(
      (i) => i.topic === ReportHeaderTopics.IHAS.toString(),
    );
    const listAuditTypes = [];

    iar?.auditTypes?.forEach((item) => {
      const auditFound = internalAuditReportDetail?.iarAuditTypes?.find(
        (i) => String(i.auditTypeId) === String(item),
      );
      if (auditFound) {
        listAuditTypes.push(auditFound?.auditTypeName);
      }
    });

    return listAuditTypes?.length
      ? listAuditTypes?.map((i) => (
          <div key={i} className={styles.inspectionType}>
            {i}
          </div>
        ))
      : null;
  }, [
    internalAuditReportDetail?.IARReportHeaders,
    internalAuditReportDetail?.iarAuditTypes,
  ]);

  const handleEditFindingItem = useCallback((findingItem, isEdit, isCreate) => {
    setFindingChecked(findingItem);
    setEditFinding(isEdit || false);
    setCreateFinding(isCreate || false);
    setModalHistoryAndStatusVisible(true);
  }, []);
  const onCloseModal = useCallback(() => {
    setFindingChecked(null);
    setEditFinding(false);
    setCreateFinding(false);
    setModalHistoryAndStatusVisible(false);
  }, []);

  const handleUpdateSuccess = useCallback(() => {
    if (currentTab === HISTORY_TABS.AUTO) {
      handleGetListFinding();
      return;
    }
    handleGetListFindingManual();
  }, [currentTab, handleGetListFinding, handleGetListFindingManual]);

  return useMemo(
    () => (
      <CollapseUI
        title={renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Inspection history and status'],
        )}
        badges={renderInspectionType}
        collapseClassName={styles.collapse}
        collapseHeaderClassName={styles.wrapCollapse}
        isOpen={isOpen}
        content={
          <div className={styles.formContainer}>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <p className={styles.titleForm}>
                {renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['i) List of items'],
                )}
              </p>
              <div className={cx('d-flex flex-row', styles.datePickerWrapper)}>
                <div
                  className={cx(
                    'd-flex flex-row align-items-center ',
                    styles.date,
                  )}
                >
                  <span>
                    {renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS.From,
                    )}
                  </span>
                  <DateTimePicker
                    wrapperClassName="w-100"
                    className="w-100"
                    control={control}
                    name="fromDate"
                    maxDate={toDate || undefined}
                    inputReadOnly
                  />
                </div>
                <div
                  className={cx(
                    'd-flex flex-row align-items-center',
                    styles.date,
                  )}
                >
                  <span>
                    {renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS.To,
                    )}
                  </span>
                  <DateTimePicker
                    wrapperClassName="w-100"
                    className="w-100"
                    control={control}
                    minDate={fromDate || moment()}
                    name="toDate"
                    inputReadOnly
                  />
                </div>
                {currentTab === HISTORY_TABS.MANUAL && (
                  <Button
                    disabled={!isEdit || !allowEdit}
                    disabledCss={!isEdit || !allowEdit}
                    onClick={() => {
                      setModalHistoryAndStatusVisible(true);
                      setCreateFinding(true);
                    }}
                    buttonSize={ButtonSize.Medium}
                    buttonType={ButtonType.Primary}
                    className={cx('mt-auto ', styles.button)}
                    renderSuffix={
                      <img
                        src={images.icons.icAddCircle}
                        alt="createNew"
                        className={styles.icAdd}
                      />
                    }
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS.Add,
                    )}
                  </Button>
                )}
              </div>
            </div>
            <Tabs
              defaultActiveKey={currentTab}
              onChange={(e) => setCurrentTab(e)}
            >
              <Tabs.TabPane
                tab={`${renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Auto-generated records'],
                )} (${IHASListofItems?.length || 0})`}
                key={HISTORY_TABS.AUTO}
              >
                {IHASListofItems?.length > 0 ? (
                  <IHASList dataSource={dataItemList} columns={columns} />
                ) : (
                  <TableCp
                    isHiddenAction
                    rowLabels={[]}
                    renderRow={() => {}}
                    loading={false}
                    isEmpty
                    classNameNodataWrapper={styles.dataWrapperEmpty}
                  />
                )}
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={`${renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Manually created records'],
                )} (${IHASListofItemsManual?.length || 0})`}
                key={HISTORY_TABS.MANUAL}
              >
                <ManuallyCreatedRecordTable
                  handleEditFindingItem={handleEditFindingItem}
                  isEdit={isEdit && allowEdit}
                />
              </Tabs.TabPane>
            </Tabs>
            <ModalEditHistoryAndStatus
              findingItemChecked={findingChecked}
              isOpen={modalHistoryAndStatusVisible}
              onClose={onCloseModal}
              isEdit={isEditFinding}
              isCreate={isCreateFinding}
              handleEditFindingItem={handleEditFindingItem}
              inspectionId={internalAuditReportDetail?.id}
              currentTab={currentTab}
              handleUpdateSuccess={handleUpdateSuccess}
              disabled={!isEdit || !allowEdit}
            />
            <div className={styles.comment}>
              <h6>
                {renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS.Comment,
                )}
              </h6>
              <Input
                disabled={!isEdit || !allowEdit}
                placeholder={
                  isEdit && allowEdit
                    ? renderDynamicLabel(
                        dynamicLabels,
                        INSPECTION_REPORT_FIELDS_DETAILS['Enter comment'],
                      )
                    : ''
                }
                value={handleGetIHASComment()}
                onChange={(e) => {
                  handleSetIHASComment(e.target.value);
                  setTouched(true);
                }}
              />
            </div>
          </div>
        }
        toggle={() => setIsOpen((prev) => !prev)}
      />
    ),
    [
      renderInspectionType,
      isOpen,
      control,
      toDate,
      fromDate,
      currentTab,
      isEdit,
      allowEdit,
      IHASListofItems?.length,
      dataItemList,
      columns,
      IHASListofItemsManual?.length,
      handleEditFindingItem,
      findingChecked,
      modalHistoryAndStatusVisible,
      onCloseModal,
      isEditFinding,
      isCreateFinding,
      internalAuditReportDetail?.id,
      handleUpdateSuccess,
      dynamicLabels,
      handleGetIHASComment,
      handleSetIHASComment,
      setTouched,
    ],
  );
};

export default InspectionHistoryAndStatus;
