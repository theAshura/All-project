/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import isEmpty from 'lodash/isEmpty';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { Item, StepStatus } from 'components/common/step-line/lineStepInfoCP';
import cx from 'classnames';
import moment from 'moment-timezone';
import history from 'helpers/history.helper';
import { v4 } from 'uuid';
import Button from 'components/ui/button/Button';
import { useLocation } from 'react-router';
import {
  clearCreatedAuditCheckListAction,
  clearErrorMessages,
  createGeneralInfoAction,
  refreshChecklistDetailAction,
  getListQuestionAction,
  createQuestionAction,
  submitAuditCheckListAction,
  updateQuestionAction,
  checkIsCreatedInitialData,
  clearAuditCheckListDetail,
  getListROFFromIARAction,
} from 'store/audit-checklist/audit-checklist.action';
import {
  getGeneralInfoDetailApi,
  getListAuditCheckListApi,
} from 'api/audit-checklist.api';
import { MasterDataId } from 'constants/common.const';
import { toastError } from 'helpers/notification.helper';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import {
  CreateGeneralInfoBody,
  GetGeneralInfoDetailResponse,
  AuditCheckList,
} from 'models/api/audit-checklist/audit-checklist.model';
import { OptionProps } from 'components/ui/async-select/NewAsyncSelect';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import images from 'assets/images/images';
import styles from './create.module.scss';
import PreviewModal from '../common/preview-modal/PreviewModal';
import ModalSelect from '../../common/modal-select/ModalSelect';
import { OptionsProps } from '../../common/modal-select/select/ListOption';
import GeneralInfoForm, {
  GeneralInfoFormModel,
} from '../forms/AuditCheckListGeneralInfoForm';
import HeaderButtons, {
  HeaderBtn,
  HeaderBtnType,
} from '../common/header-buttons/HeaderButtons';
import { useFormHelper } from '../common/form-helper/useFormHelper';
import QuestionListForm, {
  AnswerOptionModel,
  HasRemarkType,
} from '../forms/AuditCheckListQuestionListForm';
import PopoverStatus from '../common/popover-status/PopoverStatus';

export const GENERAL_INFORMATION = 'generalInfo';
export const QUESTION_LIST = 'questionList';

export default function AuditChecklistCreateContainer() {
  const { createdAuditCheckList, listQuestion, auditCheckListDetail } =
    useSelector((store) => store.auditCheckList);
  const { userInfo } = useSelector((state) => state.authenticate);

  const [currentActiveTab, setCurrentActiveTab] =
    useState<string>(GENERAL_INFORMATION);
  const [previewModal, setPreviewModal] = useState<boolean>(false);
  const dispatch = useDispatch();
  const formHelper = useFormHelper();
  const [listACApproved, setListACApproved] = useState<AuditCheckList[]>([]);
  const [isTemplateChosen, setIsTemplateChosen] = useState<boolean>(false);
  const [generalInfoDetail, setGeneralInfoDetail] =
    useState<GetGeneralInfoDetailResponse>();
  const [generalLoading, setGeneralLoading] = useState<boolean>(false);
  const { search } = useLocation();
  const [isOpenChooseTemplate, setIsOpenChooseTemplate] = useState(false);
  const [questionProgress, setQuestionProgress] = useState<any>();
  const [isMultiQuestion, setIsMultiQuestion] = useState(false);
  const [aOptions, setAOptions] = useState<
    (AnswerOptionModel & { hasRemark?: boolean })[]
  >([
    { id: v4(), value: '', hasRemark: false, idValue: '', name: '' },
    { id: v4(), value: '', hasRemark: false, idValue: '', name: '' },
  ]);

  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
    modulePage: ModulePage.Create,
  });

  const setAnswerOptions = (
    data: (AnswerOptionModel & { hasRemark: boolean })[],
  ) => {
    setAOptions(data);
  };

  useEffect(() => {
    if (search && !createdAuditCheckList) {
      const generalInfoId = search.substring(1);
      dispatch(
        getListQuestionAction.request({
          companyId: userInfo?.mainCompanyId,
          id: generalInfoId,
          body: { page: 1, pageSize: -1 },
        }),
      );

      dispatch(refreshChecklistDetailAction.request(generalInfoId));
    }
  }, [search, createdAuditCheckList]);

  useEffect(() => {
    let mounted = true;
    getListAuditCheckListApi({
      page: 1,
      pageSize: -1,
      status: 'Approved',
      companyId: userInfo?.mainCompanyId,
    })
      .then((r) => {
        if (mounted) {
          setListACApproved(r.data.data);
        }
      })
      .catch((e) => toastError(`${e} in create container`));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      createdAuditCheckList?.generalInfo &&
      !isEmpty(createdAuditCheckList?.generalInfo)
    ) {
      formHelper.setListRefCategory(
        createdAuditCheckList?.generalInfo?.referencesCategory?.map(
          (i) => i.id,
        ),
      );
      setCurrentActiveTab(QUESTION_LIST);
    }
  }, [createdAuditCheckList]);

  useEffect(() => {
    dispatch(
      getListROFFromIARAction.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );
    return () => {
      dispatch(clearCreatedAuditCheckListAction());
      dispatch(clearAuditCheckListDetail());
      dispatch(checkIsCreatedInitialData(false));
      dispatch(clearErrorMessages());
    };
  }, []);
  const optionsChooseTemplate: OptionsProps[] = useMemo(() => {
    const newOptions: OptionsProps[] = listACApproved?.map((item) => ({
      value: item.id.toString(),
      label: item.name.toString(),
    }));

    return newOptions;
  }, [listACApproved]);

  useEffect(() => {
    if (createdAuditCheckList?.generalInfo?.statusHistory) {
      formHelper?.setStatusHistory(
        createdAuditCheckList?.generalInfo?.statusHistory,
      );
    }
  }, [createdAuditCheckList?.generalInfo?.statusHistory]);

  const switchTab = (newTab: string) => {
    setCurrentActiveTab(newTab);
  };

  const handleChooseTemplate = () => setIsOpenChooseTemplate(true);
  const handlePreview = () => {
    setPreviewModal(true);
  };
  const headerButtons: HeaderBtn[] = useMemo(() => {
    const btns: HeaderBtn[] = [
      {
        name: HeaderBtnType.BACK,
        onClick: () => {
          history.goBack();
        },
        disabled: false,
      },
      {
        name: HeaderBtnType.PREVIEW,
        onClick: handlePreview,
        disabled: formHelper.loading,
      },
    ];
    if (createdAuditCheckList?.generalInfo?.status === 'Draft') {
      return btns;
    }

    return [
      ...btns,
      {
        name: HeaderBtnType.CHOOSE_TEMPLATE,
        onClick: handleChooseTemplate,
        disabled: false,
      },
    ];
  }, [createdAuditCheckList?.generalInfo, formHelper.loading]);

  const handleSubmitGeneralInfo = useCallback(
    (data: GeneralInfoFormModel) => {
      let body: CreateGeneralInfoBody = {
        timezone: formHelper?.currentTimeZone,
        // appType: data.appType,
        chkType: data.chkType,
        auditEntity: data.auditEntity,
        code: formHelper?.chkCode?.verifySignature,
        name: data.name,
        revisionDate: moment(data.revisionDate).format(),
        revisionNumber: data.revisionNumber,
        validityFrom: data.validityPeriod[0].format(),
        validityTo: data.validityPeriod[1].format(),
        visitTypes: data.visitTypes,
        inspectionModule: data.inspectionModule,
        referencesCategory: data.referencesCategory,
      };

      if (generalInfoDetail) {
        body = { ...body, auditChecklistTemplateId: generalInfoDetail?.id };
      }
      dispatch(createGeneralInfoAction.request(body));
    },
    [formHelper, generalInfoDetail],
  );

  const handleSaveQuestion = useCallback(
    (data: any) => {
      const checkIdValue = aOptions?.some((i) => !i?.idValue);
      if (checkIdValue) {
        toastError('Please add value for answer options');
        return null;
      }
      let referencesCategoryData: any = [];
      let finalData: any = {};
      let order: number = 0;
      let finalRemarkSpecificAnswers: string[];
      let finalAnswerOptions: AnswerOptionModel[] = [];
      let questions: string[];
      listQuestion?.forEach((item) => {
        if (item.order > order) order = item.order;
      });

      if (isMultiQuestion) {
        questions = data?.questions.split('\n').filter((i) => i !== '');
      } else {
        questions = [data?.questions?.replace('\n', ' ')]?.map((i) =>
          i?.trim(),
        );
      }
      finalAnswerOptions = aOptions.map((i) => {
        if (i?.idValue) {
          return {
            id: i.id,
            content: i.value,
            valueId: i.idValue,
          };
        }
        return {
          id: i.id,
          content: i.value,
        };
      });
      if (data.isHasRemark && data.hasRemark === HasRemarkType.SPECIFIC) {
        finalRemarkSpecificAnswers = aOptions
          .filter((i) => i.hasRemark)
          .map((i) => i.value);
      }
      if (data.attachments?.length > 0) {
        finalData = {
          ...finalData,
          attachments: data.attachments,
        };
      }
      if (data?.type) {
        finalData = {
          ...finalData,
          isHasRemark: undefined,
          order: order + 1,
          hasRemark: data?.hasRemark,
          remarkSpecificAnswers: finalRemarkSpecificAnswers,
          requireEvidencePicture: data?.requireEvidencePicture,
          isMandatory: data?.isMandatory,
          minPictureRequired:
            !Number.isNaN(Number(data?.minPictureRequired)) &&
            Number(data?.minPictureRequired) > 0
              ? Number(data?.minPictureRequired)
              : 0,
          answerOptions: finalAnswerOptions,
        };
      }
      if (data?.CDI?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.CDI, value: data?.CDI[0]?.value },
        ];
      }

      if (data?.reg) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.REG, value: data?.reg },
        ];
      }

      if (data?.infor) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.INFOR, value: data?.infor },
        ];
      }

      if (data?.VIQ?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.VIQ, value: data?.VIQ[0]?.value },
        ];
      }
      if (data?.category2nd?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          {
            id: MasterDataId.THIRD_CATEGORY,
            value: data?.category2nd[0]?.value,
          },
        ];
      }
      if (data?.subCategory1st?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          {
            id: MasterDataId.SECOND_CATEGORY,
            value: data?.subCategory1st[0]?.value,
          },
        ];
      }
      if (data?.charterOwner?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          {
            id: MasterDataId.CHARTER_OWNER,
            value: data?.charterOwner[0]?.value,
          },
        ];
      }
      if (data?.mainCategory?.length > 0) {
        finalData = {
          ...finalData,
          mainCategoryId: data?.mainCategory[0]?.value,
        };
      }
      if (data?.locationId?.length > 0) {
        finalData = { ...finalData, locationId: data?.locationId[0]?.value };
      }
      if (data?.code?.trim()?.length > 0) {
        finalData = { ...finalData, code: data?.code?.trim() };
      }
      if (data?.type?.length > 0) {
        finalData = { ...finalData, type: data?.type };
      }
      if (data?.potentialRisk?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.POTENTIAL_RISK, value: data?.potentialRisk },
        ];
      }
      if (data?.criticality?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.CRITICALITY, value: data?.criticality },
        ];
      }
      if (data?.ratingCriteria?.trim()?.length > 0) {
        finalData = {
          ...finalData,
          ratingCriteria: data?.ratingCriteria?.trim(),
        };
      }
      if (data?.topicId?.length > 0) {
        finalData = { ...finalData, topicId: data?.topicId[0]?.value };
      }
      if (data?.hint?.trim()?.length > 0) {
        finalData = { ...finalData, hint: data?.hint?.trim() };
      }

      if (data?.department?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.department?.map((i) => ({
            id: MasterDataId.DEPARTMENT,
            value: i?.value,
          })),
        ];
      }

      if (data?.shoreRank?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.shoreRank?.map((i) => ({
            id: MasterDataId.SHORE_RANK,
            value: i?.value,
          })),
        ];
      }
      if (data?.shipDepartment?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.shipDepartment?.map((i) => ({
            id: MasterDataId.SHIP_DEPARTMENT,
            value: i?.value,
          })),
        ];
      }
      if (data?.shipRanks?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.shipRanks?.map((i) => ({
            id: MasterDataId.SHIP_RANK,
            value: i?.value,
          })),
        ];
      }
      if (data?.shoreDepartment?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.shoreDepartment?.map((i) => ({
            id: MasterDataId.SHORE_DEPARTMENT,
            value: i?.value,
          })),
        ];
      }
      if (data?.vesselType?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.vesselType?.map((i) => ({
            id: MasterDataId.VESSEL_TYPE,
            value: i?.value,
          })),
        ];
      }
      if (formHelper.questionDetail) {
        dispatch(
          updateQuestionAction.request({
            idAuditChecklist: search.substring(1),
            idQuestion: formHelper.questionDetail?.id,
            body: {
              ...finalData,
              question: questions[0],
              referencesCategoryData: [...referencesCategoryData],
            },
            handleSuccess: data?.handleSuccess || undefined,
          }),
        );
      } else {
        dispatch(
          createQuestionAction.request({
            id: search.substring(1),
            body: {
              ...finalData,
              questions,
              referencesCategoryData: [...referencesCategoryData],
            },
            handleSuccess: data?.handleSuccess,
          }),
        );
      }
      return null;
    },
    [listQuestion, search, formHelper, aOptions, isMultiQuestion],
  );

  const handleSubmitAuditCheckList = useCallback(
    (data?: any) => {
      dispatch(
        submitAuditCheckListAction.request({
          id: search.substring(1),
          ...data,
        }),
      );
    },
    [dispatch, search],
  );

  const renderForm = useCallback(() => {
    if (currentActiveTab === GENERAL_INFORMATION) {
      if (
        createdAuditCheckList?.generalInfo &&
        !isEmpty(createdAuditCheckList?.generalInfo)
      ) {
        return (
          <GeneralInfoForm
            isEdit={false}
            data={createdAuditCheckList?.generalInfo}
            masterDataOptions={formHelper.masterDataOptions}
            isTemplateChosen={false}
            statusHistory={formHelper.statusHistory}
          />
        );
      }
      return (
        <>
          {formHelper.loading || generalLoading ? (
            <div className="d-flex justify-content-center">
              <img
                src={images.common.loading}
                className={styles.loading}
                alt="loading"
              />
            </div>
          ) : (
            <GeneralInfoForm
              isEdit
              isCreate
              isTemplateChosen={isTemplateChosen}
              setIsTemplateChosen={setIsTemplateChosen}
              masterDataOptions={formHelper.masterDataOptions}
              chkCode={formHelper.chkCode}
              data={generalInfoDetail}
              onSubmit={handleSubmitGeneralInfo}
              statusHistory={[]}
              handleDeleteData={() => setGeneralInfoDetail(null)}
            />
          )}
        </>
      );
    }
    if (currentActiveTab === QUESTION_LIST) {
      return (
        <>
          <QuestionListForm
            id={search?.substring(1) || ''}
            handleSaveQuestion={handleSaveQuestion}
            inProgressData={questionProgress}
            setQuestionProgress={setQuestionProgress}
            isMultiQuestion={isMultiQuestion}
            setIsMultiQuestion={setIsMultiQuestion}
            answerOptions={aOptions}
            setAnswerOptions={setAnswerOptions}
            isEdit
            dataPackage={formHelper.dataPackage}
            fetchLocationData={formHelper.fetchLocationData}
            fetchCategoryData={formHelper.fetchCategoryData}
            loadingQuestionDetail={formHelper.loadingQuestionDetail}
            fetchVesselTypeData={formHelper.fetchVesselTypeData}
            fetchCDIData={formHelper.fetchCDIData}
            fetchCharterOwnerData={formHelper.fetchCharterOwnerData}
            handleSubmitAuditCheckList={handleSubmitAuditCheckList}
            fetchShipRanksData={formHelper.fetchShipRanksData}
            fetchShoreDepartmentData={formHelper.fetchShoreDepartmentData}
            fetchVIQData={formHelper.fetchVIQData}
            fetchShoreRankData={formHelper.fetchShoreRankData}
            fetchTopicsData={formHelper.fetchTopicsData}
            fetchShipDepartmentData={formHelper.fetchShipDepartmentData}
            fetchShipDirectResponsibleData={
              formHelper.fetchShipDirectResponsibleData
            }
            disabledSubmit={listQuestion?.length === 0}
            moreButton
            setQuestionDetailChecklist={formHelper.setQuestionDetailChecklist}
            questionDetail={formHelper.questionDetail}
            removeDataQuestionDetail={formHelper.removeDataQuestionDetail}
            isCreate
          />
        </>
      );
    }
    return <div>Error</div>;
  }, [
    currentActiveTab,
    generalInfoDetail,
    createdAuditCheckList,
    formHelper,
    listQuestion,
  ]);

  const stepStatusItems = useMemo(() => {
    let items: Item[] = formHelper.DEFAULT_STATUS_ITEMS;

    if (createdAuditCheckList?.generalInfo?.status === 'Draft') {
      items = items.map((i, index) => {
        if (index < 1) {
          return { ...i, status: StepStatus.ACTIVE };
        }
        return { ...i, info: null };
      });
    }
    return items;
  }, [createdAuditCheckList, formHelper.DEFAULT_STATUS_ITEMS]);

  return (
    <div className={styles.createContainer}>
      <Container className={styles.headerContainer}>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.AUDIT_CHECKLIST_CREATE} />
          <div className="d-flex justify-content-between">
            <div className={cx('fw-bold', styles.title)}>
              {renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
              )}
            </div>
            <HeaderButtons
              dynamicLabels={dynamicLabels}
              buttons={headerButtons}
            />
          </div>
        </div>
        <div className={cx('d-flex flex-row justify-content-between')}>
          <div className={cx('d-flex ', styles.tabsWrapper)}>
            <Button
              onClick={() => switchTab(GENERAL_INFORMATION)}
              type="button"
              className={cx('fw-bold', styles.tabsButton, {
                [styles.tabsButtonActive]:
                  currentActiveTab.includes(GENERAL_INFORMATION),
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                  'General information'
                ],
              )}
            </Button>
            <Button
              onClick={() => switchTab(QUESTION_LIST)}
              disabled={
                !createdAuditCheckList?.generalInfo &&
                isEmpty(createdAuditCheckList?.generalInfo)
              }
              type="button"
              className={cx('fw-bold', styles.tabsButton, {
                [styles.tabsButtonActive]:
                  currentActiveTab.includes(QUESTION_LIST),
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Question list'],
              )}
            </Button>
          </div>
          <div className="d-flex align-items-center">
            {currentActiveTab !== GENERAL_INFORMATION && (
              <div className="d-flex align-items-center">
                <div className={styles.codeTitle}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                      'Checklist code'
                    ],
                  )}
                  :
                  <span className={styles.codeValue}>
                    {createdAuditCheckList?.generalInfo?.code}
                  </span>
                </div>
                <div className={styles.stick} />
              </div>
            )}
            <PopoverStatus
              header={renderDynamicLabel(
                dynamicLabels,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                  'Workflow progress'
                ],
              )}
              dynamicLabels={dynamicLabels}
              stepStatusItems={stepStatusItems}
              status={createdAuditCheckList?.generalInfo?.status}
            />
          </div>
        </div>
      </Container>
      {renderForm()}
      <PreviewModal
        dynamicLabels={dynamicLabels}
        header={renderDynamicLabel(
          dynamicLabels,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Checklist preview'],
        )}
        bodyClassName={styles.modalBody}
        toggle={() => setPreviewModal(!previewModal)}
        data={auditCheckListDetail}
        modal={previewModal}
        chkCode={formHelper?.chkCode}
      />
      <ModalSelect
        isOpen={isOpenChooseTemplate}
        searchContent={renderDynamicLabel(
          dynamicLabels,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
            'Inspection checklist template'
          ],
        )}
        dynamicLabels={dynamicLabels}
        toggle={() => setIsOpenChooseTemplate((prev) => !prev)}
        options={optionsChooseTemplate || []}
        selectedTemplate={null} // create selected template
        handleConfirm={(value: OptionProps[]) => {
          setGeneralLoading(true);
          getGeneralInfoDetailApi(value[0]?.value)
            .then((r) => {
              setIsTemplateChosen(true);
              setGeneralInfoDetail({ ...r.data, publishedDate: null });
              const referencesCategory = r.data?.referencesCategory?.map(
                (i) => i.id,
              );
              formHelper?.setListRefCategory(referencesCategory);
              setIsOpenChooseTemplate((prev) => !prev);
            })
            .catch((e) => {
              setIsTemplateChosen(false);
              toastError(e);
            })
            .finally(() => {
              setGeneralLoading(false);
            });
        }}
      />
    </div>
  );
}
