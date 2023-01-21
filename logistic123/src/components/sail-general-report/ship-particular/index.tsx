import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { I18nNamespace } from 'constants/i18n.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect, useMemo } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { formatDateIso } from 'helpers/date.helper';
import {
  checkTimeLine,
  TIME_LINE,
} from 'components/vessel/forms/management-ownership/doc-holder/doc.func';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import {
  getVesselDetailActions,
  updateVesselActions,
} from 'store/vessel/vessel.action';
import useVesselMetadata from 'pages/vessel-screening/utils/hooks/useVesselMetadata';
import styles from './ship-particulars.module.scss';
import ShipParticulars from './ShipParticulars';

const defaultValues = {
  image: '',
  imoNumber: '',
  name: '',
  code: '',
  countryFlag: undefined,
  vesselTypeId: undefined,
  callSign: '',
  buildDate: undefined,
  age: '',
  shipyardName: '',
  shipyardCountry: undefined,
  officialNumber: '',
  classificationSocietyId: undefined,
  vesselClass: '',
  hullNumber: '',
  fleetName: '',
  divisionId: '',
  status: 'active',

  deadWeightTonnage: '',
  docResponsiblePartyInspection: false,
  docResponsiblePartyQA: false,
  ownerIds: [],
  tonesPerCentimeter: '',
  customerRestricted: false,
  blacklistOnMOUWebsite: false,
  grt: undefined,
  nrt: undefined,
  teuCapacity: '',
  maxDraft: undefined,
  lightShip: '',
  loa: undefined,
  lbp: undefined,
  breath: undefined,
  height: undefined,
  depth: undefined,
  officers: [],
  rating: [],
  crewGroupingId: '',
};

const ShipParticularsSailReporting = () => {
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);

  const { vesselDetail, loading } = useSelector((state) => state.vessel);

  const dispatch = useDispatch();
  const metadata = useVesselMetadata();

  const { id } = useParams<{ id: string }>();

  const schema = yup.object().shape({
    vesselTypeId: yup
      .array()
      .nullable()
      .nullable()
      .required(t('errors.required')),
    countryFlag: yup.array().nullable().required(t('errors.required')),
    buildDate: yup.string().trim().nullable().required(t('errors.required')),
    classificationSocietyId: yup
      .array()
      .min(1, 'This field is required')
      .required(t('errors.required')),
    deadWeightTonnage: yup
      .number()
      .nullable()
      .transform((v, o) => {
        if (o === '') {
          return null;
        }
        if (Number.isNaN(v)) {
          return -1;
        }
        return v;
      })
      .required(t('errors.required')),
    grt: yup
      .number()
      .nullable()
      .transform((v, o) => {
        if (o === '') {
          return null;
        }
        if (Number.isNaN(v)) {
          return -1;
        }
        return v;
      })
      .required(t('errors.required')),
    nrt: yup
      .number()
      .nullable()
      .transform((v, o) => {
        if (o === '') {
          return null;
        }
        if (Number.isNaN(v)) {
          return -1;
        }
        return v;
      })
      .required(t('errors.required')),
    // ownerIds: yup
    //   .array()
    //   .nullable()
    //   .required(t('errors.required'))
    //   .min(1, t('errors.required')),
  });

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, getValues } = methods;

  const sortPosition = useMemo(() => ['imoNumber'], []);
  const scrollToView = useCallback(
    (errors) => {
      if (!isEmpty(errors)) {
        const firstError = sortPosition.find((item) => errors[item]);
        const el = document.querySelector(`#${firstError}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [sortPosition],
  );

  const resetDefault = useCallback(
    (defaultParams) => {
      methods.reset(defaultParams);
    },
    [methods],
  );

  const onCancel = useCallback(() => {
    let defaultParams = {};

    const values = getValues();
    const params = {
      ...values,
    };

    defaultParams = defaultValues;

    if (isEqual(defaultParams, params)) {
      history.push(AppRouteConst.SAIL_GENERAL_REPORT);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => {
          history.push(AppRouteConst.SAIL_GENERAL_REPORT);
          resetDefault(defaultParams);
        },
      });
    }
  }, [getValues, resetDefault, t]);

  const onSubmitForm = useCallback(
    (formData) => {
      // eslint-disable-next-line no-debugger
      debugger;
      const countryFlag = formData.countryFlag[0];
      const vesselTypeId = formData.vesselTypeId[0];
      const dateIso = getValues('buildDate')?.toISOString();
      const shipyardCountry = formData.shipyardCountry[0];
      const classificationSocietyId = formData.classificationSocietyId[0];
      const divisionId = formData.divisionId?.length
        ? formData.divisionId[0]
        : null;

      const crewGroupingId = formData.crewGroupingId?.length
        ? formData.crewGroupingId[0]
        : null;
      const deadWeightTonnage = formData.deadWeightTonnage || null;
      const grt = formData.grt || null;
      const nrt = formData.nrt || null;

      const vesselDocHolders = formData?.vesselDocHolders?.map((item) => ({
        id: item?.id,
        companyId: item?.companyId,
        fromDate: formatDateIso(item?.fromDate),
        toDate: formatDateIso(item?.toDate),
        docHolderId:
          checkTimeLine(item?.fromDate, item?.toDate) !== TIME_LINE.FUTURE
            ? item?.companyId
            : undefined,
        responsiblePartyInspection: item?.responsiblePartyInspection,
        responsiblePartyQA: item?.responsiblePartyQA,
        remark: item?.remark,
      }));
      const vesselCharterers = formData?.vesselCharterers?.map((item) => ({
        id: item?.id,
        companyId: item.companyId,
        fromDate: formatDateIso(item?.fromDate),
        toDate: formatDateIso(item?.toDate),
        responsiblePartyInspection: item.responsiblePartyInspection,
        responsiblePartyQA: item.responsiblePartyQA,
        type: item.type,
        remark: item?.remark,
      }));
      const vesselOwners = formData?.vesselOwners?.map((item) => ({
        id: item?.id,
        companyId: item.companyId,
        fromDate: formatDateIso(item?.fromDate),
        toDate: formatDateIso(item?.toDate),
        responsiblePartyInspection: item.responsiblePartyInspection,
        responsiblePartyQA: item.responsiblePartyQA,
        remark: item?.remark,
      }));

      const dataSubmit = {
        ...formData,
        image: vesselDetail?.image,
        imoNumber: vesselDetail?.imoNumber,
        code: vesselDetail?.code,
        name: vesselDetail?.name,
        countryFlag,
        vesselTypeId,
        buildDate: dateIso,
        shipyardCountry,
        classificationSocietyId,
        divisionId,

        crewGroupingId,
        deadWeightTonnage,
        grt,
        nrt,
        vesselCharterers,
        vesselOwners,
        vesselDocHolders,
      };
      dispatch(
        updateVesselActions.request({
          id,
          body: dataSubmit,
          handleSuccess: () => {
            history?.push(AppRouteConst.SAIL_GENERAL_REPORT);
          },
        }),
      );
    },
    [
      getValues,
      vesselDetail?.image,
      vesselDetail?.imoNumber,
      vesselDetail?.code,
      vesselDetail?.name,
      dispatch,
      id,
    ],
  );

  const renderButtonGroup = useMemo(
    () => (
      <GroupButton
        className="pt-3"
        handleCancel={onCancel}
        handleSubmit={handleSubmit(onSubmitForm, scrollToView)}
        txButtonBetween={t('buttons.save')}
        txButtonLeft={t('buttons.cancel')}
        buttonTypeLeft={ButtonType.CancelOutline}
      />
    ),
    [onCancel, handleSubmit, onSubmitForm, scrollToView, t],
  );

  useEffect(() => {
    if (id) {
      dispatch(getVesselDetailActions.request(id));
    }
  }, [dispatch, id]);

  return (
    <div className={styles.wrapper}>
      <div className={cx('card-container', 'pt-0')}>
        {metadata}
        <div className={styles.innerWrap}>
          <FormProvider {...methods}>
            <Container className="pt-0">
              <ShipParticulars loading={loading} />
            </Container>
          </FormProvider>
          <div className={styles.groupButtons}>
            {!loading && renderButtonGroup}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShipParticularsSailReporting;
