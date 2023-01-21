import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import SelectUI from 'components/ui/select/Select';
import { CONFIG } from 'config';
import { FilePrefix, FileType } from 'constants/common.const';
import { statusOptions } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError } from 'helpers/notification.helper';
import { DMS } from 'models/api/dms/dms.model';
import { Action } from 'models/common.model';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import {
  clearDMSErrorsReducer,
  getListFileActions,
} from 'store/dms/dms.action';
import { uploadFileActions } from 'store/user/user.action';
import * as yup from 'yup';
import styles from './form.module.scss';

interface DMSFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: DMS;
  onSubmit: (CreateCharterOwnerParams, removeFile) => void;
}

const defaultValues = {
  code: '',
  name: '',
  status: 'active',
};

interface Attachment {
  id?: string;
  no: number;
  document: string;
  mimetype?: string;
  key?: string;
}
const DMSForm: FC<DMSFormProps> = ({ isEdit, data, onSubmit, isCreate }) => {
  // state
  const { avatar } = useSelector((state) => state.user);
  const [attachment, setAttachment] = useState<Attachment[]>([]);
  const { t } = useTranslation([I18nNamespace.DMS, I18nNamespace.COMMON]);
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    code: yup
      .string()
      .trim()
      .nullable()
      .required()
      .required(t('errors.required')),
    name: yup
      .string()
      .trim()
      .nullable()
      .required()
      .required(t('errors.required')),

    attachments: yup
      .array()
      .nullable()
      .required(t('errors.required'))
      .min(1, t('errors.required')),
  });
  const { errorList, fileList, loading } = useSelector((state) => state.dms);
  const [deleteFileIds, setDeleteFileIds] = useState<any>([]);

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const rowLabels = [
    {
      id: 'action',
      label: t('buttons.txAction'),
      sort: false,
      width: '50',
    },
    {
      id: 'no',
      label: t('txNo'),
      sort: true,
      width: '200px',
    },
    {
      id: 'document',
      label: t('txDocument'),
      sort: true,
      width: '320',
    },
  ];
  const uploadFile = useRef(null);

  // function
  const onDeleteAttachment = useCallback(
    (index) => {
      const newAttach = [...attachment];
      newAttach.splice(index, 1);
      setAttachment(newAttach);
      const newAttachmentForm = getValues('attachments');
      const newDeleteIds = [...deleteFileIds];
      newDeleteIds.push(newAttachmentForm[index]);
      setDeleteFileIds(newDeleteIds);
      newAttachmentForm.splice(index, 1);
      setValue('attachments', newAttachmentForm);
      uploadFile.current.value = null;
    },
    [attachment, deleteFileIds, getValues, setValue],
  );

  const handleDeleteAttachment = useCallback(
    (index) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => onDeleteAttachment(index),
      });
    },
    [onDeleteAttachment, t],
  );

  const handleDownloadAttachment = useCallback(
    (index) => {
      const link = document.createElement('a');
      const url = `${CONFIG.CDN}/${attachment[index].key}`;
      link.download = attachment[index].document;
      if (attachment[index].mimetype.split('/')[0] === 'image') {
        window.open(url, '_blank');
      } else link.href = url;
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    },
    [attachment],
  );

  const onChangeFile = (event) => {
    const { files } = event.target;
    const formDataImages = new FormData();
    formDataImages.append('files', files[0]);
    formDataImages.append('fileType', FileType.ATTACHMENT);
    formDataImages.append('prefix', FilePrefix.ATTACHMENT);
    if (files[0]?.size < 5242881) {
      setAttachment((e) => [
        ...e,
        {
          no: e?.length + 1,
          document: files[0]?.name,
          type: files[0]?.mimetype,
        },
      ]);
      dispatch(uploadFileActions.request(formDataImages));
      return null;
    }
    if (files[0]?.size > 5242880) {
      toastError(
        `This specified file ${files[0]?.name} could not be uploaded. The file is exceeding the maximum file size of 5 MB`,
      );

      return null;
    }

    toastError('This type is not supported');
    return null;
  };

  const handleCancel = () => {
    if (!isEdit) {
      history.push(AppRouteConst.DMS);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => history.push(AppRouteConst.DMS),
      });
    }
  };

  const sanitizeData = (data, index) => {
    const finalData = {
      no: index + 1,
      document: data?.document || '',
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (attachment?.length > 0) {
        return (
          <tbody>
            {attachment?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              const actions: Action[] = isCreate
                ? [
                    {
                      img: images.icons.icRemove,
                      function: () => handleDeleteAttachment(index),
                      feature: Features.CONFIGURATION,
                      subFeature: SubFeatures.DMS,
                      action: ActionTypeEnum.CREATE,
                      buttonType: ButtonType.Orange,
                      cssClass: 'ms-1',
                    },
                  ]
                : [
                    {
                      img: images.icons.icDownloadWhite,
                      function: () => handleDownloadAttachment(index),
                      feature: Features.CONFIGURATION,
                      subFeature: SubFeatures.DMS,
                      action: ActionTypeEnum.CREATE,
                      buttonType: ButtonType.Primary,
                      cssClass: 'ms-1',
                    },
                    {
                      img: images.icons.icRemove,
                      function: isEdit
                        ? () => handleDeleteAttachment(index)
                        : undefined,
                      feature: Features.CONFIGURATION,
                      subFeature: SubFeatures.DMS,
                      action: ActionTypeEnum.CREATE,
                      buttonType: ButtonType.Orange,
                      cssClass: 'ms-1 ',
                    },
                  ];
              return (
                <RowComponent
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={actions}
                  key={JSON.stringify(finalData)}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [
      attachment,
      handleDeleteAttachment,
      handleDownloadAttachment,
      isCreate,
      isEdit,
    ],
  );

  const onSubmitForm = (data: DMS) => {
    onSubmit(data, deleteFileIds);
  };

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('status', data.status);
      setValue('attachments', data.attachments);
      if (data.attachments) {
        dispatch(getListFileActions.request({ ids: data.attachments }));
      }
    }
    return () => {
      dispatch(clearDMSErrorsReducer());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      setError('code', { message: '' });
      setError('name', { message: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);

  useEffect(() => {
    if (avatar) {
      setError('attachments', { message: '' });
      const newAttach = getValues('attachments') || [];
      newAttach.push(avatar.id);
      setValue('attachments', newAttach);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar]);

  useEffect(() => {
    const data = [];
    fileList?.forEach((element) => {
      data.push({
        id: element.id,
        no: data.length + 1,
        document: element.originName,
        mimetype: element.mimetype,
        key: element.key,
      });
    });
    setAttachment(data);
  }, [fileList]);

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className={cx('fw-bold', styles.titleForm)}>
          {t('txDMSInformation')}
        </div>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('txDMSCode')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              placeholder={t('placeHolder.txDMSCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={20}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('txDMSName')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              {...register('name')}
              isRequired
              readOnly={!isEdit}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeHolder.txDMSName')}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('txDescription')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={t('placeHolder.txDescription')}
              messageRequired={errors?.description?.message || ''}
              {...register('description')}
              maxLength={250}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <SelectUI
              labelSelect={t('txStatus')}
              data={statusOptions}
              disabled={!isEdit}
              name="status"
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: !isEdit },
                'w-100',
              )}
              control={control}
            />
          </Col>
        </Row>
      </div>
      <div className={cx(styles.tableAttach, 'pt-2')}>
        <div className={cx(styles.containerForm)}>
          <label htmlFor="file-input">
            <input
              type="file"
              ref={uploadFile}
              className={styles.inputFile}
              onChange={onChangeFile}
            />
          </label>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-start">
              <div className={cx(styles.titleContainer)}>
                {t('txAttachment')}
              </div>
              <img src={images.icons.icRequiredAsterisk} alt="required" />
            </div>
            {isEdit && (
              <Button
                onClick={() => uploadFile.current.click()}
                buttonSize={ButtonSize.Medium}
                buttonType={ButtonType.Primary}
                className={cx('mt-auto ', styles.buttonAdd)}
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {t('buttons.addAttach')}
              </Button>
            )}
          </div>
          {errors?.attachments?.message && (
            <div className="message-required mt-2">
              {errors?.attachments?.message}
            </div>
          )}
          <div className={cx('pt-4', styles.table)}>
            <TableCp
              rowLabels={rowLabels}
              renderRow={renderRow}
              loading={false}
              isEmpty={undefined}
            />
          </div>
        </div>
      </div>
      {isEdit && (
        <GroupButton
          className={cx(styles.GroupButton, ' pt-4')}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={!isEdit}
        />
      )}
    </div>
  );
};

export default DMSForm;
