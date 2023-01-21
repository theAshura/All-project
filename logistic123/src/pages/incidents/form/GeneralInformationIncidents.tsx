import { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import Input from 'components/ui/input/Input';
import moment from 'moment';
import { ModuleName } from 'constants/common.const';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { getListIncidentTypeActions } from 'store/incident-type/incident-type.action';
import ModalListForm from 'components/react-hook-form/modal-list-form/ModalListForm';
import { REGEXP_INPUT_MIN_VALUE_POSITIVE } from 'constants/regExpValidate.const';
import { IncidentInvestigationDetailResponse } from 'models/api/incident-investigation/incident-investigation.model';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { OTHER_INCIDENT_TYPE_CODE } from 'components/incident-type/list';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import LabelUI from 'components/ui/label/LabelUI';
import SelectAsyncForm from 'components/react-hook-form/async-select/SelectAsyncForm';
import { convertToAgeDecimal } from 'helpers/utils.helper';

import styles from './form.module.scss';

interface GeneralInformationProps {
  isEdit: boolean;
  isCreate?: boolean;
  loading?: boolean;
  data: IncidentInvestigationDetailResponse;
}

const GeneralInformation: FC<GeneralInformationProps> = ({
  isEdit,
  loading,
  data,
}) => {
  const { t } = useTranslation([I18nNamespace.SAIL_GENERAL_REPORT]);
  const dispatch = useDispatch();
  const { listIncidentTypes, loading: loadingIncidentType } = useSelector(
    (state) => state.incidentType,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listVesselResponse } = useSelector((state) => state.vessel);

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const watchTypeIds: string[] = watch('typeIds');
  const watchVesselId = watch('vesselId');

  const rowLabelsIncidentType = useMemo(
    () => [
      {
        label: 'checkbox',
        id: 'checkbox',
        width: 40,
      },
      {
        label: t('typeCode'),
        id: 'natureFindingId',
        width: 180,
      },
      {
        label: t('typeDescription'),
        id: 'natureOfFinding',
        width: 530,
      },
    ],
    [t],
  );

  const listIncidentTypeOption = useMemo(() => {
    const mapData =
      listIncidentTypes?.data?.map((item) => ({
        id: item.id,
        label: item.name,
        code: item.code,
        name: item.name,
      })) || [];
    return [...mapData];
  }, [listIncidentTypes]);

  const vesselDetail = useMemo(
    () =>
      listVesselResponse?.data?.find((item) => item.id === watchVesselId?.[0]),
    [listVesselResponse?.data, watchVesselId],
  );

  const vesselOptions = useMemo(
    () =>
      listVesselResponse?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listVesselResponse?.data],
  );

  const otherIncidentType = useMemo(
    () =>
      listIncidentTypes?.data?.find(
        (item) => item.code === OTHER_INCIDENT_TYPE_CODE,
      ),
    [listIncidentTypes?.data],
  );

  const isOtherIncidentType = useMemo(
    () => watchTypeIds?.includes(otherIncidentType?.id),
    [otherIncidentType?.id, watchTypeIds],
  );

  useEffect(() => {
    dispatch(
      getListIncidentTypeActions.request({
        pageSize: -1,
        status: 'active',
        companyId: userInfo?.parentCompanyId || userInfo?.companyId,
      }),
    );
    dispatch(
      getListVesselActions.request({
        pageSize: -1,
        status: 'active',
        moduleName: ModuleName.QA,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userInfo?.companyId]);

  useEffect(() => {
    if (!isOtherIncidentType) {
      setValue('otherType', '');
    }
  }, [isOtherIncidentType, setValue]);

  return (
    <>
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.containerForm)}>
          <div className={cx('fw-bold pb-2', styles.labelHeader)}>
            {t('vesselInformation')}
          </div>
          <Row gutter={[24, 10]}>
            <Col span={8}>
              <SelectAsyncForm
                isRequired
                labelSelect={t('labels.vessel')}
                searchContent={t('labels.vessel')}
                control={control}
                disabled={!isEdit}
                name="vesselId"
                id="vesselId"
                placeholder="Please select"
                messageRequired={errors?.vesselId?.message || ''}
                onChangeSearch={(value: string) =>
                  dispatch(
                    getListVesselActions.request({
                      pageSize: -1,
                      content: value,
                      status: 'active',
                      moduleName: ModuleName.QA,
                    }),
                  )
                }
                options={vesselOptions}
              />
            </Col>
            <Col span={8}>
              <LabelUI
                className={cx(styles.labelForm)}
                label={t('labels.imo')}
              />
              <div className={cx(styles.contentForm)}>
                {vesselDetail?.imoNumber || '-'}
              </div>
            </Col>
            <Col span={8}>
              <LabelUI
                className={cx(styles.labelForm)}
                label={t('labels.vesselCode')}
              />
              <div className={cx(styles.contentForm)}>
                {vesselDetail?.code || '-'}
              </div>
            </Col>
            <Col span={8}>
              <LabelUI
                className={cx(styles.labelForm)}
                label={t('labels.flag')}
              />
              <div className={cx(styles.contentForm)}>
                {vesselDetail?.countryFlag || '-'}
              </div>
            </Col>
            <Col span={8}>
              <LabelUI
                className={cx(styles.labelForm)}
                label={t('labels.vesselType')}
              />
              <div className={cx(styles.contentForm)}>
                {vesselDetail?.vesselType?.name || '-'}
              </div>
            </Col>
            <Col span={8}>
              <LabelUI
                className={cx(styles.labelForm)}
                label={t('labels.age')}
              />
              <div className={cx(styles.contentForm)}>
                {vesselDetail?.buildDate
                  ? convertToAgeDecimal(vesselDetail?.buildDate)
                  : '-'}
              </div>
            </Col>
            <Col span={8}>
              <LabelUI
                className={cx(styles.labelForm)}
                label={t('labels.businessDivision')}
              />
              <div className={cx(styles.contentForm)}>
                {vesselDetail?.divisionMapping?.division?.name || '-'}
              </div>
            </Col>
            <Col span={8}>
              <LabelUI
                className={cx(styles.labelForm)}
                label={t('labels.DOCHolder')}
              />
              <div className={cx(styles.contentForm)}>
                {vesselDetail?.vesselDocHolders
                  ?.filter((item) => item?.status === 'active')
                  ?.map((item) => item?.company?.name || '-')
                  ?.join(', ') || '-'}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.containerForm)}>
          <div className="d-flex justify-content-between pb-2">
            <div className={cx('fw-bold', styles.labelHeader)}>
              {t('generalInformation')}
            </div>
          </div>

          <Row gutter={[24, 0]}>
            <Col span={8} className={cx('pt-3')}>
              <Input
                label={t('incidentTitle')}
                {...register('title')}
                isRequired
                disabled={!isEdit}
                messageRequired={errors?.title?.message || ''}
                placeholder={t('placeholderIncident.incidentTitle')}
                maxLength={128}
              />
            </Col>

            <Col span={8} className={cx('pt-3')}>
              <DateTimePicker
                disabled
                label={t('reportDate')}
                className="w-100"
                value={moment(data?.createdAt)}
                format="DD/MM/YYYY"
                inputReadOnly
              />
            </Col>
            <Col span={8} className={cx('pt-3')}>
              <Input
                label={t('voyageNo')}
                {...register('voyageNo')}
                isRequired
                disabled={!isEdit}
                messageRequired={errors?.voyageNo?.message || ''}
                placeholder={t('placeholderIncident.voyageNo')}
                maxLength={128}
              />
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8} className={cx('pt-3')}>
              <InputForm
                messageRequired={errors?.totalNumberOfCrew?.message || ''}
                maxLength={4}
                placeholder={
                  isEdit ? t('placeholderIncident.totalNumberOfCrew') : ''
                }
                label={t('totalNumberOfCrew')}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="totalNumberOfCrew"
                disabled={!isEdit}
              />
            </Col>

            <Col span={8} className={cx('pt-3')}>
              <DateTimePicker
                disabled={!isEdit}
                label={t('dateAndTimeOfIncident')}
                placeholder={isEdit ? 'Please select' : ''}
                className="w-100"
                isRequired
                control={control}
                messageRequired={errors?.dateTimeOfIncident?.message || ''}
                name="dateTimeOfIncident"
                disabledDate={(current) => current > moment().endOf('day')}
                inputReadOnly
                disabledTime={(current) => {
                  const today = moment();

                  const nowHour = today.hour();
                  const nowMinute = today.minute();
                  const listHourDisabled = [];
                  const listMinuteDisabled = [];

                  for (let i = 0; i < 24; ) {
                    if (current > moment().startOf('day') && i > nowHour) {
                      listHourDisabled.push(i);
                    }
                    i += 1;
                  }

                  for (let i = 0; i < 60; ) {
                    if (current > moment().startOf('day') && i > nowMinute) {
                      listMinuteDisabled.push(i);
                    }
                    i += 1;
                  }
                  return {
                    disabledHours: () => listHourDisabled,
                    disabledMinutes: () => listMinuteDisabled,
                  };
                }}
                showTime
                format="DD/MM/YYYY HH:mm"
              />
            </Col>
            <Col span={8} className={cx('pt-3')} />
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8} className={cx('pt-3')}>
              <ModalListForm
                name="typeIds"
                id="typeIds"
                labelSelect={t('typeOfIncident')}
                title={t('typeOfIncident')}
                disable={!isEdit || loadingIncidentType}
                isRequired
                control={control}
                data={listIncidentTypeOption}
                rowLabels={rowLabelsIncidentType}
                error={errors?.typeIds?.message || ''}
                disableCloseWhenClickOut
              />
            </Col>

            <Col span={8} className={cx('pt-3')}>
              <div className={cx(styles.contentForm)}>
                {t('otherTypeOfIncident')}
              </div>
              <TextAreaForm
                name="otherType"
                placeholder={t('placeholderIncident.otherTypeOfIncident')}
                control={control}
                minRows={3}
                disabled={!isEdit || !isOtherIncidentType}
                maxLength={2000}
              />
            </Col>
            <Col span={8} className={cx('pt-3')} />
          </Row>
        </div>
      </div>
    </>
  );
};

export default GeneralInformation;
