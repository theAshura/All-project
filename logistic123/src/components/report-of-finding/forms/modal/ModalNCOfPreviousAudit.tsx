import { yupResolver } from '@hookform/resolvers/yup';
import Table, { ColumnsType } from 'antd/lib/table';
import Tooltip from 'antd/lib/tooltip';
import {
  getListNcPreviousNcCar,
  updateNcPreviousCarActionsApi,
} from 'api/report-of-finding.api';
import cx from 'classnames';
import { CarVerificationStatusEnum } from 'constants/car.const';
import NoDataImg from 'components/common/no-data/NoData';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import ModalComponent from 'components/ui/modal/Modal';
import Radio from 'components/ui/radio/Radio';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { MaxLength, TOOLTIP_COLOR } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { FC, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import styles from '../form.module.scss';

interface PreviousNCFindings {
  id: string;
  followUpRefId: string;
  car: string;
  cap: string;
  totalNumberNc: string;
  status: string;
  status1: string;
  status2: string;
  status3: string;
  reason: string;
}
interface ModalNCOfPreviousAuditProps {
  isEdit?: boolean;
  data?: any;
  loading?: boolean;
  isShow?: boolean;
  planingId: string;
  rofId: string;
  handlePrevious?: (data) => void;
  setShow?: (e) => void;
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  reason: '',
};

export interface RowLabelType {
  title: string;
  dataIndex: string;
  width: number;
}

export const ModalNCOfPreviousAudit: FC<ModalNCOfPreviousAuditProps> = (
  props,
) => {
  const { isShow, setShow, planingId, isEdit, rofId, dynamicLabels } = props;
  const { t } = useTranslation([
    I18nNamespace.REPORT_OF_FINDING,
    I18nNamespace.COMMON,
  ]);
  const [modalReasonVisible, setModalReasonVisible] = useState(false);
  const [dataHolder, setDataHolder] = useState<PreviousNCFindings[]>([]);
  const [dataSelected, setDataSelected] = useState<PreviousNCFindings>(null);

  const schema = yup.object().shape({
    reason: yup.string().trim().nullable().required(t('errors.required')),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (rofId && planingId) {
      getListNcPreviousNcCar({ rofId, planingId })
        .then((res) => {
          if (res?.data?.data?.length) {
            setDataHolder(
              res?.data?.data?.map((i) => ({
                id: i?.id,
                followUpId: i?.planningRequest?.followUp?.id || '',
                followUpRefId: i?.planningRequest?.followUp?.refId || '',
                car: i?.actionRequest || '',
                cap: i?.cap?.planAction || '',
                totalNumberNc: i?.reportFindingItems || 0,
                status: i?.cARVerification?.status || '',
                status1: i?.cARVerification?.status || '',
                status2: i?.cARVerification?.status || '',
                status3: i?.cARVerification?.status || '',
                reason: i?.cARVerification?.reason || '',
              })),
            );
          }
        })
        .catch((err) => toastError(err));
    }
  }, [planingId, rofId]);

  const handleCancel = () => {
    setShow(false);
    setDataSelected(null);
    setModalReasonVisible(false);
  };
  const handleUpdate = async () => {
    const params = dataHolder?.map((item) => ({
      carId: item.id,
      status: item.status,
      reason: item.reason || '',
    }));
    try {
      params?.forEach(async (i) => {
        await updateNcPreviousCarActionsApi(rofId, i);
      });
    } catch (error) {
      toastError(error);
    }
    handleCancel();
    toastSuccess('You have updated successfully');
  };

  const handleOnChange = (value: string, record: any) => {
    setDataSelected(record);
    if (
      value === CarVerificationStatusEnum.HOLDING ||
      value === CarVerificationStatusEnum.OVERRIDING_CLOSURE
    ) {
      // show modal reason here
      setModalReasonVisible(true);
    }
    const updateList = dataHolder?.map((i) => {
      if (i?.id === record?.id) {
        return {
          ...i,
          status: value,
          status1: value,
          status2: value,
          status3: value,
        };
      }
      return i;
    });
    setDataHolder(updateList);
  };

  const onSubmitForm = (data) => {
    const updateList = dataHolder?.map((i) => {
      if (i?.id === dataSelected?.id) {
        return {
          ...i,
          reason: data?.reason || '',
        };
      }
      return i;
    });
    setModalReasonVisible(false);
    reset();
    setDataHolder(updateList);
  };

  // effect
  // useEffectOnce(() => {
  //   dispatch(
  //     getListAuditTypeActions.request({
  //       pageSize: -1,
  //       companyId: userInfo?.mainCompanyId,
  //     }),
  //   );
  // });

  const columns: ColumnsType = [
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Follow up Ref.ID'],
      ),
      width: 200,
      dataIndex: 'followUpRefId',
      render: (text, record: any) => (
        <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
          <Link
            to={`/inspection-follow-up/detail/${record?.followUpId}`}
            className={cx(styles.link, 'limit-line-text')}
          >
            {text}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.CAR,
      ),
      width: 150,
      dataIndex: 'car',
      render: (text) => (
        <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.CAP,
      ),
      width: 200,
      dataIndex: 'cap',
      render: (text) => (
        <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Total number of NC findings'],
      ),
      width: 200,
      dataIndex: 'totalNumberNc',
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Pending,
      ),
      width: 200,
      dataIndex: 'status',
      render: (value, record) => (
        <Radio
          value={CarVerificationStatusEnum?.PENDING}
          id={CarVerificationStatusEnum?.PENDING}
          disabled={!isEdit}
          labelClassName={styles.label}
          className={styles.radio}
          checked={value === CarVerificationStatusEnum?.PENDING}
          onChange={() =>
            handleOnChange(CarVerificationStatusEnum?.PENDING, record)
          }
        />
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Hold,
      ),
      width: 200,
      dataIndex: 'status1',
      render: (value, record) => (
        <Radio
          value={CarVerificationStatusEnum?.HOLDING}
          id={CarVerificationStatusEnum?.HOLDING}
          disabled={!isEdit}
          labelClassName={styles.label}
          className={styles.radio}
          checked={value === CarVerificationStatusEnum?.HOLDING}
          onChange={() =>
            handleOnChange(CarVerificationStatusEnum?.HOLDING, record)
          }
        />
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Verified and closed'],
      ),
      width: 200,
      dataIndex: 'status2',
      render: (value, record) => (
        <Radio
          value={CarVerificationStatusEnum?.VERIFIED_AND_CLOSE}
          id={CarVerificationStatusEnum?.VERIFIED_AND_CLOSE}
          disabled={!isEdit}
          labelClassName={styles.label}
          className={styles.radio}
          checked={value === CarVerificationStatusEnum?.VERIFIED_AND_CLOSE}
          onChange={() =>
            handleOnChange(
              CarVerificationStatusEnum?.VERIFIED_AND_CLOSE,
              record,
            )
          }
        />
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Overriding closure'],
      ),
      width: 200,
      dataIndex: 'status3',
      render: (value, record) => (
        <Radio
          value={CarVerificationStatusEnum?.OVERRIDING_CLOSURE}
          id={CarVerificationStatusEnum?.OVERRIDING_CLOSURE}
          disabled={!isEdit}
          labelClassName={styles.label}
          className={styles.radio}
          checked={value === CarVerificationStatusEnum?.OVERRIDING_CLOSURE}
          onChange={() =>
            handleOnChange(
              CarVerificationStatusEnum?.OVERRIDING_CLOSURE,
              record,
            )
          }
        />
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Reason,
      ),
      width: 200,
      dataIndex: 'reason',
      render: (text) => (
        <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        </Tooltip>
      ),
    },
  ];
  const renderFormReason = () => (
    <>
      <div>
        <Input
          isRequired
          label={renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Reason,
          )}
          {...register('reason')}
          messageRequired={errors?.reason?.message || ''}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Enter reason'],
          )}
          maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
        />
      </div>
    </>
  );

  const renderForm = () => (
    <div>
      {dataHolder?.length ? (
        <Table
          columns={columns}
          className={cx(styles.tableWrapper)}
          dataSource={dataHolder}
          scroll={{ x: 'max-content' }}
          pagination={false}
          rowKey={(item, index) => index.toString()}
          rowClassName={styles.rowWrapper}
        />
      ) : (
        <NoDataImg />
      )}
      <ModalComponent
        isOpen={modalReasonVisible}
        toggle={() => {
          setModalReasonVisible(false);
        }}
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Reason,
        )}
        content={renderFormReason()}
        footer={
          <div>
            <GroupButton
              dynamicLabels={dynamicLabels}
              className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
              buttonTypeLeft={ButtonType.PrimaryLight}
              handleCancel={() => {
                setDataSelected(null);
                setModalReasonVisible(false);
              }}
              handleSubmit={handleSubmit(onSubmitForm)}
            />
          </div>
        }
      />
    </div>
  );

  const renderFooter = () => (
    <>
      {dataHolder?.length > 0 && (
        <GroupButton
          dynamicLabels={dynamicLabels}
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.OutlineGray}
          txButtonBetween={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Update,
          )}
          handleCancel={handleCancel}
          handleSubmit={handleUpdate}
        />
      )}
    </>
  );

  return (
    <ModalComponent
      isOpen={isShow}
      toggle={() => {
        setShow(false);
      }}
      w={1150}
      title={renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
          'NC and CAR of previous inspection'
        ],
      )}
      content={renderForm()}
      footer={isEdit ? renderFooter() : undefined}
    />
  );
};
