import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_OPTIONAL,
  MAX_LENGTH_TEXT,
} from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import ModalListForm from 'components/react-hook-form/modal-list-form/ModalListForm';
import useEffectOnce from 'hoc/useEffectOnce';
import { getCountryActions } from 'store/user/user.action';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { CREW_GROUPING_FIELDS_DETAILS } from 'constants/dynamic/crew-grouping.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { checkExitCodeApi } from '../utils/api';
import { CrewGrouping } from '../utils/model';
import { createCrewGroupingActions } from '../store/action';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: CrewGrouping;
  isEdit?: boolean;
  isView?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  code: '',
  name: '',
  description: '',
  officers: [],
  rating: [],
  status: 'active',
};

const ModalMaster: FC<ModalProps> = (props) => {
  const { loading, toggle, isOpen, data, isView, handleSubmitForm, isCreate } =
    props;
  const { errorList } = useSelector((state) => state.crewGrouping);
  const dispatch = useDispatch();
  const { listCountry } = useSelector((state) => state.user);

  const modulePage = useMemo((): ModulePage => {
    if (isCreate) {
      return ModulePage.Create;
    }

    return ModulePage.View;
  }, [isCreate]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonCrewGrouping,
    modulePage,
  });

  useEffectOnce(() => {
    dispatch(
      getCountryActions.request({ pageSize: -1, status: 'active', page: 1 }),
    );
  });

  const schema = useMemo(
    () =>
      yup.object().shape({
        code: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        name: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        officers: yup
          .array()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          )
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        rating: yup
          .array()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          )
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    [dynamicLabels],
  );

  const {
    register,
    control,
    reset,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleCancel = useCallback(() => {
    toggle();
    reset();
    clearErrors();
    dispatch(createCrewGroupingActions.failure(null));
  }, [clearErrors, dispatch, reset, toggle]);

  const onSubmitForm = useCallback(
    (formData: CrewGrouping) => handleSubmitForm({ ...formData, reset }),
    [handleSubmitForm, reset],
  );

  const handleSubmitAndNew = useCallback(
    (data: CrewGrouping) => {
      const dataNew: CrewGrouping = { ...data, isNew: true, reset };
      handleSubmitForm(dataNew);
    },
    [handleSubmitForm, reset],
  );

  const muiltiCompanyOptions = useMemo(() => {
    const newData =
      listCountry?.map((item) => ({
        id: item.name,
        name: item.name,
        label: item.name,
      })) || [];

    return newData;
  }, [listCountry]);

  const rowLabelsRatings = useMemo(
    () => [
      {
        label: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_DETAILS.checkbox,
        ),
        id: 'checkbox',
        width: 80,
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_DETAILS.Rating,
        ),
        id: 'name',
        width: 710,
      },
    ],
    [dynamicLabels],
  );

  const rowLabelsOfficers = useMemo(
    () => [
      {
        label: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_DETAILS.checkbox,
        ),
        id: 'checkbox',
        width: 80,
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          CREW_GROUPING_FIELDS_DETAILS.Officers,
        ),
        id: 'name',
        width: 710,
      },
    ],
    [dynamicLabels],
  );

  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (field && value) {
        checkExitCodeApi({
          entity: 'crew-grouping',
          field,
          value,
        })
          .then((res) => {
            if (res.data.isExist) {
              switch (field) {
                case 'code':
                  if (value.trim() !== data?.code) {
                    setError(field, {
                      message: renderDynamicLabel(
                        dynamicLabels,
                        CREW_GROUPING_FIELDS_DETAILS[
                          'The crew grouping code is existed'
                        ],
                      ),
                    });
                  }
                  break;
                case 'name':
                  if (value.trim() !== data?.name) {
                    setError(field, {
                      message: renderDynamicLabel(
                        dynamicLabels,
                        CREW_GROUPING_FIELDS_DETAILS[
                          'The crew grouping name is existed'
                        ],
                      ),
                    });
                  }
                  break;
                default:
                  break;
              }
            }
          })
          .catch((err) => {});
      }
    },
    [data?.code, data?.name, dynamicLabels, setError],
  );

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', {
              message: renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS[
                  'The crew grouping code is existed'
                ],
              ),
            });
            break;
          case 'name':
            setError('name', {
              message: renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS[
                  'The crew grouping name is existed'
                ],
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
      setError('officers', { message: '' });
      setError('rating', { message: '' });
    }
  }, [dynamicLabels, errorList, setError]);

  const renderForm = useMemo(
    () => (
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS['Crew grouping code'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              disabled={isView}
              autoFocus
              isRequired
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS['Enter crew grouping code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
              onBlur={(e: any) => handleCheckExit('code', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS['Crew grouping name'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              {...register('name')}
              isRequired
              disabled={isView}
              messageRequired={errors?.name?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS['Enter crew grouping name'],
              )}
              maxLength={MAX_LENGTH_TEXT}
              onBlur={(e: any) => handleCheckExit('name', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-start" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS.Officers,
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <ModalListForm
              name="officers"
              isRequired
              labelSelect=""
              title={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS.Officers,
              )}
              disable={isView}
              control={control}
              error={errors?.officers?.message || ''}
              data={muiltiCompanyOptions || []}
              rowLabels={rowLabelsOfficers}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              dynamicLabels={dynamicLabels}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-start" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS.Rating,
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <ModalListForm
              name="rating"
              isRequired
              labelSelect=""
              title={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS.Rating,
              )}
              disable={isView}
              control={control}
              error={errors?.rating?.message || ''}
              data={muiltiCompanyOptions || []}
              rowLabels={rowLabelsRatings}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              dynamicLabels={dynamicLabels}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS.Description,
              )}
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              {...register('description')}
              disabled={isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS['Enter description'],
              )}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                CREW_GROUPING_FIELDS_DETAILS.Status,
              )}
            />
          </Col>
          <Col className="px-0 d-flex" md={8} xs={8}>
            <RadioForm
              name="status"
              disabled={isView}
              control={control}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    CREW_GROUPING_FIELDS_DETAILS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    CREW_GROUPING_FIELDS_DETAILS.Inactive,
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    ),
    [
      dynamicLabels,
      isView,
      errors?.code?.message,
      errors?.name?.message,
      errors?.officers?.message,
      errors?.rating?.message,
      register,
      control,
      muiltiCompanyOptions,
      rowLabelsOfficers,
      rowLabelsRatings,
      handleCheckExit,
    ],
  );

  const renderFooter = useMemo(
    () => (
      <div>
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CREW_GROUPING,
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
              dynamicLabels={dynamicLabels}
            />
          )}
        </PermissionCheck>
      </div>
    ),
    [
      dynamicLabels,
      handleCancel,
      handleSubmit,
      handleSubmitAndNew,
      loading,
      onSubmitForm,
    ],
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data?.code || '');
      setValue('name', data?.name || '');
      setValue('rating', data?.rating || []);
      setValue('officers', data?.officers || []);
      setValue('description', data?.description || '');
      setValue('status', data?.status || 'active');
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('officers', []);
      setValue('rating', []);
      setValue('description', '');
      setValue('status', 'active');
    }
  }, [data, setValue]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={renderDynamicLabel(
        dynamicLabels,
        CREW_GROUPING_FIELDS_DETAILS['Crew grouping information'],
      )}
      content={renderForm}
      footer={isView || !isOpen ? null : renderFooter}
    />
  );
};

export default ModalMaster;
