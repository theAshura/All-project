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
import SummarySection from 'pages/vessel-screening/components/summary-section/summary-section';
import { formatDateIso } from 'helpers/date.helper';
import {
  checkTimeLine,
  TIME_LINE,
} from 'components/vessel/forms/management-ownership/doc-holder/doc.func';
import {
  OBJECT_REFERENCE,
  TAB_REFERENCE,
} from 'pages/vessel-screening/utils/constant';
import { useCallback, useEffect, useMemo } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as yup from 'yup';
import useVesselObjectReview from 'pages/vessel-screening/utils/hooks/useVesselObjectReview';
import {
  getVesselDetailActions,
  updateVesselActions,
} from 'store/vessel/vessel.action';
import { clearAttachmentAndRemarksReducer } from 'pages/vessel-screening/store/vessel-summary.action';
import useVesselMetadata from 'pages/vessel-screening/utils/hooks/useVesselMetadata';
import TablePlanningAndDrawings from './planning-and-drawings/list-plan-and-drawings';
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
  docHolderId: undefined,
  deadWeightTonnage: '',
  docResponsiblePartyInspection: false,
  docResponsiblePartyQA: false,
  ownerIds: [],
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
  crewGroupingId: undefined,
};

const initValues = {
  [OBJECT_REFERENCE.PLANS_AND_DRAWINGS]: {
    isExpanded: false,
  },
};

const ShipParticularsVesselScreening = () => {
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);

  const { vesselScreeningDetail } = useSelector(
    (state) => state.vesselScreening,
  );

  const { vesselDetail, loading } = useSelector((state) => state.vessel);

  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const metadata = useVesselMetadata(undefined, true);
  const editMode = useMemo(() => pathname.includes('edit'), [pathname]);

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
    docHolderId: yup
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

  const { getLists, onChange } = useVesselObjectReview(initValues);

  useEffect(() => {
    getLists();
    return () => {
      dispatch(clearAttachmentAndRemarksReducer());
    };
  }, [dispatch, getLists]);

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, getValues } = methods;

  const sortPosition = useMemo(
    () => [
      'imoNumber',
      'image',
      'code',
      'name',
      'vesselTypeId',
      'countryFlag',
      'buildDate',
      'shipyardCountry',
      'classificationSocietyId',
      'docHolderId',
      'deadWeightTonnage',
      'grt',
      'nrt',
    ],
    [],
  );
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
      history.push(AppRouteConst.VESSEL_SCREENING);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => {
          history.push(AppRouteConst.VESSEL_SCREENING);
          resetDefault(defaultParams);
        },
      });
    }
  }, [getValues, resetDefault, t]);

  const onSubmitForm = useCallback(
    (formData) => {
      const countryFlag = formData.countryFlag[0];
      const vesselTypeId = formData.vesselTypeId[0];
      const dateIso = getValues('buildDate')?.toISOString();
      const shipyardCountry = formData.shipyardCountry[0];
      const classificationSocietyId = formData.classificationSocietyId[0];
      const divisionId = formData.divisionId?.length
        ? formData.divisionId[0]
        : null;
      const docHolderId = formData.docHolderId[0];
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
        docHolderId,
        crewGroupingId,
        deadWeightTonnage,
        grt,
        nrt,
        vesselCharterers,
        vesselOwners,
        vesselDocHolders,
        docResponsiblePartyInspection:
          formData.docResponsiblePartyInspection ||
          vesselDetail?.docResponsiblePartyInspection,
        docResponsiblePartyQA:
          formData.docResponsiblePartyQA || vesselDetail?.docResponsiblePartyQA,
      };
      dispatch(
        updateVesselActions.request({
          id: vesselScreeningDetail?.vesselId,
          body: dataSubmit,
          handleSuccess: () => {
            history?.push(AppRouteConst.VESSEL_SCREENING);
          },
        }),
      );
    },
    [
      dispatch,
      getValues,
      vesselDetail?.code,
      vesselDetail?.docResponsiblePartyInspection,
      vesselDetail?.docResponsiblePartyQA,
      vesselDetail?.image,
      vesselDetail?.imoNumber,
      vesselDetail?.name,
      vesselScreeningDetail?.vesselId,
    ],
  );

  const renderButtonGroup = useMemo(
    () => (
      <GroupButton
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
    if (vesselScreeningDetail?.vesselId) {
      dispatch(getVesselDetailActions.request(vesselScreeningDetail?.vesselId));
    }
  }, [dispatch, vesselScreeningDetail?.vesselId]);
  return (
    <div className={styles.wrapper}>
      <div className={cx('card-container', 'pt-0')}>
        {metadata}
        <div className={styles.innerWrap}>
          <div className="d-flex">
            <div className={styles.tableWrapper}>
              <FormProvider {...methods}>
                <Container className="pt-0">
                  <ShipParticulars loading={loading} />
                  {!loading && (
                    <TablePlanningAndDrawings
                      edit={editMode}
                      onObjectReviewFieldChange={onChange}
                    />
                  )}
                </Container>
              </FormProvider>
              <div className={styles.groupButtons}>
                {editMode && !loading && renderButtonGroup}
              </div>
            </div>
            <div className={styles.summaryWrapper}>
              {!loading && (
                <SummarySection
                  tabName={TAB_REFERENCE.SHIP_PARTICULARS}
                  tables={[OBJECT_REFERENCE.PLANS_AND_DRAWINGS]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShipParticularsVesselScreening;
