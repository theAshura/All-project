import { FC, ReactNode, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_NAME,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import { CharterOwner } from 'models/api/charter-owner/charter-owner.model';
import { RankMaster } from 'models/api/rank-master/rank-master.model';
import { createRankMasterActions } from 'store/rank-master/rank-master.action';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { RANK_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/rank.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface ModalRankProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: RankMaster;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const ModalRank: FC<ModalRankProps> = (props) => {
  const {
    loading,
    toggle,
    title,
    isOpen,
    data,
    handleSubmitForm,
    isView,
    isCreate = false,
  } = props;
  const { errorList } = useSelector((state) => state.rankMaster);
  const defaultValues = {
    code: '',
    name: '',
    description: '',
    status: 'active',
    type: 'shore',
  };

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionRank,
    modulePage: getCurrentModulePageByStatus(!isView, isCreate),
  });

  const schema = yup.object().shape({
    code: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    name: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });
  const dispatch = useDispatch();

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

  const handleCancel = () => {
    toggle();
    reset(defaultValues);
    dispatch(createRankMasterActions.failure(null));
  };
  const resetForm = () => {
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('status', 'active');
    setValue('type', 'shore');
  };

  const onSubmitForm = (formData: CharterOwner) =>
    handleSubmitForm({ ...formData, resetForm });

  const handleSubmitAndNew = (data: CharterOwner) => {
    const dataNew: CharterOwner = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS.Type,
              )}
            />
          </Col>
          <Col className="px-0 d-flex" md={9} xs={9}>
            <RadioForm
              name="type"
              control={control}
              disabled={isView}
              radioOptions={[
                {
                  value: 'shore',
                  label: renderDynamicLabel(
                    dynamicFields,
                    RANK_DYNAMIC_DETAIL_FIELDS.Shore,
                  ),
                },
                {
                  value: 'ship',
                  label: renderDynamicLabel(
                    dynamicFields,
                    RANK_DYNAMIC_DETAIL_FIELDS.Ship,
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-self-start" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['Rank code'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              disabled={loading || isView}
              autoFocus
              isRequired
              placeholder={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['Enter rank code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-self-start" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['Rank name'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('name')}
              isRequired
              disabled={loading || isView}
              messageRequired={errors?.name?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['Enter rank name'],
              )}
              maxLength={MAX_LENGTH_NAME}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-self-start" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS.Description,
              )}
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('description')}
              disabled={loading || isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['Enter description'],
              )}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS.Status,
              )}
            />
          </Col>
          <Col className="px-0 d-flex" md={9} xs={9}>
            <RadioForm
              name="status"
              control={control}
              disabled={isView}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicFields,
                    RANK_DYNAMIC_DETAIL_FIELDS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicFields,
                    RANK_DYNAMIC_DETAIL_FIELDS.Inactive,
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className="mt-1 justify-content-end"
          handleCancel={() => {
            handleCancel();
          }}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
          disable={loading || isView}
          txButtonLeft={renderDynamicLabel(
            dynamicFields,
            RANK_DYNAMIC_DETAIL_FIELDS.Cancel,
          )}
          txButtonBetween={renderDynamicLabel(
            dynamicFields,
            RANK_DYNAMIC_DETAIL_FIELDS.Save,
          )}
          txButtonRight={renderDynamicLabel(
            dynamicFields,
            RANK_DYNAMIC_DETAIL_FIELDS['Save & New'],
          )}
        />
      </div>
    </>
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
      setValue('type', data?.type?.toLowerCase());
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('description', '');
      setValue('status', 'active');
      setValue('type', 'shore');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', {
              message: renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['The rank code is existed'],
              ),
            });
            break;
          case 'name':
            setError('name', {
              message: renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['The rank name is existed'],
              ),
            });
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

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      footer={!isView && renderFooter()}
    />
  );
};

export default ModalRank;
