import { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';

import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { ModuleName } from 'constants/common.const';
import { getListVesselActions } from 'store/vessel/vessel.action';
import SelectAsyncForm from 'components/react-hook-form/async-select/SelectAsyncForm';
import LabelUI from 'components/ui/label/LabelUI';
import { PilotTerminalFeedbackDetail } from 'pages/pilot-terminal-feedback/utils/models/common.model';
import { convertToAgeDecimal } from 'helpers/utils.helper';
import { FIXED_ROLE_NAME } from 'constants/roleAndPermission.const';
import styles from './form.module.scss';

interface VesselInformationPilotTerminalFeedbackProps {
  isEdit: boolean;
  loading?: boolean;
  data?: PilotTerminalFeedbackDetail;
}

const VesselInformationPilotTerminalFeedback: FC<VesselInformationPilotTerminalFeedbackProps> =
  ({ isEdit, data, loading }) => {
    const { t } = useTranslation(I18nNamespace.PILOT_TERMINAL_FEEDBACK);
    const dispatch = useDispatch();
    const { userProfile } = useSelector((state) => state.authenticate);
    const { listVesselResponse } = useSelector((state) => state.vessel);

    const {
      control,
      watch,
      formState: { errors },
    } = useFormContext();
    const watchVesselId = watch('vesselId');

    const vesselDetail = useMemo(
      () =>
        listVesselResponse?.data?.find(
          (item) => item.id === watchVesselId?.[0],
        ),
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

    const hasRolePilot = useMemo(() => {
      const pilotRole = userProfile?.roles?.find(
        (role) => role.name === FIXED_ROLE_NAME.PILOT,
      );
      return !!pilotRole;
    }, [userProfile?.roles]);

    useEffect(() => {
      dispatch(
        getListVesselActions.request({
          pageSize: -1,
          status: 'active',
          shouldGetVesselPilot: hasRolePilot,
          moduleName: ModuleName.QA,
        }),
      );
    }, [dispatch, hasRolePilot]);

    return (
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.containerForm)}>
          <div className="d-flex justify-content-between">
            <div className={cx('fw-bold pb-2', styles.labelHeader)}>
              {t('vesselInformation')}
            </div>
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
                      shouldGetVesselPilot: hasRolePilot,
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
    );
  };

export default VesselInformationPilotTerminalFeedback;
