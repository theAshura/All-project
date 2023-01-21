import { yupResolver } from '@hookform/resolvers/yup';
import {
  getReportTemplateDetailActionsApi,
  getVersionNumberActionApi,
} from 'api/report-template.api';
import images from 'assets/images/images';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import SelectUI from 'components/ui/select/Select';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  getListTemplateActions,
  clearTemplateReducer,
} from 'store/template/template.action';
import {
  MODULE_TEMPLATE,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import cloneDeep from 'lodash/cloneDeep';
import {
  ENTITY_OPTIONS,
  ENTITY_VESSEL,
  PRINT_OPTION,
  statusOptions,
} from 'constants/filter.const';
import { handleFilterParams } from 'helpers/filterParams.helper';

import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import {
  Child,
  ReportHeader,
  ReportTemplate,
  ReportTemplateDetailResponse,
} from 'models/api/report-template/report-template.model';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError } from 'helpers/notification.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import ModalComponent from 'components/ui/modal/Modal';

import { Action, CommonApiParam } from 'models/common.model';
import { tz } from 'moment-timezone';
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Col, Row } from 'reactstrap';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import {
  clearReportTemplateErrorsReducer,
  getListReportTemplateActions,
} from 'store/report-template/report-template.action';
import { getListVesselTypeActions } from 'store/vessel-type/vessel-type.action';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { dateStringComparator } from 'helpers/utils.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/report-template-master.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import TableHistoryAGGrid from './table-history/TableHistoryAGGrid';
import styles from './form.module.scss';
import { ModalAddHeader } from './ModalAddHeader';
import { ModalAuditType } from './ModalAuditType';
import { ModalChoseVersionTemplate } from './ModalChoseVersionTemplate';
import { ModalSubTopicHeader as ModalSubHeader } from './ModalSubTopicHeader';

interface ReportTemplateFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: ReportTemplateDetailResponse;
  onDelete?: () => void;
  onSubmit: (CreateReportTemplateParams) => void;
  submitLoading: boolean;
}

export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}

const sortPosition = ['moduleName', 'code', 'auditTypeIds'];

const ReportTemplateForm: FC<ReportTemplateFormProps> = ({
  isEdit,
  data,
  onDelete,
  onSubmit,
  isCreate,
  submitLoading,
}) => {
  const FORM_LIST_DEFAULT = useMemo(
    () => [
      {
        id: v4(),
        topic: 'Overview',
        topicType: 'header',
        printOption: 'All',
        type: 'CK editor',
        serialNumber: '0.1',
        isDefault: true,
      },
      {
        id: v4(),
        topic: 'Inspection history and status',
        topicType: 'header',
        serialNumber: '0.2',
        printOption: 'All',
        type: 'Inspection history table',
        isDefault: true,
      },
    ],
    [],
  );

  const dispatch = useDispatch();

  const [formList, setFormList] = useState<ReportHeader[]>(FORM_LIST_DEFAULT);
  const [reportTemplateTable, setReportTemplateTable] =
    useState<ReportHeader[]>(FORM_LIST_DEFAULT);

  // AGGrid-Table
  const { loading, params, dataFilter } = useSelector(
    (state) => state.ReportTemplate,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const defaultValueCreate = useMemo(
    () => ({
      auditEntity: 'Vessel',
      moduleName: 'internal_audit_report',
      vesselTypeIds: [],
      auditTypeIds: [],
      status: 'active',
      reportHeaders: FORM_LIST_DEFAULT,
    }),
    [FORM_LIST_DEFAULT],
  );

  const defaultValueEditAndView = {
    vesselTypes: [],
    auditEntity: 'Vessel',
    auditTypeIds: [],
    status: 'active',
  };
  const { id } = useParams<{ id: string }>();
  const [modalHeader, setModalHeader] = useState<boolean>(false);
  const [modalSubTopicHeader, setModalSubTopicHeader] =
    useState<boolean>(false);

  const [isChooseTemplate, setIsChooseTemplate] = useState<boolean>(false);
  const [isShowAuditType, setIsShowAuditType] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [isAddSub, setIsAddSub] = useState<boolean>(false);
  const [vesselTemplate, setVesselTemplate] = useState<OptionProps>(undefined);
  const [indexHeader, setIndexHeader] = useState<number>(undefined);
  const [serialNumberHeader, setSerialNumberHeader] =
    useState<string>(undefined);

  const [selectedData, setSelectedData] = useState<ReportHeader>(undefined);
  const [createVersion, setCreateVersion] = useState<string>('');
  const [openConfirmCreateModal, setOpenConfirmCreateModal] =
    useState<boolean>(false);
  const [actionType, setActionType] = useState<'save' | 'none' | 'saveAndNew'>(
    'none',
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const schema = yup.object().shape({
    auditEntity: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
            'This field is required'
          ],
        ),
      ),
    auditTypeIds: yup
      .array()
      .nullable()
      .min(
        1,
        renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
            'This field is required'
          ],
        ),
      ),
    vesselTypeIds: yup.array().when('auditEntity', {
      is: (value) => value === ENTITY_VESSEL,
      then: yup
        .array()
        .nullable()
        .min(
          1,
          renderDynamicLabel(
            dynamicFields,
            REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
              'This field is required'
            ],
          ),
        ),
    }),
  });

  const { errorList, loading: loadingReportTemplate } = useSelector(
    (state) => state.ReportTemplate,
  );

  const { listVesselTypes, loading: loadingVesselType } = useSelector(
    (state) => state.vesselType,
  );
  const { listAuditTypes, loading: loadingAuditType } = useSelector(
    (state) => state.auditType,
  );

  const { userInfo } = useSelector((state) => state.authenticate);

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: isCreate ? defaultValueCreate : defaultValueEditAndView,
    resolver: yupResolver(schema),
  });

  const watchEntityType = watch('auditEntity');

  useEffect(() => {
    if (isCreate) {
      const timezone = tz.guess();
      getVersionNumberActionApi({
        timezone,
      })
        .then((response) => {
          setValue('version', response.data.code.split('_')[1]);
          setCreateVersion(response.data.verifySignature);
          setValue('timezone', timezone);
        })
        .catch((e) => {});
    }
  }, [isCreate, setValue]);

  useEffect(() => {
    if (isChooseTemplate) {
      dispatch(
        getListReportTemplateActions.request({
          pageSize: -1,
          isRefreshLoading: false,
          status: 'active',
          isNotSaveSearch: true,
          companyId: userInfo?.mainCompanyId,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isChooseTemplate]);

  const listVesselTypeOption = useMemo(
    () =>
      listVesselTypes?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })) || [],
    [listVesselTypes],
  );

  const listAuditTypeOption = useMemo(
    () =>
      listAuditTypes?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })) || [],
    [listAuditTypes],
  );

  const resetDefault = useCallback(
    (defaultParams) => {
      reset(defaultParams);
      history.goBack();
    },
    [reset],
  );

  const sortReportTemplateTable = useCallback((dataSort: ReportHeader[]) => {
    dataSort.sort((a: ReportHeader, b: ReportHeader) => {
      const arrHeaderA = a.serialNumber?.split('.');
      const arrHeaderB = b.serialNumber?.split('.');
      const lengthA = arrHeaderA.length || 0;
      const lengthB = arrHeaderB.length || 0;

      const lengthCheck = lengthA > lengthB ? lengthB : lengthA;

      for (let i = 0; i < lengthCheck; i += 1) {
        if (Number(arrHeaderA[i]) > Number(arrHeaderB[i])) {
          return 1;
        }

        if (Number(arrHeaderA[i]) < Number(arrHeaderB[i])) {
          return -1;
        }
      }

      return lengthA > lengthB ? 1 : -1;
    });
    return dataSort;
  }, []);

  const handleCancel = useCallback(() => {
    let previousParam = {};
    const currentParam = {
      moduleName: getValues('moduleName'),
      vesselTypeIds: getValues('vesselTypeIds'),
      auditTypeIds: getValues('vesselTypeIds'),
      status: getValues('status'),
      reportHeaders: formList,
    };

    if (isCreate) {
      previousParam = defaultValueCreate;
    } else {
      previousParam = {
        ...previousParam,
        moduleName: data?.moduleName,
        vesselTypeIds: data?.vesselTypes.map((item) => ({
          value: item?.id,
          label: item.name,
        })),
        auditTypeIds: data?.auditTypes.map((item) => ({
          value: item?.id,
          label: item.name,
        })),
        status: data?.status,
        reportHeaders: sortReportTemplateTable(data?.reportHeaders || []),
      };
    }
    if (isEqual(previousParam, currentParam)) {
      if (isCreate) {
        history.push(AppRouteConst.REPORT_TEMPLATE);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Confirmation?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Confirm,
        ),
        onPressButtonRight: () =>
          isCreate
            ? history.push(AppRouteConst.REPORT_TEMPLATE)
            : resetDefault(previousParam),
      });
    }
  }, [
    data?.auditTypes,
    data?.moduleName,
    data?.reportHeaders,
    data?.status,
    data?.vesselTypes,
    defaultValueCreate,
    dynamicFields,
    formList,
    getValues,
    isCreate,
    resetDefault,
    sortReportTemplateTable,
  ]);

  const resetFormTemplate = useCallback(() => {
    const newTemplate = FORM_LIST_DEFAULT;
    setValue('reportHeaders', newTemplate);
    setFormList(newTemplate);
    setReportTemplateTable(newTemplate);
  }, [FORM_LIST_DEFAULT, setValue]);

  const getVersionNumber = useCallback(() => {
    const timezone = tz.guess();
    getVersionNumberActionApi({
      timezone,
    })
      .then((response) => {
        setCreateVersion(response.data.verifySignature);
        setValue('version', response.data.code.split('_')[1] || '');
        setValue('code', response.data.code.split('_')[1]);
        setValue('timezone', timezone);
      })
      .catch((e) => {});
  }, [setValue]);

  const resetFormAsNew = () => {
    getVersionNumber();
    setValue('moduleName', 'internal_audit_report');
    setValue('vesselTypeIds', []);
    setValue('auditTypeIds', []);
    resetFormTemplate();
    setIndexHeader(undefined);
    setIsAdd(undefined);
  };

  const addToListReportTemplate = (data: ReportHeader) => {
    if (isAdd) {
      const lengthListHeader = reportTemplateTable.length || 0;
      if (lengthListHeader < 3) {
        setReportTemplateTable([
          ...reportTemplateTable,
          {
            ...data,
            id: v4(),
            serialNumber: '1',
            isDefault: false,
          },
        ]);
      } else {
        const arrSerialNumber =
          reportTemplateTable[lengthListHeader - 1]?.serialNumber?.split('.');
        const serialNumberMax = Number(arrSerialNumber[0]);
        setReportTemplateTable([
          ...reportTemplateTable,
          {
            ...data,
            id: v4(),
            isDefault: false,
            serialNumber: (serialNumberMax + 1).toString(),
          },
        ]);
      }
      setIsAdd(false);
      setModalHeader(false);
    } else {
      let newFormList = cloneDeep(reportTemplateTable);
      const item = newFormList[indexHeader];

      newFormList[indexHeader] = {
        ...item,
        ...data,
        id: item?.id,
      };
      if (data?.printOption !== 'All') {
        const serialNumberParent = item?.serialNumber;
        newFormList = newFormList?.map((itemNewHeader) => {
          const serialNumberChild = itemNewHeader?.serialNumber;
          if (
            serialNumberChild?.slice(0, serialNumberParent.length) ===
            serialNumberParent
          ) {
            return { ...itemNewHeader, printOption: data.printOption };
          }
          return itemNewHeader;
        });
      }
      setReportTemplateTable(newFormList);
      setIndexHeader(undefined);
      setModalHeader(false);
    }
    setSelectedData(undefined);
  };

  const addSubHeader = (data: Child, index: number) => {
    const lengthSerialNumberHeader = serialNumberHeader.length || 0;
    let newSerialNumberHeader = 1;
    let indexParent = 0;

    reportTemplateTable.forEach((item, index) => {
      const newIndexNumber2 = item?.serialNumber?.slice(
        0,
        lengthSerialNumberHeader,
      );
      const lengthNewItem = serialNumberHeader.split('.').length || 0;
      if (newIndexNumber2 === serialNumberHeader) {
        indexParent = index;
      }

      if (
        newIndexNumber2 === serialNumberHeader &&
        lengthNewItem === item?.serialNumber?.split('.').length - 1
      ) {
        newSerialNumberHeader += 1;
      }
    });

    let newData = [...reportTemplateTable.slice(0, indexParent + 1)];

    newData.push({
      ...data,
      id: v4(),
      isDefault: false,
      parentId: reportTemplateTable[indexHeader]?.id,
      serialNumber: `${serialNumberHeader}.${newSerialNumberHeader}`,
    });

    newData = [
      ...newData,
      ...reportTemplateTable.slice(indexParent + 1, reportTemplateTable.length),
    ];
    setModalSubTopicHeader(false);
    setSelectedData(undefined);
    setReportTemplateTable([...newData]);
  };

  const editSubHeader = (data: Child, headerIndex: number) => {
    const newListForm = [...reportTemplateTable];
    const newData = {
      ...data,
      serialNumber: newListForm[headerIndex]?.serialNumber,
    };
    newListForm[headerIndex] = newData;

    setReportTemplateTable(newListForm);

    setModalSubTopicHeader(false);
    setSelectedData(undefined);
  };

  useEffect(() => {
    dispatch(
      getListAuditTypeActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (isCreate) {
      if (data) {
        setValue('version', data.version.split('_')[1] || '');
        setValue('moduleName', data?.moduleName);
        setFormList(formList);
        setReportTemplateTable(formList);
      }
    } else {
      const listVesselTypes = [];
      data?.vesselTypes?.map((item) =>
        listVesselTypes.push({ label: item.name, value: item?.id }),
      );

      const listAuditTypes = [];
      data?.auditTypes?.map((item) =>
        listAuditTypes.push({ label: item.name, value: item?.id }),
      );
      setValue('auditEntity', data?.auditEntity);
      setValue('moduleName', data?.moduleName);

      setValue('version', data?.version.split('_')[1] || '');
      setValue('vesselTypeIds', listVesselTypes);
      setValue('auditTypeIds', listAuditTypes);

      setValue('status', data?.status);
      setValue('timezone', tz.guess());

      const dataReportHeader = sortReportTemplateTable(
        data?.reportHeaders || [],
      );
      setReportTemplateTable(dataReportHeader);
    }
    return () => {
      dispatch(clearReportTemplateErrorsReducer());
    };
  }, [data, dispatch, formList, isCreate, setValue, sortReportTemplateTable]);

  useEffect(() => {
    dispatch(
      getListVesselTypeActions.request({
        companyId: userInfo?.mainCompanyId,
        isRefreshLoading: false,
        paramsList: {
          pageSize: -1,
          status: 'active',
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: item.message });
            break;
          case 'name':
            setError('name', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      clearErrors();
    }
  }, [clearErrors, errorList, setError]);

  const printOptions = useMemo(() => {
    if (reportTemplateTable) {
      const dataParent = reportTemplateTable.find(
        (item) => item?.id === reportTemplateTable[indexHeader]?.parentId,
      );

      if (isAddSub && reportTemplateTable[indexHeader]?.printOption !== 'All') {
        return [
          {
            value: reportTemplateTable[indexHeader]?.printOption,
            label: reportTemplateTable[indexHeader]?.printOption,
          },
        ];
      }
      if (isAddSub && reportTemplateTable[indexHeader]?.printOption === 'All') {
        return PRINT_OPTION;
      }

      if (!isAddSub && dataParent && dataParent?.printOption !== 'All') {
        return [
          {
            value: dataParent.printOption,
            label: dataParent.printOption,
          },
        ];
      }
      return PRINT_OPTION;
    }
    return [];
  }, [reportTemplateTable, indexHeader, isAddSub]);

  const scrollToView = useCallback((errors) => {
    if (!isEmpty(errors)) {
      const firstError = sortPosition.find((item) => errors[item]);
      const el = document.querySelector(`.form_data #${firstError}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const onSubmitForm = (data) => {
    const vesselTypeIds: string[] = [];
    data?.vesselTypeIds?.forEach((element) => {
      vesselTypeIds.push(element.value);
    });

    const auditTypeIds: string[] = [];
    data?.auditTypeIds?.forEach((element) => {
      auditTypeIds.push(element.value);
    });

    let dataNew: ReportTemplate = {
      ...data,
      auditTypeIds,
      reportHeaders: reportTemplateTable.map((item) => {
        const propNames = Object.getOwnPropertyNames(item);
        for (let i = 0; i < propNames.length; i += 1) {
          const propName = propNames[i];
          if (
            item[propName] === null ||
            item[propName] === undefined ||
            item[propName]?.length === 0
          ) {
            // eslint-disable-next-line no-param-reassign
            delete item[propName];
          }
        }
        return item;
      }),
    };

    if (data?.auditEntity === ENTITY_VESSEL) {
      dataNew = { ...dataNew, vesselTypeIds };
    }
    setActionType('save');
    onSubmit(isCreate ? { ...dataNew, version: createVersion } : dataNew);
    resetFormTemplate();
  };

  const handleSubmitAndNew = (data) => {
    const vesselTypeIds: string[] = [];
    data?.vesselTypeIds?.forEach((element) => {
      vesselTypeIds.push(element.value);
    });
    const auditTypeIds: string[] = [];
    data?.auditTypeIds?.forEach((element) => {
      auditTypeIds.push(element.value);
    });

    let dataNew: ReportTemplate = {
      ...data,
      auditTypeIds,
      reportHeaders: reportTemplateTable.map((item) => {
        const propNames = Object.getOwnPropertyNames(item);
        for (let i = 0; i < propNames.length; i += 1) {
          const propName = propNames[i];
          if (
            item[propName] === null ||
            item[propName] === undefined ||
            item[propName]?.length === 0
          ) {
            // eslint-disable-next-line no-param-reassign
            delete item[propName];
          }
        }
        return item;
      }),
      isNew: true,
      resetForm: () => {
        resetFormAsNew();
      },
    };
    if (data?.auditEntity === ENTITY_VESSEL) {
      dataNew = { ...dataNew, vesselTypeIds };
    }
    setActionType('saveAndNew');
    onSubmit(isCreate ? { ...dataNew, version: createVersion } : dataNew);
  };

  const handleDeleteReportTemplate = useCallback(
    (serialNumberSelected: string, index: number) => {
      const arrSerialNumber = serialNumberSelected.split('.');
      const lengthIndexNumber = serialNumberSelected.length || 0;
      const indexCheck = (lengthIndexNumber - 1) / 2;
      const parentIndex = serialNumberSelected.slice(0, lengthIndexNumber - 2);
      const numberIndex = arrSerialNumber[arrSerialNumber.length - 1];

      let newData = reportTemplateTable.filter((item) => {
        const newIndexNumber = item?.serialNumber?.slice(0, lengthIndexNumber);
        return serialNumberSelected !== newIndexNumber;
      });

      if (arrSerialNumber.length >= 2) {
        newData = newData.map((item) => {
          const serialNumberParen = item?.serialNumber?.split('.');
          const newIndexNumber2 = serialNumberParen
            .slice(0, serialNumberParen.length - 1)
            .join('.');

          const indexNumberArr = item?.serialNumber?.split('.');

          if (
            parentIndex === newIndexNumber2 &&
            Number(indexNumberArr[indexCheck]) > Number(numberIndex)
          ) {
            indexNumberArr[indexCheck] = (
              Number(indexNumberArr[indexCheck]) - 1
            ).toString();

            return { ...item, serialNumber: indexNumberArr.join('.') };
          }
          return item;
        });
      } else {
        newData = newData.map((item) => {
          const indexNumberArr = item?.serialNumber?.split('.');
          if (Number(indexNumberArr[0]) > Number(numberIndex)) {
            indexNumberArr[0] = (Number(indexNumberArr[0]) - 1).toString();

            return { ...item, serialNumber: indexNumberArr.join('.') };
          }
          return item;
        });
      }

      setReportTemplateTable(newData);
    },
    [reportTemplateTable],
  );

  const handleDelete = useCallback(
    (id: string, index: number) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Delete,
        ),
        onPressButtonRight: () => handleDeleteReportTemplate(id, index),
      });
    },
    [dynamicFields, handleDeleteReportTemplate],
  );

  // AGGrid-Table

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListReportTemplateActions.request({ ...newParams, pageSize: -1 }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (!params?.isLeftMenu) {
      handleGetList({
        createdAtFrom: dataFilter?.dateFilter[0]
          ? dataFilter?.dateFilter[0]?.toISOString()
          : DATE_DEFAULT[0].toISOString(),
        createdAtTo: dataFilter?.dateFilter[1]
          ? dataFilter?.dateFilter[1]?.toISOString()
          : DATE_DEFAULT[1].toISOString(),
        handleSuccess: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.reportTemplateMaster,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListReportTemplateActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkWorkflow = useCallback(
    (item, index) => {
      const arrSerialNumber = item?.serialNumber
        ? item?.serialNumber.split('.')
        : [];
      let actionHeader: Action[] = [
        {
          img: images.icons.icEdit,
          function: () => {
            if (item.parentId) {
              setModalHeader(false);
              setModalSubTopicHeader(true);
              setSelectedData(item);
            } else {
              setSelectedData(item);
              setModalHeader(true);
            }
            setIndexHeader(index);
            setIsAdd(false);
            setIsAddSub(false);
          },
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.REPORT_TEMPLATE,
          action: ActionTypeEnum.UPDATE,
          disable: loadingReportTemplate,
        },
      ];
      if (index > 1 && arrSerialNumber.length < 10) {
        actionHeader = [
          ...actionHeader,
          {
            img: images.icons.icAddCircle,
            function: () => {
              setModalSubTopicHeader(true);
              setIsAddSub(true);
              setSerialNumberHeader(item?.serialNumber);
              setIndexHeader(index);
            },
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.REPORT_TEMPLATE,
            action: ActionTypeEnum.CREATE,
            buttonType: ButtonType.Green,
            cssClass: 'ms-1',
            disable: loadingReportTemplate,
          },
        ];
      }

      if (index > 1) {
        actionHeader = [
          ...actionHeader,
          {
            img: images.icons.icRemove,
            function: () => handleDelete(item?.serialNumber, index),
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.REPORT_TEMPLATE,
            action: ActionTypeEnum.DELETE,
            buttonType: ButtonType.Orange,
            cssClass: 'ms-1',
            disable: loadingReportTemplate,
          },
        ];
      }
      return actionHeader;
    },
    [handleDelete, loadingReportTemplate],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Action,
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
        field: 'serialNumber',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Serial number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'topic',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Topic,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'topicType',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Topic type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'printOption',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Print option'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'type',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Type,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'minScore',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Min score'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'maxScore',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Max score'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicFields, isMultiColumnFilter, checkWorkflow],
  );

  const dataTable = useMemo(
    () =>
      reportTemplateTable.map((item, index) => ({
        serialNumber: index !== 0 && index !== 1 ? item?.serialNumber : '',
        topic: item?.topic,
        topicType: item?.topicType,
        printOption: item?.printOption,
        type: item?.type,
        minScore: item?.minScore || null,
        maxScore: item?.maxScore || null,
      })) || [],
    [reportTemplateTable],
  );

  const handleSelectVersionTemplate = (data) => {
    setVesselTemplate(data);
    getReportTemplateDetailActionsApi(data?.value)
      .then((value) => {
        const dataResponse = value?.data;
        if (dataResponse?.reportHeaders?.length === 0) {
          toastError('This Report Template is wrong');
          return;
        }
        let newReportHeaders = sortReportTemplateTable(
          dataResponse?.reportHeaders || [],
        );
        if (id) {
          newReportHeaders = newReportHeaders.map((item) => ({
            ...item,
            id: v4(),
            reportTemplateId: id,
          }));
        } else {
          newReportHeaders = newReportHeaders.map((item) => ({
            ...item,
            id: v4(),
          }));
        }
        setValue('auditEntity', dataResponse?.auditEntity);
        setValue('status', dataResponse?.status);

        setReportTemplateTable(newReportHeaders);
        const listVesselTypes = [];
        dataResponse?.vesselTypes?.map((item) =>
          listVesselTypes.push({ label: item.name, value: item?.id }),
        );
        const listAuditTypes = [];
        dataResponse?.auditTypes?.map((item) =>
          listAuditTypes.push({ label: item.name, value: item?.id }),
        );
        setValue('vesselTypeIds', listVesselTypes);
        if (listVesselTypes.length > 0) {
          setError('vesselTypeIds', {
            type: 'manual',
            message: '',
          });
        }
        setValue('auditTypeIds', listAuditTypes);
        if (listAuditTypes.length > 0) {
          setError('auditTypeIds', {
            type: 'manual',
            message: '',
          });
        }
      })
      .catch((e) => toastError(e));
  };

  useEffect(() => {
    if (errorList) {
      const doestVersionExisted = errorList.some(
        (err) => err.fieldName === 'versionExisted',
      );
      setOpenConfirmCreateModal(doestVersionExisted);
    }
  }, [errorList]);

  useEffect(() => {
    if (openConfirmCreateModal) {
      getVersionNumber();
    }
  }, [getVersionNumber, openConfirmCreateModal]);

  if (loadingReportTemplate && !isCreate) {
    return (
      <div className="d-flex justify-content-center">
        <img
          src={images.common.loading}
          className={styles.loading}
          alt="loading"
        />
      </div>
    );
  }

  return (
    <>
      {submitLoading ? (
        <div className="d-flex justify-content-center">
          <img
            src={images.common.loading}
            className={styles.loading}
            alt="loading"
          />
        </div>
      ) : (
        <div className="form_data">
          <div
            className={cx(styles.wrapHeader, 'd-flex justify-content-between')}
          >
            <div className={cx(styles.headers)}>
              <BreadCrumb
                current={
                  // eslint-disable-next-line no-nested-ternary
                  isCreate
                    ? BREAD_CRUMB.REPORT_TEMPLATE_CREATE
                    : isEdit
                    ? BREAD_CRUMB.REPORT_TEMPLATE_EDIT
                    : BREAD_CRUMB.REPORT_TEMPLATE_DETAIL
                }
              />
              <div className={cx('fw-bold', styles.title)}>
                {renderDynamicModuleLabel(
                  listModuleDynamicLabels,
                  DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
                )}
              </div>
            </div>
            <div>
              {!isEdit && (
                <div className={styles.headerBtn}>
                  <Button
                    className={cx('me-2', styles.buttonFilter)}
                    buttonType={ButtonType.CancelOutline}
                    onClick={(e) => {
                      history.goBack();
                    }}
                  >
                    <span className="pe-2">
                      {renderDynamicLabel(
                        dynamicFields,
                        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Back,
                      )}
                    </span>
                  </Button>
                  {userInfo?.mainCompanyId === data?.companyId && (
                    <>
                      <PermissionCheck
                        options={{
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.REPORT_TEMPLATE,
                          action: ActionTypeEnum.UPDATE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission && (
                            <Button
                              className={cx('me-1', styles.buttonFilter)}
                              onClick={(e) => {
                                history.push(
                                  `${AppRouteConst.ReportTemplateDetail(
                                    id,
                                  )}?edit`,
                                );
                              }}
                            >
                              <span className="pe-2">
                                {renderDynamicLabel(
                                  dynamicFields,
                                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Edit,
                                )}
                              </span>
                              <img
                                src={images.icons.icEdit}
                                alt="edit"
                                className={styles.icEdit}
                              />
                            </Button>
                          )
                        }
                      </PermissionCheck>
                      <PermissionCheck
                        options={{
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.REPORT_TEMPLATE,
                          action: ActionTypeEnum.DELETE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission && (
                            <Button
                              className={cx('ms-1', styles.buttonFilter)}
                              buttonType={ButtonType.Orange}
                              onClick={onDelete}
                            >
                              <span className="pe-2">
                                {renderDynamicLabel(
                                  dynamicFields,
                                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Delete,
                                )}
                              </span>
                              <img
                                src={images.icons.icRemove}
                                alt="remove"
                                className={styles.icRemove}
                              />
                            </Button>
                          )
                        }
                      </PermissionCheck>
                    </>
                  )}
                </div>
              )}
              {isCreate && (
                <div className={cx(styles.buttonWrapper)}>
                  <Button
                    buttonSize={ButtonSize.Medium}
                    buttonType={ButtonType.Primary}
                    className={cx(styles.buttonTemplate)}
                    onClick={() => {
                      setIsChooseTemplate(true);
                      setVesselTemplate(undefined);
                    }}
                  >
                    {renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Choose template'
                      ],
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className={cx(styles.wrapperContainer)}>
            <div className={cx(styles.containerForm)}>
              <p className={cx('fw-bold', styles.titleForm)}>
                {renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                    'General information'
                  ],
                )}
              </p>
              <Row className={styles.separateRow}>
                <Col xs={4}>
                  <SelectUI
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Entity,
                    )}
                    data={ENTITY_OPTIONS}
                    isRequired
                    disabled={!isEdit}
                    name="auditEntity"
                    id="entity"
                    className={cx('w-100')}
                    messageRequired={errors?.auditEntity?.message || null}
                    control={control}
                    onChange={(value) => {
                      setValue('auditTypeIds', []);
                      setValue('vesselTypeIds', []);
                      setValue('status', 'active');
                    }}
                    placeholder={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Please select'
                      ],
                    )}
                  />
                </Col>
                <Col xs={4}>
                  <SelectUI
                    data={statusOptions}
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Status,
                    )}
                    disabled={!isEdit}
                    name="status"
                    id="status"
                    className={cx(
                      styles.inputSelect,
                      { [styles.disabledSelect]: !isEdit },
                      'w-100',
                    )}
                    control={control}
                    placeholder={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Please select'
                      ],
                    )}
                    dynamicLabels={dynamicFields}
                  />
                </Col>
                <Col xs={4}>
                  <Input
                    label={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Version number'
                      ],
                    )}
                    className={cx(styles.disabledInput)}
                    readOnly
                    placeholder={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Enter version number'
                      ],
                    )}
                    {...register('version')}
                    maxLength={20}
                    disabledCss
                    disabled
                  />
                </Col>
              </Row>

              <Row className={styles.separateRow}>
                {watchEntityType === ENTITY_VESSEL && (
                  <Col xs={4}>
                    <AsyncSelectResultForm
                      multiple
                      disabled={
                        !isEdit || loadingReportTemplate || loadingVesselType
                      }
                      labelSelect={renderDynamicLabel(
                        dynamicFields,
                        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                          'Selected vessel type'
                        ],
                      )}
                      control={control}
                      name="vesselTypeIds"
                      id="vesselTypeIds"
                      titleResults={renderDynamicLabel(
                        dynamicFields,
                        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Selected,
                      )}
                      isRequired
                      placeholder={renderDynamicLabel(
                        dynamicFields,
                        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                          'Please select'
                        ],
                      )}
                      searchContent={renderDynamicLabel(
                        dynamicFields,
                        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                          'Vessel type'
                        ],
                      )}
                      textSelectAll={renderDynamicLabel(
                        dynamicFields,
                        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                          'Select all'
                        ],
                      )}
                      messageRequired={errors?.vesselTypeIds?.message || ''}
                      onChangeSearch={(value: string) => {
                        dispatch(
                          getListVesselTypeActions.request({
                            isRefreshLoading: false,
                            pageSize: -1,
                            status: 'active',
                            content: value,
                            companyId: userInfo?.mainCompanyId,
                          }),
                        );
                      }}
                      options={listVesselTypeOption || []}
                      dynamicLabels={dynamicFields}
                    />
                  </Col>
                )}

                <Col xs={4}>
                  <AsyncSelectResultForm
                    multiple
                    disabled={
                      !isEdit || loadingReportTemplate || loadingAuditType
                    }
                    labelSelect={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Selected inspection type'
                      ],
                    )}
                    control={control}
                    name="auditTypeIds"
                    id="auditTypeIds"
                    titleResults={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Selected,
                    )}
                    isRequired
                    placeholder={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Please select'
                      ],
                    )}
                    searchContent={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Inspection types'
                      ],
                    )}
                    textSelectAll={renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Select all'
                      ],
                    )}
                    messageRequired={errors?.auditTypeIds?.message || ''}
                    onChangeSearch={(value: string) => {
                      dispatch(
                        getListAuditTypeActions.request({
                          isRefreshLoading: false,
                          pageSize: -1,
                          status: 'active',
                          content: value,
                          companyId: userInfo?.mainCompanyId,
                        }),
                      );
                    }}
                    options={listAuditTypeOption || []}
                    dynamicLabels={dynamicFields}
                  />
                </Col>
              </Row>
            </div>

            {modalHeader && (
              <ModalAddHeader
                isShow={modalHeader}
                data={reportTemplateTable}
                isAdd={isAdd}
                isCreate={isCreate}
                headerIndex={indexHeader}
                selectedData={selectedData}
                setShow={() => {
                  setModalHeader((e) => !e);
                }}
                handleAdd={addToListReportTemplate}
                loading={loadingReportTemplate}
                title={
                  isAdd
                    ? renderDynamicLabel(
                        dynamicFields,
                        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                          'Add header'
                        ],
                      )
                    : renderDynamicLabel(
                        dynamicFields,
                        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                          'Edit header'
                        ],
                      )
                }
                isEdit={isEdit}
              />
            )}

            {modalSubTopicHeader && (
              <ModalSubHeader
                printOptions={printOptions}
                isShow={modalSubTopicHeader}
                data={[...reportTemplateTable]}
                selectedData={{ ...selectedData }}
                headerIndex={indexHeader}
                isAdd={isAddSub}
                setShow={() => {
                  setModalSubTopicHeader((e) => !e);
                }}
                handleAdd={addSubHeader}
                handleEdit={editSubHeader}
                loading={loadingReportTemplate}
                title={
                  isAddSub
                    ? renderDynamicLabel(
                        dynamicFields,
                        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                          'Add sub-header'
                        ],
                      )
                    : renderDynamicLabel(
                        dynamicFields,
                        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                          'Edit sub-header'
                        ],
                      )
                }
                isEdit={isEdit}
                isCreate={isCreate}
              />
            )}

            {isChooseTemplate && (
              <ModalChoseVersionTemplate
                isShow={isChooseTemplate}
                vesselSelected={vesselTemplate}
                setShow={() => {
                  setIsChooseTemplate((e) => !e);
                }}
                handSelection={handleSelectVersionTemplate}
                isCreate={isCreate}
                isEdit={isEdit}
              />
            )}

            {isShowAuditType && (
              <ModalAuditType
                isShow={isShowAuditType}
                setShow={() => {
                  setIsShowAuditType((e) => !e);
                }}
                data={
                  selectedData?.auditTypeIds
                    ? [...selectedData?.auditTypeIds]
                    : [...selectedData?.auditTypes.map((i) => i?.id)]
                }
                isCreate={isCreate}
                isEdit={isEdit}
              />
            )}
          </div>
          <div
            className={cx(
              styles.wrapperContainer,
              styles.wrapperContainerHeight,
            )}
          >
            <div className={cx(styles.labelForm)}>
              <span className={cx('fw-bold', styles.titleForm)}>
                {renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                    'Report template'
                  ],
                )}
              </span>
              {isEdit && (
                <Button
                  className={styles.buttonAdd}
                  buttonSize={ButtonSize.Medium}
                  onClick={() => {
                    setModalHeader(true);
                    setIsAdd(true);
                    setSelectedData(undefined);
                  }}
                  renderSuffix={
                    <img
                      src={images.icons.icAddCircle}
                      alt="createNew"
                      className={styles.icButton}
                    />
                  }
                  disabled={loadingReportTemplate}
                >
                  {renderDynamicLabel(
                    dynamicFields,
                    REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Add header'],
                  )}
                </Button>
              )}
            </div>
            <AGGridModule
              loading={loading}
              params={params}
              setIsMultiColumnFilter={setIsMultiColumnFilter}
              hasRangePicker={false}
              columnDefs={columnDefs}
              dataFilter={null}
              pageSizeDefault={5}
              moduleTemplate={MODULE_TEMPLATE.reportTemplate}
              fileName={renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
              )}
              dataTable={dataTable}
              height="275px"
              getList={handleGetList}
              classNameHeader={styles.header}
              aggridId="ag-grid-table-1"
              dynamicLabels={dynamicFields}
            />
          </div>
          <div
            className={cx(
              styles.wrapperContainer,
              styles.wrapperContainerHeight,
              styles.wrapperContainerHistory,
            )}
          >
            <TableHistoryAGGrid
              data={data?.statusHistory}
              hideStatus
              showAction
              hideComment
              loading={loadingReportTemplate}
              pageSizeDefault={5}
              aggridId="ag-grid-table-2"
              moduleTemplate={MODULE_TEMPLATE.reportTemplateTableHistory}
              dynamicLabels={dynamicFields}
            />
          </div>
          {isEdit ? (
            <GroupButton
              className={styles.GroupButton}
              handleCancel={handleCancel}
              handleSubmit={handleSubmit(onSubmitForm, scrollToView)}
              handleSubmitAndNew={
                isCreate
                  ? handleSubmit(handleSubmitAndNew, scrollToView)
                  : undefined
              }
              disable={loadingReportTemplate}
              txButtonLeft={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Cancel,
              )}
              txButtonBetween={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Save,
              )}
              txButtonRight={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Save & New'],
              )}
              dynamicLabels={dynamicFields}
            />
          ) : null}

          <ModalComponent
            isOpen={openConfirmCreateModal}
            content={renderDynamicLabel(
              dynamicFields,
              REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                'Version number existed. Confirm to increase version number'
              ],
            )}
            toggle={() => setOpenConfirmCreateModal(false)}
            footer={
              <div className={styles.wrapperFooter}>
                <Button
                  onClick={() => {
                    if (actionType === 'save') {
                      handleSubmit(onSubmitForm, scrollToView)();
                    }
                    if (actionType === 'saveAndNew') {
                      handleSubmit(handleSubmitAndNew, scrollToView)();
                    }
                    setOpenConfirmCreateModal(false);
                  }}
                >
                  {renderDynamicLabel(
                    dynamicFields,
                    REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Confirm,
                  )}
                </Button>
              </div>
            }
            hideClose
          />
        </div>
      )}
    </>
  );
};

export default ReportTemplateForm;
