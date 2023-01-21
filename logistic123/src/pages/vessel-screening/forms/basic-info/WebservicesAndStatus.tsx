import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import ModalListForm from 'components/react-hook-form/modal-list-form/ModalListForm';
import { I18nNamespace } from 'constants/i18n.const';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WebServices } from 'pages/vessel-screening/forms/summary/components/WebServices';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListUserActions } from 'store/user/user.action';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { updateVesselScreeningActionsApi } from 'pages/vessel-screening/utils/api/common.api';
import { UpdateStatusRequestParams } from 'pages/vessel-screening/utils/models/common.model';
import styles from './web-service-and-status.module.scss';

interface WebServiceAndStatusProps {
  control: any;
  isEdit?: boolean;
  errors?: any;
  handleSubmit?: any;
}

enum StatusChangeField {
  REQUEST_STATUS = 'rq',
  REVIEW_STATUS = 'rs',
}

const REQUEST_STATUS_RADIO_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'In progress', label: 'In progress' },
  { value: 'Cleared', label: 'Cleared' },
  { value: 'Disapproved', label: 'Disapproved' },
];

const REVIEW_STATUS_RADIO_OPTIONS = [
  { value: 'Accept', label: 'Accept' },
  { value: 'In progress', label: 'In progress' },
  { value: 'Reject', label: 'Reject' },
];

const WebServiceAndStatus = ({
  control,
  isEdit,
  errors,
  handleSubmit,
}: WebServiceAndStatusProps) => {
  const { t } = useTranslation([I18nNamespace.VESSEL_SCREENING]);
  const dispatch = useDispatch();
  const { listUser } = useSelector((state) => state.user);
  const { vesselScreeningDetail } = useSelector(
    (state) => state.vesselScreening,
  );
  const [loading, setLoading] = useState(false);

  const handleSubmitStatus = useCallback(
    (
      data: UpdateStatusRequestParams,
      field: {
        picData: string[];
        changedField?: StatusChangeField;
        value?: string;
      },
    ) => {
      setLoading(true);
      const { changedField, value, picData } = field;
      const newData = {
        id: vesselScreeningDetail?.id,
        vesselId: vesselScreeningDetail?.vesselId,
        status:
          changedField === StatusChangeField.REQUEST_STATUS
            ? value
            : data.status,
        reviewStatus:
          changedField === StatusChangeField.REVIEW_STATUS
            ? value
            : data.reviewStatus,
        picIds: picData.length ? picData : data.picIds,
        ports: data?.ports || [],
        transferTypeId: data.transferTypeId?.[0],
        cargoTypeId: data.cargoTypeId?.[0],
        cargoId: data.cargoId?.[0],
        totalQuantity: data.totalQuantity,
        units: data.units,
        remark: data?.remark || '',
      };

      updateVesselScreeningActionsApi(newData)
        .then((response) => toastSuccess('You have updated successfully'))
        .catch((e) => toastError(e?.message))
        .finally(() => setLoading(false));
    },
    [vesselScreeningDetail?.id, vesselScreeningDetail?.vesselId],
  );

  const handleOnChangeStatus = useCallback(
    (value: string, changedField: StatusChangeField) =>
      handleSubmit(handleSubmitStatus)({
        picData: [],
        changedField,
        value,
      }),
    [handleSubmit, handleSubmitStatus],
  );

  const rowLabelsScreeningPIC = useMemo(
    () => [
      {
        label: 'checkbox',
        id: 'checkbox',
        width: 40,
      },
      {
        label: t('basicInfo.userName'),
        id: 'name',
        width: 200,
      },
      {
        label: t('basicInfo.userEmail'),
        id: 'email',
        width: 240,
      },
      {
        label: t('basicInfo.jobTitle'),
        id: 'jobTitle',
        width: 240,
      },
    ],
    [t],
  );

  const options = useMemo(() => {
    const mapData = listUser?.data?.map((item) => ({
      id: item.id,
      name: item.username || `${item?.firstName} ${item?.lastName} `,
      label: item.username || `${item?.firstName} ${item?.lastName} `,
      email: item.email || '',
      jobTitle: item.jobTitle || '',
    }));
    return mapData;
  }, [listUser?.data]);

  useEffectOnce(() => {
    dispatch(getListUserActions.request({ pageSize: -1, status: 'active' }));
  });

  return (
    <div className={cx(styles.wrapperContainer)}>
      <WebServices tabName="Basic Info" className={styles.wrapWebService} />
      <div className={styles.divider} />
      <div>
        <p className={styles.labelHeader}>{t('basicInfo.requestStatus')}</p>
        <RadioForm
          name="status"
          control={control}
          className={styles.radioRequestWrapper}
          radioStyle={styles.radioStyle}
          radioOptions={REQUEST_STATUS_RADIO_OPTIONS}
          onChange={(value) =>
            handleOnChangeStatus(value, StatusChangeField.REQUEST_STATUS)
          }
          disabled={loading}
        />
      </div>
      <div className={styles.divider} />
      <div>
        <p className={styles.labelHeader}>{t('basicInfo.reviewStatus')}</p>
        <RadioForm
          control={control}
          name="reviewStatus"
          className={styles.radioReviewWrapper}
          radioStyle={styles.radioStyle}
          radioOptions={REVIEW_STATUS_RADIO_OPTIONS}
          onChange={(value) =>
            handleOnChangeStatus(value, StatusChangeField.REVIEW_STATUS)
          }
          disabled={loading}
        />
      </div>
      <div className={styles.divider} />
      <div>
        <p className={cx('mb-2', styles.labelHeader)}>
          {t('basicInfo.screeningPIC')}
        </p>
        <ModalListForm
          disable={loading}
          name="picIds"
          id="picIds"
          control={control}
          data={options}
          rowLabels={rowLabelsScreeningPIC}
          error={errors?.picIds?.message || ''}
          disableCloseWhenClickOut
          onSubmit={(picIds) =>
            handleSubmit(handleSubmitStatus)({
              picData: picIds,
            })
          }
        />
      </div>
    </div>
  );
};
export default WebServiceAndStatus;
