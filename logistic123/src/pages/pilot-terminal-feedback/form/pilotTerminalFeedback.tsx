import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';

import { FC, useCallback, useEffect, useMemo } from 'react';
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
import isEmpty from 'lodash/isEmpty';

import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import history from 'helpers/history.helper';
import { useDispatch } from 'react-redux';

import { AppRouteConst } from 'constants/route.const';
import moment from 'moment';
import { debounce } from 'lodash';

import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import isEqual from 'lodash/isEqual';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';

import styles from './form.module.scss';
import {
  PilotTerminalFeedbackDetail,
  CreatePilotTerminalFeedbackParams,
} from '../utils/models/common.model';
import GeneralInformationPilotTerminalFeedback from './GeneralInformationPilotTerminalFeedback';
import VesselInformationPilotTerminalFeedback from './VesselInformationPilotTerminalFeedback';
import ChecklistPilotTerminalFeedback from './ChecklistPilotTerminalFeedback';
import { CHECKLISTS_PILOT_TERMINAL_FEEDBACK, FEEDBACK_TYPE } from './contants';

interface FormPilotTerminalFeedbackProps {
  loading?: boolean;
  data: PilotTerminalFeedbackDetail;
  onSubmit: (data: CreatePilotTerminalFeedbackParams) => void;
  screen: 'create' | 'edit' | 'detail';
}

const defaultValues = {
  vesselId: [],
  feedbackType: FEEDBACK_TYPE.PILOT_SERVICES,
  dateOfInteraction: null,
  terminalId: [],
  portId: [],
  country: [],
  pilotAgeArea: '',
  feedBack: '',
  attachments: [],
  pilotTerminalFeedbackChecklists: [],
};

const sortPosition = [
  'vesselId',
  'feedbackType',
  'dateOfInteraction',
  'portId',
  'country',
];

export enum PilotTerminalFeedbackStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
}

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

  const schema = useMemo(
    () =>
      Yup.object().shape({
        vesselId: Yup.array()
          .nullable()
          .min(1, t('errors.required'))
          .required(t('errors.required')),
        feedbackType: Yup.string().nullable().required(t('errors.required')),
        dateOfInteraction: Yup.string()
          .nullable()
          .required(t('errors.required')),
        portId: Yup.array()
          .nullable()
          .min(1, t('errors.required'))
          .required(t('errors.required')),
        country: Yup.array()
          .nullable()
          .min(1, t('errors.required'))
          .required(t('errors.required')),
        pilotTerminalFeedbackChecklists: Yup.array()
          .nullable()
          .required(t('errors.required'))
          .test('requireChecklist', t('errors.required'), (value) => {
            if (value.length === CHECKLISTS_PILOT_TERMINAL_FEEDBACK.length) {
              return true;
            }
            return false;
          }),
        status: Yup.string().oneOf([
          PilotTerminalFeedbackStatus.DRAFT,
          PilotTerminalFeedbackStatus.SUBMITTED,
        ]),
      }),
    [t],
  );

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    getValues,
    control,
    setValue,
    watch,
    formState: { errors },
  } = methods;
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
      dateOfInteraction: values?.dateOfInteraction
        ? values?.dateOfInteraction?.format('MM/DD/YYYY')
        : null,
    };

    if (screen === 'create') {
      defaultParams = {
        ...defaultValues,
      };
    } else {
      defaultParams = {
        vesselId: [data?.vesselId],
        feedbackType: data?.feedbackType || null,
        dateOfInteraction: data?.dateOfInteraction
          ? moment(data?.dateOfInteraction)?.format('MM/DD/YYYY')
          : null,
        terminalId: [data?.terminalId] || [],
        portId: [data?.portId] || [],
        country: [data?.country] || [],
        pilotAgeArea: data?.pilotAgeArea || '',
        feedBack: data?.feedBack || '',
        attachments: data?.attachments || [],
        pilotTerminalFeedbackChecklists:
          data?.pilotTerminalFeedbackChecklists || [],
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
              dateOfInteraction: moment(data?.dateOfInteraction),
            });
            history.goBack();
          }
        },
      });
    }
  }, [data, getValues, resetDefault, screen, t]);

  const scrollToView = useCallback((errors) => {
    if (!isEmpty(errors)) {
      const firstError = sortPosition.find((item) => errors[item]);
      const el = document.querySelector(`#${firstError}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  const pilotChecklist = watch('pilotTerminalFeedbackChecklists');

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
      if (pilotChecklist.length === CHECKLISTS_PILOT_TERMINAL_FEEDBACK.length) {
        onSubmit(params);
      } else {
        // setError('pilotTerminalFeedbackChecklists', {
        //   message: 'This field is required',
        // });
      }
    },
    [onSubmit, pilotChecklist.length],
  );

  useEffect(() => {
    if (data) {
      setValue('vesselId', data?.vesselId ? [data?.vesselId] : []);
      setValue('feedbackType', data?.feedbackType || null);
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
      setValue(
        'status',
        (data?.status as PilotTerminalFeedbackStatus) ||
          PilotTerminalFeedbackStatus.DRAFT,
      );
    }
  }, [data, dispatch, setValue]);

  if (loading && screen !== 'create') {
    return (
      <div className="d-flex justify-content-center">
        <img
          src={images.common.loading}
          className={styles.loading}
          alt="loading"
        />
      </div>
    );
  }

  return (
    <Container className={cx(styles.wrapper, 'pt-0')}>
      <div className={cx(styles.wrapper)}>
        <FormProvider {...methods}>
          <VesselInformationPilotTerminalFeedback
            isEdit={screen !== 'detail'}
            loading={loading}
            data={data}
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
                lengthPilotChecklist={pilotChecklist.length}
                isRequired
                isEdit={screen !== 'detail'}
                value={field.value}
                onChange={field.onChange}
                loading={loading}
                errors={errors}
              />
            )}
          />

          <Controller
            control={control}
            name="attachments"
            render={({ field }) => (
              <div
                className={cx(
                  'wrap__attachments',
                  screen !== 'detail'
                    ? styles.paddingBottom5px
                    : cx(styles.paddingBottom30px, styles.paddingTop5px),
                )}
              >
                <TableAttachment
                  scrollVerticalAttachment
                  loading={loading}
                  disable={screen === 'detail'}
                  isEdit={screen !== 'detail'}
                  value={field.value}
                  disableFeatureChecking
                  buttonName="Attach"
                  onchange={field.onChange}
                />
              </div>
            )}
          />

          {screen !== 'detail' && (
            <div className={styles.endBtnGroup}>
              <GroupButton
                className="mt-4 pb-4 justify-content-end"
                handleCancel={handleCancel}
                disable={loading}
                visibleSaveBtn
                txButtonBetween="Save as draft"
                handleSubmit={methods.handleSubmit(onSubmitForm, scrollToView)}
              />
              {data?.status !== PilotTerminalFeedbackStatus.SUBMITTED && (
                <Button
                  buttonSize={ButtonSize.Medium}
                  buttonType={ButtonType.Green}
                  className={cx(styles.buttonSubmit, styles.marginLeft20px)}
                  renderSuffix={
                    <img
                      src={images.icons.icSendMail}
                      alt={images.icons.icSendMail}
                      className={styles.marginLeft7px}
                    />
                  }
                  disabled={loading}
                  disabledCss={loading}
                  onClick={debounce(() => {
                    setValue('status', PilotTerminalFeedbackStatus.SUBMITTED);
                    methods.handleSubmit(onSubmitForm, scrollToView)();
                  }, 400)}
                >
                  {t('buttons.submit')}
                </Button>
              )}
            </div>
          )}
        </FormProvider>
      </div>
    </Container>
  );
};

export default FormPilotTerminalFeedback;
