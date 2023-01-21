import { FC, useCallback, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import Input from 'components/ui/input/Input';
import moment from 'moment';

import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  getListVesselActions,
  getVesselDetailActions,
} from 'store/vessel/vessel.action';
import { I18nNamespace } from 'constants/i18n.const';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { getListAuthorityMasterActions } from 'store/authority-master/authority-master.action';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { GetDetailExternal } from 'models/api/external/external.model';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { clearExternalErrorsReducer } from 'store/external/external.action';
import useEffectOnce from 'hoc/useEffectOnce';
import { useParams } from 'react-router';
import styles from './form.module.scss';

interface GeneralInformationProps {
  isEdit: boolean;
  isCreate?: boolean;
  loading?: boolean;
  data: GetDetailExternal;
}

const GeneralInformation: FC<GeneralInformationProps> = ({
  isEdit,
  data,
  isCreate,
}) => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const dispatch = useDispatch();
  const { vesselDetail } = useSelector((state) => state.vessel);
  const { listAuthorityMasters, loading: loadingAuthority } = useSelector(
    (state) => state.authorityMaster,
  );
  const { listAuditTypes } = useSelector((state) => state.auditType);
  const { loading: loadingUser } = useSelector((state) => state.user);
  const { control, watch, formState, setValue, register } = useFormContext();
  const { id: vesselRequestId } = useParams<{ id: string }>();

  const listAuthorityOption = useMemo(() => {
    const mapData = listAuthorityMasters?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    return mapData;
  }, [listAuthorityMasters]);

  const listEventTypeOption: Array<NewAsyncOptions> = useMemo(() => {
    const mapData = listAuditTypes?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    return mapData;
  }, [listAuditTypes]);

  useEffectOnce(() => {
    dispatch(getVesselDetailActions.request(vesselRequestId));
  });

  useEffect(() => {
    dispatch(
      getListAuditTypeActions.request({
        pageSize: -1,
        status: 'active',
        scope: 'external',
      }),
    );
    dispatch(getListVesselActions.request({ pageSize: -1, status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      const findings = data?.externalInspectionReports?.map((item) => ({
        ...item,
        pscDeficiencyId: item?.pscDeficiency?.id,
        pscActionId: item?.pscAction?.id,
        viqId: item?.viq?.id,
      }));
      setValue(
        'eventTypeId',
        data?.eventTypeId
          ? [{ value: data?.eventTypeId, label: data?.eventType?.name }]
          : [],
      );

      setValue('vesselId', data?.vesselId || null);
      setTimeout(() => {
        // setValue('authorityId', authoritySelected || null);
        setValue(
          'authorityId',
          data?.authorityId
            ? [{ value: data?.authorityId, label: data?.authority?.name }]
            : [],
        );
      }, 200);

      setValue('isPort', Boolean(data?.isPort));
      setValue('noFindings', Boolean(data?.noFindings));
      setValue('portId', data?.portId || null);
      setValue('terminalId', data?.terminalId || null);
      setValue('dateOfInspection', moment(data?.dateOfInspection) || null);
      setValue('inspectorName', data?.inspectorName || null);
      setValue('comment', data?.comment || null);
      setValue('externalInspectionReports', findings || []);
    }
    return () => {
      dispatch(clearExternalErrorsReducer());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const watchEventTypeId = watch('eventTypeId');

  useEffect(() => {
    if ((isCreate || isEdit) && watchEventTypeId?.length) {
      setValue('authorityId', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchEventTypeId]);

  const handleChangeSearchAuthority = useCallback(
    (value: string) => {
      let params: any = {
        pageSize: -1,
        status: 'active',
        scope: 'external',
      };

      if (value?.trim()) {
        params = { ...params, content: value };
      }
      if (watchEventTypeId?.[0]?.value) {
        params.inspectionTypeId = watchEventTypeId?.[0]?.value;
      }
      dispatch(getListAuthorityMasterActions.request(params));
    },
    [dispatch, watchEventTypeId],
  );

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <Row gutter={[24, 0]}>
          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('vesselName')}</div>
            <div className={cx(styles.contentForm)}>
              {vesselDetail?.name || '-'}
            </div>
          </Col>
          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('imoNumber')}</div>
            <div className={cx(styles.contentForm)}>
              {vesselDetail?.imoNumber || '-'}
            </div>
          </Col>
          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('vesselType')}</div>
            <div className={cx(styles.contentForm)}>
              {vesselDetail?.vesselType?.name || '-'}
            </div>
          </Col>
          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('fleetName')}</div>
            <div className={cx(styles.contentForm)}>
              {vesselDetail?.fleetName || '-'}
            </div>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <AsyncSelectForm
              disabled={!isEdit}
              isRequired
              labelSelect={t('eventTypeTx')}
              searchContent={t('externalInspectionType')}
              control={control}
              name="eventTypeId"
              id="eventTypeId"
              placeholder={isEdit ? 'Please select' : ''}
              messageRequired={formState?.errors?.eventTypeId?.message || ''}
              onChangeSearch={(value: string) =>
                dispatch(
                  getListAuditTypeActions.request({
                    pageSize: -1,
                    isRefreshLoading: false,
                    content: value,
                    status: 'active',
                    scope: 'external',
                  }),
                )
              }
              options={listEventTypeOption}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <AsyncSelectForm
              disabled={!isEdit || loadingAuthority}
              isRequired
              labelSelect={t('authority')}
              searchContent={t('authority')}
              control={control}
              name="authorityId"
              id="authorityId"
              placeholder={isEdit ? 'Please select' : ''}
              messageRequired={formState?.errors?.authorityId?.message || ''}
              onChangeSearch={handleChangeSearchAuthority}
              options={listAuthorityOption}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <DateTimePicker
              disabled={!isEdit}
              label={t('dateOfInspection')}
              placeholder={isEdit ? 'Please select' : ''}
              className="w-100"
              isRequired
              control={control}
              messageRequired={
                formState?.errors?.dateOfInspection?.message || ''
              }
              name="dateOfInspection"
              maxDate={moment()}
              inputReadOnly
            />
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>{t('noFindings')}</div>

            <ToggleSwitch
              disabled={!isEdit}
              control={control}
              name="noFindings"
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <Input
              value={watch('externalInspectionReports')?.length || 0}
              label={t('totalNoOfFindings')}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <Input
              {...register('inspectorName')}
              name="inspectorName"
              label={t('auditorInspectorName')}
              disabled={!isEdit || loadingUser}
              placeholder={isEdit && t('auditorPlaceHolder')}
              isRequired
              messageRequired={formState?.errors?.inspectorName?.message || ''}
              maxLength={128}
            />
          </Col>

          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>
              {t('comment')}
              <span className={cx(styles.required)}>*</span>
            </div>

            <TextAreaForm
              name="comment"
              placeholder={t('placeholder.comment')}
              control={control}
              minRows={3}
              disabled={!isEdit}
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')} />
        </Row>
      </div>
    </div>
  );
};

export default GeneralInformation;
