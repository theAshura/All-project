import { yupResolver } from '@hookform/resolvers/yup';
import Tooltip from 'antd/lib/tooltip';
import { getListFileApi } from 'api/dms.api';
import {
  getListDraftEmailApi,
  getMailTemplateApi,
  sendEmailPlanningApiRequest,
  updateEmailPlanningApiRequest,
} from 'api/planning-and-request.api';
import images from 'assets/images/images';
import InputMention from 'components/common/ck-editor/InputMention';
import cx from 'classnames';
import CkEditorClassic from 'components/common/ck-editor/CkEditorBuildClassic';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import InputWithTags from 'components/ui/input-with-tags/InputWithTags';
import Input from 'components/ui/input/Input';
import {
  MAIL_TYPES_IDS,
  MODAL_TYPES,
} from 'constants/planning-and-request.const';
import { getFileContents } from 'helpers/file.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  convertMBtoB,
  handleUploadFile,
  validateEmail,
} from 'helpers/utils.helper';
import cloneDeep from 'lodash/cloneDeep';
import SelectUI from 'components/ui/select/Select';
import LabelUI from 'components/ui/label/LabelUI';
import uniq from 'lodash/uniq';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import DetectEsc from 'components/common/modal/DetectEsc';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { Col, Modal, Row } from 'reactstrap';
import * as yup from 'yup';
import { v4 } from 'uuid';
import useEmailCompanyConfig from '../../../hoc/useEmailCompanyConfig';
import AttachFileZip from '../list-attach-zip/AttachFileZip';
import ModalChooseUser from '../modal-choose-user/ModalChooseUser';
import {
  defaultValues,
  InputMails,
  ModalComponentProps,
  ModalSendValues,
  getTextInHTML,
  convertDataMention,
} from './mail.func';
import styles from './modal-send-mail.module.scss';

const enum SenderEmailVerifyStatusEnum {
  NOT_YET = 0,
  VERIFICATION_INITIATED = 1,
  VERIFIED = 2,
}

const ModalSendMail: FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  modalClassName,
  contentClassName,
  classesName,
  planningRequestId,
  attachmentIdsPlanning,
  entityType,
  vesselTypeId,
  workingType,
  zipFileName,
  planningAndRequestDetail,
  mailTypeId,
  mailModule,
  exportApi,
  exportName,
  dynamicLabels,
  ...other
}) => {
  const [modalSelectUserVisible, openModalSelectUser] = useState(false);
  const [commonLoading, setCommonLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [mailTemplates, setMailTemplates] = useState([]);
  const [mailTemplate, setMailTemplate] = useState(null);
  const { emailCompany } = useEmailCompanyConfig();
  const [inputMailSelected, setInputMailSelected] = useState(null);
  const [modalType, setModalSendEmailType] = useState(MODAL_TYPES.OPEN_TAB);
  const [countCharacters, setCountCharacters] = useState<number>(0);

  const schema = useMemo(
    () =>
      yup.object().shape({
        to: yup
          .array()
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
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        sub: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          )
          .test(
            'more-than-500',
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Subject must be smaller than 500'],
            ),
            (value) => countCharacters < 500,
          ),
        body: yup
          .string()
          .nullable()
          .trim()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    [countCharacters, dynamicLabels],
  );
  const {
    handleSubmit,
    control,
    setError,
    setValue,
    getValues,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const toWatch = watch('to');
  const ccWatch = watch('cc');
  const bccWatch = watch('bcc');
  const bodyWatch = watch('body');
  const attachmentsWatch = watch('attachments');

  const closeModal = useCallback(() => {
    onClose();
    setModalSendEmailType(MODAL_TYPES.OPEN_TAB);
  }, [onClose]);

  const getListFileAttach = useCallback(async (ids: string[]) => {
    if (!ids || ids?.length <= 0) {
      return [];
    }
    try {
      const listFileAttach = await getListFileApi({ ids });
      return (
        listFileAttach?.data?.map((i) => ({
          id: i.id,
          name: i.originName,
          size: i.size,
          mimetype: i.mimetype,
          key: i.key,
          link: i.link,
          lastModifiedDate: i.createdAt,
          uploadByUser: i?.uploadByUser?.username || '',
        })) || []
      );
    } catch (error) {
      setCommonLoading(false);
      toastError('Error upload file attach 105. Modal Send Mail');
      return [];
    }
  }, []);

  const populateDataTags = useCallback(
    (data) =>
      data?.length
        ? data
            ?.map((i) => ({
              id: v4(),
              value: i || '',
              isFocus: false,
              isTag: true,
            }))
            ?.concat({
              id: v4(),
              value: '',
              isFocus: false,
              isTag: false,
            })
        : [],
    [],
  );

  const initDataDraft = useCallback(
    async (data: any) => {
      setValue('from', data?.from || '');
      setValue('to', data?.to?.length ? populateDataTags(data?.to) : []);
      setValue('cc', data?.cc?.length ? populateDataTags(data?.cc) : []);
      setValue('bcc', data?.bcc?.length ? populateDataTags(data?.bcc) : []);
      setValue('sub', data?.sub || '');
      setValue('body', data?.body || '');
      setValue('mailSendId', data?.id || '');
      if (data?.attachments?.length) {
        const listFileAttach = await getListFileAttach(data?.attachments);
        setValue('attachments', listFileAttach || []);
      }
      setCommonLoading(false);
    },
    [getListFileAttach, populateDataTags, setValue],
  );

  const initDataTemplate = useCallback(
    async (data: any) => {
      if (data?.status === 'inactive') {
        return;
      }
      setValue('from', data?.from || '');
      setValue('to', data?.to?.length ? populateDataTags(data?.to) : []);
      setValue('cc', data?.cc?.length ? populateDataTags(data?.cc) : []);
      setValue('bcc', data?.bcc?.length ? populateDataTags(data?.bcc) : []);
      setValue('sub', data?.sub || '');
      setValue('body', data?.body || '');
      setValue('mailTemplateId', data?.id || '');
    },
    [populateDataTags, setValue],
  );

  const handleZipFile = useCallback(
    async (attachment) => {
      try {
        const files = attachment?.map((file) => ({
          name: file.name,
          link: file.link,
        }));

        const dataFiles = await getFileContents(files);
        const blobFile = await dataFiles.generateAsync({ type: 'blob' });
        const uploadedFile = await handleUploadFile([blobFile], zipFileName);
        return uploadedFile && uploadedFile?.size !== '0.00 MB'
          ? [uploadedFile]
          : [];
      } catch (error) {
        setCommonLoading(false);
        toastError('error zip file 175');
        return [];
      }
    },
    [zipFileName],
  );

  const handleAttachmentsKits = useCallback(
    async (attachmentKit) => {
      const listAttachKit = attachmentKit.map((item) => {
        if (item?.fileZip) {
          return item?.fileZip;
        }
        return item?.attachments;
      });

      if (listAttachKit?.length) {
        try {
          const listFileAttach = await getListFileAttach(
            uniq(listAttachKit?.flat()),
          );
          return listFileAttach;
        } catch (error) {
          setCommonLoading(false);
          toastError('error', error);
          return [];
        }
      }

      return [];
    },
    [getListFileAttach],
  );

  const handlePdfId = useCallback(async () => {
    try {
      if (!exportApi) {
        return [];
      }
      const fileDownload = await exportApi();
      const uploadedFile = await handleUploadFile(
        [fileDownload?.data],
        exportName || 'Planning And Request.pdf',
      );

      return uploadedFile ? [uploadedFile] : [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error download pdf 212.Modal Send Mail');
      setCommonLoading(false);
      return [];
    }
  }, [exportApi, exportName]);

  const populateDateByMailTemplateAndAttachFiles = useCallback(
    async (hasTemplateDraft: boolean) => {
      setCommonLoading(true);
      const pdfFile: any = await handlePdfId();

      const listFileAttach: any[] = await getListFileAttach(
        attachmentIdsPlanning,
      );
      const planingAttachFile = await handleZipFile([
        ...listFileAttach,
        ...pdfFile,
      ]);
      setAttachments(planingAttachFile);
      const mailTemplate = await getMailTemplateApi({
        entityType,
        mailTypeId: mailTypeId || MAIL_TYPES_IDS.PLANNING_AND_REQUEST,
        vesselTypeId,
        workingType,
        module: mailModule,
      });
      setMailTemplates(mailTemplate?.data);
      if (mailTemplate?.data?.length && !hasTemplateDraft) {
        setMailTemplate(mailTemplate?.data?.[0]?.id);

        const dataSubject = convertDataMention(
          mailTemplate?.data?.[0]?.sub,
          planningAndRequestDetail,
          mailTypeId,
        );

        const dataBody = convertDataMention(
          mailTemplate?.data?.[0]?.body,
          planningAndRequestDetail,
          mailTypeId,
        );
        if (mailTemplate?.data?.[0]?.attachmentKits?.length) {
          const attachmentsKits: any = await handleAttachmentsKits(
            mailTemplate?.data?.[0]?.attachmentKits,
          );

          setValue('attachments', [...attachmentsKits, ...planingAttachFile]);
        } else {
          setValue('attachments', planingAttachFile);
        }

        if (mailTemplate?.data?.[0]?.id) {
          const dataTemplate = {
            ...mailTemplate?.data?.[0],
            sub: dataSubject,
            body: dataBody,
          };
          initDataTemplate(dataTemplate);
        }
      }

      setCommonLoading(false);
    },
    [
      attachmentIdsPlanning,
      entityType,
      getListFileAttach,
      handleAttachmentsKits,
      handlePdfId,
      handleZipFile,
      initDataTemplate,
      mailModule,
      mailTypeId,
      planningAndRequestDetail,
      setValue,
      vesselTypeId,
      workingType,
    ],
  );

  const handleChangeMailTemplate = useCallback(
    async (id: string) => {
      setCommonLoading(true);

      const newTemplate = mailTemplates?.find(
        (template) => template?.id === id,
      );
      setMailTemplate(id);

      const dataSubject = convertDataMention(
        newTemplate?.sub,
        planningAndRequestDetail,
        mailTypeId,
      );

      const dataBody = convertDataMention(
        newTemplate?.body,
        planningAndRequestDetail,
        mailTypeId,
      );
      if (newTemplate?.attachmentKits?.length) {
        const attachmentsKits: any = await handleAttachmentsKits(
          newTemplate?.attachmentKits,
        );

        setValue('attachments', [...attachmentsKits, ...attachments]);
      } else {
        setValue('attachments', attachments);
      }

      if (newTemplate?.id) {
        const dataTemplate = {
          ...newTemplate,
          sub: dataSubject,
          body: dataBody,
        };
        initDataTemplate(dataTemplate);
      }
      setCommonLoading(false);
    },
    [
      attachments,
      handleAttachmentsKits,
      initDataTemplate,
      mailTemplates,
      mailTypeId,
      planningAndRequestDetail,
      setValue,
    ],
  );

  const handleGetListDraft = useCallback(() => {
    if (planningRequestId) {
      setCommonLoading(true);
      getListDraftEmailApi(planningRequestId)
        .then((res: any) => {
          const draftEmail = res?.data?.find((i) => i.status === 'Draft');
          if (draftEmail) {
            initDataDraft(draftEmail);
          }
          populateDateByMailTemplateAndAttachFiles(!!draftEmail);
        })
        .catch((err) => {
          setCommonLoading(false);
          toastError(err);
        });
    }
  }, [
    initDataDraft,
    planningRequestId,
    populateDateByMailTemplateAndAttachFiles,
  ]);

  useEffect(() => {
    if (planningRequestId && isOpen) {
      handleGetListDraft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planningRequestId, isOpen]);

  useEffect(() => {
    if (emailCompany?.senderEmail) {
      setValue('senderEmail', emailCompany?.senderEmail);
      setError('senderEmail', null);
      // setValue(
      //   'to',
      //   emailCompany?.recipientEmails?.length
      //     ? populateDataTags(emailCompany?.recipientEmails)
      //     : [],
      // );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailCompany]);

  const handleSelectUser = useCallback((inputName: string) => {
    setInputMailSelected(inputName);
    openModalSelectUser(true);
  }, []);

  const closeSelectUser = useCallback(() => {
    openModalSelectUser(false);
  }, []);

  const removeDuplicateData = useCallback((data) => {
    const listDataNotDuplicate = [];
    data.forEach((item) => {
      if (!listDataNotDuplicate.find((i) => i.value === item.value)) {
        listDataNotDuplicate.push(item);
      }
    });
    return listDataNotDuplicate;
  }, []);

  const handleDataSelected = useCallback(
    (e) => {
      if (inputMailSelected) {
        const data = e.map((i) => ({
          id: i.id,
          value: i.email,
          isFocus: false,
          isTag: true,
        }));
        const list = cloneDeep(getValues(inputMailSelected));
        list.pop();
        const listNewEmails = list?.concat([
          ...data,
          { id: v4(), value: '', isFocus: false, isTag: false },
        ]);
        setValue(inputMailSelected, removeDuplicateData(listNewEmails));
      }
    },
    [getValues, inputMailSelected, removeDuplicateData, setValue],
  );

  const mailSelected = useMemo(() => {
    switch (inputMailSelected) {
      case InputMails.TO:
        return toWatch;
      case InputMails.CC:
        return ccWatch;
      case InputMails.BCC:
        return bccWatch;
      default:
        return toWatch;
    }
  }, [bccWatch, ccWatch, inputMailSelected, toWatch]);

  const handleCloseAndClearData = useCallback(
    (notReset?: boolean) => {
      closeModal();
      setModalSendEmailType(MODAL_TYPES.OPEN_TAB);
      if (notReset) {
        return;
      }
      reset({
        mailTemplateId: null,
        to: [],
        cc: [],
        bcc: [],
        sub: '',
        body: '',
        status: '',
        attachments: [],
      });
    },
    [closeModal, reset],
  );

  const isOverSize = useMemo(() => {
    let total = 0;

    attachmentsWatch?.forEach((e) => {
      const size = convertMBtoB(e.size);
      total += size;
    });

    if (total > 9437184) {
      return true;
    }
    return false;
  }, [attachmentsWatch]);

  const onSubmitForm = useCallback(
    (data: ModalSendValues) => {
      if (isOverSize) {
        toastError(
          'The files are exceeding the maximum attachment size of 9 MB, please reduce the size of files',
        );
        return;
      }
      const invalidToEmail = data?.to?.some(
        (i) => !validateEmail(i?.value) && i?.value,
      );
      const invalidCcEmail = data?.cc?.some(
        (i) => !validateEmail(i?.value) && i?.value,
      );
      const invalidBccEmail = data?.bcc?.some(
        (i) => !validateEmail(i?.value) && i?.value,
      );
      if (invalidToEmail || invalidCcEmail || invalidBccEmail) {
        toastError(
          'The email has a wrong format, please update it. For example: abc@gmail.com',
        );
        return;
      }

      const listToEmail = data?.to
        ?.filter((i) => validateEmail(i?.value))
        ?.map((i) => i?.value);
      const listCCEmail = data?.cc
        ?.filter((i) => validateEmail(i?.value))
        ?.map((i) => i?.value);
      const listBccEmail = data?.bcc
        ?.filter((i) => validateEmail(i?.value))
        ?.map((i) => i?.value);

      if (listToEmail?.length < 1) {
        setError('to', { message: 'This field is required' });
        return;
      }

      const bodyParams = {
        ...data,
        sub: getTextInHTML(data?.sub),
        to: listToEmail || [],
        cc: listCCEmail || [],
        bcc: listBccEmail || [],
        status: data?.status || 'Sending',
        id: planningRequestId,
        attachments: data?.attachments?.length
          ? data?.attachments?.map((i) => i?.id)
          : [],
      };
      if (data?.mailSendId) {
        updateEmailPlanningApiRequest(bodyParams)
          .then((res) => {
            if (data?.status === 'Draft') {
              toastSuccess('You have saved the mail as draft successfully');
            } else {
              toastSuccess('You have sent the mail successfully');
            }
            handleCloseAndClearData(data?.status === 'Draft');
          })
          .catch((err) => toastError(err));
      } else {
        sendEmailPlanningApiRequest(bodyParams)
          .then((res) => {
            toastSuccess('You have sent the mail successfully');
            handleCloseAndClearData();
          })
          .catch((err) => toastError(err));
      }
    },
    [handleCloseAndClearData, isOverSize, planningRequestId, setError],
  );

  const isEmailValid = useMemo(() => {
    if (emailCompany?.isUseSystemEmail) {
      return true;
    }
    if (
      emailCompany?.senderEmailVerifyStatus ===
      SenderEmailVerifyStatusEnum.VERIFIED
    ) {
      return true;
    }
    return false;
  }, [emailCompany?.isUseSystemEmail, emailCompany?.senderEmailVerifyStatus]);

  return (
    <Modal
      className={cx(styles.wrapModal, classesName, {
        [styles.tabOpenEmailModal]: modalType === MODAL_TYPES.OPEN_TAB,
        [styles.tabCloseEmailModal]: modalType === MODAL_TYPES.CLOSE_TAB,
      })}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div>
        <div className={styles.header}>
          <div>
            {renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['New mail'],
            )}
          </div>
          <DetectEsc close={handleCloseAndClearData} />
          <div className={styles.modalActions}>
            <div
              className={styles.closeBtn}
              onClick={() =>
                setModalSendEmailType(
                  modalType === MODAL_TYPES.CLOSE_TAB
                    ? MODAL_TYPES.OPEN_TAB
                    : MODAL_TYPES.CLOSE_TAB,
                )
              }
            >
              <img src={images.icons.icMinus} alt="ic-close-modal" />
            </div>
            <div
              className={styles.closeBtn}
              onClick={() =>
                setModalSendEmailType(
                  modalType === MODAL_TYPES.OPEN_TAB
                    ? MODAL_TYPES.NORMAL
                    : MODAL_TYPES.OPEN_TAB,
                )
              }
            >
              <img
                src={
                  modalType === MODAL_TYPES.OPEN_TAB
                    ? images.icons.icOpenFullScreen
                    : images.icons.icCloseFullScreen
                }
                alt="ic-close-modal"
              />
            </div>
            <div className={styles.closeBtn} onClick={closeModal}>
              <img src={images.icons.icClose} alt="ic-close-modal" />
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <Row className={styles.rowWrap}>
            <Col className="d-flex align-items-center" xs={2}>
              <LabelUI
                label={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Mail template'],
                )}
              />
            </Col>
            <Col xs={10}>
              <SelectUI
                value={mailTemplate}
                data={mailTemplates?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                onChange={(value) => {
                  setMailTemplate(value);
                  handleChangeMailTemplate(value?.toString());
                }}
                className="w-100"
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                control={control}
              />
            </Col>
          </Row>

          <Row className={styles.rowWrap}>
            <Col xs={2}>
              <div className={styles.label}>
                {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.From)}
              </div>
            </Col>
            <Col xs={10}>
              <div className={cx(styles.wrapInfo, 'd-flex align-items-center')}>
                <Input
                  readOnly
                  className="cssDisabled"
                  wrapperInput={styles.customInput}
                  {...register('senderEmail')}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Enter from'],
                  )}
                  isRequired
                  messageRequired={errors?.senderEmail?.message || ''}
                />
              </div>
              {!isEmailValid && (
                <div className={styles.messageError}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS[
                      'The email is invalid, please click the verification link in verification request email to verify it'
                    ],
                  )}
                </div>
              )}
            </Col>
          </Row>
          <Row className={styles.rowWrap}>
            <Col xs={2}>
              <div className={styles.label}>
                {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.To)}{' '}
                <span className={styles.dotRequired}>*</span>
                <Tooltip
                  placement="bottom"
                  title={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS[
                      'Please enter to email to add the mail address'
                    ],
                  )}
                  color="#A5A3A9"
                >
                  <img
                    src={images.icons.icInfoCircleGray}
                    alt="icInfoCircleGray"
                    className={styles.infoIcon}
                  />
                </Tooltip>
              </div>
            </Col>
            <Col xs={8}>
              <div className={cx(styles.wrapInfo)}>
                <InputWithTags
                  key="toEmail"
                  onChange={(e) => {
                    setValue('to', e);
                    setError('to', null);
                  }}
                  listTags={toWatch}
                  disabled={commonLoading}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Enter to'],
                  )}
                />
              </div>
              {errors?.to?.message && (
                <div className={styles.messageError}>
                  {errors?.to?.message || ''}
                </div>
              )}
            </Col>
            <Col xs={2}>
              <Button
                className={styles.btnSelect}
                buttonType={ButtonType.Outline}
                onClick={() => {
                  handleSelectUser(InputMails.TO);
                  setError('to', null);
                }}
                loading={commonLoading}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Select,
                )}
              </Button>
            </Col>
          </Row>
          <Row className={styles.rowWrap}>
            <Col xs={2}>
              <div className={styles.label}>
                {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cc)}
                <Tooltip
                  placement="bottom"
                  title={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS[
                      'Please enter cc email to add the mail address'
                    ],
                  )}
                  color="#A5A3A9"
                >
                  <img
                    src={images.icons.icInfoCircleGray}
                    alt="icInfoCircleGray"
                    className={styles.infoIcon}
                  />
                </Tooltip>
              </div>
            </Col>
            <Col xs={8}>
              <div className={cx(styles.wrapInfo)}>
                <InputWithTags
                  key="ccEmail"
                  onChange={(e) => {
                    setValue('cc', e);
                  }}
                  listTags={ccWatch}
                  disabled={commonLoading}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Enter cc'],
                  )}
                />
              </div>
            </Col>
            <Col xs={2}>
              <Button
                className={styles.btnSelect}
                buttonType={ButtonType.Outline}
                loading={commonLoading}
                onClick={() => handleSelectUser(InputMails.CC)}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Select,
                )}
              </Button>
            </Col>
          </Row>
          <Row className={styles.rowWrap}>
            <Col xs={2}>
              <div className={styles.label}>
                {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Bcc)}
                <Tooltip
                  placement="bottom"
                  title={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS[
                      'Please enter bcc email to add the mail address'
                    ],
                  )}
                  color="#A5A3A9"
                >
                  <img
                    src={images.icons.icInfoCircleGray}
                    alt="icInfoCircleGray"
                    className={styles.infoIcon}
                  />
                </Tooltip>
              </div>
            </Col>
            <Col xs={8}>
              <div className={cx(styles.wrapInfo)}>
                <InputWithTags
                  key="bccEmail"
                  onChange={(e) => {
                    setValue('bcc', e);
                  }}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Enter bcc'],
                  )}
                  disabled={commonLoading}
                  listTags={bccWatch}
                />
              </div>
            </Col>
            <Col xs={2}>
              <Button
                className={styles.btnSelect}
                buttonType={ButtonType.Outline}
                loading={commonLoading}
                onClick={() => handleSelectUser(InputMails.BCC)}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Select,
                )}
              </Button>
            </Col>
          </Row>
          <div className={styles.separateLine} />
          <Row className={styles.rowWrap}>
            <Col xs={12}>
              {isOpen && (
                <Controller
                  control={control}
                  name="sub"
                  render={({ field }) => (
                    <InputMention
                      label={renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS.Subject,
                      )}
                      isRequired
                      messageRequired={errors?.sub?.message || ''}
                      data={field.value || null}
                      disabled={commonLoading}
                      onChange={(e) => field.onChange(e?.data)}
                      setCountCharacters={setCountCharacters}
                      placeholder={renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS['Please select'],
                      )}
                    />
                  )}
                />
              )}
            </Col>
          </Row>
          <Row className={styles.rowWrap}>
            <Col xs={12}>
              <div className={styles.label}>
                {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Body)}{' '}
                <span className={styles.dotRequired}>*</span>
              </div>

              {isOpen && (
                <CkEditorClassic
                  data={bodyWatch}
                  disabled={commonLoading}
                  onChange={(e) => {
                    setValue('body', e?.data || null);
                    setError('body', null);
                  }}
                />
              )}
              <div className={styles.messageError}>
                {errors?.body?.message || ''}
              </div>
            </Col>
          </Row>
          <AttachFileZip
            values={attachmentsWatch}
            disabled={commonLoading}
            isOverSize={isOverSize}
            onchange={(e) => setValue('attachments', e)}
            dynamicLabels={dynamicLabels}
          />
          <ModalChooseUser
            isOpen={modalSelectUserVisible}
            onClose={closeSelectUser}
            mailSelected={mailSelected}
            autoResetData
            onSaveData={handleDataSelected}
          />
        </div>
        <div className={styles.footer}>
          <Button
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.CancelOutline}
            onClick={closeModal}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.CancelOutline}
            loading={commonLoading}
            className={styles.saveDraft}
            onClick={handleSubmit((data: ModalSendValues) =>
              onSubmitForm({ ...data, status: 'Draft' }),
            )}
          >
            {renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Save as draft'],
            )}
          </Button>
          <Button
            className={styles.send}
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Primary}
            onClick={handleSubmit(onSubmitForm)}
            loading={commonLoading}
            disabledCss={!isEmailValid}
            disabled={!isEmailValid}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Send)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSendMail;
