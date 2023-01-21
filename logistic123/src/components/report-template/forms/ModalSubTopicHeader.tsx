/* eslint-disable no-lonely-if */
import cx from 'classnames';
import { FC, useEffect, useState } from 'react';
import { ButtonType } from 'components/ui/button/Button';
import ModalComponent from 'components/ui/modal/Modal';
import { Col, Row } from 'reactstrap';
import useEffectOnce from 'hoc/useEffectOnce';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { MaxLength } from 'constants/common.const';
import Input from 'components/ui/input/Input';
import { GroupButton } from 'components/ui/button/GroupButton';
import SelectUI from 'components/ui/select/Select';
import { useDispatch, useSelector } from 'react-redux';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import { ReportHeader } from 'models/api/report-template/report-template.model';
import { TYPE_HEADER } from 'constants/filter.const';
import toNumber from 'lodash/toNumber';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/report-template-master.const';
import styles from './form.module.scss';

interface PrintOptionType {
  value: string;
  label: string;
}
interface ModalAddProps {
  data?: ReportHeader[];
  handleAdd?: (data, index) => void;
  handleEdit?: (data, headerIndex) => void;

  loading?: boolean;
  isAdd?: boolean;
  isShow?: boolean;
  headerIndex?: number;
  selectedData?: ReportHeader;
  printOptions?: PrintOptionType[];

  // parentID: string;
  setShow?: () => void;
  title?: string;
  isEdit?: boolean;
  isCreate?: boolean;
}

const defaultValues = {
  minScore: undefined,
  maxScore: undefined,
  printOption: undefined,
  type: undefined,
};

const typeRequiredCore = ['Dynamic', 'Internal audit table'];

export const ModalSubTopicHeader: FC<ModalAddProps> = (props) => {
  const {
    handleAdd,
    handleEdit,
    headerIndex,
    selectedData,
    isAdd,
    loading,
    isShow,
    setShow,
    printOptions,
    title,
    isEdit = false,
    isCreate = false,
    // data,
  } = props;
  const { userInfo } = useSelector((state) => state.authenticate);

  const dispatch = useDispatch();
  const [isTypeDynamic, setIsTypeDynamic] = useState(true);

  const [modal, setModal] = useState(isShow || false);
  const [maxScore, setMaxScore] = useState<string>(undefined);
  const [minScore, setMinScore] = useState<string>(undefined);
  const [isFirstTypeDynamic, setIsFirstTypeDynamic] = useState(true);

  const dynamicFields = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  useEffectOnce(() => {
    dispatch(
      getListAuditTypeActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );
  });

  const schema = yup.object().shape(
    {
      topic: yup
        .string()
        .trim()
        .nullable()
        .required(
          renderDynamicLabel(
            dynamicFields,
            REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
              'This field is required'
            ],
          ),
        ),
      type: yup
        .string()
        .trim()
        .nullable()
        .required(
          renderDynamicLabel(
            dynamicFields,
            REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
              'This field is required'
            ],
          ),
        ),

      printOption: yup
        .string()
        .trim()
        .nullable()
        .required(
          renderDynamicLabel(
            dynamicFields,
            REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
              'This field is required'
            ],
          ),
        ),

      minScore: yup.number().when('type', (typeForm) => {
        const isRequired = typeRequiredCore.includes(typeForm);

        if (isRequired || typeForm === undefined) {
          return yup
            .number()
            .required(
              renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                  'This field is required'
                ],
              ),
            )
            .when('maxScore', (maxScore) => {
              if (maxScore && Number(maxScore) < 30) {
                return yup
                  .number()
                  .transform((v, o) => (o === '' ? null : v))
                  .nullable()
                  .required(
                    renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'This field is required'
                      ],
                    ),
                  )
                  .min(
                    1,
                    renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Min score must be greater than 0'
                      ],
                    ),
                  )
                  .max(
                    yup.ref('maxScore'),
                    renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Min score must be smaller than max score'
                      ],
                    ),
                  )
                  .test(
                    'less-than-30',
                    renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Min score must be smaller than 30'
                      ],
                    ),
                    (value) => value <= 30,
                  );
              }
              return yup
                .number()
                .required(
                  renderDynamicLabel(
                    dynamicFields,
                    REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                      'This field is required'
                    ],
                  ),
                )
                .transform((v, o) => (o === '' ? null : v))
                .nullable()
                .min(
                  1,
                  renderDynamicLabel(
                    dynamicFields,
                    REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                      'Min score must be greater than 0'
                    ],
                  ),
                )
                .max(
                  30,
                  renderDynamicLabel(
                    dynamicFields,
                    REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                      'Min score must be smaller than 30'
                    ],
                  ),
                );
            });
        }
        return yup.number().when('maxScore', (maxScore) => {
          if (maxScore && Number(maxScore) < 30) {
            return yup
              .number()
              .transform((v, o) => (o === '' ? null : v))
              .nullable()
              .min(
                1,
                renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                    'Min score must be greater than 0'
                  ],
                ),
              )
              .max(
                yup.ref('maxScore'),
                renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                    'Min score must be smaller than max score'
                  ],
                ),
              )
              .test(
                'less-than-30',
                renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                    'Min score must be smaller than 30'
                  ],
                ),
                (value) => value <= 30,
              );
          }
          return yup
            .number()
            .transform((v, o) => (o === '' ? null : v))
            .nullable()
            .min(
              1,
              renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                  'Min score must be greater than 0'
                ],
              ),
            )
            .max(
              30,
              renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                  'Min score must be smaller than 30'
                ],
              ),
            );
        });
      }),
      maxScore: yup.number().when('type', (typeForm) => {
        const isRequired = typeRequiredCore.includes(typeForm);

        if (isRequired || typeForm === undefined) {
          return yup
            .number()
            .required(
              renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                  'This field is required'
                ],
              ),
            )
            .when('minScore', (minScore) => {
              if (minScore && Number(minScore) < 30) {
                return yup
                  .number()
                  .transform((v, o) => (o === '' ? null : v))
                  .required(
                    renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'This field is required'
                      ],
                    ),
                  )
                  .nullable()
                  .min(
                    1,
                    renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Max score must be greater than 0'
                      ],
                    ),
                  )
                  .min(
                    yup.ref('minScore'),
                    renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Max score must be greater than min score'
                      ],
                    ),
                  )
                  .test(
                    'less-than-30',
                    renderDynamicLabel(
                      dynamicFields,
                      REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                        'Max score must be smaller than 30'
                      ],
                    ),
                    (value) => value <= 30,
                  );
              }
              return yup
                .number()
                .transform((v, o) => (o === '' ? null : v))
                .nullable()
                .required(
                  renderDynamicLabel(
                    dynamicFields,
                    REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                      'This field is required'
                    ],
                  ),
                )
                .min(
                  1,
                  renderDynamicLabel(
                    dynamicFields,
                    REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                      'Max score must be greater than 0'
                    ],
                  ),
                )
                .max(
                  30,
                  renderDynamicLabel(
                    dynamicFields,
                    REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                      'Max score must be smaller than 30'
                    ],
                  ),
                );
            });
        }
        return yup.number().when('minScore', (minScore) => {
          if (minScore && Number(minScore) < 30) {
            return yup
              .number()
              .transform((v, o) => (o === '' ? null : v))
              .nullable()
              .min(
                1,
                renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                    'Max score must be greater than 0'
                  ],
                ),
              )
              .min(
                yup.ref('minScore'),
                renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                    'Max score must be greater than min score'
                  ],
                ),
              )
              .test(
                'less-than-30',
                renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                    'Max score must be smaller than 30'
                  ],
                ),
                (value) => value <= 30,
              );
          }
          return yup
            .number()
            .transform((v, o) => (o === '' ? null : v))
            .nullable()
            .min(
              1,
              renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                  'Max score must be greater than 0'
                ],
              ),
            )
            .max(
              30,
              renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                  'Max score must be smaller than 30'
                ],
              ),
            );
        });
      }),
    },
    [['minScore', 'maxScore']],
  );
  const {
    register,
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const valuetype = watch('type');

  const handleKeyPress = (event) => {
    if (event.which < 48 || event.which > 57) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (!isFirstTypeDynamic) {
      const isEnDisabledCore = typeRequiredCore.includes(valuetype);

      if (isEnDisabledCore) {
        setIsTypeDynamic(true);
      } else {
        setValue('minScore', undefined);
        setValue('maxScore', undefined);
        clearErrors('minScore');
        clearErrors('maxScore');
        setIsTypeDynamic(false);
      }
    } else {
      setIsFirstTypeDynamic(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuetype]);

  const resetForm = () => {
    setValue('topic', undefined);
    setValue('printOption', undefined);
    setValue('type', '');
    setValue('minScore', undefined);
    setValue('maxScore', undefined);
  };

  const onSubmitForm = (dataForm) => {
    const params = {
      ...selectedData,
      ...dataForm,
      minScore: minScore?.length > 0 ? toNumber(minScore) : null,
      maxScore: maxScore?.length > 0 ? toNumber(maxScore) : null,
      topicType: 'sub_header',
      isDefault: false,
    };
    if (isAdd) {
      handleAdd(params, headerIndex);
    } else {
      handleEdit(params, headerIndex);
    }

    resetForm();
  };

  const handleCancel = () => {
    setModal(false);
    setShow();
    resetForm();
  };

  useEffect(() => {
    setModal(isShow);
  }, [isShow]);

  useEffect(() => {
    if (selectedData && !isAdd) {
      setValue('minScore', selectedData?.minScore || '');
      setValue('maxScore', selectedData?.maxScore || '');
      setValue('printOption', selectedData?.printOption || '');
      setValue('type', selectedData?.type || '');
      setMinScore(String(selectedData?.minScore));
      setMaxScore(String(selectedData?.maxScore));
      setValue('topic', selectedData?.topic || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData, isAdd]);

  useEffect(() => {
    if (maxScore?.length) {
      if (minScore?.length) {
        if (toNumber(minScore) > toNumber(maxScore)) {
          setError('minScore', {
            message: renderDynamicLabel(
              dynamicFields,
              REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                'Min score must be smaller than max score'
              ],
            ),
          });
        } else {
          if (toNumber(minScore) > 30) {
            setError('minScore', {
              message: renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                  'Min score must be smaller than 30'
                ],
              ),
            });
          } else {
            setError('minScore', {
              message: '',
            });
          }
        }
      }
      if (toNumber(maxScore) > 30) {
        setError('maxScore', {
          message: renderDynamicLabel(
            dynamicFields,
            REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
              'Max score must be smaller than 30'
            ],
          ),
        });
      } else {
        setError('maxScore', {
          message: '',
        });
      }
    } else {
      if (minScore?.length) {
        if (toNumber(minScore) > 30) {
          setError('minScore', {
            message: renderDynamicLabel(
              dynamicFields,
              REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                'Min score must be smaller than 30'
              ],
            ),
          });
        } else {
          setError('minScore', {
            message: '',
          });
        }
      } else {
        setError('minScore', {
          message: '',
        });
      }
      // }
    }
  }, [minScore, maxScore, setError, dynamicFields]);
  const renderForm = () => (
    <>
      <div>
        <Row className=" mx-0">
          <Col className="ps-0">
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Topic,
              )}
              {...register('topic')}
              disabled={loading}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Enter topic'],
              )}
              messageRequired={errors?.topic?.message || ''}
            />
          </Col>
        </Row>
        <Row className="pt-4">
          <Col>
            <SelectUI
              isRequired={isTypeDynamic}
              labelSelect="Type"
              messageRequired={errors?.type?.message || ''}
              data={TYPE_HEADER?.filter(
                (i) => i.value !== 'Internal audit table',
              )}
              disabled={loading}
              name="type"
              className="w-100"
              control={control}
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Please select'],
              )}
            />
          </Col>
          <Col className="ps-0  mx-0">
            <SelectUI
              isRequired
              labelSelect={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Print option'],
              )}
              data={printOptions}
              messageRequired={errors?.printOption?.message || ''}
              disabled={loading}
              name="printOption"
              className="w-100"
              control={control}
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Please select'],
              )}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <Input
              maxLength={2}
              label={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Min score'],
              )}
              name="minScore"
              isRequired={isTypeDynamic}
              {...register('minScore')}
              onKeyPress={handleKeyPress}
              className={!isTypeDynamic && 'cssDisabled'}
              onChange={(e) => {
                setValue('minScore', e.target.value.trim());
                setMinScore(e.target.value);
              }}
              onBlur={() => {
                if (errors?.minScore?.message?.length > 0) {
                  setError('minScore', {
                    message: errors?.minScore?.message,
                  });
                }
                if (errors?.maxScore?.message?.length > 0) {
                  setError('maxScore', {
                    message: errors?.maxScore?.message,
                  });
                }
              }}
              disabled={loading || !isTypeDynamic}
              messageRequired={errors?.minScore?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Enter min score'],
              )}
            />
          </Col>
          <Col>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Max score'],
              )}
              name="maxScore"
              isRequired={isTypeDynamic}
              {...register('maxScore')}
              onKeyPress={handleKeyPress}
              className={!isTypeDynamic && 'cssDisabled'}
              onChange={(e) => {
                setValue('maxScore', e.target.value.trim());
                setMaxScore(e.target.value);
              }}
              onBlur={() => {
                if (errors?.minScore?.message?.length > 0) {
                  setError('minScore', {
                    message: errors?.minScore?.message,
                  });
                }
                if (errors?.maxScore?.message?.length > 0) {
                  setError('maxScore', {
                    message: errors?.maxScore?.message,
                  });
                }
              }}
              disabled={loading || !isTypeDynamic}
              messageRequired={errors?.maxScore?.message || ''}
              maxLength={2}
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Enter max score'],
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.OutlineGray}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={
            loading ||
            errors?.minScore?.message?.length > 0 ||
            errors?.maxScore?.message?.length > 0
          }
          txButtonLeft={renderDynamicLabel(
            dynamicFields,
            REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Cancel,
          )}
          txButtonBetween={renderDynamicLabel(
            dynamicFields,
            REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Save,
          )}
        />
      </div>
    </>
  );

  return (
    <ModalComponent
      isOpen={modal}
      toggle={() => {
        if (!loading) {
          setModal(false);
          setShow();
          resetForm();
        }
      }}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};
