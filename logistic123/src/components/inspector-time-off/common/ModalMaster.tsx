import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectUI from 'components/ui/select/Select';

import {
  CreateInspectorTimeOffParams,
  InspectorTimeOff,
} from 'models/api/inspector-time-off/inspector-time-off.model';
import { useSelector, useDispatch } from 'react-redux';
import { GroupButton } from 'components/ui/button/GroupButton';
import {
  FORMAT_DATE_YEAR,
  MAX_LENGTH_NAME,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import moment, { Moment } from 'moment';
import { getListUserActions } from 'store/user/user.action';
import { RoleScope } from 'constants/roleAndPermission.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { TIME_OFF_MANAGEMENT_FIELDS_DETAILS } from 'constants/dynamic/time-off-management.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './modal-master.module.scss';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: InspectorTimeOff;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const ModalMaster: FC<ModalProps> = (props) => {
  const { loading, toggle, isOpen, data, handleSubmitForm, isView } = props;
  const { errorList } = useSelector((state) => state.inspectorTimeOff);
  const { listUser } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.authenticate);

  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      offUserId: userInfo?.id,
      offUserUsername: '',
      type: '',
      description: '',
      startDate: '',
      endDate: '',
      duration: '',
    }),
    [userInfo?.id],
  );

  const modulePage = useMemo((): ModulePage => {
    if (isView) {
      return ModulePage.View;
    }

    return ModulePage.Create;
  }, [isView]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionInspectorTimeOff,
    modulePage,
  });

  const schema = yup.object().shape({
    offUserUsername: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_DETAILS['This field is required'],
        ),
      ),
    type: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_DETAILS['This field is required'],
        ),
      ),
    startDate: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_DETAILS['This field is required'],
        ),
      ),
    endDate: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          TIME_OFF_MANAGEMENT_FIELDS_DETAILS['This field is required'],
        ),
      ),
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchStartDate: Moment = watch('startDate');
  const watchEndDate: Moment = watch('endDate');

  const listUserOption = useMemo(() => {
    const listOption =
      listUser?.data?.map((item) => ({
        label: `${item.firstName} ${item.lastName}`,
        value: item.id,
      })) || [];
    return listOption;
  }, [listUser?.data]);

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleCancel = () => {
    toggle();
    resetForm();
  };

  const onSubmitForm = (formData) => {
    const params: CreateInspectorTimeOffParams = {
      ...formData,
      startDate: watchStartDate.startOf('day').toISOString(),
      endDate: watchEndDate.endOf('day').toISOString(),
      duration: watchEndDate.diff(watchStartDate, 'days') + 1,
    };

    handleSubmitForm({ ...params, resetForm });
  };

  const handleSubmitAndNew = (data) => {
    const params: CreateInspectorTimeOffParams = {
      ...data,
      startDate: watchStartDate.startOf('day').toISOString(),
      endDate: watchEndDate.endOf('day').toISOString(),
      duration: watchEndDate.diff(watchStartDate, 'days') + 1,
    };
    handleSubmitForm({ ...params, isNew: true, resetForm });
  };

  const disableSelectUser = useMemo(() => {
    if (loading) return true;
    // TODO : not is ADMIN
    if (userInfo?.roleScope !== RoleScope.Admin) return true;
    // TODO : is ADMIN but not is create user
    if (
      userInfo?.roleScope === RoleScope.Admin &&
      userInfo?.id !== data?.createdUserId &&
      !!data
    ) {
      return true;
    }
    return false;
  }, [data, loading, userInfo?.id, userInfo?.roleScope]);

  const durationDay: Number = useMemo(
    () =>
      watchEndDate && watchStartDate
        ? watchEndDate.diff(watchStartDate, 'days') + 1
        : 0,
    [watchEndDate, watchStartDate],
  );

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0">
          <Col className="p-0 pe-3" span={12}>
            <SelectUI
              data={listUserOption || []}
              disabled={disableSelectUser || isView}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                TIME_OFF_MANAGEMENT_FIELDS_DETAILS.Username,
              )}
              name="offUserUsername"
              className={cx('w-100')}
              messageRequired={errors?.offUserId?.message || null}
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
          <Col className="p-0 ps-3" span={12}>
            <Input
              {...register('type')}
              disabled={loading || isView}
              isRequired
              messageRequired={errors?.type?.message || null}
              label={renderDynamicLabel(
                dynamicLabels,
                TIME_OFF_MANAGEMENT_FIELDS_DETAILS['Time off type'],
              )}
              maxLength={MAX_LENGTH_NAME}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                TIME_OFF_MANAGEMENT_FIELDS_DETAILS['Enter time off type'],
              )}
            />
          </Col>
        </Row>
        <Input
          {...register('description')}
          disabled={loading || isView}
          styleLabel="pt-2"
          label={renderDynamicLabel(
            dynamicLabels,
            TIME_OFF_MANAGEMENT_FIELDS_DETAILS.Description,
          )}
          maxLength={MAX_LENGTH_OPTIONAL}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            TIME_OFF_MANAGEMENT_FIELDS_DETAILS['Enter description'],
          )}
        />
        <Row className="pt-2 mx-0">
          <Col className="p-0 pe-3" span={12}>
            <DateTimePicker
              label={renderDynamicLabel(
                dynamicLabels,
                TIME_OFF_MANAGEMENT_FIELDS_DETAILS['Start date'],
              )}
              className="w-100"
              isRequired
              disabled={isView}
              minDate={moment()}
              maxDate={watchEndDate}
              control={control}
              name="startDate"
              id="startDate"
              messageRequired={errors?.startDate?.message || ''}
              inputReadOnly
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
          <Col className="p-0 ps-3" span={12}>
            <DateTimePicker
              className="w-100"
              isRequired
              disabled={isView}
              label={renderDynamicLabel(
                dynamicLabels,
                TIME_OFF_MANAGEMENT_FIELDS_DETAILS['End date'],
              )}
              minDate={watchStartDate || moment()}
              control={control}
              name="endDate"
              id="endDate"
              messageRequired={errors?.endDate?.message || ''}
              inputReadOnly
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
        </Row>
        <Input
          value={
            // eslint-disable-next-line no-nested-ternary
            durationDay
              ? durationDay > 1
                ? `${durationDay} days`
                : '1 day'
              : ''
          }
          disabled
          styleLabel="pt-2"
          label={renderDynamicLabel(
            dynamicLabels,
            TIME_OFF_MANAGEMENT_FIELDS_DETAILS.Duration,
          )}
          className={styles.inputDisable}
        />
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
          handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
          disable={loading || isView}
          dynamicLabels={dynamicLabels}
        />
      </div>
    </>
  );

  // effect

  useEffect(() => {
    dispatch(getListUserActions.request({ pageSize: -1 }));
  }, [dispatch]);

  useEffect(() => {
    if (data && userInfo) {
      setValue('offUserId', data?.offUserId || '');
      setValue('offUserUsername', data?.offUserUsername);
      setValue('type', data?.type);
      setValue('description', data?.description);
      setValue('startDate', moment(data?.startDate, FORMAT_DATE_YEAR));
      setValue('endDate', moment(data?.endDate, FORMAT_DATE_YEAR));
    } else {
      resetForm();
    }
  }, [data, resetForm, setValue, userInfo]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'offUserUsername':
            setError('offUserUsername', {
              message: item.message,
            });
            break;
          case 'type':
            setError('type', { message: item.message });
            break;
          case 'startDate':
            setError('startDate', { message: item.message });
            break;
          case 'endDate':
            setError('endDate', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      clearErrors();
    }
  }, [clearErrors, errorList, setError]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={renderDynamicLabel(
        dynamicLabels,
        TIME_OFF_MANAGEMENT_FIELDS_DETAILS['Time off information'],
      )}
      content={renderForm()}
      footer={!isView && renderFooter()}
    />
  );
};

export default ModalMaster;
