import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';

import { FC, useCallback, useEffect } from 'react';
import {
  FormProvider,
  FieldValues,
  useForm,
  Controller,
} from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import history from 'helpers/history.helper';
import { useDispatch } from 'react-redux';

import { clearIncidentInvestigationErrorsReducer } from 'store/incident-investigation/incident-investigation.action';

import { AppRouteConst } from 'constants/route.const';
import moment from 'moment';

import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import isEqual from 'lodash/isEqual';
import { showConfirmBase } from 'components/ui/modal/confirmBase';

import {
  CreatePilotTerminalFeedbackParams,
  PilotTerminalFeedbackDetail,
} from 'pages/pilot-terminal-feedback/utils/models/common.model';
import VesselInformationPilotTerminalFeedback from 'pages/pilot-terminal-feedback/form/VesselInformationPilotTerminalFeedback';
import GeneralInformationPilotTerminalFeedback from 'pages/pilot-terminal-feedback/form/GeneralInformationPilotTerminalFeedback';
import ChecklistPilotTerminalFeedback from 'pages/pilot-terminal-feedback/form/ChecklistPilotTerminalFeedback';
import styles from './form.module.scss';

interface FormPilotTerminalFeedbackProps {
  loading?: boolean;
  data: PilotTerminalFeedbackDetail;
  onSubmit: (data: CreatePilotTerminalFeedbackParams) => void;
  screen: 'create' | 'edit' | 'detail';
}

const defaultValues = {
  attachments: [],
};

const FormPilotTerminalFeedback: FC<FormPilotTerminalFeedbackProps> = ({
  data,
  loading,
  onSubmit,
  screen,
}) => {
  const { t } = useTranslation([
    I18nNamespace.PILOT_TERMINAL_FEEDBACK,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    vesselId: Yup.array()
      .nullable()
      .min(1, t('errors.required'))
      .required(t('errors.required')),
    feedbackType: Yup.string().nullable().required(t('errors.required')),
    dateOfInteraction: Yup.string().nullable().required(t('errors.required')),
  });

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { getValues, control, setValue } = methods;

  const resetDefault = useCallback(
    (defaultParams) => {
      methods.reset(defaultParams);
    },
    [methods],
  );

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const values = getValues();
    const params = {
      ...values,
      dateTimeOfIncident: values?.dateTimeOfIncident
        ? values?.dateTimeOfIncident?.format('MM/DD/YYYY')
        : null,
    };

    if (screen === 'create') {
      defaultParams = {
        ...defaultValues,
      };
    } else {
      defaultParams = {
        ...data,
      };
    }

    if (isEqual(defaultParams, params)) {
      if (screen === 'create') {
        history.push(AppRouteConst.PILOT_TERMINAL_FEEDBACK);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => {
          if (screen === 'create') {
            history.push(AppRouteConst.PILOT_TERMINAL_FEEDBACK);
          } else {
            resetDefault({
              ...defaultParams,
            });
            history.goBack();
          }
        },
      });
    }
  }, [data, getValues, resetDefault, screen, t]);

  const onSubmitForm = useCallback(
    (data) => {
      const { country, dateOfInteraction, portId, terminalId, vesselId } = data;
      const params = {
        ...data,
        country: country?.[0] || null,
        portId: portId?.[0] || null,
        terminalId: terminalId?.[0] || null,
        vesselId: vesselId?.[0] || null,
        dateOfInteraction: moment(dateOfInteraction).toISOString(),
      };

      onSubmit(params);
    },
    [onSubmit],
  );

  useEffect(() => {
    if (data) {
      setValue('vesselId', data?.vesselId ? [data?.vesselId] : []);
      setValue('feedbackType', data?.feedbackType || '');
      setValue(
        'dateOfInteraction',
        data?.vesselId ? moment(data?.dateOfInteraction) : null,
      );
      setValue('terminalId', data?.terminalId ? [data?.terminalId] : []);
      setValue('portId', data?.portId ? [data?.portId] : []);
      setValue('country', data?.country ? [data?.country] : []);
      setValue('pilotAgeArea', data?.pilotAgeArea || '');
      setValue('feedBack', data?.feedBack || '');
      setValue('attachments', data?.attachments || []);
      setValue(
        'pilotTerminalFeedbackChecklists',
        data?.pilotTerminalFeedbackChecklists || [],
      );
    }
    return () => {
      dispatch(clearIncidentInvestigationErrorsReducer());
    };
  }, [data, dispatch, setValue]);

  return loading && screen !== 'create' ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <Container className={cx(styles.wrapper, 'pt-0')}>
      <div className={cx(styles.wrapper)}>
        <FormProvider {...methods}>
          <VesselInformationPilotTerminalFeedback
            isEdit={screen !== 'detail'}
            loading={loading}
          />
          <GeneralInformationPilotTerminalFeedback
            isEdit={screen !== 'detail'}
            loading={loading}
          />
          <Controller
            control={control}
            name="pilotTerminalFeedbackChecklists"
            render={({ field }) => (
              <ChecklistPilotTerminalFeedback
                isEdit={screen !== 'detail'}
                value={field.value}
                onChange={field.onChange}
                loading={loading}
              />
            )}
          />
          <Controller
            control={control}
            name="attachments"
            render={({ field }) => (
              <div className="wrap__attachments">
                <TableAttachment
                  scrollVerticalAttachment
                  loading={loading}
                  disable={screen === 'detail'}
                  isEdit={screen !== 'detail'}
                  value={field.value}
                  buttonName="Attach"
                  onchange={field.onChange}
                />
              </div>
            )}
          />

          {screen !== 'detail' && (
            <GroupButton
              className="mt-4 pb-4 justify-content-end"
              handleCancel={handleCancel}
              disable={loading}
              visibleSaveBtn
              handleSubmit={methods.handleSubmit(onSubmitForm)}
            />
          )}
        </FormProvider>
      </div>
    </Container>
  );
};

export default FormPilotTerminalFeedback;
