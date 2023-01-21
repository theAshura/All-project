import { FC, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectUI from 'components/ui/select/Select';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import {
  CreateInspectorTimeOffParams,
  InspectorTimeOff,
} from 'models/api/inspector-time-off/inspector-time-off.model';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { GroupButton } from 'components/ui/button/GroupButton';
import { MAX_LENGTH_NAME, MAX_LENGTH_OPTIONAL } from 'constants/common.const';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import moment, { Moment } from 'moment';
import { RoleScope } from 'constants/roleAndPermission.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './modal-time-off.module.scss';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  data?: InspectorTimeOff;
  loading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ContentTimeOff: FC<ModalProps> = (props) => {
  const { loading, toggle, data, handleSubmitForm, dynamicLabels } = props;
  const { errorList } = useSelector((state) => state.inspectorTimeOff);
  const { listUser } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.authenticate);

  const defaultValues = useMemo(
    () => ({
      offUserId: userInfo?.id,
      type: '',
      description: '',
      startDate: '',
      endDate: '',
      duration: '',
    }),
    [userInfo?.id],
  );

  const { t } = useTranslation([
    I18nNamespace.INSPECTOR_TIME_OFF,
    I18nNamespace.COMMON,
  ]);

  const schema = yup.object().shape({
    offUserId: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    type: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    startDate: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    endDate: yup
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

    listOption?.push({
      label: `${userInfo.firstName} ${userInfo.lastName}`,
      value: userInfo?.id,
    });
    return listOption;
  }, [listUser?.data, userInfo]);

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
      startDate: watchStartDate?.startOf('day').toISOString(),
      endDate: watchEndDate.endOf('day').toISOString(),
      duration: watchEndDate.diff(watchStartDate, 'days') + 1,
    };
    handleSubmitForm({ ...params, resetForm });
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

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0">
          <Col className="p-0 pe-3" span={12}>
            <SelectUI
              data={listUserOption || []}
              disabled={disableSelectUser}
              isRequired
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['User name'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              name="offUserId"
              className={cx('w-100')}
              messageRequired={errors?.offUserId?.message || null}
              control={control}
            />
          </Col>
          <Col className="p-0 ps-3" span={12}>
            <Input
              {...register('type')}
              disabled={loading}
              isRequired
              messageRequired={errors?.type?.message || null}
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Time off type'],
              )}
              maxLength={MAX_LENGTH_NAME}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Enter time off type'],
              )}
            />
          </Col>
        </Row>
        <Input
          {...register('description')}
          disabled={loading}
          styleLabel="pt-2"
          label={renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS.Description,
          )}
          messageRequired={errors?.description?.message || ''}
          maxLength={MAX_LENGTH_OPTIONAL}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS['Enter description'],
          )}
        />
        <Row className="pt-2 mx-0">
          <Col className="p-0 pe-3" span={12}>
            <DateTimePicker
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Start date'],
              )}
              className="w-100"
              isRequired
              minDate={moment()}
              maxDate={watchEndDate}
              control={control}
              name="startDate"
              id="startDate"
              messageRequired={errors?.startDate?.message || ''}
              inputReadOnly
            />
          </Col>
          <Col className="p-0 ps-3" span={12}>
            <DateTimePicker
              className="w-100"
              isRequired
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['End date'],
              )}
              minDate={watchStartDate || moment()}
              control={control}
              name="endDate"
              id="endDate"
              messageRequired={errors?.endDate?.message || ''}
              inputReadOnly
            />
          </Col>
        </Row>
        <Input
          value={
            watchEndDate && watchStartDate
              ? `${watchEndDate.diff(watchStartDate, 'days') + 1} days`
              : ''
          }
          disabled
          styleLabel="pt-2"
          label={renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS.Duration,
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
          disable={loading}
          dynamicLabels={dynamicLabels}
        />
      </div>
    </>
  );

  useEffect(() => {
    if (data && userInfo) {
      setValue('offUserId', data?.offUserId || '');
      setValue('type', data?.type);
      setValue('description', data?.description);
      setValue('startDate', moment(data?.startDate));
      setValue('endDate', moment(data?.endDate));
    } else {
      resetForm();
    }
  }, [data, resetForm, setValue, userInfo]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'offUserId':
            setError('offUserId', {
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
  }, [clearErrors, errorList, setError, t]);

  return (
    <>
      <div className="">{renderForm()}</div>{' '}
      <div className="pt-4">{renderFooter()}</div>
    </>
  );
};

export default ContentTimeOff;
