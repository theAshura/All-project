/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from '@hookform/resolvers/yup';
import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import cx from 'classnames';
import DetectEsc from 'components/common/modal/DetectEsc';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { GroupButton } from 'components/ui/button/GroupButton';
import Checkbox from 'components/ui/checkbox/Checkbox';
import Input from 'components/ui/input/Input';
import LabelUI from 'components/ui/label/LabelUI';
import ModalComponent from 'components/ui/modal/Modal';
import SelectUI from 'components/ui/select/Select';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { FC, useCallback, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Col, ModalProps, Row } from 'reactstrap';
import * as yup from 'yup';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { checkExitCodeApi } from 'pages/cargo/utils/api';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/companyType.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import {
  createCompanyTypeApiRequest,
  updateCompanyTypeActionsApi,
} from '../utils/api';
import { CompanyType } from '../utils/model';
import styles from './modal-form-division.module.scss';

export enum CompanyTypeEnum {
  CONSUMER = 'Consumer',
  PROVIDER = 'Provider',
  MAIN = 'Main',
  EXTERNAL = 'External',
}

const schema = yup.object().shape({
  industry: yup.string().nullable().trim().required('This field is required'),
  industryCode: yup
    .string()
    .nullable()
    .trim()
    .required('This field is required'),
  status: yup.string().nullable().trim().required('This field is required'),
  companyType: yup
    .string()
    .nullable()
    .trim()
    .required('This field is required'),
  actors: yup.array().min(1, 'This field is required'),
});

const defaultValues = {
  industry: 'Maritime',
  industryCode: '',
  status: 'active',
  companyType: '',
  actors: [],
};

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleGetList: () => void;
  dataSelected?: string;
  clearData: () => void;
  viewMode?: boolean;
}

const ModalFormDivision: FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  classesName,
  modalClassName,
  contentClassName,
  dataSelected,
  handleGetList,
  viewMode,
  clearData,
  ...other
}) => {
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    // getValues,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.GroupCompanyCompanyType,
    modulePage: getCurrentModulePageByStatus(
      !!(!viewMode && dataSelected),
      !!(!viewMode && !dataSelected),
    ),
  });

  const { listData } = useSelector((state) => state.companyType);
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState<CompanyType>();

  const watchActors = watch('actors');
  const onCloseAndClearData = useCallback(() => {
    onClose();
    reset(defaultValues);
  }, [onClose, reset]);

  useEffect(() => {
    if (dataSelected) {
      const dataDetailCPT = listData?.data?.find(
        (item) => item.id === dataSelected,
      );
      if (dataDetailCPT) {
        setDataDetail(dataDetailCPT);
        setValue('industry', dataDetailCPT.industry || '');
        setValue('industryCode', dataDetailCPT.industryCode || '');
        setValue('status', dataDetailCPT.status || '');
        setValue('companyType', dataDetailCPT.companyType || '');
        setValue('actors', dataDetailCPT.actors || '');
      }
    }
  }, [dataSelected, listData?.data, setValue]);

  const handleErrors = useCallback(
    (errorList) => {
      if (errorList?.length) {
        setError(errorList?.[0]?.fieldName, {
          message: errorList?.[0]?.message,
        });
      }
    },
    [setError],
  );
  const errFunction = (err) => {
    if (watchActors?.length === 0) {
      setError('actors', {
        message: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      });
    }
  };

  const onSubmitForm = useCallback(
    (values) => {
      if (watchActors?.length === 0) {
        setError('actors', {
          message: renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        });
        return null;
      }
      setLoading(true);
      if (dataSelected) {
        updateCompanyTypeActionsApi({
          ...values,
          id: dataSelected,
        })
          .then((res) => {
            toastSuccess('Update company type successfully');
            handleGetList();
            setLoading(false);
            if (values?.mode === 'SaveAndNew') {
              setDataDetail(null);
              reset(defaultValues);
              clearData();
            } else {
              onCloseAndClearData();
            }
          })
          .catch((err) => {
            handleErrors(err?.errorList || []);
            toastError(err);
            setLoading(false);
          });
        return null;
      }
      createCompanyTypeApiRequest(values)
        .then((res) => {
          toastSuccess('Create company type successfully');
          handleGetList();
          if (values?.mode === 'SaveAndNew') {
            setDataDetail(null);
            reset(defaultValues);
            clearData();
          } else {
            onCloseAndClearData();
          }
          setLoading(false);
        })
        .catch((err) => {
          handleErrors(err?.errorList || []);
          setLoading(false);
        });
      return null;
    },
    [
      clearData,
      dataSelected,
      dynamicLabels,
      handleErrors,
      handleGetList,
      onCloseAndClearData,
      reset,
      setError,
      watchActors?.length,
    ],
  );

  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (field && value) {
        checkExitCodeApi({
          entity: 'company-type',
          field,
          value,
        })
          .then((res) => {
            if (res.data.isExist) {
              switch (field) {
                case 'industryCode':
                  if (value.trim() !== dataDetail?.industryCode) {
                    setError(field, {
                      message: renderDynamicLabel(
                        dynamicLabels,
                        COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS[
                          'The industry code is existed'
                        ],
                      ),
                    });
                  }
                  break;
                case 'companyType':
                  if (value.trim() !== dataDetail?.companyType) {
                    setError(field, {
                      message: renderDynamicLabel(
                        dynamicLabels,
                        COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS[
                          'The company type is existed'
                        ],
                      ),
                    });
                  }
                  break;
                default:
                  setError(field, { message: '' });
                  break;
              }
            }
          })
          .catch((err) => {
            setError(field, { message: '' });
          });
      }
    },
    [
      dataDetail?.companyType,
      dataDetail?.industryCode,
      dynamicLabels,
      setError,
    ],
  );

  const onChangeService = useCallback(
    (value: string) => {
      if (watchActors?.some((i) => i === value)) {
        setValue(
          'actors',
          watchActors?.filter((i) => i !== value),
        );
      } else {
        setValue('actors', watchActors?.concat(value));
      }
    },
    [setValue, watchActors],
  );

  const renderForm = () => (
    <>
      <DetectEsc close={onCloseAndClearData} />
      <div>
        <Row className="pt-2 mx-0">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS.Industry,
              )}
            />
          </Col>
          <Col className="px-0 pb-3" md={9} xs={9}>
            <SelectUI
              data={[
                {
                  value: 'Maritime',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS.Maritime,
                  ),
                },
                // { value: 'Non-maritime', label: 'Non-maritime' },
              ]}
              name="industry"
              messageRequired={errors?.industry?.message || ''}
              isRequired
              disabled
              className={cx('w-100')}
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS['Industry code'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0 pb-3" md={9} xs={9}>
            <Input
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS['Enter industry code'],
              )}
              isRequired
              disabled={viewMode || loading}
              {...register('industryCode')}
              maxLength={20}
              messageRequired={errors?.industryCode?.message || ''}
              onBlur={(e: any) =>
                handleCheckExit('industryCode', e.target.value)
              }
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS['Company type'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0 pb-3" md={9} xs={9}>
            <Input
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS['Enter company type'],
              )}
              isRequired
              disabled={viewMode || loading}
              {...register('companyType')}
              maxLength={128}
              messageRequired={errors?.companyType?.message || ''}
              onBlur={(e: any) =>
                handleCheckExit('companyType', e.target.value)
              }
            />
          </Col>
        </Row>
        <Row className={cx('mt-2 mx-0', styles.rowCheckBoxLabel)}>
          <Col className="ps-0 d-flex align-items-center justify-content-center">
            <div>
              <span>
                {renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS.Consumer,
                )}
              </span>
              <Tooltip
                placement="topLeft"
                title={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS[
                    'Inspection/Service allowed subscriptions'
                  ],
                )}
                color="#fffff"
              >
                <img
                  src={images.icons.icInfoCircleBlue}
                  alt="icInfoCircle"
                  className={styles.infoIcon}
                />
              </Tooltip>
            </div>
          </Col>
          <Col
            className={cx(
              'ps-0 d-flex align-items-center justify-content-center',
              styles.borderRowCheckBox,
            )}
          >
            <div>
              <span>
                {renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS.Provider,
                )}
              </span>
              <Tooltip
                placement="topLeft"
                title={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS[
                    'Inspection/Service allowed subscriptions'
                  ],
                )}
                color="#fffff"
              >
                <img
                  src={images.icons.icInfoCircleBlue}
                  alt="icInfoCircle"
                  className={styles.infoIcon}
                />
              </Tooltip>
            </div>
          </Col>
          <Col className="ps-0 d-flex align-items-center justify-content-center">
            <div>
              <span>
                {renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS.Main,
                )}
              </span>
              <Tooltip
                placement="topLeft"
                title={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS[
                    'QA allowed subscriptions'
                  ],
                )}
                color="#fffff"
              >
                <img
                  src={images.icons.icInfoCircleBlue}
                  alt="icInfoCircle"
                  className={styles.infoIcon}
                />
              </Tooltip>
            </div>
          </Col>
          <Col className="ps-0 d-flex align-items-center justify-content-center">
            <div>
              <span>
                {renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS.External,
                )}
              </span>
              <Tooltip
                placement="topLeft"
                title={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS[
                    'QA allowed subscriptions'
                  ],
                )}
                color="#fffff"
              >
                <img
                  src={images.icons.icInfoCircleBlue}
                  alt="icInfoCircle"
                  className={styles.infoIcon}
                />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row className={cx('mx-0', styles.rowCheckBox)}>
          <Col className="ps-0 d-flex align-items-center justify-content-center">
            <Checkbox
              className="me-0"
              checked={watchActors?.some((i) => i === CompanyTypeEnum.CONSUMER)}
              onChange={(e) => {
                onChangeService(CompanyTypeEnum.CONSUMER);
                setError('actors', null);
              }}
              disabled={viewMode || loading}
            />
          </Col>
          <Col
            className={cx(
              'ps-0 d-flex align-items-center justify-content-center',
              styles.borderRowCheckBox,
            )}
          >
            <Checkbox
              className="me-0"
              checked={watchActors?.some((i) => i === CompanyTypeEnum.PROVIDER)}
              onChange={(e) => {
                onChangeService(CompanyTypeEnum.PROVIDER);
                setError('actors', null);
              }}
              disabled={viewMode || loading}
            />
          </Col>
          <Col className="ps-0 d-flex align-items-center justify-content-center">
            <Checkbox
              className="me-0"
              checked={watchActors?.some((i) => i === CompanyTypeEnum.MAIN)}
              onChange={(e) => {
                onChangeService(CompanyTypeEnum.MAIN);
                setError('actors', null);
              }}
              disabled={viewMode || loading}
            />
          </Col>
          <Col className="ps-0 d-flex align-items-center justify-content-center">
            <Checkbox
              className="me-0"
              checked={watchActors?.some((i) => i === CompanyTypeEnum.EXTERNAL)}
              onChange={(e) => {
                onChangeService(CompanyTypeEnum.EXTERNAL);
                setError('actors', null);
              }}
              disabled={viewMode || loading}
            />
          </Col>
        </Row>
        <div className={styles.messageError}>
          {errors?.actors?.message || ''}
        </div>
        <Row className="pt-2 mx-0">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS.Status,
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <RadioForm
              name="status"
              control={control}
              disabled={viewMode || loading}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS.Inactive,
                  ),
                },
              ]}
              messageRequired={errors?.status?.message || ''}
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
          className="mt-2 justify-content-end"
          handleCancel={() => {
            onCloseAndClearData();
          }}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm, errFunction)}
          handleSubmitAndNew={handleSubmit(
            (values) => onSubmitForm({ ...values, mode: 'SaveAndNew' }),
            errFunction,
          )}
          disable={loading}
          dynamicLabels={dynamicLabels}
        />
      </div>
    </>
  );

  return (
    <ModalComponent
      w={730}
      isOpen={isOpen}
      toggle={() => {
        onCloseAndClearData();
      }}
      title={renderDynamicLabel(
        dynamicLabels,
        COMPANY_TYPE_DYNAMIC_DETAIL_FIELDS['Company type'],
      )}
      content={renderForm()}
      footer={!viewMode && renderFooter()}
    />
  );
};

export default ModalFormDivision;
