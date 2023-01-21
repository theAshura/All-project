import cx from 'classnames';
import { FC, useEffect, useMemo } from 'react';
import { Modal, Col, Row } from 'reactstrap';
import Input from 'components/ui/input/Input';
import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import SelectUI, { OptionProp } from 'components/ui/select/Select';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import DetectEsc from 'components/common/modal/DetectEsc';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import { REGEXP_INPUT_NUMBER } from 'constants/regExpValidate.const';
import { ViqMainCategory } from 'models/api/viq/viq.model';

import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { VIQ_FIELDS_DETAILS } from 'constants/dynamic/vessel-inspection-questionnaires.const';
import { VIQSubExtend } from '../table/TableSub';
import styles from './modal.module.scss';

interface ModalSubCateGoryProps {
  isOpen: boolean;
  title: string;
  isSecondSub?: boolean;
  data: ViqMainCategory[];
  selectedData?: VIQSubExtend;
  onSubmit: (
    data,
    isAdd: boolean,
    indexMain: string,
    indexSub?: number,
  ) => void;
  toggle?: () => void;
  isAdd?: boolean;
  w?: string | number;
  h?: string | number;
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  subCategoryName: null,
  subRefNo: null,
  mainCategoryName: null,
  potentialRiskId: null,
  question: null,
  guidance: null,
};

const ModalSubCateGory: FC<ModalSubCateGoryProps> = ({
  isOpen,
  toggle,
  title,
  onSubmit,
  data = [],
  selectedData,
  isAdd,
  w,
  h,
  dynamicLabels,
}) => {
  const { potentialRisk } = useSelector((state) => state.viq);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
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
    subCategoryName: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    subRefNo: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    potentialRiskId: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    question: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    // guidance: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchMainName = watch('mainCategoryName');

  const existSubName = useMemo(() => {
    const mainIndex = isAdd
      ? getValues('mainCategoryName')
      : String(selectedData?.mainIndex) || null;

    const dataSubName = [];
    const dataSubNo = [];

    data?.forEach((item, index) => {
      if (Number(mainIndex) === index) {
        item?.viqSubCategories?.forEach((itemSub) => {
          dataSubName.push(itemSub.subCategoryName);
          dataSubNo.push(itemSub.subRefNo);
        });
      }
    });
    return { dataSubName, dataSubNo };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, watchMainName, isAdd]);

  const optionMainNo: OptionProp[] = useMemo(
    () =>
      data?.map((item, index) => ({
        value: String(index),
        label: item.mainCategoryName,
      })),
    [data],
  );

  const optionPotentialRick = useMemo(
    () =>
      potentialRisk?.map((item) => ({
        value: item.id,
        label: item.risk,
      })),
    [potentialRisk],
  );

  const resetForm = () => {
    reset();
  };

  const resetFormNew = () => {
    setValue('subCategoryName', '');
    setValue('subRefNo', '');
    setValue('potentialRiskId', null);
    setValue('guidance', '');
    setValue('question', '');

    setError('subCategoryName', { message: '' });
    setError('subRefNo', { message: '' });
    setError('mainCategoryName', { message: '' });
    setError('potentialRiskId', { message: '' });
    // setError('guidance', { message: '' });
    setError('question', { message: '' });
  };

  const handleCancel = () => {
    toggle();
    resetForm();
  };

  const handleSubmitFormNew = (dataForm) => {
    if (
      existSubName.dataSubNo.includes(dataForm.subRefNo) &&
      dataForm.subRefNo !== selectedData?.subRefNo
    ) {
      return setError('subRefNo', {
        message: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_DETAILS['The sub reference no is existed'],
        ),
      });
    }
    // if (
    //   existSubName.dataSubName.includes(dataForm.subCategoryName) &&
    //   dataForm.subCategoryName !== selectedData?.subCategoryName
    // ) {
    //   return setError('subCategoryName', { message: t('subNameIsExisted') });
    // }

    onSubmit(dataForm, isAdd, dataForm.mainCategoryName);

    return resetFormNew();
  };

  const handleSubmitForm = (dataForm) => {
    if (
      existSubName.dataSubNo.includes(dataForm.subRefNo) &&
      dataForm.subRefNo !== selectedData?.subRefNo
    ) {
      return setError('subRefNo', {
        message: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_DETAILS['The sub reference no is existed'],
        ),
      });
    }

    // if (
    //   existSubName.dataSubName.includes(dataForm.subCategoryName) &&
    //   dataForm.subCategoryName !== selectedData?.subCategoryName
    // ) {
    //   return setError('subCategoryName', { message: t('subNameIsExisted') });
    // }

    if (isAdd) {
      onSubmit(dataForm, isAdd, dataForm.mainCategoryName);
    } else {
      onSubmit(
        dataForm,
        isAdd,
        dataForm.mainCategoryName,
        selectedData.subIndex,
      );
    }
    return handleCancel();
  };

  useEffect(() => {
    if (selectedData && !isAdd) {
      setValue('subCategoryName', selectedData?.subCategoryName || '');
      setValue('subRefNo', selectedData?.subRefNo || '');
      setValue('mainCategoryName', selectedData?.mainCategoryName || null);
      setValue('potentialRiskId', selectedData?.potentialRiskId || null);
      setValue('guidance', selectedData?.guidance);
      setValue('question', selectedData?.question);
    }
  }, [selectedData, isAdd, setValue, dispatch]);

  return (
    <Modal
      className={styles.modalWrap}
      modalClassName={styles.wrapper}
      contentClassName={cx(styles.content, styles.contentSub)}
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
              'd-flex justify-content-end  text-right',
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
            <SelectUI
              data={optionMainNo}
              disabled={!isAdd}
              name="mainCategoryName"
              className={cx(styles.inputSelect, 'w-100')}
              messageRequired={errors?.mainCategoryName?.message || null}
              control={control}
              dynamicLabels={dynamicLabels}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col
            md={3}
            className={cx(
              'd-flex justify-content-end  text-right',
              styles.textLabel,
            )}
          >
            {renderDynamicLabel(
              dynamicLabels,
              VIQ_FIELDS_DETAILS['Sub reference no.'],
            )}
            <img
              src={images.icons.icRequiredAsterisk}
              alt="required"
              className={cx(styles.requiredImg)}
            />
          </Col>
          <Col md={9} className={cx('pe-0')}>
            <InputForm
              messageRequired={errors?.subRefNo?.message || ''}
              maxLength={20}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['Enter sub reference no.'],
              )}
              patternValidate={REGEXP_INPUT_NUMBER}
              control={control}
              name="subRefNo"
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col
            md={3}
            className={cx(
              'd-flex justify-content-end  text-right',
              styles.textLabel,
            )}
          >
            {renderDynamicLabel(
              dynamicLabels,
              VIQ_FIELDS_DETAILS['Sub category name'],
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
                VIQ_FIELDS_DETAILS['Enter sub category name'],
              )}
              maxLength={128}
              messageRequired={errors?.subCategoryName?.message || ''}
              {...register('subCategoryName')}
            />
          </Col>
        </Row>

        <Row className="pt-4 mx-0">
          <Col
            md={3}
            className={cx(
              'd-flex justify-content-end  text-right',
              styles.textLabel,
            )}
          >
            {renderDynamicLabel(
              dynamicLabels,
              VIQ_FIELDS_DETAILS['Potential risk'],
            )}
            <img
              src={images.icons.icRequiredAsterisk}
              alt="required"
              className={cx(styles.requiredImg)}
            />
          </Col>
          <Col md={9} className={cx('pe-0')}>
            <SelectUI
              data={optionPotentialRick}
              name="potentialRiskId"
              messageRequired={errors?.potentialRiskId?.message || null}
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              notAllowSortData
              dynamicLabels={dynamicLabels}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0 ">
          <Col md={3} className="d-flex justify-content-end py-2">
            {renderDynamicLabel(dynamicLabels, VIQ_FIELDS_DETAILS.Questions)}
            <img
              src={images.icons.icRequiredAsterisk}
              alt="required"
              className={cx(styles.requiredImg)}
            />
          </Col>
          <Col md={9} className={cx('pe-0')}>
            <TextAreaForm
              name="question"
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['Enter questions'],
              )}
              maxLength={500}
              control={control}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0 ">
          <Col md={3} className="d-flex justify-content-end py-2">
            {renderDynamicLabel(dynamicLabels, VIQ_FIELDS_DETAILS.Guidance)}
            {/* <img
              src={images.icons.icRequiredAsterisk}
              alt="required"
              className={cx(styles.requiredImg)}
            /> */}
          </Col>
          <Col md={9} className={cx('pe-0')}>
            <TextAreaForm
              name="guidance"
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['Enter guidance'],
              )}
              maxLength={2000}
              autoSize={{ minRows: 3, maxRows: 6 }}
              control={control}
            />
          </Col>
        </Row>
      </div>
      <div className={styles.footer}>
        <GroupButton
          className={styles.GroupButton}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(handleSubmitForm)}
          handleSubmitAndNew={
            isAdd ? handleSubmit(handleSubmitFormNew) : undefined
          }
          disable={false}
          dynamicLabels={dynamicLabels}
        />
      </div>
    </Modal>
  );
};

export default ModalSubCateGory;
