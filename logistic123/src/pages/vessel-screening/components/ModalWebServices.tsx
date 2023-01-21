import { FC, useCallback, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/ui/input/Input';
import { Col, Row } from 'antd/lib/grid';
import styles from './comment.module.scss';
import { WebService } from '../utils/models/summary.model';

interface Props {
  isOpen?: boolean;
  toggle?: () => void;
  data?: WebService;
  handleSubmitForm?: (data) => void;
  isEdit?: boolean;
  title?: string;
}
const defaultValues = {
  name: '',
  url: '',
};

export const ModalWebServices: FC<Props> = ({
  isOpen,
  data,
  handleSubmitForm,
  toggle,
  isEdit,
  title,
}) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().trim().nullable().required(t('errors.required')),
        url: yup
          .string()
          .trim()
          .matches(
            new RegExp(
              '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
              'i',
            ),
            {
              message: t('errors.invalid'),
            },
          )
          .nullable()
          .required(t('errors.required')),
      }),
    [t],
  );

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmitForm = useCallback(
    (data) => {
      handleSubmitForm(data);
      reset(defaultValues);
    },
    [handleSubmitForm, reset],
  );

  const handleCancel = useCallback(() => {
    toggle();
    reset(defaultValues);
  }, [reset, toggle]);

  useEffect(() => {
    if (data) {
      setValue('name', data?.webName);
      setValue('url', data?.url);
    }
    return () => {};
  }, [data, setValue]);

  const renderForm = useCallback(
    () => (
      <Row gutter={24}>
        <Col span={12}>
          <Input
            label={t('summary.txWebName')}
            isRequired
            readOnly={!isEdit}
            disabledCss={!isEdit}
            placeholder={t('placeholders.webName')}
            messageRequired={errors?.name?.message || ''}
            {...register('name')}
            maxLength={50}
          />
        </Col>
        <Col span={12}>
          <Input
            label={t('summary.url')}
            isRequired
            readOnly={!isEdit}
            disabledCss={!isEdit}
            placeholder={t('placeholders.url')}
            messageRequired={errors?.url?.message || ''}
            {...register('url')}
            maxLength={250}
          />
        </Col>
      </Row>
    ),
    [errors?.name?.message, errors?.url?.message, register, t, isEdit],
  );

  const renderFooter = useCallback(
    () => (
      <div>
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.PrimaryLight}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
        />
      </div>
    ),
    [handleCancel, handleSubmit, onSubmitForm],
  );

  return (
    <ModalComponent
      isOpen={isOpen}
      toggle={() => {
        toggle();
        reset(defaultValues);
      }}
      title={title || t('summary.webServices')}
      content={renderForm()}
      footer={isEdit && renderFooter()}
    />
  );
};
