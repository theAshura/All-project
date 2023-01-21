/* eslint-disable no-lonely-if */
import cx from 'classnames';
import { FC, useEffect, useState } from 'react';
import { ButtonType } from 'components/ui/button/Button';
import ModalComponent from 'components/ui/modal/Modal';
import { Col, Row } from 'reactstrap';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MaxLength } from 'constants/common.const';
import Input from 'components/ui/input/Input';
import { GroupButton } from 'components/ui/button/GroupButton';
import SelectUI from 'components/ui/select/Select';
import { ReportHeader } from 'models/api/report-template/report-template.model';
import { PRINT_OPTION, TYPE_HEADER } from 'constants/filter.const';
import { v4 } from 'uuid';

import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/report-template-master.const';
import styles from './form.module.scss';

interface ModalAddProps {
  data?: ReportHeader[];
  handleAdd?: (data) => void;
  loading?: boolean;
  isAdd?: boolean;
  isCreate?: boolean;
  selectedData?: ReportHeader;
  headerIndex?: number;

  isShow?: boolean;
  setShow?: () => void;
  title?: string;
  isEdit?: boolean;
}

const defaultValues = {
  topic: '',
  topicType: 'header',
  type: undefined,
  printOption: 'All',
  minScore: undefined,
  maxScore: undefined,
};

const typeRequiredCore = ['Dynamic', 'Internal audit table'];

export const ModalAddHeader: FC<ModalAddProps> = (props) => {
  const {
    handleAdd,
    selectedData,
    isAdd,
    loading,
    isShow,
    setShow,
    title,
    isCreate = false,
    isEdit = false,
  } = props;
  const [modal, setModal] = useState(isShow || false);
  const [isFirst, setIsFirst] = useState(true);
  const [isFirstTypeDynamic, setIsFirstTypeDynamic] = useState(true);
  const [isTypeDynamic, setIsTypeDynamic] = useState(true);

  // const isTypeOne =
  //   selectedData?.serialNumber === '1' || selectedData?.serialNumber === '1A';

  const dynamicFields = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
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
                        renderDynamicLabel(
                          dynamicFields,
                          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                            'This field is required'
                          ],
                        )
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
                      'This field is required'
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
                    'This field is required'
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
                  'This field is required'
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
                    'Max score must be greater than min score',
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
                      'Min score must be smaller than 30'
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
                  'Max score must be greater than 0'
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
    },
    [['minScore', 'maxScore']],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const valuetype = watch('type');

  useEffect(() => {
    const subscription = watch((value) => {
      if (
        Number(value.minScore) < Number(value.maxScore) &&
        Number(value.minScore) < 30 &&
        Number(value.maxScore) < 30 &&
        Number(value.minScore) > 0 &&
        Number(value.maxScore) > 0
      ) {
        clearErrors('minScore');
        clearErrors('maxScore');
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [clearErrors, watch]);

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

  const handleKeyPress = async (event) => {
    if (event?.target?.value?.length >= 2 || event?.key === 'e') {
      event.preventDefault();
    }
  };
  const resetForm = () => {
    setValue('topic', '');
    setValue('minScore', null);
    setValue('maxScore', null);
    setValue('printOption', null);
    setValue('type', null);
  };

  const onSubmitForm = (formData) => {
    if (isAdd) {
      const dataNew = {
        ...formData,
        minScore: Number(formData?.minScore) || null,
        maxScore: Number(formData?.maxScore) || null,
        id: v4(),
      };

      handleAdd(dataNew);
    } else {
      const dataNew = {
        id: selectedData.id,
        ...formData,
        minScore: Number(formData?.minScore) || null,
        maxScore: Number(formData?.maxScore) || null,
      };
      handleAdd(dataNew);
    }
  };

  const handleCancel = () => {
    setModal(false);
    setShow();
  };

  useEffect(() => {
    setModal(isShow);
  }, [isShow]);

  useEffect(() => {
    if (isFirst && selectedData && !isAdd) {
      setValue('topic', selectedData?.topic);
      setValue('minScore', selectedData?.minScore || '');
      setValue('maxScore', selectedData?.maxScore || '');
      setValue('printOption', selectedData?.printOption || '');
      setValue('type', selectedData?.type || '');
      setIsFirst(false);
    }
  }, [selectedData, isAdd, isFirst, setValue]);

  const renderForm = () => (
    <>
      <div>
        <Row className="mx-0">
          <Col className="p-0">
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
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <SelectUI
              isRequired
              labelSelect={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Type,
              )}
              messageRequired={errors?.type?.message || ''}
              data={TYPE_HEADER?.filter(
                (i) => i.value !== 'Internal audit table',
              )}
              disabled={loading}
              name="type"
              className={cx('w-100')}
              control={control}
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Please select'],
              )}
            />
          </Col>
          <Col className="pe-0">
            <SelectUI
              isRequired
              labelSelect={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Print option'],
              )}
              data={PRINT_OPTION}
              messageRequired={errors?.printOption?.message || ''}
              name="printOption"
              className={cx('w-100')}
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
              min={1}
              max={30}
              label={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Min score'],
              )}
              name="minScore"
              {...register('minScore')}
              type="number"
              isRequired={isTypeDynamic}
              onKeyPress={handleKeyPress}
              disabled={loading || !isTypeDynamic}
              className={!isTypeDynamic && 'cssDisabled'}
              maxLength={2}
              messageRequired={errors?.minScore?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Enter min score'],
              )}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Max score'],
              )}
              name="maxScore"
              {...register('maxScore')}
              isRequired={isTypeDynamic}
              min={1}
              max={30}
              onKeyPress={handleKeyPress}
              type="number"
              className={!isTypeDynamic && 'cssDisabled'}
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
          handleCancel={() => {
            handleCancel();
            setIsFirst(true);
          }}
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
        setModal(false);
        setShow();
        resetForm();
        setIsFirst(true);
      }}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};
