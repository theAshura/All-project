import images from 'assets/images/images';
import cx from 'classnames';
import ExpandTextAreaForm from 'components/audit-checklist/common/expand-textarea/ExpandTextarea';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import Radio from 'components/ui/radio/Radio';
import SelectUI from 'components/ui/select/Select';
import {
  ActivePermission,
  MasterDataId,
  MaxLength,
} from 'constants/common.const';
import { QUESTION_TYPE_OPTIONS } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import { REGEXP_NUMERIC_VALUE } from 'constants/regExpValidate.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { isEmpty, toastError, toastSuccess } from 'helpers/notification.helper';
import { convertDataUserAssignment } from 'helpers/userAssignment.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import PermissionCheck from 'hoc/withPermissionCheck';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { v4 } from 'uuid';

import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import { yupResolver } from '@hookform/resolvers/yup';
import Tooltip from 'antd/lib/tooltip';
import {
  exportExportQuestionApi,
  exportTemPlateApi,
  getQuestionDetailApi,
  uploadFileExcelApi,
} from 'api/audit-checklist.api';
import ModalListTable from 'components/common/modal-list-table/ModalListTable';
import OptionsContainer, {
  OptionsType,
} from 'components/common/options-container/OptionsContainer';
import ItemQuestion, {
  ReferencesCategoryList,
} from 'components/common/question-list/item/ItemQuestion';
import { ItemStatus } from 'components/common/step-line/lineStepCP';
import { TableAttachmentAGGrid } from 'components/common/table-attachment/TableAttachmentAGGrid';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import CheckBox from 'components/ui/checkbox/Checkbox';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { filterContentSelect } from 'helpers/filterSelect.helper';
import {
  capitalizeFirstLetter,
  handleAndDownloadFileXLSX,
} from 'helpers/utils.helper';
import isEqual from 'lodash/isEqual';
import {
  Question,
  QuestionDetail,
} from 'models/store/audit-checklist/audit-checklist.model';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  createQuestionAction,
  deleteQuestionAction,
  getAuditCheckListDetailAction,
  getListQuestionAction,
  reorderQuestionList,
} from 'store/audit-checklist/audit-checklist.action';
import { clearDMSReducer } from 'store/dms/dms.action';
import * as Yup from 'yup';

import {
  clearValueManagementReducer,
  getListValueManagementActions,
} from 'pages/value-management/store/action';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import Assignment from '../common/assignment/Assignment';
import { ACDataPackage } from '../common/form-helper/useFormHelper';
import ModalList from '../common/modal-list/ModalList';
import ModalLoading from '../common/modal/ModalLoading';
import ModalUploadedFail, {
  QuestionErr,
} from '../common/modal/ModalUploadedFail';
import NumberOfQuestionInformationModal from '../common/number-of-question-information-modal/NumberOfQuestionInformationModal';
import SectionInformationModal from '../common/section-information-modal/SectionInformationModal';
import styles from './form.module.scss';

export interface AnswerOptionModel {
  id: string;
  value?: string;
  name?: string;
  idValue?: string;
  content?: string;
}

export interface AnswerOptionValueModel extends AnswerOptionModel {
  hasRemark?: boolean;
}

export enum HasRemarkType {
  ALL = 'All',
  SPECIFIC = 'Specific',
}

interface QuestionListProps {
  isEdit: boolean;
  data?: any;
  inProgressData?: any;
  dataPackage: ACDataPackage;
  isMultiQuestion?: boolean;
  questionDetail?: QuestionDetail;
  answerOptions?: (AnswerOptionModel & { hasRemark?: boolean })[];
  moreButton?: boolean;
  loadingQuestionDetail?: boolean;
  id?: string;
  setAnswerOptions?: (
    data: (AnswerOptionModel & { hasRemark?: boolean })[],
  ) => void;
  disabledSubmit?: boolean;
  setQuestionProgress?: (data: any, id?: string) => void;
  setIsMultiQuestion?: (data: boolean) => void;
  fetchTopicsData?: (content: string) => void;
  fetchLocationData?: (content: string) => void;
  fetchCategoryData?: (content: string, levels: string, id?: string) => void;
  fetchVesselTypeData?: (content: string) => void;
  fetchCDIData?: (content: string) => void;
  fetchCharterOwnerData?: (content: string) => void;
  fetchSDRData?: (content: string) => void;
  fetchShipRanksData?: (content: string) => void;
  fetchShoreDepartmentData?: (content: string) => void;
  fetchVIQData?: (content: string) => void;
  fetchShoreRankData?: (content: string) => void;
  fetchShipDepartmentData?: (content: string) => void;
  fetchShipDirectResponsibleData?: (content: string) => void;
  handleSaveQuestion?: (data: any) => void;
  removeDataQuestionDetail: () => void;
  setQuestionDetailChecklist?: (
    idAuditChecklist: string,
    idQuestion: string,
    action?: () => void,
  ) => void;
  handleSubmitAuditCheckList: (dataParam: any) => void;
  status?: string;
  isCreator?: boolean;
  isCreate?: boolean;
}

const sortPosition = [
  'code',
  'type',
  'questions',
  'answer_option',
  'topicId',
  'locationId',
  'vesselType',
  'mainCategory',
];

const defaultValues = {
  code: '',
  type: null,
  questions: '',
  isMandatory: false,
  isHasRemark: true,
  hasRemark: HasRemarkType.ALL,
  minPictureRequired: 0,
  ratingCriteria: '',
  hint: '',
  topicId: [],
  department: [],
  locationId: [],
  attachments: [],
  requireEvidencePicture: false,
  vesselType: null,
  CDI: null,
  charterOwner: null,
  VIQ: null,
  mainCategory: [],
  category2nd: null,
  subCategory1st: null,
  shipDepartment: null,
  shipRanks: null,
  shoreDepartment: null,
  shoreRank: null,
  criticality: null,
  potentialRisk: null,
  reg: null,
  infor: null,
};

const AuditCheckListQuestionListForm: FC<QuestionListProps> = ({
  isEdit,
  id,
  data,
  questionDetail,
  dataPackage,
  moreButton,
  inProgressData,
  answerOptions,
  isMultiQuestion,
  disabledSubmit,
  loadingQuestionDetail,
  setIsMultiQuestion,
  setAnswerOptions,
  setQuestionProgress,
  fetchLocationData,
  fetchCategoryData,
  fetchVesselTypeData,
  fetchCDIData,
  fetchTopicsData,
  fetchCharterOwnerData,
  fetchShipRanksData,
  fetchShoreDepartmentData,
  fetchVIQData,
  fetchShoreRankData,
  fetchShipDepartmentData,
  handleSaveQuestion,
  removeDataQuestionDetail,
  handleSubmitAuditCheckList,
  setQuestionDetailChecklist,
  status,
  isCreator,
  isCreate,
}) => {
  const dispatch = useDispatch();

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const { t } = useTranslation([
    I18nNamespace.AUDIT_CHECKLIST,
    I18nNamespace.COMMON,
  ]);

  const uploadFile = useRef(null);

  const rowLabelsAddFinding = useMemo(
    () => [
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Vessel code'
          ],
        ),
        width: 180,
        dataIndex: 'vesselCode',
      },
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Vessel name'
          ],
        ),
        dataIndex: 'vesselName',
        width: 220,
      },
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList['Ref.No'],
        ),
        dataIndex: 'refNo',
        width: 180,
      },
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList.Entity,
        ),
        dataIndex: 'auditEntity',
        width: 180,
      },
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Inspection number'
          ],
        ),
        dataIndex: 'auditNumber',
        width: 160,
      },
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Inspection type'
          ],
        ),
        dataIndex: 'auditType',
        width: 160,
      },
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Findings comment'
          ],
        ),
        dataIndex: 'findingComment',
        width: 160,
      },
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Nature of finding'
          ],
        ),
        dataIndex: 'natureOfFinding',
        width: 160,
      },
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Checklist code'
          ],
        ),
        dataIndex: 'checklistCode',
        width: 180,
      },
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Module id'
          ],
        ),
        dataIndex: 'moduleId',
        width: 160,
      },
      {
        title: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Module name'
          ],
        ),
        dataIndex: 'moduleName',
        width: 160,
      },
    ],
    [dynamicFields],
  );

  const schema = useMemo(
    () =>
      Yup.object().shape({
        code: Yup.string().required(
          renderDynamicLabel(
            dynamicFields,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
        type: Yup.string()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        questions: Yup.string()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          )
          .min(
            2,
            renderDynamicLabel(
              dynamicFields,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Must be between 2 and 2000 characters'
              ],
            ),
          ),
        topicId: Yup.array().min(
          1,
          renderDynamicLabel(
            dynamicFields,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
        locationId: Yup.array().min(
          1,
          renderDynamicLabel(
            dynamicFields,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
        mainCategory: Yup.array().min(
          1,
          renderDynamicLabel(
            dynamicFields,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
        vesselType: Yup.array()
          .transform((v, o) => (o === null ? [] : v))
          .test(
            'vesselType',
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
            (value, context) => {
              const hasVesselType = dataPackage?.listRefCategory?.includes(
                MasterDataId.VESSEL_TYPE,
              );
              if (hasVesselType) {
                return value?.length > 0;
              }
              return true;
            },
          ),
        ratingCriteria: Yup.string()
          .nullable()
          .matches(/.{2,}/, {
            excludeEmptyString: true,
            message: renderDynamicLabel(
              dynamicFields,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Must be between 2 and 2000 characters'
              ],
            ),
          }),
        hint: Yup.string()
          .nullable()
          .matches(/.{2,}/, {
            excludeEmptyString: true,
            message: renderDynamicLabel(
              dynamicFields,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Must be between 2 and 2000 characters'
              ],
            ),
          }),
        minPictureRequired: Yup.number()
          .transform((v, o) => {
            if (o === '') {
              return null;
            }
            if (Number.isNaN(v)) {
              return -1;
            }
            return v;
          })
          .test(
            'checkZero',
            renderDynamicLabel(
              dynamicFields,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Minimum picture required must greater than 0 if Evidence picture required is Yes'
              ],
            ),
            (value, context) => {
              if (context.parent.requireEvidencePicture && value <= 0) {
                return false;
              }
              return true;
            },
          )
          .nullable(true)
          .min(
            0,
            renderDynamicLabel(
              dynamicFields,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Invalid amount'
              ],
            ),
          ),
      }),
    [dataPackage?.listRefCategory, dynamicFields],
  );

  const method = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    getValues,
    reset,
    watch,
    formState: { errors, isSubmitted },
  } = method;

  const {
    listQuestion,
    auditCheckListDetail,
    errorList,
    listROFFromIAR,
    loading,
  } = useSelector((store) => store.auditCheckList);
  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isOpenQuestionInformation, setIsOpenQuestionInformation] =
    useState(true);
  const [isOpenModalImport, setIsOpenModalImport] = useState<boolean>(false);
  const [isOpenModalErr, setIsOpenModalErr] = useState<boolean>(false);
  const [initialDisable, setInitialDisable] = useState<boolean>(false);
  const [modalAssignMentVisible, openModalAssignment] =
    useState<boolean>(false);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isFirstLoadingCategory, setIsFirstLoadingCategory] = useState(true);
  const [isOpenVerification, setIsOpenVerification] = useState(true);
  const [listQuestionState, setListQuestionState] = useState([]);
  const [dataFormState, setDataFormState] = useState(null);
  const [listQuestionErr, setListQuestionErr] = useState<QuestionErr[]>([]);
  const [currentQuestionType, setCurrentQuestionType] = useState<string>('');
  const [aOptionsError, setAOptionsError] = useState<string>('');
  const [remarkSpecificAnswersError, setRemarkSpecificAnswersError] =
    useState<string>(null);
  const [expandList, setExpandList] = useState<boolean>(false);
  const [firstErrorId, setFirstErrorId] = useState('');
  const [isOpenModalValues, setIsOpenModalValues] = useState<boolean>(false);
  const [dataValueModal, setDataValueModal] = useState<
    AnswerOptionValueModel[]
  >([]);

  const [visibleSectionInformationModal, setVisibleSectionInformationModal] =
    useState<boolean>(false);
  const [isOpenReferencesCategory, setIsOpenReferencesCategory] =
    useState(true);
  const toggleQuestionInformation = () =>
    setIsOpenQuestionInformation(!isOpenQuestionInformation);
  const toggleVerification = () => setIsOpenVerification(!isOpenVerification);
  const toggleReferencesCategory = () =>
    setIsOpenReferencesCategory(!isOpenReferencesCategory);
  const [addFinding, setAddFinding] = useState<string[]>([]);
  const [isOpenFinding, setIsOpenFinding] = useState<boolean>(false);
  const [iconActives, setIconActives] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  const [openViewDetailExpand, setOpenViewDetailExpand] =
    useState<boolean>(false);
  const [vesselOptions, setVesselOptions] = useState(
    dataPackage?.vesselType || [],
  );

  const [departmentOptions, setDepartmentOptions] = useState(
    dataPackage?.department || [],
  );

  const [detailExpand, setDetailExpand] = useState<
    {
      name: string;
      value: string;
    }[]
  >([]);

  const isHasRemark = watch('isHasRemark');
  const hasRemark = watch('hasRemark');
  const questionType = watch('type');
  const mainCategoryWatch = watch('mainCategory');

  const dataAddFinding = useMemo(
    () =>
      listROFFromIAR?.data.map((item) => ({
        id: item?.id,
        vesselCode: item?.internalAuditReport?.vessel?.code,
        vesselName: item?.internalAuditReport?.vessel?.name,
        refNo: item?.internalAuditReport?.planningRequest?.refId,
        auditEntity: item?.internalAuditReport?.planningRequest?.entityType,
        auditNumber: item?.internalAuditReport?.planningRequest?.auditNo,
        auditType: item?.auditType?.name,
        findingComment: item?.findingComment,
        natureOfFinding: item?.natureFinding?.name,
        checklistCode: item?.auditChecklist?.code,
        moduleId: '', // fix after
        moduleName: '', // fix after'
        label: item?.findingComment,
      })),
    [listROFFromIAR?.data],
  );

  useEffect(() => {
    const inProgress = watch((value) => {
      setQuestionProgress(value);
    });
    return () => inProgress.unsubscribe(); // eslint-disable-next-line
  }, [watch]);

  useEffect(() => {
    const newDataValueModal =
      answerOptions?.map((item) => ({
        ...item,
        idValue: item?.idValue || '',
        name: item?.name || '',
      })) || [];
    setDataValueModal(newDataValueModal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerOptions]);

  useEffect(() => {
    if (mainCategoryWatch?.length > 0) {
      fetchCategoryData(
        '',
        '2',
        mainCategoryWatch && mainCategoryWatch[0]?.value?.toString(),
      );
    }

    if (
      (questionDetail &&
        mainCategoryWatch?.length &&
        !isFirstLoadingCategory) ||
      !questionDetail
    ) {
      setValue('subCategory1st', null);
    }
    if (questionDetail && mainCategoryWatch?.length) {
      setIsFirstLoadingCategory(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainCategoryWatch]);

  useEffect(() => {
    if (listQuestion?.length) {
      dispatch(getAuditCheckListDetailAction.request(id));
    }
    setListQuestionState(listQuestion);
  }, [dispatch, id, listQuestion]);

  const clearQuestionData = useCallback(() => {
    setInitialDisable(false);
    removeDataQuestionDetail();
    reset();
    setExpandList(false);
    setValue('type', null);
    dispatch(clearDMSReducer());
    setIsMultiQuestion(false);
    setAnswerOptions([
      {
        id: v4(),
        value: '',
        hasRemark: false,
        idValue: '',
      },
      {
        id: v4(),
        value: '',
        hasRemark: false,
        idValue: '',
      },
    ]);
  }, [
    dispatch,
    removeDataQuestionDetail,
    reset,
    setAnswerOptions,
    setIsMultiQuestion,
    setValue,
  ]);

  useEffectOnce(() => {
    dispatch(
      getListValueManagementActions.request({
        pageSize: -1,
        status: 'active',
        companyId: userInfo?.parentCompanyId || userInfo?.companyId,
      }),
    );

    if (isCreate) {
      clearQuestionData();
    }
    if (inProgressData) {
      setValue('code', inProgressData.code);
      setValue('type', inProgressData.type);
      setCurrentQuestionType(inProgressData.type);
      setValue('questions', inProgressData.questions);
      setValue('isMandatory', inProgressData.isMandatory);
      setValue('isHasRemark', inProgressData.isHasRemark);
      setValue('hasRemark', inProgressData.hasRemark);
      setValue('requireEvidencePicture', inProgressData.requireEvidencePicture);
      setValue('minPictureRequired', inProgressData.minPictureRequired);
      setValue('ratingCriteria', inProgressData.ratingCriteria);
      setValue('hint', inProgressData.hint);
      setValue('topicId', inProgressData.topicId);
      setValue('locationId', inProgressData.locationId);

      setValue('vesselType', inProgressData.vesselType);
      setValue('department', inProgressData.department);
      setValue('CDI', inProgressData.CDI);
      setValue('charterOwner', inProgressData.charterOwner);
      setValue('VIQ', inProgressData.VIQ);
      setValue('mainCategory', inProgressData.mainCategory);
      setValue('category2nd', inProgressData.category2nd);
      setValue('subCategory1st', inProgressData.subCategory1st);
      setValue('shipDepartment', inProgressData.shipDepartment);
      setValue('shipRanks', inProgressData.shipRanks);
      setValue('shoreDepartment', inProgressData.shoreDepartment);
      setValue('shoreRank', inProgressData.shoreRank);
      setValue('criticality', inProgressData.criticality);
      setValue('potentialRisk', inProgressData.potentialRisk);
      setValue('reg', inProgressData.reg);
      setValue('infor', inProgressData.infor);
      setIsOpenQuestionInformation(true);
      setIsOpenReferencesCategory(true);
      setIsOpenVerification(true);
    }
    return () => {
      dispatch(clearValueManagementReducer());
    };
  });

  useEffect(() => {
    if (questionDetail?.minPictureRequired > 0) {
      setValue('requireEvidencePicture', true);
    } else {
      setValue('requireEvidencePicture', false);
    }
  }, [questionDetail, setValue]);

  useEffect(() => {
    if (addFinding?.length && !isOpenFinding) {
      const questionValues = getValues('questions');
      const questionValuesArray = questionValues
        ? questionValues
            .split('\n')
            ?.map((item) => item?.trim())
            ?.filter((item) => item)
        : [];

      const filterFindingComments = dataAddFinding
        .filter(
          (item) =>
            addFinding.includes(item.id) &&
            !questionValuesArray?.includes(item?.findingComment),
        )
        ?.map((item) => item.findingComment);
      setValue(
        'questions',
        `${[...questionValuesArray, ...filterFindingComments].join('\n')}`,
      );
    }
  }, [addFinding, isOpenFinding, dataAddFinding, getValues, setValue]);

  const checkRemarkSpecific = useCallback(() => {
    if (
      hasRemark?.includes(HasRemarkType.SPECIFIC) &&
      questionType &&
      !answerOptions?.some((i) => i.hasRemark)
    ) {
      const el = document.querySelector(
        `#form_data_questions #remark-specific-answers`,
      );
      setFirstErrorId('');

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setFirstErrorId('answer_option');
      }
      setRemarkSpecificAnswersError(
        renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Please select at least 1 option after choosing specific'
          ],
        ),
      );

      return true;
    }
    return false;
  }, [answerOptions, dynamicFields, hasRemark, questionType]);

  const onSaveForm = (data) => {
    if (!answerOptions?.length) {
      return setAOptionsError(
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      );
    }
    if (
      answerOptions.length >= 2 &&
      answerOptions?.find((item) => !item.value?.trim())
    ) {
      const el = document.querySelector(`#form_data_questions #answer_option`);
      setFirstErrorId('');

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setFirstErrorId('answer_option');
      }
      return setAOptionsError(
        renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Must have at least 2 options'
          ],
        ),
      );
    }

    if (checkRemarkSpecific()) {
      return null;
    }
    if (!aOptionsError) {
      handleSaveQuestion({
        ...data,
        handleSuccess: () => {
          if (!questionDetail) {
            reset();
            dispatch(clearDMSReducer());
            setAnswerOptions([
              { id: v4(), value: '', hasRemark: false, idValue: '' },
              { id: v4(), value: '', hasRemark: false, idValue: '' },
            ]);
          }
          setQuestionProgress(undefined);
          setIsMultiQuestion(false);
        },
      });
    }
    return null;
  };

  const handleOpenModalValue = useCallback(
    () => setIsOpenModalValues(true),
    [],
  );

  const dataUserAssignmentConvert = useMemo(
    () => convertDataUserAssignment(auditCheckListDetail?.userAssignments),
    [auditCheckListDetail?.userAssignments],
  );

  const dataUserAssignmentBody = useCallback((value) => {
    const userAssignment = {
      usersPermissions: [
        {
          permission: ActivePermission.APPROVER,
          userIds: value?.approver?.map((item) => item?.id) || [],
        },
        {
          permission: ActivePermission.REVIEWER,
          userIds: value?.reviewer?.map((item) => item?.id) || [],
        },
        {
          permission: ActivePermission.CREATOR,
          userIds: value?.creator?.map((item) => item?.id) || [],
        },
      ]?.filter((item) => item?.userIds?.length),
    };
    return userAssignment;
  }, []);

  const handleSubmitFormAfterAssignment = useCallback(
    (dataSubmit) => {
      const { input, approver, reviewer, ...other } = dataSubmit;
      const dataBody = other?.data || dataFormState;
      const dataUser = dataUserAssignmentBody({ approver, reviewer });
      handleSaveQuestion({
        ...dataBody,

        hasSubmit: true,
        handleSuccess: (newQuestion?: Question) => {
          const afterSave = () => {
            handleSubmitAuditCheckList({
              userAssignment: {
                planningRequestId: id,
                usersPermissions: dataUser?.usersPermissions,
              },
              handleSuccess: () => {
                if (!questionDetail) dispatch(clearDMSReducer());
                setQuestionProgress(undefined);
                reset();
                setIsMultiQuestion(false);
                setAnswerOptions([
                  { id: v4(), value: '', hasRemark: false, idValue: '' },
                  { id: v4(), value: '', hasRemark: false, idValue: '' },
                ]);
              },
            });
          };
          if (newQuestion) {
            // create and submit
            setQuestionDetailChecklist(
              newQuestion?.auditChecklistId,
              newQuestion?.id,
              () => {
                afterSave();
              },
            );
          } else {
            // update and submit
            afterSave();
          }
        },
      });
    },
    [
      dataFormState,
      dataUserAssignmentBody,
      dispatch,
      handleSaveQuestion,
      handleSubmitAuditCheckList,
      id,
      questionDetail,
      reset,
      setAnswerOptions,
      setIsMultiQuestion,
      setQuestionDetailChecklist,
      setQuestionProgress,
    ],
  );

  const onSubmitForm = (data) => {
    if (
      !answerOptions?.length ||
      !answerOptions?.find((item) => item.value?.trim())
    ) {
      return setAOptionsError(
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      );
    }
    if (
      answerOptions.length >= 2 &&
      answerOptions?.find((item) => !item.value?.trim())
    ) {
      const el = document.querySelector(`#form_data_questions #answer_option`);
      setFirstErrorId('');

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setFirstErrorId('answer_option');
      }
      return setAOptionsError(
        renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Must have at least 2 options'
          ],
        ),
      );
    }
    if (checkRemarkSpecific()) {
      return null;
    }
    if (!aOptionsError) {
      setDataFormState(data);
      if (workFlowActiveUserPermission.includes(ActivePermission.APPROVER)) {
        handleSubmitFormAfterAssignment({
          approver: [{ id: userInfo?.id }],
          reviewer: [{ id: userInfo?.id }],
          data,
        });
      } else {
        openModalAssignment(true);
      }
    }
    return null;
  };

  useEffect(() => {
    if (errorList?.length) {
      errorList?.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: capitalizeFirstLetter(item.message) });
            break;
          case 'type':
            setError('type', { message: capitalizeFirstLetter(item.message) });
            break;
          case 'locationId':
            setError('locationId', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          case 'questions':
            setError('questions', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          case 'answerOptions': {
            switch (item.message) {
              case t('errorMessage.longer1Characters'):
                setAOptionsError(
                  renderDynamicLabel(
                    dynamicFields,
                    COMMON_DYNAMIC_FIELDS['This field is required'],
                  ),
                );
                break;
              case t('errorMessage.optionsDuplicateValueApi'):
                setAOptionsError(
                  renderDynamicLabel(
                    dynamicFields,
                    AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                      "Question's option must not contains duplicate value"
                    ],
                  ),
                );
                break;
              case t('errorMessage.least2AnswersApi'):
                setAOptionsError(
                  renderDynamicLabel(
                    dynamicFields,
                    AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                      'Must have at least 2 options'
                    ],
                  ),
                );
                break;
              default:
                setAOptionsError(capitalizeFirstLetter(item.message));
                break;
            }

            break;
          }
          case 'ratingCriteria': {
            setError('ratingCriteria', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          }
          case 'topicId': {
            setError('topicId', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          }
          default:
            break;
        }
      });
    } else {
      clearErrors();
      setAOptionsError('');
    }
  }, [clearErrors, dynamicFields, errorList, setError, t]);

  const fillDataQuestion = useCallback(
    (data: QuestionDetail) => {
      if (data) {
        setValue('code', data.code);
        setValue('hint', data.hint);
        setValue('isMandatory', data.isMandatory);
        setValue('isHasRemark', !!data.hasRemark);
        setValue('hasRemark', data.hasRemark);
        setValue('questions', data.question);
        setValue('type', data.type);
        setValue(
          'attachments',
          data?.attachments?.length ? [...data?.attachments] : [],
        );
        setCurrentQuestionType(data.type);
        setValue('ratingCriteria', data.ratingCriteria);
        setValue('requireEvidencePicture', data.requireEvidencePicture);
        setValue('minPictureRequired', data.minPictureRequired);

        const optionsCategory: NewAsyncOptions[] =
          dataPackage?.mainCategory?.filter(
            (i) => i.value === data?.mainCategoryId,
          );

        setValue('mainCategory', optionsCategory);
        const optionsLocation: NewAsyncOptions[] =
          dataPackage?.location?.filter((i) => i.value === data?.locationId);
        setValue('locationId', optionsLocation);
        const optionsTopic: NewAsyncOptions[] = dataPackage?.topic?.filter(
          (i) => i.value === data?.topicId,
        );
        setValue('topicId', optionsTopic);

        const vesselType = data?.referencesCategoryData
          ?.filter((item) => item?.masterTableId === MasterDataId.VESSEL_TYPE)
          ?.map((item) => ({
            label:
              dataPackage?.vesselType?.find((i) => i.value === item.valueId)
                ?.label || '',
            value: item.valueId,
          }));

        setValue('vesselType', vesselType || []);

        const shipRanks = data?.referencesCategoryData
          ?.filter((item) => item?.masterTableId === MasterDataId.SHIP_RANK)
          ?.map((item) => ({
            label:
              dataPackage?.shipRanks?.find((i) => i.value === item.valueId)
                ?.label || '',
            value: item.valueId,
          }));

        setValue('shipRanks', shipRanks || []);

        const shoreRank = data?.referencesCategoryData
          ?.filter((item) => item?.masterTableId === MasterDataId.SHORE_RANK)
          ?.map((item) => ({
            label:
              dataPackage?.shoreRank?.find((i) => i.value === item.valueId)
                ?.label || '',
            value: item.valueId,
          }));
        setValue('shoreRank', shoreRank || []);

        const shipDepartment = data?.referencesCategoryData
          ?.filter(
            (item) => item?.masterTableId === MasterDataId.SHIP_DEPARTMENT,
          )
          ?.map((item) => ({
            label:
              dataPackage?.shipDepartment?.find((i) => i.value === item.valueId)
                ?.label || '',
            value: item.valueId,
          }));

        setValue('shipDepartment', shipDepartment || []);

        const shoreDepartment = data?.referencesCategoryData
          ?.filter(
            (item) => item?.masterTableId === MasterDataId.SHORE_DEPARTMENT,
          )
          ?.map((item) => ({
            label:
              dataPackage?.shoreDepartment?.find(
                (i) => i.value === item.valueId,
              )?.label || '',
            value: item.valueId,
          }));

        setValue('shoreDepartment', shoreDepartment || []);

        const department = data?.referencesCategoryData
          ?.filter((item) => item?.masterTableId === MasterDataId.DEPARTMENT)
          ?.map((item) => ({
            label:
              dataPackage?.department?.find((i) => i.value === item.valueId)
                ?.label || '',
            value: item.valueId,
          }));
        setValue('department', department || []);

        // if (data?.attachments?.length > 0) {
        //   dispatch(
        //     getListFileActions.request({ ids: data?.attachments || [] }),
        //   );
        // } else {
        //   dispatch(getListFileActions.success([]));
        // }

        data.referencesCategoryData?.forEach((item) => {
          switch (item.masterTableId) {
            case MasterDataId.CRITICALITY: {
              setValue('criticality', item?.value);
              break;
            }
            case MasterDataId.POTENTIAL_RISK: {
              setValue('potentialRisk', item?.valueId);
              break;
            }

            case MasterDataId.REG: {
              setValue('reg', item?.value);
              break;
            }

            case MasterDataId.INFOR: {
              setValue('infor', item?.value);
              break;
            }

            case MasterDataId.VIQ: {
              const optionsVip: NewAsyncOptions[] = dataPackage?.VIQ?.filter(
                (i) => i.value === item.valueId,
              );
              setValue('VIQ', optionsVip);
              break;
            }

            case MasterDataId.SECOND_CATEGORY: {
              const optionsSubCategory: NewAsyncOptions[] =
                dataPackage?.subCategory?.filter(
                  (i) => i.value === item.valueId,
                );
              setValue('subCategory1st', optionsSubCategory);
              break;
            }
            case MasterDataId.THIRD_CATEGORY: {
              const optionsSubCategory2: NewAsyncOptions[] =
                dataPackage?.subCategory2?.filter(
                  (i) => i.value === item.valueId,
                );
              setValue('category2nd', optionsSubCategory2);
              break;
            }

            case MasterDataId.CHARTER_OWNER: {
              const optionsCharterOwner: NewAsyncOptions[] =
                dataPackage?.charterOwner?.filter(
                  (i) => i.value === item.valueId,
                );
              setValue('charterOwner', optionsCharterOwner);
              break;
            }
            case MasterDataId.CDI: {
              const optionsCDI: NewAsyncOptions[] = dataPackage?.CDI?.filter(
                (i) => i.value === item.valueId,
              );
              setValue('CDI', optionsCDI);
              break;
            }
            default:
              break;
          }
        });
        if (data.type) {
          const newOptionsAnswer: AnswerOptionValueModel[] =
            data.answerOptions?.map((answer) => {
              if (data.remarkSpecificAnswers.includes(answer.id)) {
                return {
                  id: answer.id,
                  value: answer.content,
                  idValue: answer?.value?.id || '',
                  name: answer?.value?.number?.toString() || '',
                  hasRemark: true,
                };
              }
              return {
                id: answer.id,
                value: answer.content,
                hasRemark: false,
                idValue: answer?.value?.id || '',
                name: answer?.value?.number?.toString() || '',
              };
            });

          setAnswerOptions([...newOptionsAnswer]);
        }
      }
      if (isCreate && !data) {
        setValue('attachments', []);
      }
    },
    [
      dataPackage?.CDI,
      dataPackage?.VIQ,
      dataPackage?.charterOwner,
      dataPackage?.department,
      dataPackage?.location,
      dataPackage?.mainCategory,
      dataPackage?.shipDepartment,
      dataPackage?.shipRanks,
      dataPackage?.shoreDepartment,
      dataPackage?.shoreRank,
      dataPackage?.subCategory,
      dataPackage?.subCategory2,
      dataPackage?.topic,
      dataPackage?.vesselType,
      isCreate,
      setAnswerOptions,
      setValue,
    ],
  );

  const handleDuplicate = (item: Question) => {
    setIsMultiQuestion(false);
    setAnswerOptions([
      { id: v4(), value: '', hasRemark: false, idValue: '' },
      { id: v4(), value: '', hasRemark: false },
    ]);
    getQuestionDetailApi({
      idAuditChecklist: item?.auditChecklistId,
      idQuestion: item?.id,
    })
      .then((r) => {
        const optionsCategory: NewAsyncOptions[] =
          dataPackage?.mainCategory?.filter(
            (i) => i?.value === r.data?.mainCategoryId,
          );
        const optionsLocation: NewAsyncOptions[] =
          dataPackage?.location?.filter((i) => i?.value === r.data?.locationId);
        const optionsTopic: NewAsyncOptions[] = dataPackage?.topic?.filter(
          (i) => i?.value === r.data?.topicId,
        );
        const referencesCategoryData = r.data?.referencesCategoryData?.map(
          (i) => {
            if (
              i.masterTableId === MasterDataId.CRITICALITY ||
              i.masterTableId === MasterDataId.REG ||
              i.masterTableId === MasterDataId.INFOR
            ) {
              return { id: i.masterTableId, value: i?.value };
            }
            return { id: i.masterTableId, value: i?.valueId };
          },
        );
        const answerOptions =
          r.data?.answerOptions?.map((answer) => {
            if (answer?.value) {
              return {
                id: answer.id,
                content: answer?.content,
                valueId: answer.value?.id,
              };
            }

            return {
              id: answer.id,
              content: answer?.content,
            };
          }) || [];
        let maxOrder = 0;
        listQuestion?.forEach((i) => {
          if (i.order > maxOrder) {
            maxOrder = i.order;
          }
        });
        const remarkSpecificAnswers = r.data?.answerOptions
          ?.filter(
            (answer) =>
              r.data?.remarkSpecificAnswers &&
              r.data?.remarkSpecificAnswers.includes(answer.id),
          )
          .map((answer) => answer.content);
        let newBody: any = {
          order: maxOrder + 1,
          code: r.data?.code,
          hint: r.data?.hint || undefined,
          isMandatory: r.data?.isMandatory,
          hasRemark: r.data?.hasRemark,
          questions: [r.data?.question],
          type: r.data?.type,
          ratingCriteria: r.data?.ratingCriteria || undefined,
          requireEvidencePicture: r.data?.requireEvidencePicture,
          minPictureRequired: r.data?.minPictureRequired || 0,
          remarkSpecificAnswers:
            r.data?.hasRemark || r.data?.hasRemark === HasRemarkType.SPECIFIC
              ? remarkSpecificAnswers
              : [],
          mainCategoryId:
            optionsCategory &&
            optionsCategory.length > 0 &&
            optionsCategory[0]?.value,
          locationId:
            optionsLocation &&
            optionsLocation.length > 0 &&
            optionsLocation[0]?.value,
          topicId:
            optionsTopic && optionsTopic.length > 0 && optionsTopic[0]?.value,
          referencesCategoryData,
          answerOptions,
        };
        if (r?.data?.attachments?.length > 0) {
          newBody = { ...newBody, attachments: r?.data?.attachments };
        }
        dispatch(
          createQuestionAction.request({
            id,
            body: newBody,
            isDuplicate: true,
            handleSuccess: (newQuestion?: Question) => {
              if (newQuestion) {
                reset();
                setQuestionDetailChecklist(
                  newQuestion?.auditChecklistId,
                  newQuestion?.id,
                );
              }
            },
          }),
        );
      })
      .catch((e) => toastError(`${e} in form`));
  };

  useEffect(() => {
    fetchCategoryData(
      '',
      '2',
      mainCategoryWatch && mainCategoryWatch[0]?.value?.toString(),
    );
    fillDataQuestion(questionDetail);
    if (
      isFirstLoading &&
      !history.location.pathname.includes(AppRouteConst.AUDIT_CHECKLIST_CREATE)
    ) {
      setInitialDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionDetail]);

  useEffect(() => {
    if (
      (!answerOptions?.length ||
        !answerOptions?.find((item) => item.value?.trim())) &&
      isSubmitted
    ) {
      setAOptionsError(
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      );
    }
    if (
      (answerOptions && answerOptions.length < 2) ||
      (isSubmitted &&
        answerOptions.length >= 2 &&
        answerOptions?.find((item) => !item.value?.trim()))
    ) {
      setAOptionsError(
        renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Must have at least 2 options'
          ],
        ),
      );
    } else {
      setAOptionsError('');
    }
  }, [answerOptions, dynamicFields, isSubmitted]);

  useEffect(() => {
    if (
      listQuestion &&
      listQuestion.length > 0 &&
      isFirstLoading &&
      !isCreate
    ) {
      setQuestionDetailChecklist(
        listQuestion[0].auditChecklistId,
        listQuestion[0].id,
      );
    }
    setIsFirstLoading(false);
  }, [isCreate, isFirstLoading, listQuestion, setQuestionDetailChecklist]);

  const handleExportTemPlate = useCallback(() => {
    exportTemPlateApi(id)
      .then(async (res) => {
        const fileName = res?.headers['content-disposition']
          ?.split('filename=')[1]
          ?.split(';')[0];
        const contentType = res?.headers['content-type'];
        handleAndDownloadFileXLSX({
          data: res?.data,
          fileName,
          contentType,
        });
      })
      .catch((e) => {
        toastError(e);
      });
  }, [id]);

  const handleExportQuestion = useCallback(() => {
    exportExportQuestionApi(id)
      .then(async (res) => {
        const fileName = res?.headers['content-disposition']
          ?.split('filename=')[1]
          ?.split(';')[0];
        const contentType = res?.headers['content-type'];
        handleAndDownloadFileXLSX({
          data: res?.data,
          fileName,
          contentType,
        });
      })
      .catch((e) => {
        toastError(e);
      });
  }, [id]);

  const handleClickIcon = (name: string) => {
    let newState = [...iconActives];
    if (iconActives?.includes(name)) {
      newState = iconActives.filter((item) => item !== name);
    } else {
      newState = ReferencesCategoryList?.filter((item) =>
        [...iconActives, name].includes(item.name),
      )?.map((item) => item.name);
    }
    setIconActives(newState);
  };

  const fillDataForm = (item: Question) => {
    setQuestionDetailChecklist(item?.auditChecklistId, item?.id);
  };

  const renderAnswerArray = () => (
    <div className={styles.answerArray}>
      {answerOptions &&
        answerOptions.map((i) => (
          <CheckBox
            key={i.id}
            checked={
              !!answerOptions?.find(
                (answer) => answer.id.includes(i.id) && answer.hasRemark,
              )
            }
            disabled={!isEdit || loadingQuestionDetail || initialDisable}
            onChange={() => {
              const list = [...answerOptions];
              const optionIndex = list.findIndex(
                (answer) => answer.id === i.id,
              );
              setRemarkSpecificAnswersError(null);
              if (optionIndex > -1) {
                const currentHasRemark = list[optionIndex].hasRemark;
                list[optionIndex].hasRemark = !currentHasRemark;
                setAnswerOptions(list);
              }
            }}
            checkMarkClassName={styles.answer}
            labelClassName={styles.answerLabel}
            label={i.value}
            hasError={!!remarkSpecificAnswersError}
          />
        ))}
    </div>
  );

  const buttonValue = useMemo(() => {
    if (!isEdit || initialDisable) {
      return renderDynamicLabel(
        dynamicFields,
        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
          'View value'
        ],
      );
    }
    return questionDetail
      ? renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Edit value'
          ],
        )
      : renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Add value'
          ],
        );
  }, [isEdit, initialDisable, questionDetail, dynamicFields]);

  const imageButtonValue = useMemo(() => {
    switch (buttonValue) {
      case renderDynamicLabel(
        dynamicFields,
        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
          'Add value'
        ],
      ):
        return images.icons.icAddCircle;
      case renderDynamicLabel(
        dynamicFields,
        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
          'View value'
        ],
      ):
        return images.icons.icViewDetail;
      default:
        return images.icons.icEdit;
    }
  }, [buttonValue, dynamicFields]);

  const renderQuestionInformation = () => (
    <>
      <div className={styles.collapseContainer}>
        <Row className="mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Question code'
                ],
              )}
              isRequired
              readOnly={!isEdit || loadingQuestionDetail || initialDisable}
              disabledCss={!isEdit || loadingQuestionDetail || initialDisable}
              placeholder={
                isEdit && !initialDisable
                  ? renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Enter question code'],
                    )
                  : ''
              }
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              id="code"
              autoFocus={firstErrorId === 'code'}
              maxLength={20}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Question type'
                ],
              )}
              isRequired
              id="type"
              autoFocus={firstErrorId === 'type'}
              messageRequired={errors?.type?.message || ''}
              placeholder={
                isEdit && !initialDisable
                  ? renderDynamicLabel(
                      dynamicFields,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )
                  : ''
              }
              data={QUESTION_TYPE_OPTIONS}
              notAllowSortData
              disabled={!isEdit || loadingQuestionDetail || initialDisable}
              name="type"
              onChange={(value) => {
                switch (value) {
                  case OptionsType.YES_NO:
                    setCurrentQuestionType(OptionsType.YES_NO);
                    setAnswerOptions([
                      { id: v4(), value: 'Yes', hasRemark: false, idValue: '' },
                      { id: v4(), value: 'No', hasRemark: false, idValue: '' },
                    ]);
                    break;
                  case OptionsType.YES_NO_NA:
                    setCurrentQuestionType(OptionsType.YES_NO_NA);
                    setAnswerOptions([
                      { id: v4(), value: 'Yes', hasRemark: false, idValue: '' },
                      { id: v4(), value: 'No', hasRemark: false, idValue: '' },
                      { id: v4(), value: 'NA', hasRemark: false, idValue: '' },
                    ]);
                    break;
                  case OptionsType.COMBO:
                    if (
                      currentQuestionType !== OptionsType.COMBO &&
                      currentQuestionType !== OptionsType.RADIO
                    ) {
                      setCurrentQuestionType(OptionsType.COMBO);
                      setAnswerOptions([
                        { id: v4(), value: '', hasRemark: false, idValue: '' },
                        { id: v4(), value: '', hasRemark: false, idValue: '' },
                      ]);
                    }
                    break;
                  case OptionsType.RADIO:
                    if (
                      currentQuestionType !== OptionsType.COMBO &&
                      currentQuestionType !== OptionsType.RADIO
                    ) {
                      setCurrentQuestionType(OptionsType.RADIO);
                      setAnswerOptions([
                        { id: v4(), value: '', hasRemark: false, idValue: '' },
                        { id: v4(), value: '', hasRemark: false, idValue: '' },
                      ]);
                    }
                    break;
                  default:
                    break;
                }
              }}
              className="w-100"
              control={control}
            />
          </Col>
          <Col className={cx('p-0 ms-3', styles.btnWrapper)}>
            <Row>
              <Col className="d-flex justify-content-end">
                <Button
                  onClick={handleOpenModalValue}
                  buttonSize={ButtonSize.Medium}
                  disabled={!questionType}
                  renderSuffix={<img src={imageButtonValue} alt="createNew" />}
                >
                  <span className="pe-2">{buttonValue}</span>
                </Button>
              </Col>
              <Col
                className={cx(
                  'd-flex justify-content-end',
                  styles.wrapAddValue,
                )}
              >
                <ModalListTable
                  buttonOpen={
                    <Button
                      disabled={
                        !isEdit || loadingQuestionDetail || initialDisable
                      }
                      buttonType={ButtonType.Outline}
                      className={cx(styles.addFinding)}
                      onClick={() => {
                        setIsOpenFinding(true);
                        setAddFinding([]);
                      }}
                    >
                      <span className={styles.text}>
                        {renderDynamicLabel(
                          dynamicFields,
                          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                            .questionList['Add findings'],
                        )}
                      </span>
                      <img src={images.icons.icSearchBlue} alt="findings" />
                    </Button>
                  }
                  disable={!isEdit || loadingQuestionDetail || initialDisable}
                  data={dataAddFinding}
                  values={addFinding}
                  title={renderDynamicLabel(
                    dynamicFields,
                    AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                      'Add findings'
                    ],
                  )}
                  rowLabels={rowLabelsAddFinding}
                  onChangeValues={(data) => {
                    setAddFinding(data);
                    setIsOpenFinding(false);
                    if (isEdit && !questionDetail) {
                      setIsMultiQuestion(true);
                    }
                  }}
                  disableCloseWhenClickOut
                  dynamicLabels={dynamicFields}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <div id="questions" className="d-flex justify-content-between p-0">
            <div className={cx('d-flex', styles.wrapLabel)}>
              <p className={cx('mb-0 ', styles.label)}>
                {renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                    .Question,
                )}
              </p>
              <img src={images.icons.icRequiredAsterisk} alt="required" />
            </div>
            <div>
              {isEdit && !questionDetail && (
                <ToggleSwitch
                  label={renderDynamicLabel(
                    dynamicFields,
                    AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                      'Add multiple'
                    ],
                  )}
                  disabled={!isEdit || loadingQuestionDetail || initialDisable}
                  onChange={(e) => {
                    setIsMultiQuestion(e);
                  }}
                  checked={isMultiQuestion}
                />
              )}
            </div>
          </div>

          <FormProvider {...method}>
            <ExpandTextAreaForm
              disabled={!isEdit || loadingQuestionDetail || initialDisable}
              maxRows={10000000}
              modalMinRows={1}
              modalMaxRows={30}
              placeholder={
                isEdit && !initialDisable
                  ? renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Enter question'],
                    )
                  : ''
              }
              isMulti={isMultiQuestion}
              autoFocus={firstErrorId === 'questions'}
              name="questions"
              maxLength={2000}
              dynamicLabels={dynamicFields}
            />
          </FormProvider>
        </Row>
        <div id="answer_option" />
        <OptionsContainer
          disabled={!isEdit || loadingQuestionDetail || initialDisable}
          control={control}
          focus={firstErrorId === 'answer_option'}
          messageError={aOptionsError}
          className="my-2"
          handleSetOptions={(options) => {
            setAnswerOptions(options);
          }}
          data={answerOptions}
          dynamicLabels={dynamicFields}
        />
        <Row className="pt-2 mx-0">
          <Col xl={5} xs={3} className={cx('p-0')}>
            <ToggleSwitch
              disabled={!isEdit || loadingQuestionDetail || initialDisable}
              label={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                  .Mandatory,
              )}
              control={control}
              name="isMandatory"
            />
          </Col>
          <Col xl={7} xs={9} className={cx('p-0')}>
            <div
              className={cx('d-flex flex-row', styles.hasRemark)}
              id="remark-specific-answers"
            >
              <ToggleSwitch
                disabled={!isEdit || loadingQuestionDetail || initialDisable}
                label={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Mandatory remark for findings'
                  ],
                )}
                control={control}
                name="isHasRemark"
                labelClassName={styles.hasRemarkLabel}
                onChange={(checked) => {
                  setRemarkSpecificAnswersError(null);
                  if (checked) {
                    setValue('hasRemark', HasRemarkType.ALL);
                  } else {
                    setValue('hasRemark', null);
                  }
                }}
              />
              {isHasRemark && (
                <div className={styles.allSpecific}>
                  <Radio
                    {...register('hasRemark')}
                    label={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.All,
                    )}
                    value={HasRemarkType.ALL}
                    className={styles.options}
                    disabled={
                      (!isEdit || loadingQuestionDetail || initialDisable) &&
                      questionDetail?.hasRemark &&
                      !questionDetail?.hasRemark.includes(HasRemarkType.ALL)
                    }
                    name="hasRemark"
                  />
                  <Radio
                    {...register('hasRemark')}
                    label={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.Specific,
                    )}
                    value={HasRemarkType.SPECIFIC}
                    className={styles.options}
                    disabled={
                      (!isEdit || loadingQuestionDetail || initialDisable) &&
                      questionDetail?.hasRemark &&
                      !questionDetail?.hasRemark.includes(
                        HasRemarkType.SPECIFIC,
                      )
                    }
                    name="hasRemark"
                  />
                </div>
              )}
              {hasRemark?.includes(HasRemarkType.SPECIFIC) && questionType && (
                <div>
                  {renderAnswerArray()}
                  {remarkSpecificAnswersError && (
                    <div className={styles.errorMessage}>
                      {remarkSpecificAnswersError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
        {loadingQuestionDetail && (
          <img
            src={images.common.loading}
            className={styles.loading}
            alt="loading"
          />
        )}
      </div>
    </>
  );

  const renderVerification = () => (
    <>
      <div className={styles.collapseContainer}>
        <Row className="">
          <Col xl={4} lg={6} className={cx('pt-2 ', styles.col)}>
            <p className={cx(styles.mb_4, styles.textLabel)}>
              {renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Evidence picture required'
                ],
              )}
            </p>
            <ToggleSwitch
              disabled={!isEdit || loadingQuestionDetail || initialDisable}
              control={control}
              name="requireEvidencePicture"
              onChange={(e) => {
                if (e) {
                  setValue('minPictureRequired', 1);
                } else {
                  setValue('minPictureRequired', 0);
                }
                clearErrors('minPictureRequired');
              }}
            />
          </Col>
          <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
            <InputForm
              messageRequired={errors?.minPictureRequired?.message || ''}
              maxLength={3}
              placeholder={
                isEdit && !initialDisable
                  ? renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Enter minimum picture required'],
                    )
                  : ''
              }
              label={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Minimum picture required'
                ],
              )}
              patternValidate={REGEXP_NUMERIC_VALUE}
              control={control}
              name="minPictureRequired"
              disabled={!isEdit || loadingQuestionDetail || initialDisable}
            />
          </Col>
          <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
            <AsyncSelectForm
              dynamicLabels={dynamicFields}
              disabled={!isEdit || loadingQuestionDetail || initialDisable}
              control={control}
              name="topicId"
              id="topicId"
              labelSelect={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                  .Topic,
              )}
              isRequired
              titleResults={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Selected Topic'
                ],
              )}
              placeholder={
                isEdit && !initialDisable
                  ? renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Please select'],
                    )
                  : ''
              }
              searchContent={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                  .Topic,
              )}
              textSelectAll={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Select all'
                ],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                  .Confirm,
              )}
              messageRequired={errors?.topicId?.message || ''}
              onChangeSearch={(value: string) => fetchTopicsData(value)}
              options={dataPackage?.topic || []}
            />
          </Col>
        </Row>
        <div>
          <div className={cx('d-flex pb-1 pt-2', styles.wrapLabel)}>
            <p className={cx('mb-0', styles.label)}>
              {renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Rating criteria'
                ],
              )}
            </p>
          </div>
          <TextAreaForm
            disabled={!isEdit || loadingQuestionDetail || initialDisable}
            control={control}
            placeholder={
              isEdit && !initialDisable
                ? renderDynamicLabel(
                    dynamicFields,
                    AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                      'Enter rating criteria'
                    ],
                  )
                : ''
            }
            autoSize={{ minRows: 1 }}
            name="ratingCriteria"
            maxLength={500}
          />
        </div>
        <div>
          <div className={cx('d-flex pb-1 pt-2', styles.wrapLabel)}>
            <p className={cx('mb-0', styles.label)}>
              {renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                  .Hint,
              )}
            </p>
          </div>
          <TextAreaForm
            disabled={!isEdit || loadingQuestionDetail || initialDisable}
            control={control}
            placeholder={
              isEdit && !initialDisable
                ? renderDynamicLabel(
                    dynamicFields,
                    AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                      'Enter hint'
                    ],
                  )
                : ''
            }
            minRows={7}
            maxRows={7}
            className={styles.noScroll}
            name="hint"
            autoSize={{ minRows: 1 }}
            maxLength={2000}
          />
        </div>
        {loadingQuestionDetail && (
          <img
            src={images.common.loading}
            className={styles.loading}
            alt="loading"
          />
        )}
      </div>
    </>
  );

  const renderReferencesCategory = () => (
    <>
      <div
        className={cx(
          styles.collapseContainer,
          styles.collapseContainerBottomPadding,
        )}
      >
        <p className={cx('fw-bold', styles.titleGroup)}>
          {renderDynamicLabel(
            dynamicFields,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'General information'
            ],
          )}
        </p>
        <Row className={cx('', styles.row)}>
          <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
            <AsyncSelectForm
              disabled={!isEdit || loadingQuestionDetail || initialDisable}
              control={control}
              name="locationId"
              dynamicLabels={dynamicFields}
              id="locationId"
              labelSelect={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                  .Location,
              )}
              isRequired
              titleResults={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Selected group'
                ],
              )}
              placeholder={
                isEdit && !initialDisable
                  ? renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Please select'],
                    )
                  : ''
              }
              searchContent={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                  .Location,
              )}
              textSelectAll={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Select all'
                ],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                  .Confirm,
              )}
              messageRequired={errors?.locationId?.message || ''}
              onChangeSearch={(value: string) => fetchLocationData(value)}
              options={dataPackage?.location || []}
            />
          </Col>

          <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
            {dataPackage?.listRefCategory?.find(
              (i) => i === MasterDataId.VESSEL_TYPE,
            ) && (
              <AsyncSelectResultForm
                multiple
                isRequired
                dynamicLabels={dynamicFields}
                disabled={!isEdit || loadingQuestionDetail || initialDisable}
                labelSelect={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Vessel type'
                  ],
                )}
                control={control}
                name="vesselType"
                id="vesselType"
                showResult
                titleResults={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Selected group'
                  ],
                )}
                placeholder={
                  isEdit && !initialDisable
                    ? renderDynamicLabel(
                        dynamicFields,
                        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                          .questionList['Please select'],
                      )
                    : ''
                }
                searchContent={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Vessel type'
                  ],
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Select all'
                  ],
                )}
                messageRequired={errors?.vesselType?.message || ''}
                onChangeSearch={(value: string) => {
                  const newData = filterContentSelect(
                    value,
                    dataPackage?.vesselType || [],
                  );
                  setVesselOptions(newData);
                }}
                options={vesselOptions}
              />
            )}

            {dataPackage?.listRefCategory?.find(
              (i) => i === MasterDataId.DEPARTMENT,
            ) && (
              <AsyncSelectResultForm
                dynamicLabels={dynamicFields}
                multiple
                disabled={!isEdit || loadingQuestionDetail || initialDisable}
                labelSelect={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                    .Department,
                )}
                control={control}
                name="department"
                id="department"
                titleResults={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Selected group'
                  ],
                )}
                placeholder={
                  isEdit && !initialDisable
                    ? renderDynamicLabel(
                        dynamicFields,
                        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                          .questionList['Please select'],
                      )
                    : ''
                }
                searchContent={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                    .Department,
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Select all'
                  ],
                )}
                onChangeSearch={(value: string) => {
                  const newData = filterContentSelect(
                    value,
                    dataPackage?.department || [],
                  );
                  setDepartmentOptions(newData);
                }}
                options={departmentOptions}
              />
            )}
          </Col>
        </Row>

        {/* reference */}
        {[
          MasterDataId.CDI,
          MasterDataId.CHARTER_OWNER,
          MasterDataId.VIQ,
          MasterDataId.REG,
        ].some((i) => dataPackage?.listRefCategory?.includes(i)) && (
          <>
            <p className={cx('fw-bold', styles.titleGroup)}>Reference </p>
            <Row className={cx('pt-2 ', styles.row)}>
              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.CDI,
              ) && (
                <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
                  <AsyncSelectForm
                    dynamicLabels={dynamicFields}
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    control={control}
                    name="CDI"
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.CDI,
                    )}
                    titleResults={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Selected group'],
                    )}
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Please select'],
                          )
                        : ''
                    }
                    searchContent={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.CDI,
                    )}
                    textSelectAll={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Select all'],
                    )}
                    textBtnConfirm={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.Confirm,
                    )}
                    messageRequired={errors?.CDI?.message || ''}
                    onChangeSearch={(value: string) => fetchCDIData(value)}
                    options={dataPackage?.CDI || []}
                  />
                </Col>
              )}
              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.CHARTER_OWNER,
              ) && (
                <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
                  <AsyncSelectForm
                    dynamicLabels={dynamicFields}
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    control={control}
                    name="charterOwner"
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Charter owner'],
                    )}
                    titleResults={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Selected Charter/ Owner'],
                    )}
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Please select'],
                          )
                        : ''
                    }
                    searchContent={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Charter/ Owner'],
                    )}
                    textSelectAll={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Select all'],
                    )}
                    textBtnConfirm={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.Confirm,
                    )}
                    onChangeSearch={(value: string) =>
                      fetchCharterOwnerData(value)
                    }
                    options={dataPackage?.charterOwner || []}
                  />
                </Col>
              )}

              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.VIQ,
              ) && (
                <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
                  <AsyncSelectForm
                    dynamicLabels={dynamicFields}
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    control={control}
                    name={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.VIQ,
                    )}
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.VIQ,
                    )}
                    titleResults={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Selected VIQ'],
                    )}
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Please select'],
                          )
                        : ''
                    }
                    searchContent={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.VIQ,
                    )}
                    textSelectAll={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Select all'],
                    )}
                    textBtnConfirm={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.Confirm,
                    )}
                    onChangeSearch={(value: string) => fetchVIQData(value)}
                    options={dataPackage?.VIQ || []}
                  />
                </Col>
              )}
              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.REG,
              ) && (
                <Col span={12} className={cx('pt-2', styles.col)}>
                  <Input
                    label={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.Reg,
                    )}
                    readOnly={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    disabledCss={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Enter reg'],
                          )
                        : ''
                    }
                    messageRequired={errors?.reg?.message || ''}
                    {...register('reg')}
                    id="reg"
                    autoFocus={firstErrorId === 'reg'}
                    maxLength={50}
                  />
                </Col>
              )}
            </Row>
          </>
        )}

        {/* category */}
        <p className={cx('fw-bold', styles.titleGroup)}>
          {renderDynamicLabel(
            dynamicFields,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
              .Category,
          )}{' '}
        </p>
        <Row className={cx('', styles.row)}>
          <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
            <AsyncSelectForm
              dynamicLabels={dynamicFields}
              disabled={!isEdit || loadingQuestionDetail || initialDisable}
              control={control}
              isRequired
              name="mainCategory"
              id="mainCategory"
              labelSelect={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Main category'
                ],
              )}
              titleResults={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Selected main category'
                ],
              )}
              placeholder={
                isEdit && !initialDisable
                  ? renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Please select'],
                    )
                  : ''
              }
              searchContent={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Main category'
                ],
              )}
              textSelectAll={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                  'Select all'
                ],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                  .Confirm,
              )}
              messageRequired={errors?.mainCategory?.message || ''}
              onChangeSearch={(value: string) => fetchCategoryData(value, '1')}
              options={dataPackage?.mainCategory || []}
            />
          </Col>
          <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
            {dataPackage?.listRefCategory?.find(
              (i) => i === MasterDataId.SECOND_CATEGORY,
            ) && (
              <AsyncSelectForm
                dynamicLabels={dynamicFields}
                disabled={!isEdit || loadingQuestionDetail || initialDisable}
                control={control}
                name="subCategory1st"
                labelSelect={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Second category'
                  ],
                )}
                titleResults={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Selected second category'
                  ],
                )}
                placeholder={isEdit && !initialDisable ? 'Please select' : ''}
                searchContent={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Second category'
                  ],
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Select all'
                  ],
                )}
                textBtnConfirm={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                    .Confirm,
                )}
                onChangeSearch={(value: string) => {
                  fetchCategoryData(
                    value,
                    '2',
                    mainCategoryWatch &&
                      mainCategoryWatch[0]?.value?.toString(),
                  );
                }}
                options={dataPackage?.subCategory || []}
              />
            )}
          </Col>
          <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
            {dataPackage?.listRefCategory?.find(
              (i) => i === MasterDataId.THIRD_CATEGORY,
            ) && (
              <AsyncSelectForm
                dynamicLabels={dynamicFields}
                disabled={!isEdit || loadingQuestionDetail || initialDisable}
                control={control}
                name="category2nd"
                labelSelect={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Third category'
                  ],
                )}
                titleResults="Selected Third Category"
                placeholder={isEdit && !initialDisable ? 'Please select' : ''}
                searchContent={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Third category'
                  ],
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                    'Selected third category'
                  ],
                )}
                textBtnConfirm={renderDynamicLabel(
                  dynamicFields,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                    .Confirm,
                )}
                onChangeSearch={(value: string) =>
                  fetchCategoryData(value, '3')
                }
                options={dataPackage?.subCategory2 || []}
              />
            )}
          </Col>
        </Row>

        {[
          MasterDataId.SHIP_DEPARTMENT,
          MasterDataId.SHIP_RANK,
          MasterDataId.SHORE_DEPARTMENT,
          MasterDataId.SHORE_RANK,
          MasterDataId.CRITICALITY,
          MasterDataId.POTENTIAL_RISK,
          MasterDataId.INFOR,
        ].some((i) => dataPackage?.listRefCategory?.includes(i)) ? (
          <>
            <p className={cx('fw-bold', styles.titleGroup)}>Information </p>
            <Row className={cx(' ', styles.row)}>
              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.SHIP_DEPARTMENT,
              ) && (
                <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
                  <AsyncSelectResultForm
                    dynamicLabels={dynamicFields}
                    multiple
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    control={control}
                    name="shipDepartment"
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Ship department'],
                    )}
                    titleResults={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Selected ship department'],
                    )}
                    id="shipDepartment"
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Please select'],
                          )
                        : ''
                    }
                    showResult
                    searchContent={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Ship department'],
                    )}
                    textSelectAll={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Select all'],
                    )}
                    textBtnConfirm={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.Confirm,
                    )}
                    messageRequired={errors?.shipDepartment?.message || ''}
                    onChangeSearch={(value: string) =>
                      fetchShipDepartmentData(value)
                    }
                    options={dataPackage?.shipDepartment || []}
                  />
                </Col>
              )}

              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.SHIP_RANK,
              ) && (
                <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
                  <AsyncSelectResultForm
                    multiple
                    dynamicLabels={dynamicFields}
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    control={control}
                    name="shipRanks"
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Ship rank'],
                    )}
                    titleResults={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Selected ship rank'],
                    )}
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Please select'],
                          )
                        : ''
                    }
                    showResult
                    searchContent={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Ship rank'],
                    )}
                    textSelectAll={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Select all'],
                    )}
                    textBtnConfirm={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.Confirm,
                    )}
                    onChangeSearch={(value: string) =>
                      fetchShipRanksData(value)
                    }
                    options={dataPackage?.shipRanks || []}
                    messageRequired={errors?.shipRanks?.message || ''}
                  />
                </Col>
              )}
              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.SHORE_DEPARTMENT,
              ) && (
                <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
                  <AsyncSelectResultForm
                    multiple
                    dynamicLabels={dynamicFields}
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    control={control}
                    name="shoreDepartment"
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Shore department'],
                    )}
                    titleResults={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Selected shore department'],
                    )}
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Please select'],
                          )
                        : ''
                    }
                    showResult
                    searchContent={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Shore department'],
                    )}
                    textSelectAll={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Select all'],
                    )}
                    textBtnConfirm={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.Confirm,
                    )}
                    onChangeSearch={(value: string) =>
                      fetchShoreDepartmentData(value)
                    }
                    options={dataPackage?.shoreDepartment || []}
                    messageRequired={errors?.shipRanks?.message || ''}
                  />
                </Col>
              )}
              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.SHORE_RANK,
              ) && (
                <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
                  <AsyncSelectResultForm
                    multiple
                    dynamicLabels={dynamicFields}
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    control={control}
                    name="shoreRank"
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Shore rank'],
                    )}
                    titleResults={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Selected shore rank'],
                    )}
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Please select'],
                          )
                        : ''
                    }
                    showResult
                    searchContent={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Shore rank'],
                    )}
                    textSelectAll={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Select all'],
                    )}
                    textBtnConfirm={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.Confirm,
                    )}
                    onChangeSearch={(value: string) =>
                      fetchShoreRankData(value)
                    }
                    options={dataPackage?.shoreRank || []}
                    messageRequired={errors?.shipRanks?.message || ''}
                  />
                </Col>
              )}
              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.CRITICALITY,
              ) && (
                <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
                  <SelectUI
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList.Criticality,
                    )}
                    data={[
                      {
                        value: 'High',
                        label: renderDynamicLabel(
                          dynamicFields,
                          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                            .questionList.High,
                        ),
                      },
                      {
                        value: 'Medium',
                        label: renderDynamicLabel(
                          dynamicFields,
                          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                            .questionList.Medium,
                        ),
                      },
                      {
                        value: 'Low',
                        label: renderDynamicLabel(
                          dynamicFields,
                          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                            .questionList.Low,
                        ),
                      },
                    ]}
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Please select'],
                          )
                        : ' '
                    }
                    name="criticality"
                    className="w-100"
                    control={control}
                    notAllowSortData
                    dynamicLabels={dynamicFields}
                  />
                </Col>
              )}
              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.POTENTIAL_RISK,
              ) && (
                <Col xl={4} lg={6} className={cx('pt-2', styles.col)}>
                  <SelectUI
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Potential risk'],
                    )}
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Please select'],
                          )
                        : ' '
                    }
                    data={dataPackage?.potentialRisk || []}
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    name="potentialRisk"
                    notAllowSortData
                    className="w-100"
                    control={control}
                    dynamicLabels={dynamicFields}
                  />
                </Col>
              )}
            </Row>
            <Row className={cx(' ', styles.row, styles.infoRow)}>
              {dataPackage?.listRefCategory?.find(
                (i) => i === MasterDataId.INFOR,
              ) && (
                <Col span={12} className={cx('pt-2', styles.col)}>
                  <div className={cx('d-flex pb-1 pt-2', styles.wrapLabel)}>
                    <p className={cx('mb-0', styles.label)}>
                      {renderDynamicLabel(
                        dynamicFields,
                        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                          .questionList.Infor,
                      )}
                    </p>
                  </div>
                  <TextAreaForm
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    autoDetectLink={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    control={control}
                    placeholder={
                      isEdit && !initialDisable
                        ? renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList['Enter infor'],
                          )
                        : ''
                    }
                    autoSize={{ minRows: 1 }}
                    name="infor"
                    maxLength={MaxLength.MAX_LENGTH_COMMENTS}
                  />
                </Col>
              )}
            </Row>
          </>
        ) : null}

        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            // <TableAttachment
            //   featurePage={Features.AUDIT_INSPECTION}
            //   subFeaturePage={SubFeatures.AUDIT_CHECKLIST}
            //   loading={false}
            //   isEdit={!(!isEdit || loadingQuestionDetail || initialDisable)}
            //   value={field.value}
            //   buttonName="Attach"
            //   onchange={field.onChange}
            // />

            <TableAttachmentAGGrid
              featurePage={Features.CONFIGURATION}
              subFeaturePage={SubFeatures.AUDIT_CHECKLIST}
              loading={false}
              disable={!isEdit || loadingQuestionDetail || initialDisable}
              isEdit={!(!isEdit || loadingQuestionDetail || initialDisable)}
              value={field.value}
              buttonName={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                  .Attach,
              )}
              onchange={field.onChange}
              moduleTemplate={
                MODULE_TEMPLATE.auditCheckListQuestionListFormTableAttachment
              }
              dynamicLabels={dynamicFields}
            />
          )}
        />
        {loadingQuestionDetail ? (
          <img
            src={images.common.loading}
            className={styles.loading}
            alt="loading"
          />
        ) : null}
      </div>
    </>
  );

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      const newResult = Array.from(listQuestionState);
      const [removed] = newResult.splice(result.source.index, 1);
      newResult.splice(result.destination.index, 0, removed);
      dispatch(
        reorderQuestionList.request({
          id,
          questions: newResult?.map((i, index) => ({
            id: i.id,
            order: index + 1,
          })),
          reorderBodySucceed: () =>
            dispatch(getAuditCheckListDetailAction.request(id)),
        }),
      );
      setListQuestionState([...newResult]);
    },
    [dispatch, id, listQuestionState],
  );

  const handleCancel = () => {
    const dataForm = getValues();

    if (isEqual(defaultValues, dataForm)) {
      if (isCreate) {
        history.push(AppRouteConst.AUDIT_CHECKLIST);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['Confirmation?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () => history.push(AppRouteConst.AUDIT_CHECKLIST),
      });
    }
  };

  const handleDelete = (item) => {
    if (userInfo?.id === item?.createdUserId && moreButton) {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS.Delete,
        ),
        onPressButtonRight: () => {
          dispatch(
            deleteQuestionAction.request({
              idAuditChecklist: item?.auditChecklistId,
              idQuestion: item?.id,
            }),
          );
          reset();
          setInitialDisable(false);
          removeDataQuestionDetail();
          setIsMultiQuestion(false);
          setAnswerOptions([
            { id: v4(), value: '', hasRemark: false, idValue: '' },
            { id: v4(), value: '', hasRemark: false, idValue: '' },
          ]);
        },
      });
    }
  };

  const onErrorForm = (errors) => {
    if (!isEmpty(errors)) {
      const answerOptionErr =
        !answerOptions?.length ||
        answerOptions?.find((item) => !item.value?.trim());

      const firstError = sortPosition.find(
        (item) =>
          (errors[item] || (answerOptionErr && item === 'answer_option')) &&
          item !== 'type' &&
          item !== 'topicId',
      );

      const el = document.querySelector(`#form_data_questions #${firstError}`);
      setFirstErrorId('');

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setFirstErrorId(firstError);
      }
    }
  };

  const buttonSubmitVisible = useMemo(
    () =>
      (status === ItemStatus.DRAFT || status === ItemStatus.REJECTED) &&
      expandList &&
      isEdit,
    [expandList, isEdit, status],
  );

  const disableQuestionItem = useMemo(() => {
    if (isCreate) {
      return false;
    }
    if (
      status === ItemStatus.DRAFT &&
      workFlowActiveUserPermission.includes(ActivePermission.CREATOR) &&
      isCreator &&
      isEdit
    ) {
      return false;
    }
    return true;
  }, [isCreator, isEdit, status, workFlowActiveUserPermission, isCreate]);

  const displayAddQuestion = useMemo(() => {
    if ((isEdit && status === ItemStatus.DRAFT) || isCreate) {
      return true;
    }
    return false;
  }, [isEdit, status, isCreate]);

  const onCheckQuestion = useCallback(
    (newQuestion?: Question[]) => {
      if (newQuestion?.length) {
        setQuestionDetailChecklist(
          newQuestion?.[0]?.auditChecklistId,
          newQuestion?.[0]?.id,
        );
      }
    },
    [setQuestionDetailChecklist],
  );

  const onChangeFile = async (event: { target: { files: any } }) => {
    const { files } = event.target;
    const fileName = (files && files[0]?.name?.slice(-4)) || '';
    const isXLSX = fileName?.toLowerCase() === 'xlsx';
    const formDataImages = new FormData();
    formDataImages.append('file', files[0]);
    if (isXLSX) {
      setIsOpenModalImport(true);
      await uploadFileExcelApi(id, formDataImages)
        .then((res) => {
          dispatch(
            getListQuestionAction.request({
              companyId: userInfo?.mainCompanyId,
              id,
              body: { page: 1, pageSize: -1 },
              onSuccess: onCheckQuestion,
            }),
          );

          toastSuccess('You have imported successfully');
        })
        .catch((err) => {
          if (typeof err?.message === 'string') {
            toastError(err?.message);
          }
          if (err?.errorList?.length) {
            let dataErr: QuestionErr[] = [];
            err?.errorList?.forEach((itemErr) => {
              if (dataErr?.some((i) => i.fieldName === itemErr.fieldName)) {
                dataErr = dataErr?.map((t) => {
                  if (t?.fieldName === itemErr.fieldName) {
                    return {
                      fieldName: t?.fieldName,
                      messages: [...t.messages, itemErr.message],
                    };
                  }
                  return t;
                });
              } else {
                dataErr = [
                  ...dataErr,
                  {
                    fieldName: itemErr?.fieldName,
                    messages: [itemErr?.message],
                  },
                ];
              }
            });
            setListQuestionErr(dataErr);
            setIsOpenModalErr(true);
          }
        });
      setIsOpenModalImport(false);
    } else {
      toastError(t('modal.errFormat'));
    }
    uploadFile.current.value = null;

    return null;
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div id="form_data_questions" className={cx(styles.wrapperQuestions)}>
          <div className="d-flex">
            <div
              className={cx(styles.questions, { [styles.expand]: expandList })}
            >
              <div
                className={cx(
                  'd-flex align-items-center justify-content-end',
                  styles.btnWrapper,
                )}
                onClick={() => {
                  setExpandList((prev) => !prev);
                }}
              >
                <Button
                  buttonSize={ButtonSize.IconSmallAction}
                  className={styles.expandBtn}
                >
                  {!expandList ? (
                    <img
                      src={images.icons.icMenuQuestionCollapse}
                      className={styles.icExpand}
                      alt="collapse"
                    />
                  ) : (
                    <img
                      src={images.icons.icMenuQuestionExpand}
                      className={styles.icExpand}
                      alt="expand"
                    />
                  )}
                </Button>
              </div>
              <div className={cx(styles.wrapTitleQuestion)}>
                <div
                  className={cx(
                    'd-flex justify-content-between align-items-center',
                  )}
                >
                  <div>
                    <p className={cx('mb-0 fw-b', styles.titleQuestion)}>
                      {renderDynamicLabel(
                        dynamicFields,
                        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                          .questionList['Question list'],
                      )}
                    </p>
                    {expandList ? (
                      <div className="">
                        <p className={cx(styles.titleQuestionExpands)}>
                          {renderDynamicLabel(
                            dynamicFields,
                            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                              .questionList[
                              'To change question order, please drag!'
                            ],
                          )}
                        </p>
                        <div className="d-flex">
                          {ReferencesCategoryList.map((item) => (
                            <Tooltip
                              placement="top"
                              title={item.title}
                              key={item.name}
                              color="#3B9FF3"
                            >
                              <span
                                onClick={() => handleClickIcon(item.name)}
                                className={styles.iconMaster}
                              >
                                <img
                                  src={
                                    iconActives?.includes(item.name)
                                      ? item.icActive
                                      : item.iconInActive
                                  }
                                  alt="icon_master-data"
                                />
                              </span>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setExpandList(false);
                          setVisibleSectionInformationModal(true);
                        }}
                        className={cx(styles.titleViewFull)}
                      >
                        {renderDynamicLabel(
                          dynamicFields,
                          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                            .questionList['View full question details'],
                        )}
                      </div>
                    )}
                  </div>
                  {displayAddQuestion && (
                    <Button
                      buttonSize={ButtonSize.IconSmallAction}
                      className={styles.buttonSave}
                      onClick={clearQuestionData}
                    >
                      <Tooltip
                        placement="top"
                        title={renderDynamicLabel(
                          dynamicFields,
                          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                            .questionList['Add question'],
                        )}
                        color="#3B9FF3"
                        trigger="focus"
                      >
                        <img
                          src={images.icons.icPlusCircle}
                          alt="edit"
                          className={styles.icEdit}
                        />
                      </Tooltip>
                    </Button>
                  )}
                </div>
              </div>

              <div
                className={cx(styles.wrapperQuestionsItem, {
                  [styles.expandWrapper]: expandList,
                  [styles.collapseWrapper]: !expandList,
                })}
              >
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cx('flex-item')}
                    >
                      {listQuestionState?.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={!isEdit && !loadingQuestionDetail}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ItemQuestion
                                key={item?.id}
                                disabled={disableQuestionItem}
                                dataPackage={dataPackage}
                                isFocused={item.id === questionDetail?.id}
                                id={`#${item.code}`}
                                dataQuestion={item}
                                iconActives={iconActives}
                                description={item.question}
                                onViewMore={(data) => {
                                  setOpenViewDetailExpand(true);
                                  setDetailExpand(data);
                                  setQuestionIndex(index);
                                }}
                                referencesCategoryData={
                                  dataPackage?.listRefCategory
                                }
                                title={`Question ${index + 1}`}
                                isRequired={item.isMandatory}
                                expand={expandList}
                                handleDuplicate={() => {
                                  setIsFirstLoadingCategory(true);
                                  handleDuplicate(item);
                                }}
                                handleClick={
                                  !loadingQuestionDetail
                                    ? () => {
                                        setIsFirstLoadingCategory(true);
                                        reset();
                                        fillDataForm(item);
                                        setInitialDisable(true);
                                        setExpandList(false);
                                        if (
                                          questionDetail &&
                                          item.id !== questionDetail.id
                                        ) {
                                          reset();
                                          setIsOpenQuestionInformation(true);
                                          setIsOpenReferencesCategory(true);
                                          setIsOpenVerification(true);
                                          setIsMultiQuestion(false);
                                        }
                                      }
                                    : undefined
                                }
                                handleEdit={
                                  !loadingQuestionDetail
                                    ? () => {
                                        setIsFirstLoadingCategory(true);
                                        reset();
                                        setExpandList(false);
                                        fillDataForm(item);
                                        setInitialDisable(false);
                                        if (
                                          questionDetail &&
                                          item.id !== questionDetail.id
                                        ) {
                                          reset();
                                          setIsMultiQuestion(false);
                                        }
                                      }
                                    : undefined
                                }
                                handleDelete={
                                  !loadingQuestionDetail
                                    ? userInfo?.id === item?.createdUserId &&
                                      moreButton &&
                                      (() => {
                                        handleDelete(item);
                                        if (
                                          listQuestion &&
                                          listQuestion.length < 0
                                        ) {
                                          reset();
                                        }
                                      })
                                    : undefined
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
                {buttonSubmitVisible && (
                  <div className="d-flex justify-content-end px-4 py-3">
                    <Button
                      onClick={handleSubmitAuditCheckList}
                      className={cx(styles.submitBtn, {
                        [styles.submitsBtnDisable]: disabledSubmit,
                      })}
                      disabled={disabledSubmit}
                    >
                      <span>
                        {renderDynamicLabel(
                          dynamicFields,
                          COMMON_DYNAMIC_FIELDS.Submit,
                        )}
                      </span>
                      <img src={images.icons.icRightArrow} alt="right-arrow" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {detailExpand?.length > 0 && (
              <NumberOfQuestionInformationModal
                iconActives={iconActives}
                modal={openViewDetailExpand}
                toggle={() => {
                  setOpenViewDetailExpand(false);
                  setDetailExpand([]);
                }}
                dataMaster={detailExpand}
                header={`Question ${questionIndex + 1} details`}
                dynamicLabels={dynamicFields}
              />
            )}
            <div
              className={cx('', styles.questionForm, {
                [styles.expandQuestion]: !expandList,
                [styles.collapseQuestion]: expandList,
                'py-3 px-4': !expandList,
              })}
            >
              <PermissionCheck
                options={{
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.AUDIT_CHECKLIST,
                  action: ActionTypeEnum.EXECUTE,
                }}
              >
                {({ hasPermission }) =>
                  hasPermission && (
                    <div
                      className={cx(
                        'd-flex justify-content-end',
                        styles.btnWrapper,
                      )}
                    >
                      <Button
                        onClick={handleExportTemPlate}
                        buttonSize={ButtonSize.Medium}
                        buttonType={ButtonType.Primary}
                        className={cx('mt-auto')}
                        renderSuffix={
                          <img
                            src={images.icons.icImportExcel}
                            alt="importTemplate"
                            className={styles.icButton}
                          />
                        }
                      >
                        {renderDynamicLabel(
                          dynamicFields,
                          COMMON_DYNAMIC_FIELDS['Download template'],
                        )}
                      </Button>
                      {displayAddQuestion && (
                        <>
                          <label htmlFor="file-input">
                            <input
                              type="file"
                              id="file"
                              accept=".xlsx"
                              ref={uploadFile}
                              className={styles.inputFile}
                              onChange={onChangeFile}
                            />
                          </label>

                          <Button
                            onClick={(e) => {
                              uploadFile.current.click();
                            }}
                            buttonSize={ButtonSize.Medium}
                            buttonType={ButtonType.Primary}
                            className="mt-auto ms-3"
                            renderSuffix={
                              <img
                                src={images.icons.icImportExcel}
                                alt="createNew"
                                className={styles.icButton}
                              />
                            }
                          >
                            {renderDynamicLabel(
                              dynamicFields,
                              COMMON_DYNAMIC_FIELDS['Import excel'],
                            )}
                          </Button>
                        </>
                      )}
                      {listQuestion?.length > 0 && (
                        <Button
                          onClick={handleExportQuestion}
                          buttonSize={ButtonSize.Medium}
                          buttonType={ButtonType.Primary}
                          className={cx('mt-auto ms-3')}
                          renderSuffix={
                            <img
                              src={images.icons.icExportExcel}
                              alt="importTemplate"
                              className={styles.icButton}
                            />
                          }
                        >
                          {renderDynamicLabel(
                            dynamicFields,
                            COMMON_DYNAMIC_FIELDS['Export excel'],
                          )}
                        </Button>
                      )}
                    </div>
                  )
                }
              </PermissionCheck>

              {expandList ? (
                <div className={styles.collapseWrapper} />
              ) : (
                <div>
                  {!isEdit && listQuestion?.length === 0 ? null : (
                    <div className="">
                      <CollapseUI
                        className={cx(styles.mb_16)}
                        collapseHeaderClassName={cx(styles.headerCollapse)}
                        isOpen={isOpenQuestionInformation}
                        toggle={toggleQuestionInformation}
                        title={renderDynamicLabel(
                          dynamicFields,
                          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                            .questionList['Question information'],
                        )}
                        content={renderQuestionInformation()}
                      />
                      <CollapseUI
                        isOpen={isOpenVerification}
                        toggle={toggleVerification}
                        title={renderDynamicLabel(
                          dynamicFields,
                          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                            .questionList.Verification,
                        )}
                        className={cx(styles.mb_16)}
                        collapseHeaderClassName={cx(styles.headerCollapse)}
                        content={renderVerification()}
                      />
                      <CollapseUI
                        className={cx(styles.mb_16)}
                        collapseHeaderClassName={cx(styles.headerCollapse)}
                        isOpen={isOpenReferencesCategory}
                        toggle={toggleReferencesCategory}
                        title={renderDynamicLabel(
                          dynamicFields,
                          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                            .questionList['References & Category'],
                        )}
                        content={renderReferencesCategory()}
                      />
                    </div>
                  )}
                  {isEdit && (
                    <GroupButton
                      handleCancel={handleCancel}
                      handleSubmit={handleSubmit(onSaveForm, onErrorForm)}
                      disable={loading}
                      txButtonLeft={renderDynamicLabel(
                        dynamicFields,
                        COMMON_DYNAMIC_FIELDS.Cancel,
                      )}
                      txButtonBetween={renderDynamicLabel(
                        dynamicFields,
                        COMMON_DYNAMIC_FIELDS.Save,
                      )}
                    >
                      {moreButton ? (
                        <Button
                          onClick={handleSubmit(onSubmitForm, onErrorForm)}
                          className={cx(styles.submitBtn)}
                        >
                          <span>
                            {renderDynamicLabel(
                              dynamicFields,
                              COMMON_DYNAMIC_FIELDS.Submit,
                            )}
                          </span>
                          <img
                            src={images.icons.icRightArrow}
                            alt="right-arrow"
                          />
                        </Button>
                      ) : null}
                    </GroupButton>
                  )}
                  <ModalList
                    data={dataValueModal}
                    disabled={
                      !isEdit || loadingQuestionDetail || initialDisable
                    }
                    title={renderDynamicLabel(
                      dynamicFields,
                      AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                        .questionList['Value information'],
                    )}
                    onSubmit={(data) => {
                      setDataValueModal(data);
                      setAnswerOptions([...data]);
                    }}
                    isOpenModalValues={isOpenModalValues}
                    setIsOpenModalValues={setIsOpenModalValues}
                    dynamicLabel={dynamicFields}
                  />
                </div>
              )}
            </div>
            <Assignment
              titleModal={renderDynamicLabel(
                dynamicFields,
                COMMON_DYNAMIC_FIELDS.Submit,
              )}
              isOpen={modalAssignMentVisible}
              initialData={dataUserAssignmentConvert}
              userAssignmentDetails={auditCheckListDetail?.userAssignments}
              onClose={() => openModalAssignment(false)}
              onConfirm={handleSubmitFormAfterAssignment}
              dynamicLabel={dynamicFields}
            />
            <ModalLoading
              isOpen={isOpenModalImport}
              dynamicLabel={dynamicFields}
            />
            <ModalUploadedFail
              isOpen={isOpenModalErr}
              toggle={() => {
                setIsOpenModalErr(false);
              }}
              data={listQuestionErr}
              dynamicLabel={dynamicFields}
            />
          </div>
        </div>
      </DragDropContext>
      <SectionInformationModal
        header={renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
            'Section information'
          ],
        )}
        modal={visibleSectionInformationModal}
        toggle={() => setVisibleSectionInformationModal((e) => !e)}
        dynamicLabel={dynamicFields}
      />
    </>
  );
};

export default AuditCheckListQuestionListForm;
