import cx from 'classnames';
import { FC, useEffect, useMemo } from 'react';
import { Modal, Col, Row } from 'reactstrap';
import Input from 'components/ui/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { ViqMainCategory } from 'models/api/viq/viq.model';
import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import * as yup from 'yup';
import DetectEsc from 'components/common/modal/DetectEsc';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FieldValues } from 'react-hook-form';
import { clearVIQErrorsReducer } from 'store/viq/viq.action';
import { REGEXP_INPUT_NUMBER } from 'constants/regExpValidate.const';
import InputForm from 'components/react-hook-form/input-form/InputForm';

import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { VIQ_FIELDS_DETAILS } from 'constants/dynamic/vessel-inspection-questionnaires.const';
import styles from './modal.module.scss';

interface ModalMainCateGoryProps {
  isOpen: boolean;
  title: string;
  data: ViqMainCategory[];
  selectedData?: ViqMainCategory;
  mainIndex?: number;
  onSubmit: (data: ViqMainCategory, indexMain: number, isAdd: boolean) => void;
  isAdd?: boolean;
  toggle?: () => void;
  w?: string | number;
  h?: string | number;
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  mainCategoryNo: '',
  mainCategoryName: '',
};

const ModalMainCateGory: FC<ModalMainCateGoryProps> = ({
  isOpen,
  toggle,
  title,
  data,
  selectedData,
  onSubmit,
  mainIndex,
  isAdd,
  w,
  h,
  dynamicLabels,
}) => {
  const { errorList } = useSelector((state) => state.viq);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    mainCategoryNo: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    mainCategoryName: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const existSubName = useMemo(() => {
    const dataName = data.map((item) => item.mainCategoryName);
    const dataNo = data.map((item) => item.mainCategoryNo);
    return { dataName, dataNo };
  }, [data]);

  const resetForm = () => {
    setValue('mainCategoryNo', '');
    setValue('mainCategoryName', '');
    setError('mainCategoryNo', { message: '' });
    setError('mainCategoryName', { message: '' });
    dispatch(clearVIQErrorsReducer());
  };

  const handleCancel = (isNew?: boolean) => {
    toggle();
    resetForm();
  };
  const handleSubmitForm = (dataForm) => {
    const { dataNo, dataName } = existSubName;
    if (
      dataNo.includes(dataForm.mainCategoryNo) &&
      dataForm.mainCategoryNo !== selectedData?.mainCategoryNo
    ) {
      return setError('mainCategoryNo', {
        message: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_DETAILS['The main reference no is existed'],
        ),
      });
    }
    if (
      dataName.includes(dataForm.mainCategoryName) &&
      dataForm.mainCategoryName !== selectedData?.mainCategoryName
    ) {
      return setError('mainCategoryName', {
        message: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_DETAILS['The main category name is existed'],
        ),
      });
    }

    onSubmit(dataForm, mainIndex, isAdd);
    return handleCancel();
  };

  const handleSubmitFormNew = (dataForm) => {
    const { dataNo, dataName } = existSubName;
    if (
      dataNo.includes(dataForm.mainCategoryNo) &&
      dataForm.mainCategoryNo !== selectedData?.mainCategoryNo
    ) {
      return setError('mainCategoryNo', {
        message: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_DETAILS['The main reference no is existed'],
        ),
      });
    }
    if (
      dataName.includes(dataForm.mainCategoryName) &&
      dataForm.mainCategoryName !== selectedData?.mainCategoryName
    ) {
      return setError('mainCategoryName', {
        message: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_DETAILS['The main reference name is existed'],
        ),
      });
    }

    onSubmit(dataForm, mainIndex, isAdd);
    return resetForm();
  };

  useEffect(() => {
    if (selectedData && !isAdd) {
      setValue('mainCategoryNo', selectedData?.mainCategoryNo);
      setValue('mainCategoryName', selectedData?.mainCategoryName);
    }
  }, [selectedData, isAdd, setValue, dispatch]);

  useEffect(() => {
    // set Error
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'mainCategoryNo':
            setError('mainCategoryNo', { message: item.message });
            break;
          case 'mainCategoryName':
            setError('mainCategoryName', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('mainCategoryNo', { message: '' });
      setError('mainCategoryName', { message: '' });
    }
  }, [errorList, setError]);

  return (
    <Modal
      className={styles.modalWrap}
      modalClassName={styles.wrapper}
      contentClassName={styles.content}
      isOpen={isOpen}
      style={{ width: w || '100%' }}
    >
      <div className={styles.header}>
        <span>{title}</span>
      </div>
      <DetectEsc close={handleCancel} />
      <div className={styles.body}>
        <Row className="mx-0">
          <Col
            md={3}
            className={cx(
              'd-flex justify-content-end text-right',
              styles.textLabel,
            )}
          >
            {renderDynamicLabel(
              dynamicLabels,
              VIQ_FIELDS_DETAILS['Main reference no.'],
            )}
            <img
              src={images.icons.icRequiredAsterisk}
              alt="required"
              className={cx(styles.requiredImg)}
            />
          </Col>
          <Col md={9} className={cx('pe-0')}>
            <InputForm
              messageRequired={errors?.mainCategoryNo?.message || ''}
              maxLength={20}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['Enter main reference no.'],
              )}
              patternValidate={REGEXP_INPUT_NUMBER}
              control={control}
              name="mainCategoryNo"
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col
            md={3}
            className={cx(
              'd-flex justify-content-end text-right',
              styles.textLabel,
            )}
          >
            {renderDynamicLabel(
              dynamicLabels,
              VIQ_FIELDS_DETAILS['Main category name'],
            )}
            <img
              src={images.icons.icRequiredAsterisk}
              alt="required"
              className={cx(styles.requiredImg)}
            />
          </Col>
          <Col md={9} className={cx('pe-0')}>
            <Input
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['Enter main category name'],
              )}
              messageRequired={errors?.mainCategoryName?.message || ''}
              {...register('mainCategoryName')}
              maxLength={128}
            />
          </Col>
        </Row>
      </div>
      <div className={styles.footer}>
        <GroupButton
          dynamicLabels={dynamicLabels}
          className={styles.GroupButton}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(handleSubmitForm)}
          handleSubmitAndNew={
            isAdd ? handleSubmit(handleSubmitFormNew) : undefined
          }
          disable={false}
        />
      </div>
    </Modal>
  );
};

export default ModalMainCateGory;
