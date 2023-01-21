import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkExitCodeApi } from 'api/event-type.api';

import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_NAME,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useDispatch, useSelector } from 'react-redux';
import { SECTION_TYPES } from 'constants/filter.const';
import { IssueNote } from 'models/api/issue-note/issue-note.model';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import { createIssueNoteActions } from 'store/issue-note/issue-note.action';

interface ModalIssueNoteProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: IssueNote;
  isEdit?: boolean;
  isView?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  code: '',
  name: '',
  modules: [],
  description: '',
  status: 'active',
};

const ModalIssueNote: FC<ModalIssueNoteProps> = (props) => {
  const {
    loading,
    isCreate,
    toggle,
    title,
    isOpen,
    data,
    isView,
    handleSubmitForm,
  } = props;
  const { t } = useTranslation([
    I18nNamespace.ISSUE_NOTE,
    I18nNamespace.COMMON,
  ]);

  const { errorList } = useSelector((state) => state.issueNote);

  const schema = useMemo(
    () =>
      yup.object().shape({
        description: yup.string().trim().nullable(),
        code: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
        name: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const handleCancel = useCallback(() => {
    toggle();
    reset(defaultValues);
    dispatch(createIssueNoteActions.failure(null));
  }, [reset, toggle, dispatch]);

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (!isCreate) {
        return;
      }
      if (field && value) {
        checkExitCodeApi({
          entity: 'technical-issue-note',
          field,
          value,
        })
          .then((res) => {
            if (res?.data?.isExist) {
              switch (field) {
                case 'code':
                  if (value !== data?.code) {
                    setError(field, {
                      message: t('issueNoteCodeIsExisted'),
                    });
                  }
                  break;
                case 'name':
                  if (value !== data?.name) {
                    setError(field, {
                      message: t('issueNoteNameIsExisted'),
                    });
                  }
                  break;
                default:
                  setError(field, { message: '' });
                  break;
              }
            }
          })
          .catch((err) => {
            setError(field, { message: '' });
          });
      }
    },
    [data?.code, data?.name, isCreate, setError, t],
  );

  const onSubmitForm = useCallback(
    (formData) => {
      const modules = formData?.modules?.map((i) => i.value) || [];
      handleSubmitForm({
        ...formData,
        modules,
        resetForm,
      });
    },
    [handleSubmitForm, resetForm],
  );

  const handleSubmitAndNew = useCallback(
    (formData) => {
      const modules = formData?.modules?.map((i) => i.value) || [];

      const dataNew = { ...formData, modules, isNew: true, resetForm };
      handleSubmitForm(dataNew);
    },
    [handleSubmitForm, resetForm],
  );

  const renderForm = useMemo(
    () => (
      <>
        <div>
          <Row className="pt-2 mx-0 pb-3">
            <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('codeForm')} isRequired />
            </Col>
            <Col className="px-0" md={9} xs={9}>
              <Input
                disabled={isView}
                autoFocus
                isRequired
                placeholder={t('placeholderCode')}
                messageRequired={errors?.code?.message || ''}
                {...register('code')}
                maxLength={MAX_LENGTH_CODE}
                onBlur={(e: any) => handleCheckExit('code', e.target.value)}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0 pb-3">
            <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('nameForm')} isRequired />
            </Col>
            <Col className="px-0" md={9} xs={9}>
              <Input
                {...register('name')}
                isRequired
                disabled={isView}
                messageRequired={errors?.name?.message || ''}
                placeholder={t('placeholderName')}
                maxLength={MAX_LENGTH_NAME}
                onBlur={(e: any) => handleCheckExit('name', e.target.value)}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0 pb-3">
            <Col className="ps-0  pt-2" md={3} xs={3}>
              <LabelUI label={t('sectionType')} />
            </Col>
            <Col className="px-0" md={9} xs={9}>
              <AsyncSelectResultForm
                multiple
                disabled={isView}
                control={control}
                name="modules"
                id="modules"
                titleResults="Selected"
                placeholder="Please select"
                searchContent="Section Type"
                textSelectAll="Select All"
                hiddenSearch
                messageRequired={errors?.modules?.message || ''}
                options={SECTION_TYPES}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0 pb-3">
            <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('description')} />
            </Col>
            <Col className="px-0" md={9} xs={9}>
              <Input
                {...register('description')}
                disabled={isView}
                maxLength={MAX_LENGTH_OPTIONAL}
                placeholder={t('placeholderDescription')}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('status')} />
            </Col>
            <Col className="px-0 d-flex" md={9} xs={9}>
              <RadioForm
                name="status"
                disabled={isView}
                control={control}
                radioOptions={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />
            </Col>
          </Row>
        </div>
      </>
    ),
    [
      t,
      isView,
      errors?.code?.message,
      errors?.name?.message,
      errors?.modules?.message,
      register,
      control,
      handleCheckExit,
    ],
  );

  const renderFooter = useMemo(
    () => (
      <div>
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.ISSUE_NOTE,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) => (
            <GroupButton
              className="mt-1 justify-content-end"
              handleCancel={handleCancel}
              visibleSaveBtn
              handleSubmit={handleSubmit(onSubmitForm)}
              handleSubmitAndNew={
                hasPermission ? handleSubmit(handleSubmitAndNew) : undefined
              }
              disable={loading}
            />
          )}
        </PermissionCheck>
      </div>
    ),
    [handleCancel, handleSubmit, handleSubmitAndNew, loading, onSubmitForm],
  );

  // effect
  useEffect(() => {
    if (data && isOpen) {
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
      setValue(
        'modules',
        data?.modules?.map((i) => ({ value: i, label: i })) || null,
      );
    } else {
      reset(defaultValues);
    }
  }, [data, isOpen, reset, setValue]);

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
  }, [errorList, setError]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm}
      footer={isView || !isOpen ? null : renderFooter}
    />
  );
};

export default ModalIssueNote;
