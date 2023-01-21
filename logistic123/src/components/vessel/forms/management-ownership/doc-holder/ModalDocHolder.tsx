import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { FieldValues, useForm } from 'react-hook-form';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/ui/input/Input';
import { Col, Row } from 'reactstrap';
import moment from 'moment';
import { VesselDocHolder } from 'models/api/vessel/vessel.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { VESSEL_DETAIL_DYNAMIC_FIELDS } from 'constants/dynamic/vessel.const';
import CheckBox from 'components/ui/checkbox/Checkbox';
import { CompanyType } from 'constants/common.const';
import LabelUI from 'components/ui/label/LabelUI';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { getListSubCompanyApi } from 'api/company.api';
import { toastError } from 'helpers/notification.helper';
import styles from '../../form.module.scss';
import {
  checkTimeLine,
  TIME_LINE,
  handleValidateDocChattererVesselOwner,
  disableDateTimeInPast,
} from './doc.func';

interface Props {
  isOpen?: boolean;
  toggle?: () => void;
  data?: any;
  handleSubmitForm?: (data) => void;
  isEdit?: boolean;
  docHolders?: any;
  selectedIndex?: any;
  allowEditHistory?: boolean;
  initialData?: VesselDocHolder[];
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  docHolderItem: [],
  cimo: '',
  docHolderCode: '',
  fromDate: null,
  responsiblePartyInspection: false,
  responsiblePartyQA: false,
  remark: '',
};

const ModalDocHolder: FC<Props> = ({
  isOpen,
  data,
  handleSubmitForm,
  toggle,
  isEdit,
  docHolders,
  selectedIndex,
  allowEditHistory,
  initialData,
  dynamicLabels,
}) => {
  const [subCompanyList, setSubCompanyList] = useState([]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        docHolderItem: yup
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
    setError,
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchDoc = watch('docHolderItem');

  const handleGetListSubCompany = useCallback((search?: string) => {
    getListSubCompanyApi({
      pageSize: -1,
      page: 1,
      status: 'active',
      content: search?.trim(),
      type: CompanyType.SHIP_MAGEMENT,
    })
      .then((res) => {
        const dataState =
          res?.data?.map((i) => ({
            value: i.id,
            label: i.name,
            code: i?.code,
            cimo: i?.companyIMO,
          })) || [];
        setSubCompanyList(dataState);
      })
      .catch((err) => {
        toastError(err);
      });
  }, []);

  const onSubmitForm = useCallback(
    (bodyParams) => {
      const params = {
        id: data?.id || null,
        company: bodyParams?.docHolderItem?.[0],
        companyId: bodyParams?.docHolderItem?.[0]?.value,
        name: bodyParams?.docHolderItem?.[0]?.label,
        code: bodyParams?.docHolderItem?.[0]?.code,
        cimo: bodyParams?.docHolderItem?.[0]?.cimo,
        fromDate: moment(bodyParams?.fromDate).startOf('day'),
        toDate: bodyParams?.toDate,
        responsiblePartyInspection: bodyParams?.responsiblePartyInspection,
        responsiblePartyQA: bodyParams?.responsiblePartyQA,
        remark: bodyParams?.remark,
      };

      const checkCompanyValidate: {
        dateInvalid: string;
        companyInvalid: string;
      } = handleValidateDocChattererVesselOwner(
        docHolders,
        params,
        selectedIndex,
        allowEditHistory,
      );
      if (checkCompanyValidate?.dateInvalid) {
        setError('fromDate', {
          message: checkCompanyValidate?.dateInvalid,
        });
      }
      if (checkCompanyValidate?.companyInvalid) {
        setError('docHolderItem', {
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
      docHolders,
      handleSubmitForm,
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
  }, [data?.companyId, handleGetListSubCompany, isOpen]);

  useEffect(() => {
    if (data) {
      setValue('responsiblePartyInspection', data?.responsiblePartyInspection);
      setValue('responsiblePartyQA', data?.responsiblePartyQA);
      setValue('fromDate', data?.fromDate ? moment(data?.fromDate) : null);
      setValue('toDate', data?.toDate ? moment(data?.toDate) : null);
      setValue('remark', data?.remark);
      setValue(
        'docHolderItem',
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
  }, [data, setValue]);

  useEffect(() => {
    if (watchDoc) {
      setValue('cimo', watchDoc[0]?.cimo);
      setValue('docHolderCode', watchDoc[0]?.code);
    }
  }, [setValue, watchDoc]);

  const currentTimeLine = useMemo(
    () => checkTimeLine(data?.fromDate, data?.toDate),
    [data?.fromDate, data?.toDate],
  );
  const disableDocAndFromDate = useMemo(() => {
    if (!isEdit) {
      return true;
    }
    if (data?.id && currentTimeLine !== TIME_LINE.FUTURE) {
      return true;
    }
    return false;
  }, [currentTimeLine, data?.id, isEdit]);

  const companyOptions = useMemo(() => {
    if (watchDoc?.length) {
      const existDataSelect = subCompanyList?.some(
        (item) => item.id === watchDoc?.[0].id,
      );
      if (!existDataSelect) {
        return [watchDoc?.[0], ...subCompanyList]?.map((i) => ({
          value: i.id || i.value,
          label: i.name || i.label,
          code: i?.code,
        }));
      }
    }
    return subCompanyList;
  }, [subCompanyList, watchDoc]);

  const renderForm = useCallback(
    () => (
      <div>
        <Row>
          <Col xs={6}>
            <AsyncSelectForm
              disabled={disableDocAndFromDate}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['DOC holder name'],
              )}
              name="docHolderItem"
              isRequired
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              searchContent={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['DOC holder name'],
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
              messageRequired={errors?.docHolderItem?.message || ''}
              options={companyOptions}
            />
          </Col>
          <Col xs={6}>
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
          <Col xs={6}>
            <Input
              disabled
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['DOC holder code'],
              )}
              {...register('docHolderCode')}
              name="docHolderCode"
            />
          </Col>
          <Col xs={6}>
            <DateTimePicker
              disabled={disableDocAndFromDate}
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
              // minDate={moment()}
              disabledDate={(date) => disableDateTimeInPast(date, initialData)}
              name="fromDate"
              id="fromDate"
              inputReadOnly
            />
          </Col>
        </Row>
        <Row className="pt-4">
          <Col xs={6}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Responsible party'],
              )}
            />
            <Row className="mx-0 pt-2">
              <Col xs={4} className="ps-0">
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
              <Col xs={4}>
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
            </Row>
          </Col>
        </Row>
        <Row className="pt-4">
          <Col xs={12}>
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
      disableDocAndFromDate,
      dynamicLabels,
      control,
      handleGetListSubCompany,
      errors?.docHolderItem?.message,
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
          dynamicLabels={dynamicLabels}
          handleCancel={handleCancel}
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
        VESSEL_DETAIL_DYNAMIC_FIELDS['DOC holder information'],
      )}
      content={renderForm()}
      footer={isEdit && renderFooter()}
    />
  );
};

export default ModalDocHolder;
