import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { FieldValues, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/ui/input/Input';
import { Col, Row } from 'reactstrap';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import moment from 'moment';
import CheckBox from 'components/ui/checkbox/Checkbox';
import LabelUI from 'components/ui/label/LabelUI';
import SelectUI from 'components/ui/select/Select';
import { chartererTypeOptions } from 'constants/filter.const';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { getListSubCompanyApi } from 'api/company.api';
import { VesselCharterers } from 'models/api/vessel/vessel.model';
import { CompanyType } from 'constants/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { VESSEL_DETAIL_DYNAMIC_FIELDS } from 'constants/dynamic/vessel.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { toastError } from 'helpers/notification.helper';
import {
  handleValidateDocChattererVesselOwner,
  checkTimeLine,
  TIME_LINE,
  disableDateTimeInPast,
} from './management-ownership/doc-holder/doc.func';
import styles from './form.module.scss';

interface Props {
  isOpen?: boolean;
  toggle?: () => void;
  data?: any;
  handleSubmitForm?: (data) => void;
  isEdit?: boolean;
  listData?: any;
  selectedIndex?: number;
  allowEditHistory?: boolean;
  dynamicLabels?: IDynamicLabel;
  initialData?: VesselCharterers[];
}

const defaultValues = {
  chartererItem: [],
  type: null,
  code: '',
  fromDate: null,
  responsiblePartyInspection: false,
  responsiblePartyQA: false,
  remark: '',
};

export const ModalCharterer: FC<Props> = ({
  isOpen,
  data,
  handleSubmitForm,
  toggle,
  isEdit,
  listData,
  selectedIndex,
  allowEditHistory,
  initialData,
  dynamicLabels,
}) => {
  const [subCompanyList, setSubCompanyList] = useState([]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        chartererItem: yup
          .array()
          .nullable()
          .min(
            1,
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
        fromDate: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    [dynamicLabels],
  );

  const {
    handleSubmit,
    watch,
    control,
    setError,
    reset,
    setValue,
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchChartererName = watch('chartererItem');

  const handleGetListSubCompany = useCallback((search?: string) => {
    getListSubCompanyApi({
      pageSize: -1,
      page: 1,
      status: 'active',
      content: search?.trim(),
      type: CompanyType.CHARTERER,
    })
      .then((res) => {
        const dataState =
          res?.data?.map((i) => ({
            value: i.id,
            label: i.name,
            code: i?.code,
          })) || [];
        setSubCompanyList(dataState);
      })
      .catch((err) => {
        toastError(err);
      });
  }, []);

  const filterCompany = useCallback(
    (company: string) => subCompanyList.filter((e) => e.label === company),
    [subCompanyList],
  );

  const onSubmitForm = useCallback(
    (bodyParams) => {
      const params = {
        id: data?.id || null,
        company: bodyParams?.chartererItem?.[0],
        companyId: bodyParams?.chartererItem?.[0]?.value,
        name: bodyParams?.chartererItem?.[0]?.label,
        code: bodyParams?.chartererItem?.[0]?.code,
        cimo: bodyParams?.chartererItem?.[0]?.imo,
        fromDate: moment(bodyParams?.fromDate).startOf('day'),
        toDate: bodyParams?.toDate,
        type: bodyParams?.type,
        responsiblePartyInspection: bodyParams?.responsiblePartyInspection,
        responsiblePartyQA: bodyParams?.responsiblePartyQA,
        remark: bodyParams?.remark,
      };
      const checkCompanyValidate: {
        dateInvalid: string;
        companyInvalid: string;
      } = handleValidateDocChattererVesselOwner(
        listData,
        params,
        selectedIndex,
        allowEditHistory,
        'Charterer',
      );

      if (checkCompanyValidate?.dateInvalid) {
        setError('fromDate', {
          message: checkCompanyValidate?.dateInvalid,
        });
      }
      if (checkCompanyValidate?.companyInvalid) {
        setError('chartererItem', {
          message: checkCompanyValidate?.companyInvalid,
        });
      }
      if (checkCompanyValidate) {
        return;
      }
      handleSubmitForm(params);
      reset(defaultValues);
    },
    [
      allowEditHistory,
      data?.id,
      handleSubmitForm,
      listData,
      reset,
      selectedIndex,
      setError,
    ],
  );

  const handleCancel = useCallback(() => {
    toggle();
    reset(defaultValues);
  }, [reset, toggle]);

  useEffect(() => {
    if (isOpen) {
      handleGetListSubCompany('');
    }
  }, [handleGetListSubCompany, isOpen]);

  useEffect(() => {
    if (data) {
      setValue('type', data?.type || null);
      setValue('fromDate', data?.fromDate ? moment(data?.fromDate) : null);
      setValue('toDate', data?.toDate ? moment(data?.toDate) : null);
      setValue('responsiblePartyInspection', data?.responsiblePartyInspection);
      setValue('responsiblePartyQA', data?.responsiblePartyQA);
      setValue('remark', data?.remark);
      setValue(
        'chartererItem',
        data?.company
          ? [
              {
                value: data?.company?.id || data?.company?.value,
                label: data?.company?.name || data?.company?.label,
                code: data?.company?.code,
              },
            ]
          : [],
      );
    }
  }, [data, filterCompany, setValue]);

  useEffect(() => {
    if (watchChartererName) {
      setValue('code', watchChartererName[0]?.code);
    }
  }, [setValue, watchChartererName]);

  const currentTimeLine = useMemo(
    () => checkTimeLine(data?.fromDate, data?.toDate),
    [data?.fromDate, data?.toDate],
  );

  const companyOptions = useMemo(() => {
    if (watchChartererName?.length) {
      const existDataSelect = subCompanyList?.some(
        (item) => item.id === watchChartererName?.[0].id,
      );
      if (!existDataSelect) {
        return [watchChartererName?.[0], ...subCompanyList]?.map((i) => ({
          value: i.id || i.value,
          label: i.name || i.label,
          code: i?.code,
        }));
      }
    }
    return subCompanyList;
  }, [subCompanyList, watchChartererName]);

  const disableChecking = useMemo(() => {
    if (!isEdit) {
      return true;
    }
    if (data?.id && currentTimeLine !== TIME_LINE.FUTURE) {
      return true;
    }
    return false;
  }, [currentTimeLine, data?.id, isEdit]);

  const renderForm = useCallback(
    () => (
      <div>
        <Row>
          <Col span={6}>
            <AsyncSelectForm
              disabled={disableChecking}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Charterer name'],
              )}
              name="chartererItem"
              isRequired
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              searchContent={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Enter charterer name'],
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              hasImage
              onChangeSearch={handleGetListSubCompany}
              messageRequired={errors?.chartererItem?.message || ''}
              options={companyOptions}
            />
          </Col>
          <Col span={6}>
            <Input
              disabled
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Charterer code'],
              )}
              {...register('code')}
              name="code"
            />
          </Col>
        </Row>
        <Row className="pt-4">
          <Col span={6}>
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Charterer type'],
              )}
              data={chartererTypeOptions}
              name="type"
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              isRequired
              disabled={disableChecking}
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.type?.message || ''}
            />
          </Col>
          <Col xs={6}>
            <DateTimePicker
              disabled={disableChecking}
              messageRequired={errors?.fromDate?.message || ''}
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['From date'],
              )}
              isRequired
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              control={control}
              className={cx('w-100', styles.disabledDatePicker)}
              disabledDate={(date) => disableDateTimeInPast(date, initialData)}
              name="fromDate"
              id="fromDate"
              inputReadOnly
            />
          </Col>
        </Row>
        <Row className="pt-4">
          <Col span={6}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Responsible party'],
              )}
            />
            <Row className="mx-0 pt-2">
              <Col span={6} className="ps-0">
                <div className={styles.wrapCheckbox}>
                  <CheckBox
                    name="responsiblePartyInspection"
                    id="responsiblePartyInspection"
                    disabled={!isEdit}
                    {...register('responsiblePartyInspection')}
                  />
                  <div className={styles.name}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS.Inspection,
                    )}
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.wrapCheckbox}>
                  <CheckBox
                    name="responsiblePartyQA"
                    id="responsiblePartyQA"
                    {...register('responsiblePartyQA')}
                    disabled={!isEdit}
                  />
                  <div className={styles.name}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS.QA,
                    )}
                  </div>
                </div>
              </Col>
              <Col className="pe-0" />
            </Row>
          </Col>
        </Row>
        <Row className="pt-4">
          <Col span={12}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS.Remark,
              )}
            />
            <TextAreaForm
              disabled={!isEdit}
              control={control}
              minRows={3}
              placeholder={
                isEdit
                  ? renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['Enter remark'],
                    )
                  : ''
              }
              name="remark"
              maxLength={500}
            />
          </Col>
        </Row>
      </div>
    ),
    [
      disableChecking,
      dynamicLabels,
      control,
      handleGetListSubCompany,
      errors?.chartererItem?.message,
      errors?.type?.message,
      errors?.fromDate?.message,
      companyOptions,
      register,
      isEdit,
      initialData,
    ],
  );

  const renderFooter = useCallback(
    () => (
      <div>
        <GroupButton
          className={cx('mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.PrimaryLight}
          handleCancel={handleCancel}
          dynamicLabels={dynamicLabels}
          handleSubmit={handleSubmit(onSubmitForm)}
        />
      </div>
    ),
    [dynamicLabels, handleCancel, handleSubmit, onSubmitForm],
  );

  return (
    <ModalComponent
      isOpen={isOpen}
      toggle={() => {
        toggle();
        reset(defaultValues);
      }}
      title={renderDynamicLabel(
        dynamicLabels,
        VESSEL_DETAIL_DYNAMIC_FIELDS['Charterer information'],
      )}
      content={renderForm()}
      footer={isEdit && renderFooter()}
    />
  );
};
