import { GridApi } from 'ag-grid-community';
import images from 'assets/images/images';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import cx from 'classnames';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import {
  DATA_SPACE,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { formatDateIso, formatDateLocalNoTime } from 'helpers/date.helper';
import { convertDataUserAssignment } from 'helpers/userAssignment.helper';
import { handleLongTextTable } from 'helpers/utils.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ActivePermission } from 'constants/common.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { clearTemplateDictionaryReducer } from 'store/template/template.action';
import { DatePicker } from 'antd/lib';
import moment from 'moment';
import SelectUI from 'components/ui/select/Select';
import {
  getSelfAssessmentDetailActions,
  getListSelfDeclarationActions,
  reOpenAllSelfDeclarationApprovedActions,
  getSelfAssessmentMatrixActions,
  updateSelfAssessmentActions,
  updateComplianceAndTargetDateActions,
} from '../store/action';
import {
  SELF_ASSESSMENT_TYPE_OPTIONS,
  SELF_DECLARATION_STATUS,
} from '../utils/constant';
import ModalAssignment from '../modals/Assignment';
import { SelfDeclarationDetailResponse } from '../utils/model';
import styles from './declaration.module.scss';
import './declaration.scss';

interface FormDeclarationProps {
  screen?: 'detail' | 'edit' | 'create';
}

const FormDeclaration = ({ screen }: FormDeclarationProps) => {
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { listSelfDeclaration, loading, selfAssessmentDetail } = useSelector(
    (state) => state.selfAssessment,
  );

  const { search } = useLocation();

  const { userInfo } = useSelector((state) => state.authenticate);
  const [gridApi, setGridApi] = useState<GridApi>(null);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [modalAssignMentVisible, openModalAssignment] =
    useState<boolean>(false);
  const viewDetail = useCallback(
    (selfDeclarationId?: string) => {
      const win = window.open(
        `${AppRouteConst.getSelfAssessmentDeclarationById(
          selfDeclarationId,
        )}?selfAssessmentId=${id}`,
        '_blank',
      );
      win.focus();
    },
    [id],
  );

  const editDetail = useCallback(
    (selfDeclarationId?: string) => {
      const win = window.open(
        `${AppRouteConst.getSelfAssessmentDeclarationById(
          selfDeclarationId,
        )}?selfAssessmentId=${id}&edit=true`,
        '_blank',
      );
      win.focus();
    },
    [id],
  );

  const reviewerAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.REVIEWER,
        selfAssessmentDetail?.userAssignments,
      ),
    [selfAssessmentDetail?.userAssignments, userInfo?.id],
  );

  const inEditMode = useMemo(() => search.includes('edit'), [search]);

  const editableFields = useCallback(
    (item: SelfDeclarationDetailResponse, editInRow?: boolean) => {
      if (selfAssessmentDetail?.type === 'Review Prep') {
        return false;
      }

      const editCasePending =
        item?.status === 'Pending' &&
        userInfo?.id === selfAssessmentDetail?.createdUserId;

      const editCaseSubmitted =
        item?.status === 'Submitted' &&
        reviewerAssignmentPermission &&
        !editInRow;
      const editCaseReassigned =
        item?.status === 'Reassigned' &&
        userInfo?.id === selfAssessmentDetail?.createdUserId;
      if (
        (editCasePending || editCaseSubmitted || editCaseReassigned) &&
        inEditMode
      ) {
        return true;
      }
      return false;
    },
    [
      inEditMode,
      reviewerAssignmentPermission,
      selfAssessmentDetail?.createdUserId,
      selfAssessmentDetail?.type,
      userInfo?.id,
    ],
  );

  const checkWorkflow = useCallback(
    (item: SelfDeclarationDetailResponse): Action[] => {
      let actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SELF_ASSESSMENT,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
      ];
      const editAction = {
        img: images.icons.icEdit,
        function: () => editDetail(item?.id),
        feature: Features.QUALITY_ASSURANCE,
        subFeature: SubFeatures.SELF_ASSESSMENT,
        action: ActionTypeEnum.EXECUTE,
        cssClass: 'me-1',
      };
      if (editableFields(item, false)) {
        actions = [...actions, editAction];
      }
      return actions;
    },
    [editDetail, editableFields, viewDetail],
  );

  const dataUserAssignmentConvert = useMemo(
    () => convertDataUserAssignment(selfAssessmentDetail?.userAssignments),
    [selfAssessmentDetail?.userAssignments],
  );

  const dataTable = useMemo(() => {
    if (!listSelfDeclaration?.data) {
      return [];
    }
    return listSelfDeclaration?.data?.map((data) => ({
      id: data?.id || DATA_SPACE,
      reopen: '' || DATA_SPACE,
      standard: data?.elementMaster?.standardMaster?.code || DATA_SPACE,
      elementCode: data?.elementMaster?.code || DATA_SPACE,
      elementName: data?.elementMaster?.name || DATA_SPACE,
      elementNumber: data?.elementMaster?.number || DATA_SPACE,
      stage: handleLongTextTable(data?.elementMaster?.stage) || DATA_SPACE,
      questionNumber: data?.elementMaster?.questionNumber || DATA_SPACE,
      elementStageQ: data?.elementMaster?.elementStageQ || DATA_SPACE,
      keyPerformanceIndicator:
        handleLongTextTable(data?.elementMaster?.keyPerformanceIndicator) ||
        DATA_SPACE,
      bestPracticeGuidance:
        handleLongTextTable(data?.elementMaster?.bestPracticeGuidance) ||
        DATA_SPACE,
      compliance: data?.compliance?.answer || DATA_SPACE,
      companyCommentInternal:
        handleLongTextTable(data?.newestInternalComment) || DATA_SPACE,
      companyCommentExternal:
        handleLongTextTable(data?.newestExternalComment) || DATA_SPACE,
      selfClose: data?.selfClose ? 'Yes' : 'No' || DATA_SPACE,
      targetCompletionDate:
        formatDateLocalNoTime(data?.targetCompletionDate) || DATA_SPACE,
      status: data?.status || DATA_SPACE,
      selfDeclarationHistories: data?.selfDeclarationHistories,
      selfAssessment: data?.selfAssessment,
      complianceAnswers: data?.elementMaster?.standardMaster?.complianceAnswers,
      complianceId: data?.complianceId,
    }));
  }, [listSelfDeclaration?.data]);

  const columnDefs = useCallback(
    (dataTable) => [
      {
        field: 'action',
        headerName: t('table.action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;

          let actions = checkWorkflow(data);
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
        field: 'reopen',
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        width: 125,
        headerName: t('table.reopen'),
        checkboxSelection: (rowNode) => {
          const { data } = rowNode;
          const isNotReview =
            selfAssessmentDetail?.type !==
              SELF_ASSESSMENT_TYPE_OPTIONS[2].value && inEditMode;

          const reviewerPermission = checkAssignmentPermission(
            userInfo?.id,
            ActivePermission.REVIEWER,
            data?.selfAssessment?.userAssignments,
          );
          const publisherPermission = checkAssignmentPermission(
            userInfo?.id,
            ActivePermission.PUBLISHER,
            data?.selfAssessment?.userAssignments,
          );

          if (
            data?.status === SELF_DECLARATION_STATUS.approved &&
            (reviewerPermission || publisherPermission)
          ) {
            const selfDeclarationHistories =
              data?.selfDeclarationHistories || [];
            const isCurrentStatus = selfDeclarationHistories.some(
              (value) => value.id === userInfo?.id,
            );
            if (!isCurrentStatus && isNotReview) {
              return true;
            }
          }

          return false;
        },
        suppressRowClickSelection: true,
      },
      {
        field: 'standard',
        headerName: t('table.standard'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'elementCode',
        headerName: t('table.elementCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'elementName',
        headerName: t('table.elementName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'elementNumber',
        headerName: t('table.elementNumber'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'stage',
        headerName: t('table.stage'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'questionNumber',
        headerName: t('table.questionNumber'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'elementStageQ',
        headerName: t('table.elementStageQ'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'keyPerformanceIndicator',
        headerName: t('table.keyPerformanceIndicator'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'bestPracticeGuidance',
        headerName: t('table.bestPracticeGuidance'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'compliance',
        headerName: t('table.compliance'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        editable: ({ data }) => editableFields(data, true),
        cellEditor: 'agSelectCellEditor',
        popup: true,
        cellRendererFramework: ({ data }) => (
          <SelectUI
            data={data?.complianceAnswers?.map((i) => ({
              label: i?.answer,
              value: i?.id,
            }))}
            value={data?.compliance}
            transparentSelect
            onChange={(e) => {
              dispatch(
                updateComplianceAndTargetDateActions.request({
                  selfAssessmentId: id,
                  selfDeclaration: data?.id,
                  complianceId: String(e),
                }),
              );
            }}
            className={styles.complianceSelection}
            disabled={!editableFields(data, true)}
            selectRowClassName="selectRowClassName"
          />
        ),
      },
      {
        field: 'companyCommentInternal',
        width: 225,
        headerName: t('table.companyCommentInternal'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'companyCommentExternal',
        headerName: t('table.companyCommentExternal'),
        width: 225,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'selfClose',
        headerName: t('table.selfClose'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'targetCompletionDate',
        headerName: t('table.targetCompletionDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        editable: ({ data }) => editableFields(data, true),
        popup: true,
        cellRendererFramework: ({ data }) => (
          <DatePicker
            defaultValue={
              moment(data?.targetCompletionDate, 'DD/MM/YYYY').isValid()
                ? moment(data?.targetCompletionDate, 'DD-MM-YYYY')
                : undefined
            }
            name="targetCompletionDate"
            bordered={false}
            format="DD-MM-YYYY"
            onChange={(e) => {
              dispatch(
                updateComplianceAndTargetDateActions.request({
                  selfAssessmentId: id,
                  selfDeclaration: data?.id,
                  targetCompletionDate: formatDateIso(e),
                }),
              );
            }}
            disabled={!editableFields(data, true)}
          />
        ),
      },
      {
        field: 'status',
        headerName: t('table.progressStatus'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [
      checkWorkflow,
      dispatch,
      editableFields,
      id,
      inEditMode,
      isMultiColumnFilter,
      selfAssessmentDetail?.type,
      t,
      userInfo?.id,
    ],
  );

  const handleGetListSelfDeclaration = useCallback(
    (param?: CommonApiParam) => {
      if (id) {
        dispatch(
          getListSelfDeclarationActions.request({
            selfAssessmentId: id,
            params: { pageSize: -1 },
            handleSuccess: () => param?.handleSuccess?.(),
          }),
        );
      }
    },
    [dispatch, id],
  );

  const handleRefresh = useCallback(() => {
    if (id) {
      handleGetListSelfDeclaration();
      dispatch(getSelfAssessmentDetailActions.request(id));
      dispatch(
        getSelfAssessmentMatrixActions.request({
          selfAssessmentId: id,
        }),
      );
    }
  }, [dispatch, handleGetListSelfDeclaration, id]);

  const getSelectedRowData = useCallback(() => {
    const selectedNodes = gridApi?.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  }, [gridApi]);

  const handleReopenAll = useCallback(() => {
    const data = getSelectedRowData();
    const dataIds = data.map((item) => item.id);
    if (dataIds.length) {
      dispatch(
        reOpenAllSelfDeclarationApprovedActions.request({
          selfAssessmentId: id,
          selfDeclarationIds: dataIds,
          handleSuccess: () => {
            handleGetListSelfDeclaration();
          },
        }),
      );
    }
  }, [dispatch, getSelectedRowData, handleGetListSelfDeclaration, id]);

  useEffect(
    () => () => {
      dispatch(clearTemplateDictionaryReducer());
      dispatch(
        getListSelfDeclarationActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
    },
    [dispatch],
  );

  const hiddenBtnAssignment = useMemo(
    () => listSelfDeclaration?.data?.some((item) => item.status !== 'Approved'),
    [listSelfDeclaration?.data],
  );

  const dataUserAssignmentBody = useCallback(
    (value) => {
      const currentReviewer =
        dataUserAssignmentConvert?.find(
          (item) => item?.permission === ActivePermission.REVIEWER,
        )?.userIds || [];
      const currentCreator =
        dataUserAssignmentConvert?.find(
          (item) => item?.permission === ActivePermission.CREATOR,
        )?.userIds || [];

      const userAssignment = [
        {
          permission: ActivePermission.PUBLISHER,
          userIds: value?.publisher?.map((item) => item?.id) || [],
        },
        {
          permission: ActivePermission.REVIEWER,
          userIds: currentReviewer,
        },
        {
          permission: ActivePermission.CREATOR,
          userIds: currentCreator,
        },
      ]?.filter((item) => item?.userIds?.length);
      return userAssignment;
    },
    [dataUserAssignmentConvert],
  );

  const updateSelfAssessment = useCallback(
    (values) => {
      const { input, ...other } = values;

      const dataUser = dataUserAssignmentBody(other);
      dispatch(
        updateSelfAssessmentActions.request({
          id,
          data: {
            userAssignment: {
              usersPermissions: dataUser,
            },
          },
        }),
      );
    },
    [dataUserAssignmentBody, dispatch, id],
  );

  return (
    <div className={styles.wrapperContainer}>
      <div className={cx(styles.labelForm)}>
        <span className={cx('fw-bold', styles.titleForm)}>
          {t('selfDeclaration')}
        </span>

        <div>
          <Button
            className={styles.buttonAdd}
            buttonSize={ButtonSize.Medium}
            onClick={handleRefresh}
            renderSuffix={
              <img
                src={images.icons.icRefresh}
                alt="createNew"
                className={styles.icButton}
              />
            }
            disabled={loading || !id}
            disabledCss={loading || !id}
          >
            {t('button.refresh')}
          </Button>
          {!hiddenBtnAssignment && reviewerAssignmentPermission && (
            <Button
              className={cx('ms-1', styles.buttonAdd)}
              buttonSize={ButtonSize.Medium}
              buttonType={ButtonType.Outline}
              onClick={() => openModalAssignment(true)}
              disabled={loading || !id || screen === 'detail'}
              disabledCss={loading || !id || screen === 'detail'}
            >
              {t('button.assignUser')}
            </Button>
          )}

          <Button
            className={cx('ms-1', styles.buttonAdd)}
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Outline}
            onClick={handleReopenAll}
            disabled={loading || !id || screen === 'detail'}
            disabledCss={loading || !id || screen === 'detail'}
          >
            {t('button.reopenAllApprovedQuestion')}
          </Button>
        </div>
      </div>

      <ModalAssignment
        initialData={dataUserAssignmentConvert}
        isOpen={modalAssignMentVisible}
        userAssignmentDetails={selfAssessmentDetail?.userAssignments}
        onClose={() => openModalAssignment(false)}
        onConfirm={(values) => {
          updateSelfAssessment(values);
          openModalAssignment(false);
        }}
      />

      <AGGridModule
        loading={false}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs(dataTable)}
        rowSelection="multiple"
        dataFilter={null}
        moduleTemplate={`${MODULE_TEMPLATE.selfDeclarationTemplate}__${id}`}
        fileName="Self-assessment_Self-declaration"
        dataTable={dataTable}
        height="calc(100vh - 269px)"
        // view={(params) => {
        //   viewDetail(params);
        //   return true;
        // }}
        exposeGridApi={setGridApi}
        getList={handleGetListSelfDeclaration}
        // onRowSelected={(rowNode) => {
        //   if (screen === 'detail') {
        //     rowNode.node.setSelected(false);
        //   }
        // }}
        // isRowSelectable={checkAllowReopen}
      />
    </div>
  );
};

export default FormDeclaration;
