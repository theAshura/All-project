import { useEffect, FC, useCallback, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import RowAntd from 'antd/lib/row';
import ColAntd from 'antd/lib/col';
import { scopeOptions } from 'constants/filter.const';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import history from 'helpers/history.helper';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { AppRouteConst } from 'constants/route.const';
import ModalListForm from 'components/react-hook-form/modal-list-form/ModalListForm';
import ModalListTableForm from 'components/react-hook-form/modal-list-form/ModalListTableForm';
import { useDispatch, useSelector } from 'react-redux';
import { toastError } from 'helpers/notification.helper';
import Container from 'components/common/container/Container';
import SelectUI from 'components/ui/select/Select';
import * as yup from 'yup';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import images from 'assets/images/images';
import { REGEXP_INPUT_MIN_VALUE_POSITIVE } from 'constants/regExpValidate.const';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import {
  clearInspectionMappingErrorsReducer,
  getListNatureOfFindingActions,
} from 'store/inspection-mapping/inspection-mapping.action';
import {
  InspectionMapping,
  InspectionMappingDetailResponse,
} from 'models/api/inspection-mapping/inspection-mapping.model';
import {
  clearAuthorityMasterReducer,
  getListAuthorityMasterActions,
} from 'store/authority-master/authority-master.action';
import {
  clearAuditCheckListReducer,
  getListAuditCheckListAction,
} from 'store/audit-checklist/audit-checklist.action';
import { formatDateTime } from 'helpers/utils.helper';
import {
  clearAuditTypeReducer,
  getListAuditTypeActions,
} from 'store/audit-type/audit-type.action';
import { getListInspectionMappingsActionsApi } from 'api/inspection-mapping.api';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';

import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS } from 'constants/dynamic/inspectionMapping.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import TableAuditChecklist from './components/table-audit-checklist/TableAuditChecklist';
import TableUserHistorySection from './components/table-user-history-section/TableUserHistorySection';
import styles from './form.module.scss';

interface InspectionMappingFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: InspectionMappingDetailResponse;
  onSubmit: (CreateInspectionMappingParams) => void;
}

const sortPosition = [
  'scope',
  'auditTypeId',
  'auditPeriod',
  'natureFindingIds',
  'status',
  'primaryFinding',
  'auditChecklistIds',
];

const defaultValues = {
  scope: null,
  status: 'active',
  windowStartPeriod: '',
  windowEndPeriod: '',
  auditPeriod: '',
  // extensionApplicable: false,
  applicableShip: false,
  applicableShore: true,
  showViq: false,
  // applicableToOtherBoard: false,
  // shoreApprovalRequired: false,
  auditTypeId: null,
  primaryFinding: null,
  natureFindingIds: [],
  auditChecklistIds: [],
  authorityIds: [],
};

const InspectionMappingForm: FC<InspectionMappingFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
}) => {
  const [isChangeScope, setIsChangeScope] = useState(true);

  const dispatch = useDispatch();

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const schema = useMemo(
    () =>
      yup.object().shape({
        auditTypeId: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        scope: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        primaryFinding: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        natureFindingIds: yup
          .array()
          .min(
            1,
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    [dynamicFields],
  );

  const { errorList, loading, listNatureOfFindings } = useSelector(
    (state) => state.inspectionMapping,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const { listAuditCheckList } = useSelector((state) => state.auditCheckList);
  const { listAuditTypes } = useSelector((state) => state.auditType);
  const [currentUrl, setCurrentUrl] = useState<string>(
    history.location.pathname,
  );
  const [usedAuditType, setUsedAuditType] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setError,
    getValues,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchNatureFinding = watch('natureFindingIds');
  const watchPrimaryFinding = watch('primaryFinding');
  const watchScope = watch('scope');

  const watchAuditChecklistIds = watch('auditChecklistIds');
  const watchAuditTypeId = watch('auditTypeId');

  useEffect(() => {
    dispatch(
      getListAuthorityMasterActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );

    dispatch(
      getListAuditTypeActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );

    dispatch(
      getListNatureOfFindingActions.request({
        pageSize: -1,
        status: 'active',
        companyId: userInfo?.mainCompanyId,
      }),
    );

    dispatch(
      getListAuditCheckListAction.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );

    return () => {
      dispatch(clearAuthorityMasterReducer());
      dispatch(clearAuditCheckListReducer());
      dispatch(clearAuditTypeReducer());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!isSubmitted) {
      getListInspectionMappingsActionsApi({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      })
        .then((res) => {
          const dataIds = [];

          res.data.data.forEach((item) => {
            if (
              !dataIds.includes(item.auditTypeId) &&
              data?.auditTypeId !== item?.auditTypeId
            ) {
              dataIds.push(item.auditTypeId);
            }
          });
          setUsedAuditType(dataIds);
        })
        .catch((e) => {
          setUsedAuditType([]);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.auditTypeId, isSubmitted]);

  useEffect(
    () =>
      history.listen((location) => {
        setCurrentUrl(location?.pathname);
      }),
    [],
  );

  const rowLabelsNatureOfFinding = [
    {
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.checkbox,
      ),
      id: 'checkbox',
      width: 40,
    },
    {
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Nature of finding code'],
      ),
      id: 'natureFindingId',
      width: 180,
    },
    {
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Nature of finding name'],
      ),
      id: 'natureOfFinding',
      width: 530,
    },
  ];

  const rowLabelsAuditChecklist = [
    {
      title: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Checklist code'],
      ),
      width: 180,
      dataIndex: 'checklistCode',
    },
    {
      title: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Checklist name'],
      ),
      dataIndex: 'checklistName',
      width: 220,
    },
    {
      title: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Entity,
      ),
      dataIndex: 'auditEntity',
      width: 160,
    },
    {
      title: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Revision number'],
      ),
      dataIndex: 'revisionNumber',
      width: 160,
    },
    {
      title: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Revision date'],
      ),
      dataIndex: 'revisionDate',
      width: 160,
    },
    {
      title: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Status,
      ),
      dataIndex: 'status',
      width: 160,
    },
    {
      title: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['App type'],
      ),
      dataIndex: 'appType',
      width: 160,
    },
    {
      title: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Checklist type'],
      ),
      dataIndex: 'checklistType',
      width: 160,
    },
    {
      title: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Valid form'],
      ),
      dataIndex: 'validityFrom',
      width: 160,
    },
    {
      title: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Valid to'],
      ),
      dataIndex: 'validityFrom',
      width: 160,
    },
  ];

  const dataNatureOfFinding = useMemo(
    () =>
      listNatureOfFindings?.data?.map((item) => ({
        id: item.id,
        label: item.name,
        code: item.code,
        name: item.name,
      })),
    [listNatureOfFindings?.data],
  );

  const dataMarkOfFinding = useMemo(() => {
    const natureIds = watchNatureFinding;
    return dataNatureOfFinding
      ?.filter((item) => natureIds?.includes(item.id))
      .map((item) => ({
        value: item.id,
        label: item.name,
      }));
  }, [dataNatureOfFinding, watchNatureFinding]);

  const dataAuditType = useMemo(() => {
    const filterData = listAuditTypes?.data.filter(
      (item) => !usedAuditType.includes(item.id),
    );
    let newData =
      filterData
        ?.filter((item) => (watchScope ? watchScope === item.scope : true))
        ?.map((item) => ({
          value: item.id,
          label: item.name,
        })) || [];
    const dataAuditType = newData?.find((i) => i.value === data?.auditType?.id);
    // check old data
    if (
      data?.auditType &&
      !dataAuditType &&
      watchAuditTypeId === data?.auditType?.id
    ) {
      newData = [
        ...newData,
        {
          value: data?.auditType?.id,
          label: data?.auditType?.name,
        },
      ];
    }
    return newData;
  }, [
    watchScope,
    listAuditTypes?.data,
    data?.auditType,
    watchAuditTypeId,
    usedAuditType,
  ]);

  const dataAuditChecklist = useMemo(
    () =>
      listAuditCheckList?.data
        ?.filter((item) => item.status === 'Approved')
        .map((item) => ({
          id: item.id,
          checklistCode: item.code,
          checklistName: item.name,
          revisionNumber: item.revisionNumber,
          revisionDate: formatDateTime(item.revisionDate),
          status: item.status,
          appType: item.appType,
          checklistType: item.chkType,
          validityFrom: formatDateTime(item.validityFrom),
          validityTo: formatDateTime(item.validityTo),
          label: item.name,
          auditEntity: item?.auditEntity,
        })),
    [listAuditCheckList?.data],
  );

  const dataAuditChecklistTable = useMemo(() => {
    const auditChecklist = watchAuditChecklistIds;

    return listAuditCheckList?.data?.filter((item) =>
      auditChecklist?.includes(item.id),
    );
  }, [watchAuditChecklistIds, listAuditCheckList?.data]);

  const resetDefault = useCallback(
    (defaultParams) => {
      reset(defaultParams);
      history.goBack();
    },
    [reset],
  );

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    let params = getValues();
    params = {
      ...params,
      windowStartPeriod: String(params?.windowEndPeriod),
      windowEndPeriod: String(params?.windowStartPeriod),
      auditPeriod: String(params?.auditPeriod),
    };
    if (isCreate) {
      defaultParams = defaultValues;
    } else {
      let primaryFindingId = '';
      const natureFindingListId = data?.natureFindings?.map((item) => {
        if (item.isPrimaryFinding) {
          primaryFindingId = item.natureFinding.id;
        }
        return item.natureFinding.id;
      });
      defaultParams = {
        scope: data?.scope,
        status: data?.status,
        showViq: data?.showViq,
        // extensionApplicable: data?.extensionApplicable,
        applicableShip: data?.applicableShip,
        applicableShore: data?.applicableShore,
        windowStartPeriod: String(data?.windowEndPeriod),
        windowEndPeriod: String(data?.windowStartPeriod),
        auditPeriod: String(data?.auditPeriod),
        // applicableToOtherBoard:
        //   data?.scope === 'internal'
        //     ? data?.applicableToOtherBoard
        //     : data?.applicableToVettingInspection,
        // shoreApprovalRequired: data?.shoreApprovalRequired,
        auditTypeId: data?.auditType.id,
        primaryFinding: primaryFindingId,
        natureFindingIds: natureFindingListId,
        auditChecklistIds: data?.auditChecklists.map((item) => item.id) || [],
        authorityIds: data?.authorities.map((item) => item.id) || [],
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.INSPECTION_MAPPING);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Confirmation?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () =>
          isCreate
            ? history.push(AppRouteConst.INSPECTION_MAPPING)
            : resetDefault(defaultParams),
      });
    }
  }, [
    data?.applicableShip,
    data?.applicableShore,
    data?.auditChecklists,
    data?.auditPeriod,
    data?.auditType.id,
    data?.authorities,
    data?.natureFindings,
    data?.scope,
    data?.showViq,
    data?.status,
    data?.windowEndPeriod,
    data?.windowStartPeriod,
    dynamicFields,
    getValues,
    isCreate,
    resetDefault,
  ]);

  const scrollToView = useCallback((errors) => {
    if (!isEmpty(errors)) {
      const firstError = sortPosition.find((item) => errors[item]);
      const el = document.querySelector(`.form_data #${firstError}`);

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleSubmitAndNew = useCallback(
    // eslint-disable-next-line consistent-return
    (dataForm) => {
      if (!dataForm?.auditChecklistIds?.length) {
        return toastError('Please add audit checklist');
      }
      const { countryAuthority, applicableToOtherBoard, ...other } = dataForm;
      const params = {
        ...other,
        windowEndPeriod: Number(dataForm.windowEndPeriod),
        windowStartPeriod: Number(dataForm.windowStartPeriod),
        auditPeriod: Number(dataForm.auditPeriod),
        // applicableToOtherBoard:
        //   dataForm.scope === 'internal'
        //     ? applicableToOtherBoard
        //     : !applicableToOtherBoard,
        // applicableToVettingInspection:
        //   dataForm.scope === 'internal'
        //     ? !applicableToOtherBoard
        //     : applicableToOtherBoard,
      };
      const dataNew: InspectionMapping = {
        ...params,
        isNew: true,
        resetForm,
      };

      onSubmit(dataNew);
    },
    [onSubmit, resetForm],
  );

  const onSubmitForm = useCallback(
    // eslint-disable-next-line consistent-return
    (dataForm) => {
      if (!dataForm?.auditChecklistIds?.length) {
        return toastError('Please add audit checklist');
      }
      const { countryAuthority, applicableToOtherBoard, ...other } = dataForm;
      const params = {
        ...other,
        windowEndPeriod: Number(dataForm.windowEndPeriod),
        windowStartPeriod: Number(dataForm.windowStartPeriod),
        auditPeriod: Number(dataForm.auditPeriod),
        // applicableToOtherBoard:
        //   dataForm.scope === 'internal'
        //     ? applicableToOtherBoard
        //     : !applicableToOtherBoard,
        // applicableToVettingInspection:
        //   dataForm.scope === 'internal'
        //     ? !applicableToOtherBoard
        //     : applicableToOtherBoard,
      };

      onSubmit(params);
    },
    [onSubmit],
  );

  const handleDeleteAuditChecklist = useCallback(
    (id: string) => {
      const result =
        dataAuditChecklistTable
          ?.filter((item) => item.id !== id)
          ?.map((item) => item.id) || [];
      setValue('auditChecklistIds', result);
    },
    [dataAuditChecklistTable, setValue],
  );

  // EFFECT

  useEffect(() => {
    if (data) {
      let primaryFindingId = '';
      const natureFindingIds = data?.natureFindings?.map((item) => {
        if (item.isPrimaryFinding) {
          primaryFindingId = item.natureFinding.id;
        }
        return item.natureFinding.id;
      });

      setValue('scope', data?.scope || null);
      setValue('status', data?.status || '');

      setValue('windowStartPeriod', data?.windowStartPeriod || '');
      setValue('windowEndPeriod', data?.windowEndPeriod || '');
      setValue('auditPeriod', data?.auditPeriod || '');
      setValue('applicableShip', data?.applicableShip || false);
      setValue('applicableShore', data?.applicableShore || false);
      setValue('showViq', data?.showViq || false);
      // setValue('extensionApplicable', data?.extensionApplicable || false);
      // setValue('shoreApprovalRequired', data?.shoreApprovalRequired || false);
      // setValue(
      //   'applicableToOtherBoard',
      //   data.scope === 'internal'
      //     ? data?.applicableToOtherBoard
      //     : data?.applicableToVettingInspection || false,
      // );

      setValue('auditTypeId', data?.auditTypeId || null);

      setValue('primaryFinding', primaryFindingId);
      setValue('natureFindingIds', natureFindingIds || []);
      setValue(
        'auditChecklistIds',
        data?.auditChecklists?.map((item) => item.id) || [],
      );
      setValue('authorityIds', data?.authorities.map((item) => item.id) || []);
    }

    return () => {
      dispatch(clearInspectionMappingErrorsReducer());
    };
  }, [data, dispatch, isCreate, setValue]);

  useEffect(() => {
    const markFindingId = watchPrimaryFinding;
    const natureIds = watchNatureFinding;
    if (!natureIds?.includes(markFindingId)) {
      setValue('primaryFinding', null);
    }
  }, [setValue, watchNatureFinding, watchPrimaryFinding]);

  useEffect(() => {
    if (!isChangeScope) {
      setValue('auditTypeId', null);
    }
  }, [isChangeScope, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'windowStartPeriod':
            setError('windowStartPeriod', { message: item.message });
            break;
          case 'windowEndPeriod':
            setError('windowEndPeriod', { message: item.message });
            break;
          case 'auditPeriod':
            setError('auditPeriod', { message: item.message });
            break;
          case 'auditTypeId':
            setError('auditTypeId', { message: item.message });
            break;
          case 'primaryFinding':
            setError('primaryFinding', { message: item.message });
            break;
          case 'natureFindingIds':
            setError('natureFindingIds', { message: item.message });
            break;
          case 'auditChecklistIds':
            setError('auditChecklistIds', { message: item.message });
            break;
          case 'authorityIds':
            setError('authorityIds', { message: item.message });
            break;
          // case 'applicableToOtherBoard':
          // case 'applicableToVettingInspection':
          //   setError('applicableToOtherBoard', { message: item.message });
          //   break;
          default:
            break;
        }
      });
    } else {
      clearErrors();
    }
  }, [clearErrors, errorList, setError]);

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <Container>
      <div className={cx('pb-4', styles.wrap)}>
        <div className={cx('container__subtitle', styles.subTitle)}>
          {renderDynamicLabel(
            dynamicFields,
            INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS[
              'Inspection mapping information'
            ],
          )}
        </div>
        <Row className="mx-0">
          <Col className="p-0 me-3">
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Scope,
              )}
              data={scopeOptions}
              isRequired
              disabled={!isEdit}
              name="scope"
              id="scope"
              messageRequired={errors?.scope?.message || null}
              className="w-100"
              onChange={() => {
                setIsChangeScope(false);
              }}
              control={control}
              placeholder={renderDynamicLabel(
                dynamicFields,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
          <Col className="p-0 mx-3">
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Inspection type'],
              )}
              data={dataAuditType || []}
              disabled={!isEdit}
              name="auditTypeId"
              id="auditTypeId"
              isRequired
              messageRequired={errors?.auditTypeId?.message || ''}
              className="w-100"
              control={control}
              placeholder={renderDynamicLabel(
                dynamicFields,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
          <Col className="p-0 ms-3">
            <InputForm
              label={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS[
                  'Inspection period (in days)'
                ],
              )}
              disabled={!isEdit}
              messageRequired={errors?.auditPeriod?.message || ''}
              maxLength={4}
              placeholder={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS[
                  'Enter inspection period'
                ],
              )}
              patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
              control={control}
              name="auditPeriod"
              id="auditPeriod"
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className="p-0 me-3 modal__list-form">
            <ModalListForm
              name="natureFindingIds"
              id="natureFindingIds"
              labelSelect={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Nature of findings'],
              )}
              title={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Nature of findings'],
              )}
              disable={!isEdit}
              isRequired
              control={control}
              data={dataNatureOfFinding}
              rowLabels={rowLabelsNatureOfFinding}
              error={errors?.natureFindingIds?.message || ''}
              disableCloseWhenClickOut
              placeholder={renderDynamicLabel(
                dynamicFields,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              dynamicLabels={dynamicFields}
            />
          </Col>
          <Col className="p-0 mx-3">
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS[
                  'Mark primary findings'
                ],
              )}
              data={dataMarkOfFinding || []}
              isRequired
              disabled={!isEdit || !dataMarkOfFinding?.length}
              name="primaryFinding"
              id="primaryFinding"
              messageRequired={errors?.primaryFinding?.message || null}
              className="w-100"
              control={control}
              placeholder={renderDynamicLabel(
                dynamicFields,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
          <Col className="p-0 ms-3">
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Status,
              )}
              data={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicFields,
                    COMMON_DYNAMIC_FIELDS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicFields,
                    COMMON_DYNAMIC_FIELDS.Inactive,
                  ),
                },
              ]}
              disabled={!isEdit}
              name="status"
              id="status"
              className="w-100"
              control={control}
              placeholder={renderDynamicLabel(
                dynamicFields,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
        </Row>

        <RowAntd gutter={[28, 14]}>
          <ColAntd xs={8} xl={8} className="">
            <ToggleSwitch
              disabled={!isEdit}
              label={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Ship (no/yes)'],
              )}
              control={control}
              name="applicableShip"
              id="applicableShip"
            />
          </ColAntd>
          <ColAntd xs={8} xl={8} className="">
            <ToggleSwitch
              disabled={!isEdit}
              label={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Shore (no/yes)'],
              )}
              control={control}
              name="applicableShore"
              id="applicableShore"
            />
          </ColAntd>
          {/* <ColAntd xs={8} xl={8} className="">
            <ToggleSwitch
              disabled={!isEdit}
              label={t('extensionApplicable')}
              control={control}
              name="extensionApplicable"
              id="extensionApplicable"
            />
          </ColAntd> */}
          <ColAntd xs={8} xl={8} className="">
            <ToggleSwitch
              disabled={!isEdit}
              label={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Show VIQ'],
              )}
              control={control}
              name="showViq"
              id="showViq"
            />
          </ColAntd>
          {/* <ColAntd xs={8} xl={6} className="">
            <ToggleSwitch
              disabled={!isEdit}
              label={
                watchScope === 'internal'
                  ? t('applicableToOtherOnboard')
                  : t('applicableToVettingInspection')
              }
              control={control}
              name="applicableToOtherBoard"
              wrapperClassName={cx(styles.toggle)}
              id="applicableToOtherBoard"
            />
          </ColAntd> */}
          {/* <ColAntd xs={8} xl={6} className="">
            <ToggleSwitch
              disabled={!isEdit}
              label={t('shoreApprovalRequiredTx')}
              control={control}
              name="shoreApprovalRequired"
              id="shoreApprovalRequired"
            />
          </ColAntd> */}
        </RowAntd>
      </div>
      <div className="mt-2 container__divider" />
      <div className="d-flex justify-content-between align-items-center py-3 ">
        <div className="container__subtitle">
          {renderDynamicLabel(
            dynamicFields,
            INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS[
              'Inspection checklist template'
            ],
          )}
        </div>
        {isEdit && (
          <ModalListTableForm
            name="auditChecklistIds"
            disable={!isEdit}
            id="auditChecklistIds"
            control={control}
            dynamicLabels={dynamicFields}
            title={renderDynamicLabel(
              dynamicFields,
              INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS[
                'Inspection checklist template'
              ],
            )}
            data={dataAuditChecklist}
            rowLabels={rowLabelsAuditChecklist}
            error={errors?.auditChecklistIds?.message || ''}
            multiple
            disableCloseWhenClickOut
            textBtn={renderDynamicLabel(
              dynamicFields,
              INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Add more'],
            )}
          />
        )}
      </div>
      <TableAuditChecklist
        data={dataAuditChecklistTable}
        onDelete={handleDeleteAuditChecklist}
        loading={false}
        isEdit={isEdit}
        isCreated={isCreate}
      />

      {currentUrl?.includes('/detail') && data?.statusHistory?.length > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center py-3 ">
            <div className="container__subtitle">
              {renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS[
                  'User history section'
                ],
              )}
            </div>
          </div>
          <TableUserHistorySection
            data={data}
            loading={false}
            isEdit={isEdit}
            isCreated={isCreate}
          />
        </>
      )}
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
          disable={loading}
          txButtonLeft={renderDynamicLabel(
            dynamicFields,
            INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Cancel,
          )}
          txButtonBetween={renderDynamicLabel(
            dynamicFields,
            INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Save,
          )}
          txButtonRight={renderDynamicLabel(
            dynamicFields,
            INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Save & New'],
          )}
        />
      ) : null}
    </Container>
  );
};

export default InspectionMappingForm;
