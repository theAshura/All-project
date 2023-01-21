import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';
import { FC, useCallback, useEffect, useMemo } from 'react';
import {
  FormProvider,
  FieldValues,
  useForm,
  Controller,
} from 'react-hook-form';
import moment from 'moment';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import isEqual from 'lodash/isEqual';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import history from 'helpers/history.helper';
import {
  CreateSailReportInspectionInternalParams,
  SailReportInspectionInternal,
} from 'models/api/sail-report-inspection-internal/sail-report-inspection-internal.model';
import { formatDateIso } from 'helpers/date.helper';
import { AppRouteConst } from 'constants/route.const';
import { useParams } from 'react-router';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import styles from './form.module.scss';
import GeneralInformation from './GeneralInformation';

interface InternalInspectionFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  loading?: boolean;
  data: SailReportInspectionInternal;
  onSubmit: (data: CreateSailReportInspectionInternalParams) => void;
}

const defaultValues = {
  vesselId: null,
  eventTypeId: [],
  inspectionDateFrom: null,
  inspectionDateTo: null,
  portId: null,
  nextInspectionDue: null,
  status: 'Open',
  attachments: [],
};

const InternalForm: FC<InternalInspectionFormProps> = ({
  isEdit,
  data,
  loading,
  onSubmit,
  isCreate,
}) => {
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);
  const { id: vesselRequestId } = useParams<{ id: string }>();

  const schema = useMemo(
    () =>
      Yup.object().shape({
        eventTypeId: Yup.array().min(1, t('errors.required')),
        inspectionDateFrom: Yup.string()
          .nullable()
          .required(t('errors.required')),
        inspectionDateTo: Yup.string()
          .nullable()
          .required(t('errors.required')),
        portId: Yup.string().nullable().required(t('errors.required')),
      }),
    [t],
  );

  const method = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { setValue, reset, getValues, control, handleSubmit } = method;
  const resetDefault = useCallback(
    (defaultParams) => {
      reset(defaultParams);
      history.push(
        `${AppRouteConst.getSailGeneralReportById(
          vesselRequestId,
        )}?tab=inspections&subTab=other-inspections-audit`,
      );
    },
    [reset, vesselRequestId],
  );

  const handleCancel = useCallback(() => {
    let defaultData = {};
    const { country, portName, ...compareParams } = getValues();

    if (isCreate) {
      defaultData = defaultValues;
    } else {
      defaultData = {
        eventTypeId: data?.eventTypeId || [],
        inspectionDateFrom: moment(data?.inspectionDateFrom) || null,
        inspectionDateTo: moment(data?.inspectionDateTo) || null,
        nextInspectionDue: moment(data?.nextInspectionDue) || null,
        portId: data?.portId || null,
        status: data?.status || 'Open',
        attachments: data?.attachments || null,
      };
    }

    if (isEqual(defaultData, compareParams)) {
      history.push(
        `${AppRouteConst.getSailGeneralReportById(
          vesselRequestId,
        )}?tab=inspections&subTab=other-inspections-audit`,
      );
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () =>
          isCreate
            ? history.push(
                `${AppRouteConst.getSailGeneralReportById(
                  vesselRequestId,
                )}?tab=inspections&subTab=other-inspections-audit`,
              )
            : resetDefault(defaultData),
      });
    }
  }, [
    data?.attachments,
    data?.eventTypeId,
    data?.inspectionDateFrom,
    data?.inspectionDateTo,
    data?.nextInspectionDue,
    data?.portId,
    data?.status,
    getValues,
    isCreate,
    resetDefault,
    t,
    vesselRequestId,
  ]);

  const onSubmitForm = useCallback(
    (formData: any) => {
      const params = {
        vesselId: vesselRequestId,
        eventTypeId: formData?.eventTypeId[0]?.value,
        inspectionDateFrom: formatDateIso(formData.inspectionDateFrom),
        inspectionDateTo: formatDateIso(formData.inspectionDateTo),
        portId: formData.portId,
        nextInspectionDue: formatDateIso(formData.nextInspectionDue),
        status: formData.status,
        attachments: formData.attachments,
      };
      onSubmit(params);
    },
    [onSubmit, vesselRequestId],
  );

  useEffect(() => {
    setValue('attachments', data?.attachments);
  }, [data?.attachments, setValue]);

  if (loading && !isCreate) {
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
    <Container>
      <div className={cx(styles.wrapper)}>
        <FormProvider {...method}>
          <GeneralInformation data={data} isEdit={isEdit} />
          <Controller
            control={control}
            name="attachments"
            render={({ field }) => (
              <TableAttachment
                featurePage={Features.QUALITY_ASSURANCE}
                subFeaturePage={SubFeatures.SAIL_GENERAL_REPORT}
                scrollVerticalAttachment
                loading={loading}
                disable={!isEdit}
                isEdit={!loading && isEdit}
                isCreate={isCreate}
                value={field.value}
                buttonName="Attach"
                onchange={field.onChange}
                classWrapper={styles.internalAttachments}
              />
            )}
          />
          {isEdit && (
            <GroupButton
              className="mt-4 pb-4 justify-content-end"
              handleCancel={handleCancel}
              visibleSaveBtn
              handleSubmit={handleSubmit(onSubmitForm)}
            />
          )}
        </FormProvider>
      </div>
    </Container>
  );
};

export default InternalForm;
