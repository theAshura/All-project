import cx from 'classnames';
import moment from 'moment';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import { REGEXP_INPUT_MIN_VALUE_POSITIVE } from 'constants/regExpValidate.const';
import { Col, Row } from 'reactstrap';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMPANY_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/company.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './subscription-package.module.scss';

const SubscriptionPackage = ({
  control,
  setValue,
  disabled,
  errors,
  watch,
  setError,
  dynamicLabels,
}) => {
  const watchStartDate = watch('startDate');

  return (
    <Row>
      <Col xs={12} className="mb-3">
        <p className={cx('fw-bold mb-0', styles.titleForm)}>
          {renderDynamicLabel(
            dynamicLabels,
            COMPANY_DYNAMIC_DETAIL_FIELDS['Subscription package'],
          )}
        </p>
      </Col>
      <Col xs={6} className="mb-3">
        <div className={styles.label}>
          {renderDynamicLabel(
            dynamicLabels,
            COMPANY_DYNAMIC_DETAIL_FIELDS['Total number of users'],
          )}{' '}
          <span className={styles.dotRequired}>*</span>
        </div>
        <InputForm
          className={cx({ [styles.disabledInput]: disabled })}
          control={control}
          type="number"
          maxValue={100000000}
          name="numberOfUser"
          patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
          placeholder={
            disabled
              ? null
              : renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Enter total number of users'],
                )
          }
          isRequired
          disabled={disabled}
          messageRequired={errors?.numberOfUser?.message || ''}
        />
      </Col>
      <Col xs={6} className="mb-3">
        <div className={styles.label}>
          {renderDynamicLabel(
            dynamicLabels,
            COMPANY_DYNAMIC_DETAIL_FIELDS['Total number of jobs'],
          )}{' '}
          <span className={styles.dotRequired}>*</span>
        </div>
        <InputForm
          className={cx({ [styles.disabledInput]: disabled })}
          control={control}
          maxValue={100000000}
          type="number"
          name="numberOfJob"
          patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
          placeholder={
            disabled
              ? null
              : renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Enter total number of jobs'],
                )
          }
          isRequired
          disabled={disabled}
          messageRequired={errors?.numberOfJob?.message || ''}
        />
      </Col>
      <Col xs={6}>
        <div className={styles.label}>
          {renderDynamicLabel(
            dynamicLabels,
            COMPANY_DYNAMIC_DETAIL_FIELDS['Start date'],
          )}
          <span className={styles.dotRequired}>*</span>
        </div>
        <DateTimePicker
          wrapperClassName="w-100"
          className="w-100"
          control={control}
          name="startDate"
          placeholder={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Please select'],
          )}
          maxDate={undefined}
          messageRequired={errors?.startDate?.message || ''}
          disabled={disabled}
          minDate={moment()}
          onChange={(date) => {
            setError('startDate', null);
            setError('endDate', null);
            setValue('startDate', date);
            setValue('endDate', null);
          }}
          isRequired
          inputReadOnly
        />
      </Col>
      <Col xs={6}>
        <div className={styles.label}>
          {renderDynamicLabel(
            dynamicLabels,
            COMPANY_DYNAMIC_DETAIL_FIELDS['End date'],
          )}
          <span className={styles.dotRequired}>*</span>
        </div>
        <DateTimePicker
          wrapperClassName="w-100"
          className="w-100"
          control={control}
          name="endDate"
          placeholder={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Please select'],
          )}
          maxDate={undefined}
          onChange={(date) => {
            setError('endDate', null);
            setValue('endDate', date);
          }}
          messageRequired={errors?.endDate?.message || ''}
          disabled={disabled}
          minDate={watchStartDate || moment()}
          isRequired
          inputReadOnly
        />
      </Col>
    </Row>
  );
};

export default SubscriptionPackage;
