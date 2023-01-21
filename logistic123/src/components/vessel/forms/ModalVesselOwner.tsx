import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { FieldValues, useForm } from 'react-hook-form';
import moment from 'moment';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/ui/input/Input';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { Col, Row } from 'reactstrap';
import CheckBox from 'components/ui/checkbox/Checkbox';
import LabelUI from 'components/ui/label/LabelUI';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { getListSubCompanyApi } from 'api/company.api';
import { toastError } from 'helpers/notification.helper';
import { CompanyType } from 'constants/common.const';
import { VESSEL_DETAIL_DYNAMIC_FIELDS } from 'constants/dynamic/vessel.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { VesselOwners } from 'models/api/vessel/vessel.model';
import {
  TIME_LINE,
  checkTimeLine,
  handleValidateDocChattererVesselOwner,
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
  initialData?: VesselOwners[];
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  vesselOwnerItem: [],
  cimo: '',
  code: '',
  fromDate: null,
  responsiblePartyInspection: false,
  responsiblePartyQA: false,
  remark: '',
};

export const ModalVesselOwner: FC<Props> = ({
  isOpen,
  data,
  handleSubmitForm,
  toggle,
  isEdit,
  listData,
  selectedIndex,
  allowEditHistory,
  dynamicLabels,
  initialData,
}) => {
  const [subCompanyList, setSubCompanyList] = useState([]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        vesselOwnerItem: yup
          .array()
          .nullable()
          .min(
            1,
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
    reset,
    watch,
    control,
    setValue,
    register,
    setError,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const filterCompany = useCallback(
    (company: string) => subCompanyList.filter((e) => e.label === company),
    [subCompanyList],
  );

  const watchOwnerName = watch('vesselOwnerItem');
  const handleGetListSubCompany = useCallback((search?: string) => {
    getListSubCompanyApi({
      pageSize: -1,
      page: 1,
      status: 'active',
      content: search?.trim(),
      type: CompanyType.SHIP_OWNER,
    })
      .then((res) => {
        const dataState =
          res?.data?.map((i) => ({
            value: i.id,
            label: i.name,
            code: i?.code,
            imo: i?.companyIMO,
          })) || [];
        setSubCompanyList(dataState);
      })
      .catch((err) => {
        toastError(err);
      });
  }, []);

  const onSubmitForm = useCallback(
    (bodyData) => {
      const params = {
        id: data?.id || null,
        company: bodyData?.vesselOwnerItem?.[0],
        companyId: bodyData?.vesselOwnerItem?.[0]?.value,
        name: bodyData?.vesselOwnerItem?.[0]?.label,
        code: bodyData?.vesselOwnerItem?.[0]?.code,
        fromDate: moment(bodyData?.fromDate).startOf('day'),
        toDate: bodyData?.toDate,
        cimo: bodyData?.vesselOwnerItem?.[0]?.imo,
        responsiblePartyInspection: bodyData?.responsiblePartyInspection,
        responsiblePartyQA: bodyData?.responsiblePartyQA,
        remark: bodyData?.remark,
      };
      const checkCompanyValidate: {
        dateInvalid: string;
        companyInvalid: string;
      } = handleValidateDocChattererVesselOwner(
        listData,
        params,
        selectedIndex,
        allowEditHistory,
        'Vessel owner',
      );
      if (checkCompanyValidate?.dateInvalid) {
        setError('fromDate', {
          message: checkCompanyValidate?.dateInvalid,
        });
      }
      if (checkCompanyValidate?.companyInvalid) {
        setError('vesselOwnerItem', {
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
      setValue('responsiblePartyInspection', data?.responsiblePartyInspection);
      setValue('fromDate', data?.fromDate ? moment(data?.fromDate) : null);
      setValue('toDate', data?.toDate ? moment(data?.toDate) : null);
      setValue('responsiblePartyQA', data?.responsiblePartyQA);
      setValue('remark', data?.remark);
      setValue(
        'vesselOwnerItem',
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
    if (watchOwnerName) {
      setValue('code', watchOwnerName[0]?.code);
      setValue('cimo', watchOwnerName[0]?.imo);
    }
  }, [setValue, watchOwnerName]);

  const currentTimeLine = useMemo(
    () => checkTimeLine(data?.fromDate, data?.toDate),
    [data?.fromDate, data?.toDate],
  );

  const companyOptions = useMemo(() => {
    if (watchOwnerName?.length) {
      const existDataSelect = subCompanyList?.some(
        (item) => item.id === watchOwnerName?.[0].id,
      );
      if (!existDataSelect) {
        return [watchOwnerName?.[0], ...subCompanyList]?.map((i) => ({
          value: i.id || i.value,
          label: i.name || i.label,
          code: i?.code,
        }));
      }
    }
    return subCompanyList;
  }, [subCompanyList, watchOwnerName]);

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
                VESSEL_DETAIL_DYNAMIC_FIELDS['Owner name'],
              )}
              name="vesselOwnerItem"
              isRequired
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              searchContent={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Owner name'],
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
              messageRequired={errors?.vesselOwnerItem?.message || ''}
              options={companyOptions}
            />
          </Col>
          <Col span={6}>
            <Input
              disabled
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['CIMO number'],
              )}
              {...register('cimo')}
              name="cimo"
            />
          </Col>
        </Row>
        <Row className="pt-4">
          <Col span={6}>
            <Input
              disabled
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Owner code'],
              )}
              {...register('code')}
              name="code"
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
                    disabled={!isEdit}
                    name="responsiblePartyInspection"
                    id="responsiblePartyInspection"
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
      errors?.vesselOwnerItem?.message,
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
        VESSEL_DETAIL_DYNAMIC_FIELDS['Vessel owner information'],
      )}
      content={renderForm()}
      footer={isEdit && renderFooter()}
    />
  );
};
