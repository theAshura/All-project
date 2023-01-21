import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';
import * as yup from 'yup';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  DateTimePicker,
  DateTimeRangePicker,
} from 'components/ui/datepicker/Datepicker';
import Input from 'components/ui/input/Input';
import SelectUI from 'components/ui/select/Select';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import { Option, ENTITY_OPTIONS, ENTITY_VESSEL } from 'constants/filter.const';
import { DataObj } from 'models/common.model';
import { MasterDataId } from 'constants/common.const';
import {
  MasterData,
  GetAuditCheckListCode,
  StatusHistory,
} from 'models/api/audit-checklist/audit-checklist.model';
import { AppRouteConst } from 'constants/route.const';
import { capitalizeFirstLetter } from 'helpers/utils.helper';
import { AuditVisitType } from 'constants/components/planning.const';
import history from 'helpers/history.helper';
import moment, { Moment } from 'moment-timezone';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { formatDateNoTime } from 'helpers/date.helper';
import { useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import ReferencesCategorySelect from '../common/references-category-select/ReferencesCategorySelect';
import TableHistorySectionAGGrid from '../common/user-history-section/TableHistorySectionAGGrid';
import styles from './form.module.scss';

export interface GeneralInfoFormModel {
  code: string;
  auditEntity: string;
  chkType: string;
  name: string;
  revisionNumber: string;
  revisionDate: string;
  publishedDate: string;
  validityPeriod: Moment[];
  visitTypes: string[];
  referencesCategory: string[];
  inspectionModule: string;
}

export interface GeneralInfoFormProps {
  isEdit?: boolean;
  isTemplateChosen: boolean;
  setIsTemplateChosen?: (value: boolean) => void;
  data?: DataObj;
  isCreate?: boolean;
  masterDataOptions?: MasterData[];
  chkCode?: GetAuditCheckListCode;
  onSubmit?: (value: GeneralInfoFormModel) => void;
  handleDeleteData?: () => void;
  statusHistory?: StatusHistory[];
}

const sortPosition = [
  'auditEntity',
  'chkType',
  'name',
  'revisionNumber',
  'revisionDate',
  'validityPeriod',
  'visitTypes',
  'referencesCategory',
  'inspectionModule',
];

const AuditCheckListGeneralInfoForm: FC<GeneralInfoFormProps> = ({
  isEdit = false,
  data,
  isCreate,
  isTemplateChosen,
  setIsTemplateChosen,
  masterDataOptions,
  chkCode,
  onSubmit,
  statusHistory,
  handleDeleteData,
}) => {
  const { loading, errorList } = useSelector((state) => state.auditCheckList);
  const [firstErrorId, setFirstErrorId] = useState('');

  // AGGrid
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  // AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS

  const visitTypeOptions: Option[] = [
    {
      value: AuditVisitType.PORT,
      label: renderDynamicLabel(
        dynamicLabels,
        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation.Port,
      ),
    },
    {
      value: AuditVisitType.SAILING,
      label: renderDynamicLabel(
        dynamicLabels,
        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation
          .Sailing,
      ),
    },
  ];
  const [listVisitType, setListVisitType] =
    useState<Option[]>(visitTypeOptions);

  const rowLabels = useMemo(
    () => [
      {
        label: renderDynamicLabel(
          dynamicLabels,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation
            .Checkbox,
        ),
        id: 'checkbox',
        width: 80,
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
            'References & Category field names'
          ],
        ),
        id: 'categories',
        width: '100%',
      },
    ],
    [dynamicLabels],
  );

  const defaultValues = useMemo(
    () =>
      isCreate
        ? {
            code: chkCode?.code || '',
            auditEntity: ENTITY_VESSEL,
            chkType: null,
            name: '',
            revisionNumber: '',
            revisionDate: '',
            publishedDate: '',
            validityPeriod: [moment(), moment().add(1, 'M')],
            visitTypes: [],
            referencesCategory: [
              MasterDataId.LOCATION,
              MasterDataId.MAIN_CATEGORY,
              MasterDataId.VESSEL_TYPE,
            ],
            inspectionModule: null,
          }
        : {
            code: data?.code || '',
            auditEntity: data?.auditEntity || ENTITY_VESSEL,
            chkType: data?.chkType || null,
            name: data?.name || '',
            revisionNumber: data?.revisionNumber || '',
            revisionDate: moment(data?.revisionDate),
            publishedDate: formatDateNoTime(data?.publishedDate),
            validityPeriod: [
              moment(data?.validityFrom),
              moment(data?.validityTo),
            ],
            visitTypes: data?.visitTypes || [],
            referencesCategory: data?.referencesCategory?.map((i) => i.id),
            inspectionModule: data?.inspectionModule || null,
          },
    [chkCode, isCreate, data],
  );

  const checkListTypeOptions: Option[] = [
    {
      value: 'Audit Report',
      label: renderDynamicLabel(
        dynamicLabels,
        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
          'Inspection report'
        ],
      ),
    },
    {
      value: 'Audit Finding Report',
      label: renderDynamicLabel(
        dynamicLabels,
        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
          'Inspection finding report'
        ],
      ),
    },
  ];

  const inspectionModuleOptions: Option[] = [
    {
      value: 'Ship visit findings',
      label: renderDynamicLabel(
        dynamicLabels,
        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
          'Report of finding'
        ],
      ),
    },
  ];

  const schema = yup.object().shape({
    auditEntity: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    chkType: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    name: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .min(
        2,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Must be at least 2 characters'],
        ),
      ),
    revisionNumber: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    revisionDate: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    validityPeriod: yup
      .array()
      .nullable()
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    visitTypes: yup
      .array()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),

    referencesCategory: yup
      .array()
      .nullable()
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    getValues,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchEntity = watch('auditEntity');

  const resetValues = useCallback(
    (valueEntity: string) => {
      let values = {
        auditEntity: valueEntity,
        name: '',
        chkType: data?.chkType || null,
        revisionNumber: '',
        revisionDate: '',
        validityPeriod: [moment(), moment().add(1, 'M')],
        visitTypes: [],
        inspectionModule: null,
        referencesCategory:
          valueEntity === ENTITY_VESSEL
            ? [
                MasterDataId.LOCATION,
                MasterDataId.MAIN_CATEGORY,
                MasterDataId.VESSEL_TYPE,
              ]
            : [MasterDataId.LOCATION, MasterDataId.MAIN_CATEGORY],
      };
      if (isCreate) {
        values = { ...values, chkType: null };
      }
      return values;
    },
    [data?.chkType, isCreate],
  );

  const referencesCategoryOptions = useMemo(() => {
    let dataMasterDataOptions = masterDataOptions
      ?.filter((i) => i.id !== MasterDataId.SDR && i.name)
      ?.map((item) => ({
        id: item.id,
        label: item.name,
        name: item.name,
        required:
          item.id === MasterDataId.LOCATION ||
          item.id === MasterDataId.MAIN_CATEGORY ||
          item.id === MasterDataId.VESSEL_TYPE ||
          !isEdit,
      }));
    if (watchEntity === ENTITY_VESSEL) {
      dataMasterDataOptions = dataMasterDataOptions?.filter(
        (i) => i.id !== MasterDataId.DEPARTMENT,
      );
    } else {
      dataMasterDataOptions = dataMasterDataOptions?.filter(
        (i) => i.id !== MasterDataId.VESSEL_TYPE,
      );
    }
    return dataMasterDataOptions;
  }, [masterDataOptions, isEdit, watchEntity]);

  const defaultReferencesCategory: string[] = useMemo(() => {
    let fetchData = data?.referencesCategory?.map((i) => i.id) || [];
    if (!fetchData.includes(MasterDataId.LOCATION)) {
      fetchData = [...fetchData, MasterDataId.LOCATION];
    }

    if (!fetchData.includes(MasterDataId.MAIN_CATEGORY)) {
      fetchData = [...fetchData, MasterDataId.MAIN_CATEGORY];
    }
    if (
      watchEntity === ENTITY_VESSEL &&
      !fetchData.includes(MasterDataId.VESSEL_TYPE)
    ) {
      fetchData = [...fetchData, MasterDataId.VESSEL_TYPE];
    }

    if (watchEntity !== ENTITY_VESSEL) {
      fetchData = fetchData.filter((item) => item !== MasterDataId.VESSEL_TYPE);
    }

    return fetchData;
  }, [data?.referencesCategory, watchEntity]);

  const handleSetDataForm = useCallback(() => {
    const visitTypes = data?.visitTypes?.map((item) => ({
      value: item,
      label: item,
    }));

    if (data && isCreate) {
      setValue('chkType', data?.chkType || null);
      setValue('auditEntity', data?.auditEntity || ENTITY_VESSEL);

      setValue('visitTypes', visitTypes || []);
      setValue(
        'referencesCategory',
        data?.referencesCategory?.map((i) => i.id),
      );
      setValue('inspectionModule', data?.inspectionModule || null);
      if (data?.publishedDate) {
        setValue('publishedDate', formatDateNoTime(data?.publishedDate));
      }
      setValue('validityPeriod', [
        moment(data?.validityFrom),
        moment(data?.validityTo),
      ]);
    }
    if (data && !isCreate) {
      setValue('auditEntity', data?.auditEntity);
      setValue('code', data?.code);
      setValue('chkType', data?.chkType || null);
      setValue('visitTypes', visitTypes || []);
      setValue('revisionNumber', data?.revisionNumber);
      setValue(
        'referencesCategory',
        data?.referencesCategory?.map((i) => i.id),
      );
      setValue('inspectionModule', data?.inspectionModule || null);
      if (data?.publishedDate) {
        setValue('publishedDate', formatDateNoTime(data?.publishedDate));
      }

      setValue('validityPeriod', [
        moment(data?.validityFrom),
        moment(data?.validityTo),
      ]);
    }
  }, [data, isCreate, setValue]);

  const handleCancel = () => {
    let dataForm = getValues();
    dataForm = {
      ...dataForm,
      visitTypes: dataForm.visitTypes?.map((item) => item.value),
    };

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
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Confirmation?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () => {
          if (isCreate) {
            history.push(AppRouteConst.AUDIT_CHECKLIST);
          } else {
            reset(defaultValues);
            handleSetDataForm();
            history.goBack();
          }
        },
      });
    }
  };

  const onSubmitForm = (data) => {
    const visitTypes: string[] = [];
    data?.visitTypes?.forEach((element) => {
      visitTypes.push(element.value);
    });
    if (isEdit) {
      onSubmit({ ...data, visitTypes });
    }
  };

  const onErrorForm = (errors) => {
    if (!isEmpty(errors)) {
      const firstError = sortPosition.find((item) => errors[item]);
      const el = document.querySelector(`#form_data #${firstError}`);
      setFirstErrorId('');

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        if (errors?.name) {
          setFirstErrorId('name');
          return;
        }
        setFirstErrorId(firstError);
      }
    }
  };

  // useEffect

  useEffect(() => {
    handleSetDataForm();
  }, [data, handleSetDataForm, isCreate]);

  useEffect(() => {
    if (errorList?.length) {
      errorList?.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: capitalizeFirstLetter(item.message) });
            break;
          case 'chkType':
            setError('chkType', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          case 'name':
            setError('name', { message: capitalizeFirstLetter(item.message) });
            break;
          case 'revisionNumber':
            setError('revisionNumber', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          case 'revisionDate':
            setError('revisionDate', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          case 'validityFrom':
            setError('validityPeriod', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          case 'validityTo':
            setError('validityPeriod', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          case 'visitTypes':
            setError('visitTypes', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          case 'referencesCategory':
            setError('referencesCategory', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          case 'inspectionModule':
            setError('inspectionModule', {
              message: capitalizeFirstLetter(item.message),
            });
            break;
          default:
            break;
        }
      });
    } else {
      clearErrors();
    }
  }, [clearErrors, errorList, setError]);

  useEffect(() => {
    if (isCreate && isTemplateChosen && data) {
      const dataEntity = data?.auditEntity;
      setValue(
        'referencesCategory',
        data?.referencesCategory
          ?.map((i) => i.id)
          ?.filter((item) => {
            if (dataEntity === ENTITY_VESSEL) {
              return item !== MasterDataId.DEPARTMENT;
            }
            return item !== MasterDataId.VESSEL_TYPE;
          }),
      );
    }
  }, [data, isCreate, isTemplateChosen, setValue]);

  return (
    <Container className={styles.generalInfoFormContainer}>
      <div
        id="form_data"
        onClick={() => setFirstErrorId('')}
        className={cx(styles.wrapperContainer)}
      >
        <div className={cx(styles.containerForm, 'pb-0')}>
          <Row className=" mx-0">
            <Col className={cx('p-0 me-3')}>
              <SelectUI
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation.Entity,
                )}
                data={ENTITY_OPTIONS}
                isRequired
                disabled={!isEdit}
                name="auditEntity"
                id="entity"
                className={cx(
                  styles.inputSelect,
                  { [styles.disabledSelect]: !isEdit },
                  'w-100',
                )}
                onChange={(value: string) => {
                  if (isTemplateChosen && setIsTemplateChosen && data) {
                    reset(resetValues(value));
                    setIsTemplateChosen(false);
                  } else {
                    setValue(
                      'referencesCategory',
                      value === ENTITY_VESSEL
                        ? [
                            MasterDataId.LOCATION,
                            MasterDataId.MAIN_CATEGORY,
                            MasterDataId.VESSEL_TYPE,
                          ]
                        : [MasterDataId.LOCATION, MasterDataId.MAIN_CATEGORY],
                    );
                  }
                }}
                messageRequired={errors?.entity?.message || null}
                control={control}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
            </Col>
            <Col className={cx('p-0 mx-3', styles.noInput)}>
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Checklist code'],
                )}
                className={cx(styles.disabledInput, styles.readOnly)}
                disabled
                {...register('code')}
                id="code"
                maxLength={128}
              />
            </Col>

            <Col className={cx('p-0 ms-3')}>
              <SelectUI
                data={checkListTypeOptions}
                disabled={!isCreate}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Checklist type'],
                )}
                name="chkType"
                id="chkType"
                className={cx(
                  styles.inputSelect,
                  { [styles.disabledSelect]: !isEdit },
                  'w-100',
                )}
                isRequired
                messageRequired={errors?.chkType?.message || null}
                control={control}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 me-3')} id="name">
              <InputForm
                messageRequired={errors?.name?.message || ''}
                maxLength={250}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Enter checklist name'],
                )}
                label={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Checklist name'],
                )}
                patternValidate={/^[a-z\d\-_\s]+$/i}
                control={control}
                name="name"
                autoFocus={firstErrorId === 'name'}
                isRequired
                disabled={!isEdit}
              />
            </Col>
            <Col className={cx('p-0 mx-3')}>
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Revision number'],
                )}
                className={cx({ [styles.readOnly]: !isEdit })}
                {...register('revisionNumber')}
                id="revisionNumber"
                name="revisionNumber"
                isRequired
                disabled={!isEdit}
                messageRequired={errors?.revisionNumber?.message || ''}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Enter revision number'],
                )}
                maxLength={128}
                autoFocus={firstErrorId === 'revisionNumber'}
              />
            </Col>
            <Col className={cx('p-0 ms-3')}>
              <DateTimePicker
                disabled={!isEdit}
                messageRequired={errors?.revisionDate?.message || ''}
                label={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Revision date'],
                )}
                placeholder={
                  isEdit
                    ? renderDynamicLabel(
                        dynamicLabels,
                        AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                          .generalInformation['Please select'],
                      )
                    : ''
                }
                isRequired
                focus={firstErrorId === 'revisionDate'}
                className="w-100"
                id="revisionDate"
                control={control}
                name="revisionDate"
                inputReadOnly
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 me-3')}>
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Published date'],
                )}
                className={styles.disabledInput}
                disabled
                autoFocus={firstErrorId === 'publishedDate'}
                {...register('publishedDate')}
                id="publishedDate"
                maxLength={128}
              />
            </Col>
            <Col className={cx('p-0 mx-3')}>
              <DateTimeRangePicker
                label={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Checklist validity period'],
                )}
                wrapperClassName="w-100"
                rangePickerClassName="w-100"
                minDate={moment()}
                control={control}
                name="validityPeriod"
                id="validityPeriod"
                messageRequired={errors?.validityPeriod?.message || ''}
                separator={<div>-</div>}
                hideFooter
                disabled={!isEdit}
              />
            </Col>
            <Col className={cx('p-0 ms-3')}>
              <SelectUI
                data={inspectionModuleOptions}
                disabled={!isEdit}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Inspection module'],
                )}
                name="inspectionModule"
                id="inspectionModule"
                className={cx(
                  styles.inputSelect,
                  { [styles.disabledSelect]: !isEdit },
                  'w-100',
                )}
                messageRequired={errors?.inspectionModule?.message || null}
                control={control}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 me-3')}>
              <ReferencesCategorySelect
                name="referencesCategory"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['References & Category'],
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['References & Category'],
                )}
                defaultSelectedId={defaultReferencesCategory}
                hiddenClear={!isEdit}
                dynamicLabels={dynamicLabels}
                disable={!isEdit}
                control={control}
                data={referencesCategoryOptions}
                rowLabels={rowLabels}
                error={errors?.referencesCategory?.message || ''}
                verticalResultClassName={styles.resultBox}
                constraintDelete={isTemplateChosen}
                hasVesselType={watchEntity === ENTITY_VESSEL}
                disableCloseWhenClickOut
              />
            </Col>
            <Col className={cx('p-0 mx-3')}>
              <AsyncSelectResultForm
                multiple
                hiddenSearch
                disabled={!isEdit}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Visit type'],
                )}
                dynamicLabels={dynamicLabels}
                control={control}
                name="visitTypes"
                id="visitTypes"
                titleResults={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation.Selected,
                )}
                isRequired
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Please select'],
                )}
                searchContent={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Visit type'],
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicLabels,
                  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                    .generalInformation['Select all'],
                )}
                messageRequired={errors?.visitTypes?.message || ''}
                onChangeSearch={(value: string) => {
                  if (!value?.length) {
                    setListVisitType(visitTypeOptions);
                  } else {
                    const resultFilter = visitTypeOptions.filter(
                      (item) => item.value === value,
                    );
                    setListVisitType(resultFilter);
                  }
                }}
                options={listVisitType || []}
              />
            </Col>
            <Col className={cx('p-0 ms-3')} />
          </Row>
          {statusHistory?.length > 0 && (
            <div className={cx(styles.wrapperContainerHeight)}>
              <TableHistorySectionAGGrid
                data={statusHistory}
                hideActionCol
                loading={loading}
                pageSizeDefault={5}
                moduleTemplate={
                  MODULE_TEMPLATE.auditCheckListGeneralInfoTableHistorySection
                }
                dynamicLabel={dynamicLabels}
              />
            </div>
          )}
        </div>
        {isEdit && (
          <GroupButton
            dynamicLabels={dynamicLabels}
            txButtonBetween={
              isCreate
                ? renderDynamicLabel(
                    dynamicLabels,
                    AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                      .generalInformation.Next,
                  )
                : renderDynamicLabel(
                    dynamicLabels,
                    AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS
                      .generalInformation.Save,
                  )
            }
            className={styles.GroupButton}
            handleCancel={handleCancel}
            handleSubmit={handleSubmit(onSubmitForm, onErrorForm)}
            disable={!isEdit || loading}
            txButtonLeft={renderDynamicLabel(
              dynamicLabels,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation
                .Cancel,
            )}
          />
        )}
      </div>
    </Container>
  );
};

export default AuditCheckListGeneralInfoForm;
