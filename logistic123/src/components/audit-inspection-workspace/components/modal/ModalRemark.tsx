import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import cx from 'classnames';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import ModalComponent from 'components/ui/modal/Modal';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { PARAMS_DEFAULT } from 'constants/filter.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { I18nNamespace } from 'constants/i18n.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import {
  RemarkItem,
  RemarkParam,
} from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { CommonApiParam } from 'models/common.model';
import { FC, useCallback, useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { getListAuthorityMasterActions } from 'store/authority-master/authority-master.action';
import * as yup from 'yup';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  toggle?: () => void;
  onSubmit?: (data: RemarkParam) => void;
  data?: RemarkItem;
  isView?: boolean;
  loading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  title: null,
  remark: null,
  isPublic: false,
};

const ModalRemark: FC<ModalProps> = (props) => {
  const {
    loading,
    toggle,
    title,
    isOpen,
    onSubmit,
    data,
    isView,
    dynamicLabels,
  } = props;
  const { t } = useTranslation([
    I18nNamespace.AUDIT_INSPECTION_WORKSPACE,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(getListAuthorityMasterActions.request(newParams));
    },
    [dispatch],
  );

  useEffect(() => {
    handleGetList(PARAMS_DEFAULT);
  }, [handleGetList]);

  const schema = yup.object().shape({
    title: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    remark: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
  });

  const {
    control,
    handleSubmit,
    setValue,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const isPublicWatch = watch('isPublic');

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (data) => {
      onSubmit({
        data,
        handleSuccess: () => {
          toggle();
          resetForm();
        },
      });
    },
    [onSubmit, resetForm, toggle],
  );

  useEffect(() => {
    if (!isView && !data) {
      setValue('title', null);
      setValue('isPublic', false);
      setValue('remark', null);
      setValue('attachments', []);
    }
    if (data) {
      setValue('title', data?.title);
      setValue('isPublic', data?.isPublic);
      setValue('remark', data?.remark);
      setValue(
        'attachments',
        data?.attachments?.length ? [...data?.attachments] : [],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isView]);

  const renderForm = useCallback(
    () => (
      <div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')} id="name">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Title,
              )}
              isRequired
              messageRequired={errors?.title?.message || ''}
              // className={styles.disabledInput}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks[
                  'Enter title'
                ],
              )}
              maxLength={150}
              readOnly={isView || loading}
              disabledCss={isView || loading}
              {...register('title')}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <div className="d-flex align-items-end">
              <ToggleSwitch
                disabled={isView || loading}
                labelTop={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Security,
                )}
                control={control}
                name="isPublic"
              />
              <p className="mb-1">{isPublicWatch ? 'Public' : 'Private'}</p>
            </div>
          </Col>
        </Row>
        <div className="mt-2">
          <div className="d-flex align-items-start">
            <div>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Remarks,
              )}
            </div>
            <img src={images.icons.icRequiredAsterisk} alt="required" />
          </div>

          <TextAreaForm
            disabled={isView}
            control={control}
            autoSize={{ minRows: 1, maxRows: 4 }}
            name="remark"
            placeholder={renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks[
                'Enter remarks'
              ],
            )}
            className={cx('w-100  mt-2')}
            id="remark"
            maxLength={500}
          />
        </div>

        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <TableAttachment
              featurePage={Features.AUDIT_INSPECTION}
              subFeaturePage={SubFeatures.AUDIT_INSPECTION_WORKSPACE}
              scrollVerticalAttachment
              loading={loading}
              isEdit={!isView}
              disable={isView}
              isCreate={!isView}
              value={field.value}
              buttonName={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Attach,
              )}
              onchange={field.onChange}
              dynamicLabels={dynamicLabels}
            />
          )}
        />
      </div>
    ),
    [
      control,
      dynamicLabels,
      errors?.title?.message,
      isPublicWatch,
      isView,
      loading,
      register,
    ],
  );

  const renderFooter = useCallback(
    () => (
      <div>
        <GroupButton
          className="mt-1 justify-content-end"
          handleCancel={handleCancel}
          visibleSaveBtn
          hideBtnSave
          dynamicLabels={dynamicLabels}
          disable={loading}
        >
          <Button
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Green}
            className={cx('ms-2')}
            onClick={handleSubmit(onSubmitForm)}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Submit)}
          </Button>
        </GroupButton>
      </div>
    ),
    [dynamicLabels, handleCancel, handleSubmit, loading, onSubmitForm],
  );

  return (
    <ModalComponent
      w={1156}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      footer={!isView ? renderFooter() : null}
    />
  );
};

export default ModalRemark;
