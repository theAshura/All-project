import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';

import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import {
  CreatePlansAndDrawingParams,
  PlansAndDrawingDetailResponse,
} from 'models/api/plans-and-drawings/plans-and-drawings.model';
import styles from './modal.module.scss';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  onSubmit?: (data: CreatePlansAndDrawingParams) => void;
  data?: PlansAndDrawingDetailResponse;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  nameOfPlanning: null,
  remarks: null,
  attachments: null,
};

const ModalPlansAndDrawing = ({
  loading,
  toggle,
  title,
  isOpen,
  onSubmit,
  data,
  isEdit,
}: ModalProps) => {
  const { t } = useTranslation([
    I18nNamespace.PLANS_AND_DRAWINGS,
    I18nNamespace.COMMON,
  ]);
  const { vesselDetail } = useSelector((state) => state.vessel);
  const { control, handleSubmit, register, reset, setValue } =
    useForm<FieldValues>({
      mode: 'onChange',
      defaultValues,
    });

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (dataForm) => {
      const dataSubmit: CreatePlansAndDrawingParams = {
        plansDrawingsMasterId: data?.plansDrawingsMaster?.id,
        remarks: dataForm?.remarks,
        attachments: dataForm?.attachments || [],
        vesselId: vesselDetail?.id,
      };
      onSubmit({
        ...dataSubmit,
        handleSuccess: () => {
          resetForm();
          toggle();
        },
      });
    },
    [
      data?.plansDrawingsMaster?.id,
      onSubmit,
      resetForm,
      toggle,
      vesselDetail?.id,
    ],
  );

  useEffect(() => {
    if (data) {
      setValue('nameOfPlanning', data?.plansDrawingsMaster?.name);
      setValue('remarks', data?.remarks);
      setValue(
        'attachments',
        data?.attachments?.length ? [...data?.attachments] : [],
      );
    }
  }, [data, setValue]);

  const renderForm = useMemo(
    () => (
      <div>
        <Row className="pt-2 mx-0">
          <Col sm={4} className="p-0">
            <Input
              label={t('nameOfPlanning')}
              className={styles.disabledInput}
              maxLength={500}
              disabled
              {...register('nameOfPlanning')}
            />
          </Col>
          <Col sm={18} />
        </Row>

        <div className={cx(styles.labelForm, 'pt-3')}>{t('comment')}</div>
        <TextAreaForm
          name="remarks"
          placeholder={t('placeholder.comment')}
          control={control}
          rows={3}
          disabled={!isEdit}
          maxLength={2000}
        />

        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <TableAttachment
              featurePage={Features.QUALITY_ASSURANCE}
              subFeaturePage={SubFeatures.SAIL_GENERAL_REPORT}
              loading={false}
              disable={!isEdit}
              isEdit={isEdit}
              value={field.value}
              buttonName={t('buttons.attach')}
              onchange={field.onChange}
              scrollVerticalAttachment
            />
          )}
        />
      </div>
    ),
    [control, isEdit, register, t],
  );

  const renderFooter = useMemo(
    () => (
      <>
        <div>
          <GroupButton
            className="mt-1 justify-content-end"
            handleCancel={handleCancel}
            visibleSaveBtn
            handleSubmit={handleSubmit(onSubmitForm)}
            disable={loading}
          />
        </div>
      </>
    ),
    [handleCancel, handleSubmit, loading, onSubmitForm],
  );

  return (
    <ModalComponent
      w={1156}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      refId={data?.refId}
      bodyClassName={cx(styles.formWrapper)}
      content={renderForm}
      footer={isEdit ? renderFooter : null}
    />
  );
};

export default ModalPlansAndDrawing;
