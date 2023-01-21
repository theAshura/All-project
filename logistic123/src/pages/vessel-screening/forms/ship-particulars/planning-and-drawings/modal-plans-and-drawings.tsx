import { FC, ReactNode, useEffect, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import {
  FieldValues,
  useForm,
  Controller,
  FormProvider,
} from 'react-hook-form';
import LabelUI from 'components/ui/label/LabelUI';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { PlansAndDrawingDetailResponse } from 'models/api/plans-and-drawings/plans-and-drawings.model';
import { TableNoteByreviewer } from 'pages/vessel-screening/components/note-reviewer/NoteByReviewer';
import { useSelector } from 'react-redux';
import styles from './modal-plans-and-drawings.module.scss';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  onSubmit?: (any) => void;
  data?: PlansAndDrawingDetailResponse;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  vesselId: null,
  nameOfPlanning: '',
  remarks: '',
  comments: [],
  attachments: [],
};

const PlanningAndDrawingsForm: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, onSubmit, isEdit, data } = props;

  const { t } = useTranslation([
    I18nNamespace.PLANNING_AND_DRAWINGS,
    I18nNamespace.COMMON,
  ]);
  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });
  const { control, handleSubmit, setValue, register, reset } = methods;
  const { vesselDetail } = useSelector((state) => state.vessel);
  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = () => {
    toggle();
    resetForm();
  };

  const onSubmitForm = useCallback(
    (dataForm) => {
      const dataSubmit = {
        plansDrawingsMasterId: data?.plansDrawingsMaster?.id,
        remarks: dataForm?.remarks,
        comments: dataForm?.comments?.length ? [...dataForm?.comments] : null,
        attachments: dataForm?.attachments?.length
          ? [...dataForm?.attachments]
          : [],
        vesselId: vesselDetail?.id,
      };
      onSubmit(dataSubmit);
      resetForm();
      toggle();
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
      setValue(
        'comments',
        data?.PDComments?.length ? [...data.PDComments] : [],
      );
    }
  }, [data, setValue]);

  const renderForm = () => (
    <>
      <div>
        <FormProvider {...methods}>
          <Row className="pt-2 mx-0">
            <Col sm={4} className={cx('p-0')}>
              <Input
                label="Name of plan"
                className={styles.disabledInput}
                placeholder="Enter capacity plan"
                maxLength={500}
                disabled
                {...register('nameOfPlanning')}
              />
            </Col>
            <Col sm={18} className={cx('p-0')} />
          </Row>
          <Row className="pt-3 mx-0">
            <div className={cx('d-flex pb-1 ps-0 ', styles.wrapLabel)}>
              <LabelUI label={t('comment')} />
            </div>
            <TextAreaForm
              name="remarks"
              maxLength={2000}
              control={control}
              rows={3}
              disabled
            />
          </Row>

          <Controller
            control={control}
            name="attachments"
            render={({ field }) => (
              <TableAttachment
                featurePage={Features.QUALITY_ASSURANCE}
                subFeaturePage={SubFeatures.VESSEL_SCREENING}
                scrollVerticalAttachment
                loading={false}
                isEdit={false}
                disable
                value={field.value}
                buttonName="Attach"
                onchange={field.onChange}
                classWrapper="pb-0"
              />
            )}
          />

          <Controller
            control={control}
            name="comments"
            render={({ field }) => (
              <TableNoteByreviewer
                disable={!isEdit}
                loading={false}
                value={field.value}
                onchange={field.onChange}
                className="p-0"
              />
            )}
          />
        </FormProvider>
      </div>
    </>
  );

  const renderFooter = () => (
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
  );

  return (
    <ModalComponent
      w={1156}
      isOpen={isOpen}
      toggle={handleCancel}
      bodyClassName={cx(styles.formWrapper)}
      title={title}
      content={renderForm()}
      footer={isEdit ? renderFooter() : null}
      refId={data?.refId}
    />
  );
};

export default PlanningAndDrawingsForm;
