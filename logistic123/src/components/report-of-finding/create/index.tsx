import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { tz } from 'moment-timezone';
import Table, { ColumnsType } from 'antd/lib/table';
import { formatDateTimeDay } from 'helpers/utils.helper';
import LineStepCP, {
  Item,
  StepStatus,
} from 'components/common/step-line/lineStepCP';
import { createReportOfFindingActions } from 'store/report-of-finding/report-of-finding.action';
import images from 'assets/images/images';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import { GroupButton } from 'components/ui/button/GroupButton';
import Radio from 'components/ui/radio/Radio';
import { DataObj } from 'models/common.model';
import {
  getFillAuditCheckListByPlanningAndRequestActionsApi,
  getListNCPreviousAuditActionsApi,
} from 'api/report-of-finding.api';
import { getListCurrentFindingItemActionsApi } from 'api/internal-audit-report.api';
import { CreateReportOfFindingParams } from 'models/api/report-of-finding/report-of-finding.model';
import { toastError } from 'helpers/notification.helper';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import useEffectOnce from 'hoc/useEffectOnce';
import { ModalNCOfPreviousAudit } from '../forms/modal/ModalNCOfPreviousAudit';
import ReportOfFindingForm from '../forms/ReportOfFindingForm';
import CheckListModal from '../forms/modal/ModalCheckList';
import styles from './create.module.scss';

interface PreviousNCFindings {
  id: string;
  auditNumber: string;
  auditDate: string;
  auditName: string;
  findingComment: string;
  findingRemark: string;
  isVerify: boolean;
  isOpen: boolean;
}
export interface RowLabelType {
  title: string;
  dataIndex: string;
  width: number;
}

const rowLabels: RowLabelType[] = [
  {
    title: 'Name of vessel',
    width: 180,
    dataIndex: 'vesselName',
  },
  {
    title: 'Inspection type',
    dataIndex: 'auditTypes',
    width: 150,
  },
  {
    title: 'Inspector name',
    dataIndex: 'auditor',
    width: 150,
  },
  {
    title: 'Lead inspector name',
    dataIndex: 'leaderAuditor',
    width: 150,
  },
  {
    title: 'Inspection number',
    dataIndex: 'auditNumber',
    width: 150,
  },
  {
    title: 'Scheduler S.No.',
    dataIndex: 'schedulerNo',
    width: 150,
  },
];

export default function ShoreRankCreate() {
  const { t } = useTranslation([
    I18nNamespace.REPORT_OF_FINDING,
    I18nNamespace.COMMON,
  ]);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authenticate);
  const [currentStepStatus, setCurrentStepStatus] = useState<string>('');
  const [modalNC, setModalNC] = useState<boolean>(false);
  const [listCheckView, setListCheckView] = useState([]);
  const [checkListView, setCheckListView] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [dataHolder, setDataHolder] = useState<DataObj[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [checklistAttachments, setChecklistAttachment] = useState<string[]>([]);
  const [planSelected, setPlanSelected] = useState(undefined);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [listPreviousAudit, setListPreviousAudit] = useState<
    PreviousNCFindings[]
  >([]);
  // const
  const { listPlanningAndRequest } = useSelector(
    (state) => state.planningAndRequest,
  );

  const handleChange = useCallback(
    (checked: boolean, id: string) => {
      if (checked && selectedId !== id) {
        setSelectedId(id);
      } else {
        setSelectedId('');
      }
    },
    [selectedId],
  );

  const columns: ColumnsType = useMemo(() => {
    const columnList: ColumnsType = [
      {
        title: '',
        width: 60,
        fixed: 'left',
        dataIndex: 'id',
        render: (text) => (
          <div className={styles.checkboxWrapper}>
            <Radio
              value={text}
              checked={selectedId === text}
              onChange={(e) => {
                handleChange(e.target.checked, text);
              }}
            />
          </div>
        ),
      },
    ];
    rowLabels.forEach((item) => {
      columnList.push({
        title: item.title,
        width: item.width,
        dataIndex: item.dataIndex,
        key: item.dataIndex,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      });
    });
    return columnList;
  }, [selectedId, handleChange]);

  const listToView = useMemo(
    () =>
      dataHolder?.map((item) => ({
        id: item?.id,
        vesselName: item?.vessel?.name || '',
        auditTypes: item?.auditTypes?.map((item) => item.name).join(', '),
        auditor: item?.auditors?.map((el) => el.username).join(', '),
        leaderAuditor: item?.leadAuditor?.username,
        auditNumber: item?.auditNo,
        schedulerNo: item?.auditNo,
      })),
    [dataHolder],
  );

  const renderForm = useCallback(
    () => (
      <div className={cx(styles.container)}>
        <div className={cx(styles.header)}>
          <div className={cx(styles.title)}>Choose planning</div>
          <div className={cx(styles.search)}>
            <Input
              placeholder="Search"
              renderPrefix={
                <img
                  src={images.icons.menu.icSearchInActive}
                  alt="buttonReset"
                />
              }
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
              }}
              className={styles.searchInput}
            />
            <Button
              className={styles.btnSearch}
              buttonSize={ButtonSize.Medium}
              onClick={() => {}}
            >
              {t('buttons.search')}
            </Button>
          </div>
        </div>

        <div className={cx(styles.wrapperTable, 'mt-4')}>
          <Table
            columns={columns}
            className={cx(styles.tableWrapper)}
            dataSource={listToView}
            scroll={{ x: 800, y: 290 }}
            pagination={false}
            rowClassName={styles.rowWrapper}
          />
        </div>
      </div>
    ),
    [searchKeyword, t, columns, listToView],
  );

  const fillReportFinding = (data) =>
    data?.map((e) => ({
      ...e,
      auditTypeId: e?.auditTypeId,
      natureFindingId: e?.natureFindingId,
      isSignificant: e?.isSignificant || false,
    }));

  const renderFooter = () => (
    <>
      <GroupButton
        className={styles.GroupButton}
        handleCancel={() => setModal(false)}
        txButtonBetween={t('buttons.confirm')}
        txButtonLeft="Back"
        handleSubmit={() => {
          let planningAndRequestSelected = listPlanningAndRequest?.data?.find(
            (item) => item?.id === selectedId,
          );
          getListNCPreviousAuditActionsApi({
            vesselId: planningAndRequestSelected.vesselId,
            planningRequestId: planningAndRequestSelected.id,
            natureFinding: 'Non Conformity',
          }).then((value) => {
            const newListPrevious = value?.data?.map((el) => ({
              id: el?.id,
              auditNumber: el?.reportFindingForm?.planningRequest.refId,
              auditDate: formatDateTimeDay(
                new Date(
                  el?.reportFindingForm?.planningRequest?.auditTimeTable?.actualFrom,
                ),
              ),
              auditName: el?.auditChecklist?.name,
              findingComment: el?.findingComment,
              findingRemark: el?.findingRemark,
              isVerify: el?.isVerify,
              isOpen: el?.isOpen,
            }));
            setListPreviousAudit(newListPrevious);
          });

          getListCurrentFindingItemActionsApi({
            vesselId: planningAndRequestSelected.vesselId,
            planningRequestId: planningAndRequestSelected.id,
          })
            .then((e) => {
              planningAndRequestSelected = {
                ...planningAndRequestSelected,
                reportFindingItems:
                  e?.data?.length > 0 && fillReportFinding(e.data),
              };
              setPlanSelected(planningAndRequestSelected);
            })
            .catch((error) => toastError(error));

          getFillAuditCheckListByPlanningAndRequestActionsApi(
            planningAndRequestSelected?.id,
          ).then((result) => {
            const listCheckList = result?.data?.map((item) => ({
              id: item?.id,
              checklistNo: item?.auditChecklist?.code,
              checklistName: item?.auditChecklist?.name,
              auditType: item?.auditType?.name,
              auditTypeId: item?.auditTypeId,
            }));
            setListCheckView(listCheckList);
          });
          setModal(false);
          setPlanSelected(planningAndRequestSelected);
        }}
        txButtonRight={t('buttons.confirm')}
      />
    </>
  );

  const DEFAULT_ITEMS: Item[] = [
    {
      id: 'draft',
      name: t('statusPlan.txDraft'),
      status: StepStatus.INACTIVE,
    },
    {
      id: 'submitted',
      name: t('statusPlan.txSubmitted'),
      status: StepStatus.INACTIVE,
    },
    {
      id: 'reviewed',
      name: t('statusPlan.txReviewed'),
      status: StepStatus.INACTIVE,
    },
    {
      id: 'closeOut',
      name: t('statusPlan.txCloseOut'),
      status: StepStatus.INACTIVE,
    },
  ];
  const stepStatusItems = () => {
    const items: Item[] = DEFAULT_ITEMS;
    switch (currentStepStatus) {
      case 'submitted': {
        const newItems = items.map((i) => i);
        return newItems;
      }
      default:
        return items;
    }
  };

  const handleSaveDraft = useCallback(
    (formData) => {
      const timezone = tz.guess();
      const { reportFindingItems, officeComment } = formData;
      const previousNCFindingsAudit = listPreviousAudit?.map((item) => ({
        id: item?.id,
        isVerify: item?.isVerify,
        isOpen: item?.isOpen,
      }));
      const newItem = reportFindingItems?.map((item) => ({
        id: item?.id || undefined,
        natureFindingId: item?.natureFindingId,
        auditTypeId: item?.auditTypeId,
        isSignificant: item?.isSignificant,
        findingRemark: item?.findingRemark,
        findingComment: item?.findingComment,
        reference: item?.reference,
        mainCategoryId: item?.mainCategoryId,
        secondCategoryId: item?.secondCategoryId,
        viqId: item?.viqId,
        departmentId: item?.departmentId,
        findingAttachments: item?.attachments || [],
      }));
      const dataSaveDraft: CreateReportOfFindingParams = {
        planningRequestId: planSelected?.id,
        timezone,
        attachments: [],
        checklistAttachments,
        reportFindingItems: newItem,
        previousNCFindings: previousNCFindingsAudit,
        officeComment,
        isSubmit: false,
      };

      dispatch(createReportOfFindingActions.request(dataSaveDraft));
    },
    [listPreviousAudit, planSelected?.id, checklistAttachments, dispatch],
  );
  const onSubmit = useCallback(
    (formData) => {
      const timezone = tz.guess();
      const { reportFindingItems, officeComment } = formData;
      const previousNCFindingsAudit = listPreviousAudit?.map((item) => ({
        id: item?.id,
        isVerify: item?.isVerify,
        isOpen: item?.isOpen,
      }));
      const newItem = reportFindingItems?.map((item) => ({
        id: item?.id || undefined,
        natureFindingId: item?.natureFindingId,
        auditTypeId: item?.auditTypeId,
        isSignificant: item?.isSignificant,
        findingRemark: item?.findingRemark,
        findingComment: item?.findingComment,
        reference: item?.reference,
        mainCategoryId: item?.mainCategoryId,
        secondCategoryId: item?.secondCategoryId,
        viqId: item?.viqId,
        departmentId: item?.departmentId,
        findingAttachments: item?.findingAttachments || [],
      }));
      const dataSubmit: CreateReportOfFindingParams = {
        planningRequestId: planSelected?.id,
        timezone,
        attachments: [],
        checklistAttachments,
        reportFindingItems: newItem,
        previousNCFindings: previousNCFindingsAudit,
        officeComment,
        isSubmit: true,
      };

      dispatch(createReportOfFindingActions.request(dataSubmit));
    },
    [listPreviousAudit, planSelected?.id, checklistAttachments, dispatch],
  );

  const handleChooseTemplate = () => {
    setModalNC(true);
  };

  useEffect(() => {
    setCurrentStepStatus('submitted');
  }, []);

  useEffect(() => {
    setDataHolder(listPlanningAndRequest?.data);
  }, [listPlanningAndRequest]);

  useEffect(() => {
    if (!modal && !listPlanningAndRequest?.data?.length) {
      setDataHolder([]);
    }
  }, [modal, listPlanningAndRequest]);

  useEffectOnce(() => {
    dispatch(
      getListAuditTypeActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );
  });

  return (
    <div className={styles.createContainer}>
      <Container className={styles.headerContainer}>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.REPORT_OF_FINDING_CREATE} />
          <div className="d-flex justify-content-between">
            <div className={cx('fw-bold', styles.title)}>
              {t('txReportOfFinding')}
            </div>
            <div>
              <Button
                buttonType={ButtonType.Primary}
                className={cx('mt-auto', styles.button, styles.mr_20)}
                onClick={() => {
                  setModal(true);
                }}
                disabled={
                  listPlanningAndRequest?.data.length === 0 ||
                  !listPlanningAndRequest
                }
                disabledCss={
                  listPlanningAndRequest?.data.length === 0 ||
                  !listPlanningAndRequest
                }
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                Add planning
              </Button>
              <Button
                buttonType={ButtonType.Primary}
                className={cx(styles.chooseTemplate, styles.mr_20)}
                disabled={
                  listPlanningAndRequest?.data.length === 0 ||
                  !listPlanningAndRequest
                }
                disabledCss={
                  listPlanningAndRequest?.data.length === 0 ||
                  !listPlanningAndRequest
                }
                onClick={() => handleChooseTemplate()}
              >
                {t('NC of previous inspection')}
              </Button>
              <Button
                buttonType={ButtonType.Primary}
                className={styles.chooseTemplate}
                disabled={
                  listPlanningAndRequest?.data.length === 0 ||
                  !listPlanningAndRequest
                }
                disabledCss={
                  listPlanningAndRequest?.data.length === 0 ||
                  !listPlanningAndRequest
                }
                onClick={() => setCheckListView(true)}
              >
                {t('Checklist view')}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.lineStepStatus}>
          <LineStepCP items={stepStatusItems()} maxLength={650} />
        </div>
      </Container>
      <Container className={styles.formContainer}>
        <ReportOfFindingForm
          isEdit
          data={{ planningRequest: planSelected }}
          isCreate
          onSaveDraft={handleSaveDraft}
          onSubmit={onSubmit}
          onResetPlanning={setPlanSelected}
        />
      </Container>
      {modalNC && (
        <ModalNCOfPreviousAudit
          isEdit
          isShow={modalNC}
          data={listPreviousAudit}
          planingId={planSelected?.id}
          rofId=""
          setShow={(e) => setModalNC(e)}
        />
      )}
      <CheckListModal
        isEdit
        header="Checklist - list"
        bodyClassName={styles.modalBody}
        toggle={() => setCheckListView(!checkListView)}
        data={listCheckView}
        setCheckListView={(value) => setCheckListView(value)}
        attachments={checklistAttachments}
        handleAdd={(data) => {
          setChecklistAttachment(data?.attachments);
          setCheckListView(!checkListView);
        }}
        modal={checkListView}
      />

      {modal && (
        <ModalComponent
          isOpen={modal}
          toggle={() => {
            setModal(false);
          }}
          title="Choose planning"
          content={renderForm()}
          footer={renderFooter()}
        />
      )}
    </div>
  );
}
