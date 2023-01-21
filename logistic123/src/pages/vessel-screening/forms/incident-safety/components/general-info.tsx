import { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import Input from 'components/ui/input/Input';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { I18nNamespace } from 'constants/i18n.const';
import { getListIncidentTypeActions } from 'store/incident-type/incident-type.action';
import ModalList from 'components/common/modal-list/ModalList';
import { convertToAgeDecimal } from 'helpers/utils.helper';
import LabelUI from 'components/ui/label/LabelUI';
import { IncidentInvestigationDetailResponse } from 'models/api/incident-investigation/incident-investigation.model';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import TextAreaUI from 'components/ui/text-area/TextArea';
import styles from './general-info.module.scss';

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
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const dispatch = useDispatch();
  const { listVesselResponse } = useSelector((state) => state.vessel);
  const { listIncidentTypes } = useSelector((state) => state.incidentType);
  const { userInfo } = useSelector((state) => state.authenticate);

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
    () => listVesselResponse?.data?.find((item) => item.id === data?.vesselId),
    [listVesselResponse?.data, data?.vesselId],
  );

  const typeOfIncident = useMemo(() => {
    const result = data?.typeIncidents?.map((i) => i.id);

    return result;
  }, [data?.typeIncidents]);

  useEffect(() => {
    dispatch(
      getListVesselActions.request({
        pageSize: -1,
        status: 'active',
      }),
    );
    dispatch(
      getListIncidentTypeActions.request({
        pageSize: -1,
        status: 'active',
        companyId: userInfo?.parentCompanyId || userInfo?.companyId,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userInfo?.companyId]);

  return (
    <>
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.containerForm)}>
          <div className={cx('fw-bold pb-2', styles.labelHeader)}>
            {t('vesselInformation')}
          </div>
          <Row gutter={[24, 10]}>
            <Col span={8}>
              <Input
                label={t('labels.vessel')}
                value={vesselDetail?.name}
                disabled
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
                {vesselDetail?.division || '-'}
              </div>
            </Col>
            <Col span={8}>
              <LabelUI
                className={cx(styles.labelForm)}
                label={t('labels.DOCHolder')}
              />
              <div className={cx(styles.contentForm)}>
                {vesselDetail?.docHolder?.name || '-'}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.containerForm)}>
          <div className="d-flex justify-content-between">
            <div className={cx('fw-bold', styles.labelHeader)}>
              {t('generalInformation')}
            </div>
          </div>

          <Row gutter={[24, 0]}>
            <Col span={8} className={cx('pt-3')}>
              <Input
                label={t('incidentTitle')}
                value={data?.title}
                disabled
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
                value={data?.voyageNo}
                disabled
                maxLength={128}
              />
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8} className={cx('pt-3')}>
              <Input
                maxLength={4}
                label={t('totalNumberOfCrew')}
                value={data?.totalNumberOfCrew}
                name="totalNumberOfCrew"
                disabled
              />
            </Col>

            <Col span={8} className={cx('pt-3')}>
              <DateTimePicker
                disabled
                label={t('dateAndTimeOfIncident')}
                className="w-100"
                value={moment(data?.dateTimeOfIncident)}
                name="dateTimeOfIncident"
                disabledDate={(current) => current > moment().endOf('day')}
                inputReadOnly
                format="DD/MM/YYYY HH:mm"
              />
            </Col>
            <Col span={8} className={cx('pt-3')} />
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8} className={cx('pt-3')}>
              <ModalList
                labelSelect={t('typeOfIncident')}
                title={t('typeOfIncident')}
                disable
                onChangeValues={() => {}}
                data={listIncidentTypeOption}
                rowLabels={rowLabelsIncidentType}
                values={typeOfIncident}
                disableCloseWhenClickOut
              />
            </Col>

            <Col span={8} className={cx('pt-3')}>
              <div className={cx(styles.labelForm)}>
                {t('otherTypeOfIncident')}
              </div>
              <TextAreaUI
                name="otherType"
                value={data?.otherType}
                autoSize={{ minRows: 2 }}
                disabled
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
