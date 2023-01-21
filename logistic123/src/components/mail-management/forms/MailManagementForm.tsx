import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import { convertBToMB, validateEmail } from 'helpers/utils.helper';
import cx from 'classnames';
import Container from 'components/common/container/Container';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import useEffectOnce from 'hoc/useEffectOnce';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalListForm from 'components/react-hook-form/modal-list-form/ModalListForm';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { getListVesselTypeActions } from 'store/vessel-type/vessel-type.action';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import {
  MODULE_MAIL_OPTIONS,
  statusOptions,
  ENTITY_OPTIONS,
} from 'constants/filter.const';
import {
  MENTION_TIME,
  MENTIONS,
  MENTION_MODULE_PLANNING,
  MENTION_MODULE_INSPECTION_REPORT,
  MENTION_MODULE_INSPECTION_FOLLOW_UP,
  MENTION_MODULE_REPORT_OF_FINDING,
} from 'constants/common.const';
import { v4 } from 'uuid';
import { getListFileApi } from 'api/dms.api';
import { AppRouteConst } from 'constants/route.const';
import CkEditorClassic from 'components/common/ck-editor/CkEditorBuildClassic';
import InputMention from 'components/common/ck-editor/InputMention';
import history from 'helpers/history.helper';
import isEqual from 'lodash/isEqual';
import { filterContentSelect } from 'helpers/filterSelect.helper';
import { Port } from 'models/api/port/port.model';
import { FC, useEffect, useMemo, useState, useCallback } from 'react';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import { CommonApiParam } from 'models/common.model';
import { getListAttachmentKitSActions } from 'store/attachment-kit/attachment-kit.action';
import {
  getMailTypesActions,
  clearMailManagementReducer,
} from 'store/mail-management/mail-management.action';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import useEmailCompanyConfig from 'hoc/useEmailCompanyConfig';
// import InputMentionForm from 'components/react-hook-form/input-mention-form/InputMentionForm';

import { MailManagementDetail } from 'models/api/mail-management/mail-management.model';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/mailTemplate.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import MailManagement from './MailManagement';
import styles from './form.module.scss';

interface MailManagementFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: MailManagementDetail;
  onSubmit: (CreatePortParams: Port) => void;
}

interface SizeAttachment {
  attachmentKitId: string;
  size: number;
}

const defaultValues = {
  vesselTypes: [],
  entityType: 'Vessel',
  name: '',
  description: '',
  code: '',
  module: 'Planning',
  body: null,
  subject: null,
  status: 'active',
  workingType: false,
  attachmentKit: [],
};

const MailManagementForm: FC<MailManagementFormProps> = ({
  isEdit,
  isCreate,
  data,
  onSubmit,
}) => {
  // state
  const dispatch = useDispatch();
  const { emailCompany } = useEmailCompanyConfig();
  const { listVesselTypes } = useSelector((state) => state.vesselType);
  const { listAttachmentKit } = useSelector((state) => state.attachmentKit);

  const { mailTypes, loading, errorList } = useSelector(
    (state) => state.mailManagement,
  );

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const rowLabels = useMemo(
    () => [
      {
        label: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Checkbox,
        ),
        id: 'checkbox',
        width: 80,
      },
      {
        label: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Kit name'],
        ),
        id: 'name',
        width: 310,
      },
      {
        label: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Kit description'],
        ),
        id: 'description',
        width: 400,
      },
    ],
    [dynamicFields],
  );

  const [sizeAttachments, setsizeAttachments] = useState<SizeAttachment[]>([]);
  const [loadingCKeditor, setLoadingCKeditor] = useState<boolean>(true);
  const [countCharacters, setCountCharacters] = useState<number>(0);

  useEffect(() => {
    if (listAttachmentKit?.data?.length) {
      let attachmentIds: string[] = [];
      listAttachmentKit?.data?.forEach((i) => {
        attachmentIds = [...attachmentIds, ...i.attachments];
      });
      attachmentIds = Array.from(new Set(attachmentIds));

      getListFileApi({
        ids: attachmentIds,
        isAttachment: true,
      })
        .then((res) => {
          const dataAttachment =
            res.data?.map((i) => ({
              id: i.id,
              size: i.size,
            })) || [];

          const sizeAttachmentKit: SizeAttachment[] = [];
          listAttachmentKit?.data?.forEach((item) => {
            let totalSize = 0;
            item?.attachments?.forEach((i) => {
              const infoAttachment = dataAttachment?.find(
                (attachment) => attachment.id === i,
              );
              if (infoAttachment) {
                totalSize += infoAttachment.size;
              }
            });
            sizeAttachmentKit.push({
              attachmentKitId: item.id,
              size: totalSize,
            });
          });
          setsizeAttachments(sizeAttachmentKit);
        })
        .catch((e) => {
          // setLoading(false);
        });
    }
  }, [listAttachmentKit]);

  const vesselOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listVesselTypes?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listVesselTypes?.data],
  );

  const listAttachmentKitOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listAttachmentKit?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })) || [],
    [listAttachmentKit?.data],
  );

  useEffectOnce(() => {
    dispatch(
      getListVesselTypeActions.request({ pageSize: -1, status: 'active' }),
    );
    dispatch(
      getListAttachmentKitSActions.request({ pageSize: -1, status: 'active' }),
    );
    // dispatch(getMailTypesActions.request({}));
    return () => {
      dispatch(clearMailManagementReducer());
    };
    // dispatch(getMailTypesActions.request());
  });

  const [vesselTypeOptions, setVesselTypeOptions] = useState(
    vesselOptions || [],
  );

  const [mailTypeStateOptions, setMailTypeStateOptions] = useState(
    listAttachmentKitOptions || [],
  );

  const checkAttachmentKitSize = useCallback(
    (value) => {
      if (!value) return true;
      let total = 0;
      value?.forEach((i) => {
        total +=
          sizeAttachments?.find((item) => item?.attachmentKitId === i)?.size ||
          0;
      });
      total = Number(convertBToMB(total));
      return total <= 8.5;
    },
    [sizeAttachments],
  );

  const schema = useMemo(
    () =>
      yup.object().shape({
        entityType: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        To: yup
          .array()
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
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        body: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        code: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        name: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        vesselTypes: yup
          .array()
          .nullable()
          .when('entityType', {
            is: (value) => value === 'Vessel',
            then: yup
              .array()
              .nullable()
              .required(
                renderDynamicLabel(
                  dynamicFields,
                  COMMON_DYNAMIC_FIELDS['This field is required'],
                ),
              )
              .min(
                1,
                renderDynamicLabel(
                  dynamicFields,
                  COMMON_DYNAMIC_FIELDS['This field is required'],
                ),
              ),
          }),
        attachmentKit: yup
          .array()
          .nullable()
          .test(
            'attachmentKit',
            renderDynamicLabel(
              dynamicFields,
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                'The files are exceeding the maximum attachment kit size of 8.5MB, please reduce the files'
              ],
            ),
            (value, context) => checkAttachmentKitSize(value),
          ),
        mailType: yup
          .array()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          )
          .min(
            1,
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        module: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        subject: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          )
          .test(
            'more-than-500',
            renderDynamicLabel(
              dynamicFields,
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                'Subject must be smaller than 500'
              ],
            ),
            (value) => countCharacters < 500,
          ),
      }),
    [dynamicFields, checkAttachmentKitSize, countCharacters],
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const entityTypeWatch = watch('entityType');
  const vesselTypeWatch = watch('vesselTypes');
  const workingTypeWatch = watch('workingType');
  const moduleWatch = watch('module');
  // const bodyWatch = watch('body');
  const subjectWatch = watch('subject');
  useEffect(() => {
    if (moduleWatch) {
      let paramsMailType: CommonApiParam;

      if (moduleWatch) {
        paramsMailType = {
          ...paramsMailType,
          module: moduleWatch,
        };
      }

      const isSetValue = isCreate || !(moduleWatch === data?.module);
      const unSetValue = !isCreate && !isEdit;
      if (isSetValue && !unSetValue) {
        setValue('mailType', []);
      }
      dispatch(getMailTypesActions.request(paramsMailType));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleWatch]);

  useEffect(() => {
    setLoadingCKeditor(false);
    setTimeout(() => {
      setLoadingCKeditor(true);
    }, 100);
  }, [moduleWatch]);

  useEffect(() => {
    if (
      isCreate &&
      emailCompany?.recipientEmails &&
      emailCompany?.recipientEmails?.length
    ) {
      const emails = emailCompany?.recipientEmails?.map((i) => ({
        id: v4(),
        isFocus: false,
        isTag: true,
        value: i,
      }));

      setValue('To', [
        ...emails,
        { id: v4(), value: '', isFocus: false, isTag: false },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailCompany, isCreate]);

  const mentionsForm = useMemo(() => {
    switch (moduleWatch) {
      case MODULE_MAIL_OPTIONS[0].value:
        return MENTION_MODULE_PLANNING;
      case MODULE_MAIL_OPTIONS[1].value:
        return MENTION_MODULE_INSPECTION_REPORT;
      case MODULE_MAIL_OPTIONS[2].value:
        return MENTION_MODULE_INSPECTION_FOLLOW_UP;
      case MODULE_MAIL_OPTIONS[3].value:
        return MENTION_MODULE_REPORT_OF_FINDING;
      default:
        return MENTION_MODULE_PLANNING;
    }
  }, [moduleWatch]);

  const mailTypeOptions: Array<NewAsyncOptions> = useMemo(() => {
    const newData = mailTypes?.map((item) => ({
      value: item?.id,
      label: item?.name,
    }));

    const workingTypeData = workingTypeWatch ? 'Remote' : 'Physical';
    if (
      !isCreate &&
      data?.entityType === entityTypeWatch &&
      vesselTypeWatch &&
      vesselTypeWatch[0] &&
      vesselTypeWatch[0]?.value === data?.vesselTypeId &&
      workingTypeData === data?.workingType
    ) {
      newData.push({
        value: data?.mailTypeId?.toString(),
        label: data?.mailType?.name,
      });
    }

    return newData;
  }, [
    mailTypes,
    data,
    entityTypeWatch,
    vesselTypeWatch,
    isCreate,
    workingTypeWatch,
  ]);

  // function
  const onSubmitForm = useCallback(
    (data) => {
      const emailTos = data.To.filter((i) => validateEmail(i.value)).map(
        (item) => item.value,
      );
      if (emailTos?.length === 0) {
        setError('To', {
          message: renderDynamicLabel(
            dynamicFields,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        });
      } else {
        let newData: any = {
          name: data.name,
          entityType: data.entityType,
          module: data.module,
          workingType: data.workingType ? 'Remote' : 'Physical',
          status: data.status,
          mailTypeId: data.mailType[0]?.value,
          to: emailTos,
          cc: data.Cc.filter((i) => validateEmail(i.value)).map(
            (item) => item.value,
          ),
          bcc: data.Bcc.filter((i) => validateEmail(i.value)).map(
            (item) => item.value,
          ),
          sub: data.subject,
          body: data.body,
          code: data.code,
          attachmentKits: data?.attachmentKit,
        };
        if (data.description) {
          newData = { ...newData, description: data.description };
        }
        if (data?.entityType === 'Vessel' && data?.vesselTypes?.length) {
          newData = {
            ...newData,
            vesselTypes: data?.vesselTypes?.map((item) => item.value),
          };
        }
        onSubmit(newData);
      }
    },
    [dynamicFields, onSubmit, setError],
  );

  const resetDefault = useCallback(
    (defaultParams) => {
      reset(defaultParams);
      history.goBack();
    },
    [reset],
  );

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const params = getValues();
    if (isCreate) {
      defaultParams = defaultValues;
    } else {
      const dataTo =
        data?.to?.map((item) => ({
          id: item,
          isFocus: false,
          isTag: true,
          value: item,
        })) || [];

      const dataCc =
        data?.cc?.map((item) => ({
          id: item,
          isFocus: false,
          isTag: true,
          value: item,
        })) || [];

      const dataBcc =
        data?.bcc?.map((item) => ({
          id: item,
          isFocus: false,
          isTag: true,
          value: item,
        })) || [];
      defaultParams = {
        vesselType: data?.vesselType?.id
          ? [{ value: data?.vesselType?.id, label: data?.vesselType?.name }]
          : [],
        entityType: data?.entityType,
        code: data?.code,
        module: data?.module,
        subject: data?.sub,
        status: data?.status,
        workingType: data?.workingType === 'Remote',
        body: data?.body,
        To: dataTo,
        Cc: dataCc,
        Bcc: dataBcc,
      };
    }
    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.MAIL_MANAGEMENT);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Confirmation?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () =>
          isCreate
            ? history.push(AppRouteConst.MAIL_MANAGEMENT)
            : resetDefault(defaultParams),
      });
    }
  }, [
    data?.bcc,
    data?.body,
    data?.cc,
    data?.code,
    data?.entityType,
    data?.module,
    data?.status,
    data?.sub,
    data?.to,
    data?.vesselType?.id,
    data?.vesselType?.name,
    data?.workingType,
    dynamicFields,
    getValues,
    isCreate,
    resetDefault,
  ]);

  // effect
  useEffect(() => {
    if (data) {
      const endItem = { id: v4(), value: '', isFocus: false, isTag: false };
      const dataTo =
        data?.to?.map((item) => ({
          id: item,
          isFocus: false,
          isTag: true,
          value: item,
        })) || [];
      dataTo.push(endItem);

      const dataCc =
        data?.cc?.map((item) => ({
          id: item,
          isFocus: false,
          isTag: true,
          value: item,
        })) || [];
      dataCc.push(endItem);

      const dataBcc =
        data?.bcc?.map((item) => ({
          id: item,
          isFocus: false,
          isTag: true,
          value: item,
        })) || [];
      dataBcc.push(endItem);

      setValue(
        'vesselTypes',
        data?.vesselTypes?.map((vesselType) => ({
          value: vesselType.id,
          label: vesselType.name,
        })),
      );
      setValue('entityType', data?.entityType);
      setValue('code', data.code);
      setValue('name', data.name);
      setValue('description', data?.description);
      setValue('status', data?.status);

      setValue(
        'attachmentKit',
        data?.attachmentKits?.map((item) => item.id) || [],
      );
      setValue('module', data.module || undefined);
      setValue('workingType', data?.workingType === 'Remote');
      setValue('To', dataTo);
      setValue('Cc', dataCc);
      setValue('Bcc', dataBcc);
      setTimeout(() => {
        setValue('body', data?.body || null);
        setValue('subject', data.sub || undefined);
      }, 500);
      setValue(
        'mailType',
        data?.mailTypeId
          ? [{ value: data?.mailTypeId, label: data?.mailType?.name }]
          : [],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    MENTIONS?.forEach((item) => {
      const classMention =
        document?.getElementsByClassName('wrap__input-mentions') || [];
      for (let i = 0; i < classMention?.length; i += 1) {
        if (classMention[i].innerHTML === item?.id) {
          classMention[i].setAttribute(
            'class',
            `wrap__input-mentions ${item?.id}`,
          );
          classMention[i].setAttribute('data-value', `${item?.id}`);
        }
      }
    });
  }, [mentionsForm, subjectWatch, data]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', {
              message: renderDynamicLabel(
                dynamicFields,
                MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                  'The mail template code is existed'
                ],
              ),
            });
            break;
          case 'mailTypeId':
            setError('mailType', { message: item.message });
            break;

          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
    }
  }, [dynamicFields, errorList, setError]);

  const isShowEntityType = useMemo(
    () => entityTypeWatch === 'Vessel',
    [entityTypeWatch],
  );

  const attachmentKitOptions = useMemo(
    () =>
      listAttachmentKit?.data?.map((item) => ({
        id: item.id,
        label: item?.name,
        name: item?.name,
        description: item?.description,
      })),
    [listAttachmentKit],
  );

  const styleHighLight = useMemo(
    () =>
      MENTIONS?.map((item) => {
        const hasItem = mentionsForm?.some((i) => i.id === item.id);
        return (
          <style
            key={item?.id}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
               .wrap-ckditor5 span[data-mention="${item?.id}"] {
                color: ${!hasItem ? '#F53E3E' : '#3B9FF3'} !important;
                position:relative;
              }

              .wrap-ckditor5 span[data-mention="${item?.id}"]:hover:before {
                content:'';
                height: 5px;
                width: 7px;
                left: 8px;
                top: 15px;
                clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                position: absolute;
                background: ${!hasItem ? '#F53E3E' : '#A5A3A9'} ;
            }
              .wrap-ckditor5 span[data-mention="${item?.id}"]:hover:after {
                  content:'${
                    !hasItem
                      ? 'The param tag is not applied for the selected module'
                      : item.display
                  }';
                  position: absolute;
                  background:  ${!hasItem ? '#F53E3E' : '#A5A3A9'};
                  color: white;
                  border-radius: 8px;
                  width: max-content;
                  top: 20px;
                  padding: 2px 5px;
                  left: 0;
                  z-index:5;
              }
            `,
            }}
          />
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mentionsForm, subjectWatch, data],
  );

  return loading && !data && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <div>
      <Container>
        <div className="pb-4">
          <div className="container__subtitle">
            {renderDynamicLabel(
              dynamicFields,
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['General information'],
            )}
          </div>

          <Row className="pt-2 mx-0">
            <Col xs={4} md={4} className={cx('ps-0 pe-2 pt-2')}>
              <SelectUI
                labelSelect={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Entity,
                )}
                data={ENTITY_OPTIONS}
                disabled={!isEdit || loading}
                name="entityType"
                className={cx(styles.inputSelect, 'w-100')}
                control={control}
                placeholder={renderDynamicLabel(
                  dynamicFields,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                dynamicLabels={dynamicFields}
              />
            </Col>
            <Col xs={4} md={4} className="pt-2 px-2">
              <Input
                label={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Mail template code'],
                )}
                className={cx({ [styles.disabledInput]: !isEdit })}
                readOnly={!isEdit}
                isRequired
                placeholder={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                    'Enter mail template code'
                  ],
                )}
                messageRequired={errors?.code?.message || ''}
                {...register('code')}
                maxLength={20}
                disabled={!isEdit || loading}
              />
            </Col>

            <Col xs={4} md={4} className="pe-0 pt-2 ps-2">
              <Input
                label={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Mail template name'],
                )}
                className={cx({ [styles.disabledInput]: !isEdit })}
                readOnly={!isEdit}
                isRequired
                placeholder={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                    'Enter mail template name'
                  ],
                )}
                messageRequired={errors?.name?.message || ''}
                {...register('name')}
                maxLength={128}
                disabled={!isEdit || loading}
              />
            </Col>
            <Col xs={4} md={4} className="px-0 pt-2 pe-2">
              <SelectUI
                labelSelect={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Module,
                )}
                data={MODULE_MAIL_OPTIONS}
                messageRequired={errors?.module?.message || ''}
                isRequired
                disabled={!isEdit || loading}
                placeholder={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                    'Enter mail template name'
                  ],
                )}
                name="module"
                className={cx(styles.inputSelect, 'w-100')}
                control={control}
                dynamicLabels={dynamicFields}
              />
            </Col>

            <Col xs={4} md={4} className="px-2 pt-2">
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Working type'],
                )}
              </div>
              <div className="d-flex">
                <ToggleSwitch
                  disabled={!isEdit || loading}
                  control={control}
                  name="workingType"
                />
                <span className={styles.workingType}>
                  {workingTypeWatch ? 'Remote' : 'Physical'}
                </span>
              </div>
            </Col>
            <Col xs={4} md={4} className="pe-0 pt-2 ps-2">
              <AsyncSelectForm
                disabled={!isEdit || loading}
                isRequired
                className="w-100"
                labelSelect={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Mail type'],
                )}
                placeholder={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Please select'],
                )}
                searchContent={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Mail type'],
                )}
                name="mailType"
                messageRequired={errors?.mailType?.message || ''}
                control={control}
                onChangeSearch={(value: string) => {
                  const newData = filterContentSelect(
                    value,
                    mailTypeOptions || [],
                  );
                  setMailTypeStateOptions(newData);
                }}
                options={mailTypeStateOptions}
                dynamicLabels={dynamicFields}
              />
            </Col>

            {isShowEntityType && (
              <Col xs={4} md={4} className="ps-0 pe-2 pt-2">
                <AsyncSelectResultForm
                  disabled={!isEdit || loading}
                  isRequired
                  multiple
                  className="w-100"
                  labelSelect={renderDynamicLabel(
                    dynamicFields,
                    MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Vessel type'],
                  )}
                  placeholder={renderDynamicLabel(
                    dynamicFields,
                    MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Please select'],
                  )}
                  searchContent={renderDynamicLabel(
                    dynamicFields,
                    MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Vessel type'],
                  )}
                  textSelectAll={renderDynamicLabel(
                    dynamicFields,
                    MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Select all'],
                  )}
                  name="vesselTypes"
                  messageRequired={errors?.vesselTypes?.message || ''}
                  control={control}
                  onChangeSearch={(value: string) => {
                    const newData = filterContentSelect(
                      value,
                      vesselOptions || [],
                    );
                    setVesselTypeOptions(newData);
                  }}
                  options={vesselTypeOptions}
                  dynamicLabels={dynamicFields}
                />
              </Col>
            )}

            <Col
              xs={4}
              md={4}
              className={cx('px-0  pt-2', {
                'px-2': isShowEntityType,
                'pe-2': !isShowEntityType,
              })}
            >
              <SelectUI
                labelSelect={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Status,
                )}
                data={statusOptions}
                disabled={!isEdit || loading}
                name="status"
                className={cx(
                  styles.inputSelect,
                  { [styles.disabledSelect]: !isEdit },
                  'w-100',
                )}
                control={control}
                placeholder={renderDynamicLabel(
                  dynamicFields,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                dynamicLabels={dynamicFields}
              />
            </Col>

            <Col
              xs={4}
              md={4}
              className={cx('pt-2', {
                'pe-0 ps-2': isShowEntityType,
                'px-2': !isShowEntityType,
              })}
            >
              <Input
                label={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                    'Mail template description'
                  ],
                )}
                className={cx({ [styles.disabledInput]: !isEdit })}
                readOnly={!isEdit}
                placeholder={renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                    'Enter mail template description'
                  ],
                )}
                {...register('description')}
                maxLength={250}
                disabled={!isEdit || loading}
              />
            </Col>
          </Row>
        </div>
      </Container>
      <Container className="overflow-hidden">
        <p className="container__subtitle">
          {renderDynamicLabel(
            dynamicFields,
            MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Mail details'],
          )}
        </p>
        <MailManagement
          messageRequired={errors?.To?.message || ''}
          setValue={setValue}
          getValues={getValues}
          watch={watch}
          setError={setError}
          disabled={!isEdit}
          dynamicFields={dynamicFields}
        />
        {loadingCKeditor ? (
          <>
            <div className="pt-3 wrap-ckditor5">
              <Controller
                control={control}
                name="subject"
                render={({ field }) => (
                  <InputMention
                    label={renderDynamicLabel(
                      dynamicFields,
                      MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Subject,
                    )}
                    isRequired
                    placeholder={renderDynamicLabel(
                      dynamicFields,
                      MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                        'Please type @ and select field names to populate data when sending mail'
                      ],
                    )}
                    messageRequired={errors?.subject?.message || ''}
                    data={field.value || null}
                    disabled={!isEdit}
                    onChange={(e) => field.onChange(e?.data)}
                    dataMentions={mentionsForm}
                    dataMentions2={MENTION_TIME}
                    setCountCharacters={setCountCharacters}
                  />
                )}
              />
            </div>
            <div className="pt-3 wrap-ckditor5">
              <Controller
                control={control}
                name="body"
                render={({ field }) => (
                  <CkEditorClassic
                    label={renderDynamicLabel(
                      dynamicFields,
                      MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Body,
                    )}
                    isRequired
                    placeholder={renderDynamicLabel(
                      dynamicFields,
                      MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                        'Please type @ and select field names to populate data when sending mail'
                      ],
                    )}
                    messageRequired={errors?.body?.message || ''}
                    data={field.value || null}
                    disabled={!isEdit}
                    onChange={(e) => field.onChange(e?.data)}
                    dataMentions={mentionsForm}
                    dataMentions2={MENTION_TIME}
                  />
                )}
              />
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center py-4">
            <div>
              <img
                src={images.common.loading}
                className={styles.loading}
                alt="loading"
              />
            </div>
          </div>
        )}

        <Row className="pt-3">
          <Col>
            <ModalListForm
              name="attachmentKit"
              labelSelect={renderDynamicLabel(
                dynamicFields,
                MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Attachment kit'],
              )}
              title={renderDynamicLabel(
                dynamicFields,
                MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Attachment kit'],
              )}
              disable={!isEdit}
              control={control}
              data={attachmentKitOptions || []}
              rowLabels={rowLabels}
              error={errors?.attachmentKit?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicFields,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              dynamicLabels={dynamicFields}
            />
          </Col>
          <Col />
        </Row>
      </Container>
      <div className="me-4 pb-2">
        {isEdit && (
          <GroupButton
            className={styles.GroupButton}
            handleCancel={handleCancel}
            handleSubmit={handleSubmit(onSubmitForm)}
            disable={!isEdit || loading}
            txButtonLeft={renderDynamicLabel(
              dynamicFields,
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Cancel,
            )}
            txButtonBetween={renderDynamicLabel(
              dynamicFields,
              MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Save,
            )}
            dynamicLabels={dynamicFields}
          />
        )}
      </div>
      {styleHighLight}
    </div>
  );
};

export default MailManagementForm;
