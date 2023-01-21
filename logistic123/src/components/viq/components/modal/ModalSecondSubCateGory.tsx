/* eslint-disable react-hooks/exhaustive-deps */
import cx from 'classnames';
import { FC, useEffect, useMemo } from 'react';
import { Modal, Col, Row } from 'reactstrap';
import Input from 'components/ui/input/Input';
import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import DetectEsc from 'components/common/modal/DetectEsc';
import SelectUI, { OptionProp } from 'components/ui/select/Select';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { REGEXP_INPUT_NUMBER } from 'constants/regExpValidate.const';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ViqMainCategory } from 'models/api/viq/viq.model';

import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { VIQ_FIELDS_DETAILS } from 'constants/dynamic/vessel-inspection-questionnaires.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './modal.module.scss';
import { VIQSubExtend } from '../table/TableSub';

interface ModalSubCateGoryProps {
  isOpen: boolean;
  title: string;
  data: ViqMainCategory[];
  selectedData?: VIQSubExtend;
  onSubmit: (data, isAdd: boolean, selectedData?: VIQSubExtend) => void;
  toggle?: () => void;
  isEdit?: boolean;
  isAdd?: boolean;
  w?: string | number;
  h?: string | number;
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  mainCategoryName: '',
  subCategoryName: '',
  secondSubCategoryName: '',
  secondSubRefNo: '',
  potentialRiskId: '',
  question: '',
  guidance: '',
};

const ModalSubCateGory: FC<ModalSubCateGoryProps> = ({
  isOpen,
  toggle,
  title,
  isEdit,
  selectedData,
  isAdd,
  onSubmit,
  data,
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
    secondSubCategoryName: yup
      .string()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    secondSubRefNo: yup
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
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchMainName = watch('mainCategoryName');
  const watchSubName = watch('subCategoryName');
  const existSecondSubName = useMemo(() => {
    const dataName = [];
    const dataNo = [];
    const mainCategoryName = getValues('mainCategoryName');
    const subCategoryName = getValues('subCategoryName');

    data.forEach((mainItem) => {
      if (mainItem?.mainCategoryName === mainCategoryName) {
        mainItem?.viqSubCategories?.forEach((subItem) => {
          if (subItem?.id === subCategoryName) {
            subItem?.children?.forEach((item) => {
              dataName.push(item.subCategoryName);
              dataNo.push(item.subRefNo);
            });
          }
        });
      }
    });

    return { dataName, dataNo };
  }, [data, watchMainName, watchSubName]);

  const optionPotentialRick = useMemo(
    () =>
      potentialRisk?.map((item) => ({
        value: item.id,
        label: item.risk,
      })),
    [potentialRisk],
  );

  const optionSub = useMemo(() => {
    const mainName = getValues('mainCategoryName');

    const findMain = data?.find((item) => item.mainCategoryName === mainName);

    return (
      (findMain &&
        findMain?.viqSubCategories?.map((item, index) => ({
          value: item?.id,
          label: item.subCategoryName,
        }))) ||
      []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, getValues, watchMainName, setValue]);

  const optionMainNo: OptionProp[] = useMemo(
    () =>
      data?.map((item, index) => ({
        value: item.mainCategoryName,
        label: item.mainCategoryName,
      })),
    [data],
  );

  const resetForm = () => {
    setValue('mainCategoryName', null);
    setValue('subCategoryName', null);
    setValue('secondSubCategoryName', '');
    setValue('secondSubRefNo', '');
    setValue('potentialRiskId', null);
    setValue('question', '');
    setValue('guidance', '');

    setError('mainCategoryName', { message: '' });
    setError('subCategoryName', { message: '' });
    setError('secondSubCategoryName', { message: '' });
    setError('secondSubRefNo', { message: '' });
    setError('potentialRiskId', { message: '' });
    setError('question', { message: '' });
    // setError('guidance', { message: '' });
  };

  const resetFormNew = () => {
    setValue('secondSubCategoryName', '');
    setValue('secondSubRefNo', '');
    setValue('potentialRiskId', null);
    setValue('question', '');
    setValue('guidance', '');
    setError('mainCategoryName', { message: '' });
    setError('subCategoryName', { message: '' });
    setError('secondSubCategoryName', { message: '' });
    setError('secondSubRefNo', { message: '' });
    setError('potentialRiskId', { message: '' });
    setError('question', { message: '' });
    setError('guidance', { message: '' });
  };

  const handleCancel = () => {
    toggle();
    resetForm();
  };

  const handleSubmitFormNew = (dataForm) => {
    if (
      existSecondSubName.dataNo.includes(dataForm.secondSubRefNo) &&
      dataForm.secondSubRefNo !== selectedData?.subRefNo
    ) {
      return setError('secondSubRefNo', {
        message: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_DETAILS['The second sub reference no is existed'],
        ),
      });
    }

    // if (
    //   existSecondSubName.dataName.includes(dataForm.secondSubCategoryName) &&
    //   dataForm.secondSubCategoryName !== selectedData?.subCategoryName
    // ) {
    //   return setError('secondSubCategoryName', {
    //     message: t('subNameIsExisted'),
    //   });
    // }

    onSubmit(dataForm, isAdd);
    return resetFormNew();
  };

  const handleSubmitForm = (dataForm) => {
    if (
      existSecondSubName.dataNo.includes(dataForm.secondSubRefNo) &&
      dataForm.secondSubRefNo !== selectedData?.subRefNo
    ) {
      return setError('secondSubRefNo', {
        message: renderDynamicLabel(
          dynamicLabels,
          VIQ_FIELDS_DETAILS['The second sub reference no is existed'],
        ),
      });
    }

    // if (
    //   existSecondSubName.dataName.includes(dataForm.secondSubCategoryName) &&
    //   dataForm.secondSubCategoryName !== selectedData?.subCategoryName
    // ) {
    //   return setError('secondSubCategoryName', {
    //     message: t('subNameIsExisted'),
    //   });
    // }
    if (isAdd) {
      onSubmit(dataForm, isAdd);
    } else {
      onSubmit(dataForm, isAdd, selectedData);
    }
    return handleCancel();
  };

  useEffect(() => {
    if (isAdd) {
      setValue('subCategoryName', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchMainName, isAdd]);

  useEffect(() => {
    if (selectedData && !isAdd) {
      setValue('mainCategoryName', selectedData?.mainCategoryName || null);
      setValue('subCategoryName', selectedData?.parentSubName || null);
      setValue('secondSubCategoryName', selectedData?.subCategoryName || '');

      setValue('secondSubRefNo', selectedData?.subRefNo || '');
      setValue('potentialRiskId', selectedData?.potentialRiskId || null);
      setValue('guidance', selectedData?.guidance);
      setValue('question', selectedData?.question);
    } else {
      resetForm();
    }
  }, [selectedData, isAdd, setValue, dispatch]);

  return (
    <Modal
      className={styles.modalWrap}
      modalClassName={styles.wrapper}
      contentClassName={cx(styles.content, styles.contentSecondSub)}
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
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: !isEdit },
                'w-100',
              )}
              messageRequired={errors?.mainCategoryName?.message || null}
              control={control}
              dynamicLabels={dynamicLabels}
            />
          </Col>
        </Row>
        {/* sub selected */}
        <Row className=" mt-4 mx-0">
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
            {isAdd ? (
              <SelectUI
                data={optionSub}
                disabled={!isAdd || !getValues('mainCategoryName')}
                name="subCategoryName"
                className={cx(
                  styles.inputSelect,
                  { [styles.disabledSelect]: !isEdit },
                  'w-100',
                )}
                messageRequired={errors?.subCategoryName?.message || null}
                control={control}
                dynamicLabels={dynamicLabels}
              />
            ) : (
              <SelectUI
                data={optionSub}
                disabled
                // todo now
                value={selectedData?.parentSubName}
                className={cx(
                  styles.inputSelect,
                  { [styles.disabledSelect]: !isEdit },
                  'w-100',
                )}
                dynamicLabels={dynamicLabels}
              />
            )}
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
              VIQ_FIELDS_DETAILS['Second sub reference no.'],
            )}
            <img
              src={images.icons.icRequiredAsterisk}
              alt="required"
              className={cx(styles.requiredImg)}
            />
          </Col>
          <Col md={9} className={cx('pe-0')}>
            <InputForm
              messageRequired={errors?.secondSubRefNo?.message || ''}
              maxLength={20}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['Enter sub reference no.'],
              )}
              patternValidate={REGEXP_INPUT_NUMBER}
              control={control}
              name="secondSubRefNo"
            />
          </Col>
        </Row>
        {/* second sub name */}
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
              VIQ_FIELDS_DETAILS['Second sub category name'],
            )}
            <img
              src={images.icons.icRequiredAsterisk}
              alt="required"
              className={cx(styles.requiredImg)}
            />
          </Col>
          <Col md={9} className={cx('pe-0')}>
            <Input
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              disabledCss={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['Enter second sub category name'],
              )}
              maxLength={128}
              messageRequired={errors?.secondSubCategoryName?.message || ''}
              {...register('secondSubCategoryName')}
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
              disabled={!isEdit}
              name="potentialRiskId"
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              messageRequired={errors?.potentialRiskId?.message || null}
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: !isEdit },
                'w-100',
              )}
              control={control}
              notAllowSortData
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
