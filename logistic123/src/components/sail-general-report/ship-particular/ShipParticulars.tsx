import images from 'assets/images/images';
import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_TEXT,
  SCREEN_STATUS,
} from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row } from 'reactstrap';
import Input from 'components/ui/input/Input';
import moment from 'moment';

import { VesselType } from 'models/api/vessel-type/vessel-type.model';
import { Option } from 'constants/filter.const';
import ModalListForm from 'components/react-hook-form/modal-list-form/ModalListForm';

import { CommonApiParam } from 'models/common.model';
import {
  clearParamsVesselTypeReducer,
  clearVesselTypeReducer,
  getListVesselTypeActions,
} from 'store/vessel-type/vessel-type.action';
import {
  clearUserManagementReducer,
  getCountryActions,
  getListUserActions,
} from 'store/user/user.action';
import {
  clearCompanyManagementReducer,
  getListCompanyManagementActions,
} from 'store/company/company.action';
import {
  clearCrewGroupingReducer,
  getListCrewGroupingActions,
} from 'pages/crew-grouping/store/action';
import { getListClassificationSocietyActionsApi } from 'api/vessel.api';
import { convertToAgeDecimal } from 'helpers/utils.helper';
import { getListDivisionActions } from 'pages/division/store/action';
import SelectAsyncForm from 'components/react-hook-form/async-select/SelectAsyncForm';

import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import DocHolder from 'components/vessel/forms/management-ownership/doc-holder/DocHolder';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import useEffectOnce from 'hoc/useEffectOnce';
import { REGEXP_INPUT_MIN_VALUE_POSITIVE } from 'constants/regExpValidate.const';
import Tooltip from 'antd/lib/tooltip';
import styles from './ship-particulars.module.scss';

interface Props {
  screen?: SCREEN_STATUS;
  loading?: boolean;
}

// Only allow numbers, one dot and two decimal places
const PARTTERN_DECIMAL = /^\d+\.{0,1}\d{0,2}$/;

const MAX_LENGTH_NUMBER = 9;

const ShipParticulars = ({ screen, loading }: Props) => {
  const { t } = useTranslation([I18nNamespace.VESSEL, I18nNamespace.COMMON]);

  const dispatch = useDispatch();

  const { vesselDetail, errorList } = useSelector((state) => state.vessel);

  const { listCountry } = useSelector((state) => state.user);
  const { listVesselTypes } = useSelector((state) => state.vesselType);

  const { listCrewGroupings } = useSelector((state) => state.crewGrouping);
  const { listDivision } = useSelector((state) => state.division);

  const [divisionOptions, setDivisionOptions] = useState([]);
  const [divisionOptionsProps, setDivisionOptionsProps] = useState([]);

  const [classSocietyOptions, setClassSocietyOptions] = useState([]);
  const [classSocietyOptionsProps, setClassSocietyOptionsProps] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [flagCountryOptions, setFlagCountryOptions] = useState([]);
  const [shipyardCountryOptions, setShipyardCountryOptions] = useState([]);
  const [crewGroupingOptions, setCrewGroupingOptions] = useState([]);
  const [crewGroupingOptionsProps, setCrewGroupingOptionsProps] = useState([]);

  const rowLabelsOfficers = useMemo(
    () => [
      {
        label: 'checkbox',
        id: 'checkbox',
        width: 80,
      },
      {
        label: t('txOfficers'),
        id: 'name',
        width: 710,
      },
    ],
    [t],
  );

  const rowLabelsRatings = useMemo(
    () => [
      {
        label: 'checkbox',
        id: 'checkbox',
        width: 80,
      },
      {
        label: t('txRating'),
        id: 'name',
        width: 710,
      },
    ],
    [t],
  );

  const {
    register,
    control,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useFormContext();

  const watchBuildDate = watch('buildDate');

  const watchCrewGrouping = watch('crewGroupingId');

  const optionVesselType = useMemo(() => {
    const options: Array<Option> = [];
    listVesselTypes?.data
      ?.filter((e) => e.status === 'active')
      .forEach((e: VesselType) => {
        options.push({ value: e.id, label: e.name });
      });
    return options;
  }, [listVesselTypes]);

  const muiltiCompanyOptions = useMemo(() => {
    const newData =
      listCountry?.map((item) => ({
        id: item.name,
        name: item.name,
        label: item.name,
      })) || [];

    return newData;
  }, [listCountry]);

  const handleSearchCrewGrouping = useCallback(
    (searchName?: string) => {
      const newSearchCrewGrouping = crewGroupingOptions?.filter((e) =>
        e.label?.toString().toLowerCase().includes(searchName?.toLowerCase()),
      );
      setCrewGroupingOptionsProps(newSearchCrewGrouping);
    },
    [crewGroupingOptions],
  );

  // Division

  const handleSearchDivisionOptionProps = useCallback(
    (searchName?: string) => {
      const newSearchDivision = divisionOptions?.filter((e) =>
        e.label?.toString().toLowerCase().includes(searchName?.toLowerCase()),
      );
      setDivisionOptionsProps(newSearchDivision);
    },
    [divisionOptions],
  );

  useEffect(() => {
    if (listDivision) {
      const divisionOptionProps = listDivision?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setDivisionOptions(divisionOptionProps);
      setDivisionOptionsProps(divisionOptionProps);
    }
  }, [listDivision]);

  // Classification Society

  const handleSearchClassificationSocietyOptionProps = useCallback(
    (searchName?: string) => {
      const newClassSocietyOptions = classSocietyOptions?.filter((e) =>
        e.label?.toString().toLowerCase().includes(searchName?.toLowerCase()),
      );
      setClassSocietyOptionsProps(newClassSocietyOptions);
    },
    [classSocietyOptions],
  );

  const handleGetClassSociety = useCallback((search?: string) => {
    getListClassificationSocietyActionsApi({
      content: search || '',
      page: 1,
      pageSize: -1,
    }).then((res) => {
      const listClassSociety = res?.data?.data?.map((item) => ({
        value: item.id,
        label: `${item.name} - ${item.code}`,
      }));
      setClassSocietyOptions(listClassSociety);
      setClassSocietyOptionsProps(listClassSociety);
    });
    return () => {
      setClassSocietyOptions(null);
      setClassSocietyOptionsProps(null);
    };
  }, []);

  useEffect(() => {
    handleGetClassSociety('');
  }, [handleGetClassSociety]);

  // Flag Country
  const filterFlagCountry = useCallback(
    (searchName?: string) => {
      const newFlagCountryOptions = countryOptions?.filter((e) =>
        e.label?.toString().toLowerCase().includes(searchName?.toLowerCase()),
      );
      setFlagCountryOptions(newFlagCountryOptions);
    },
    [countryOptions],
  );

  useEffect(() => {
    if (listCountry?.length) {
      const countryOptionProps = listCountry.map((item) => ({
        value: item.name,
        label: item.name,
        image: item?.flagImg || '',
      }));
      setCountryOptions(countryOptionProps);
      setFlagCountryOptions(countryOptionProps);
      setShipyardCountryOptions(countryOptionProps);
    }
  }, [listCountry]);

  const filterShipyardCountry = useCallback(
    (searchName?: string) => {
      const newShipyardCountryOptions = countryOptions?.filter((e) =>
        e.label?.toString().toLowerCase().includes(searchName?.toLowerCase()),
      );
      setShipyardCountryOptions(newShipyardCountryOptions);
    },
    [countryOptions],
  );

  const handleGetVesselType = useCallback(
    (search?: string) => {
      const params: CommonApiParam = {
        isRefreshLoading: false,
        pageSize: -1,
        status: 'active',
        content: search || '',
      };
      dispatch(getListVesselTypeActions.request(params));
      dispatch(clearParamsVesselTypeReducer());
    },
    [dispatch],
  );

  const clearReducer = useCallback(async () => {
    await dispatch(clearUserManagementReducer());
    await dispatch(clearCompanyManagementReducer());
    await dispatch(clearVesselTypeReducer());
    await dispatch(clearCrewGroupingReducer());
  }, [dispatch]);

  useEffect(() => {
    if (listCrewGroupings) {
      const newCrewGroupingsOptions = listCrewGroupings?.data?.map((item) => ({
        value: item.id,
        label: item.name,
        officers: item.officers,
        rating: item.rating,
      }));
      setCrewGroupingOptions(newCrewGroupingsOptions);
      setCrewGroupingOptionsProps(newCrewGroupingsOptions);
    }
  }, [listCrewGroupings]);

  useEffect(() => {
    const ageDecimal = convertToAgeDecimal(watchBuildDate);
    setValue('age', ageDecimal);
  }, [setValue, watchBuildDate]);

  useEffect(() => {
    if (watchCrewGrouping?.length) {
      const crewGrouping = crewGroupingOptions?.find(
        (i) => i.value === watchCrewGrouping[0],
      );
      const initOfficers = crewGrouping?.officers || [];
      const initRating = crewGrouping?.rating || [];
      setValue('officers', initOfficers);
      setValue('rating', initRating);
    } else {
      setValue('officers', []);
      setValue('rating', []);
    }
  }, [crewGroupingOptions, setValue, watchCrewGrouping]);

  useEffect(() => {
    if (vesselDetail) {
      const vesselCharterersData = vesselDetail?.vesselCharterers?.map(
        (item, index) => ({
          sNo: index + 1,
          id: item?.id,
          companyId: item.companyId,
          code: item?.company?.code,
          type: item?.type,
          name: item?.company?.name,
          fromDate: item?.fromDate ? moment(item?.fromDate) : null,
          toDate: item?.toDate ? moment(item?.toDate) : null,
          responsiblePartyInspection: item?.responsiblePartyInspection,
          responsiblePartyQA: item?.responsiblePartyQA,
          remark: item?.remark || '',
        }),
      );
      const vesselOwnersData = vesselDetail?.vesselOwners?.map(
        (item, index) => ({
          sNo: index + 1,
          id: item?.id,
          companyId: item.companyId,
          code: item?.company?.code,
          name: item?.company?.name,
          cimo: item?.company?.companyIMO,
          fromDate: item?.fromDate ? moment(item?.fromDate) : null,
          toDate: item?.toDate ? moment(item?.toDate) : null,
          responsiblePartyInspection: item?.responsiblePartyInspection,
          responsiblePartyQA: item?.responsiblePartyQA,
          remark: item?.remark || '',
        }),
      );
      const vesselDocHolders = vesselDetail?.vesselDocHolders?.map(
        (item, index) => ({
          sNo: index + 1,
          id: item?.id,
          companyId: item.companyId,
          code: item?.company?.code,
          name: item?.company?.name,
          cimo: item?.company?.companyIMO,
          responsiblePartyInspection: item?.responsiblePartyInspection,
          responsiblePartyQA: item?.responsiblePartyQA,
          fromDate: item?.fromDate ? moment(item?.fromDate) : null,
          toDate: item?.toDate ? moment(item?.toDate) : null,
          remark: item?.remark || '',
        }),
      );
      setValue('vesselDocHolders', vesselDocHolders || []);
      setValue('imoNumber', vesselDetail?.imoNumber);
      setValue('name', vesselDetail?.name);
      setValue('code', vesselDetail?.code);
      setValue('callSign', vesselDetail?.callSign);
      setValue('shipyardName', vesselDetail?.shipyardName);
      setValue(
        'countryFlag',
        vesselDetail?.countryFlag ? [vesselDetail?.countryFlag] : [],
      );
      setValue(
        'vesselTypeId',
        vesselDetail?.vesselTypeId ? [vesselDetail?.vesselTypeId] : [],
      );
      setValue('buildDate', moment(vesselDetail?.buildDate));
      setValue(
        'shipyardCountry',
        vesselDetail?.shipyardCountry ? [vesselDetail?.shipyardCountry] : [],
      );
      setValue('officialNumber', vesselDetail?.officialNumber);
      setValue('vesselClass', vesselDetail?.vesselClass);
      setValue('fleetName', vesselDetail?.fleetName);
      setValue('hullNumber', vesselDetail?.hullNumber);
      setValue('status', vesselDetail?.status);
      setValue(
        'divisionId',
        vesselDetail?.divisionMapping?.division?.id
          ? [vesselDetail?.divisionMapping?.division?.id]
          : [],
      );
      setValue(
        'classificationSocietyId',
        vesselDetail?.classificationSocietyId
          ? [vesselDetail?.classificationSocietyId]
          : [],
      );
      setValue('deadWeightTonnage', Number(vesselDetail?.deadWeightTonnage));
      setValue('grt', Number(vesselDetail?.grt));
      setValue('nrt', Number(vesselDetail?.nrt));
      setValue('teuCapacity', vesselDetail?.teuCapacity);
      setValue('maxDraft', vesselDetail?.maxDraft);
      setValue('lightShip', vesselDetail?.lightShip);
      setValue('loa', vesselDetail?.loa);
      setValue('lbp', vesselDetail?.lbp);
      setValue('breath', vesselDetail?.breath);
      setValue('height', vesselDetail?.height);
      setValue('depth', vesselDetail?.depth);
      setValue(
        'crewGroupingId',
        vesselDetail?.crewGroupingId ? [vesselDetail?.crewGroupingId] : [],
      );
      setValue('ownerIds', vesselDetail?.owners?.map((i) => i.id) || []);
      setValue('blacklistOnMOUWebsite', vesselDetail?.blacklistOnMOUWebsite);
      setValue('customerRestricted', vesselDetail?.customerRestricted);
      setValue(
        'docResponsiblePartyInspection',
        Boolean(vesselDetail?.docResponsiblePartyInspection),
      );
      setValue(
        'docResponsiblePartyQA',
        Boolean(vesselDetail?.docResponsiblePartyQA),
      );
      setValue('vesselCharterers', vesselCharterersData);
      setValue('vesselOwners', vesselOwnersData);
    }
  }, [vesselDetail, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: item.message });
            break;
          case 'name':
            setError('name', { message: item.message });
            break;
          case 'imoNumber':
            setError('imoNumber', { message: item.message });
            break;
          case 'buildDate':
            setError('buildDate', { message: item.message });
            break;
          case 'vesselType':
            setError('vesselTypeId', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', null);
      setError('name', null);
      setError('imoNumber', null);
      setError('buildDate', null);
      setError('vesselTypeId', null);
    }
  }, [errorList, setError]);

  const handleGetListCompany = useCallback(() => {
    dispatch(
      getListCompanyManagementActions.request({
        pageSize: -1,
        page: 1,
        status: 'active',
      }),
    );
  }, [dispatch]);

  const handleGetListCrewGrouping = useCallback(() => {
    dispatch(
      getListCrewGroupingActions.request({
        pageSize: -1,
        page: 1,
        status: 'active',
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    handleGetListCompany();
  }, [handleGetListCompany]);

  useEffect(() => {
    handleGetListCrewGrouping();
  }, [handleGetListCrewGrouping]);

  useEffect(() => {
    handleGetVesselType('');
  }, [handleGetVesselType]);

  useEffectOnce(() => {
    dispatch(
      getCountryActions.request({ pageSize: -1, status: 'active', page: 1 }),
    );
    dispatch(
      getListDivisionActions.request({
        pageSize: -1,
        status: 'active',
        page: 1,
      }),
    );
    dispatch(
      getListUserActions.request({
        pageSize: -1,
        status: 'active',
        isRefreshLoading: false,
      }),
    );

    return () => {
      clearReducer();
    };
  });

  const renderTooltip = useMemo(
    () => (
      <Tooltip
        placement="top"
        title={<div className={styles.infoText}>{t('numberTooltip')}</div>}
        overlayClassName={styles.pendingInfoOverlay}
        overlayInnerStyle={{ width: 'fit-content' }}
        color="#E5F3FF"
      >
        <img
          src={images.icons.icPendingInfo}
          className="ms-1"
          alt="pending-info"
        />
      </Tooltip>
    ),
    [t],
  );

  const renderBasicInformation = useMemo(
    () => (
      <Container className={cx(styles.container, 'pb-3')}>
        <div className={styles.containerForm}>
          <div className={cx(styles.titleContainer, 'pb-2')}>
            {t('txBasicInformation')}
          </div>
          <Row className="mx-0">
            <Col className="ps-0">
              <Input
                label={t('txIMONumber')}
                isRequired
                placeholder={t('txPlaceHolder.txIMONumber')}
                messageRequired={errors?.imoNumber?.message || ''}
                {...register('imoNumber')}
                readOnly={loading || !!vesselDetail?.imoNumber}
                disabledCss={loading || !!vesselDetail?.imoNumber}
                maxLength={MAX_LENGTH_NUMBER}
              />
            </Col>
            <Col>
              <Input
                isRequired
                label={t('txVesselNameForm')}
                {...register('name')}
                disabledCss={loading || !!vesselDetail?.name}
                readOnly={loading || !!vesselDetail?.name}
                messageRequired={errors?.name?.message || ''}
                placeholder={t('txPlaceHolder.txVesselName')}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
            <Col className="pe-0">
              <Input
                label={t('txVesselCodeForm')}
                {...register('code')}
                disabledCss={loading || !!vesselDetail?.code}
                readOnly={loading || !!vesselDetail?.code}
                isRequired
                messageRequired={errors?.code?.message || ''}
                placeholder={t('txPlaceHolder.txVesselCode')}
                maxLength={15}
              />
            </Col>
          </Row>
          <Row className="mx-0 pt-2">
            <Col className="ps-0">
              <SelectAsyncForm
                labelSelect={t('txFlag')}
                name="countryFlag"
                disabled={loading || !!vesselDetail?.countryFlag}
                isRequired
                control={control}
                placeholder="Please select"
                searchContent={t('txFlag')}
                textSelectAll="Select all"
                textBtnConfirm="Confirm"
                hasImage
                onChangeSearch={filterFlagCountry}
                messageRequired={errors?.countryFlag?.message || ''}
                options={flagCountryOptions}
                flagImage
              />
            </Col>
            <Col>
              <SelectAsyncForm
                messageRequired={errors?.vesselTypeId?.message}
                control={control}
                name="vesselTypeId"
                disabled={loading || !!vesselDetail?.vesselTypeId}
                labelSelect={t('txVesselTypeForm')}
                isRequired
                titleResults="Selected vessel type"
                placeholder="Please select"
                searchContent="Vessel type"
                textSelectAll="Select all"
                textBtnConfirm="Confirm"
                hasImage
                onChangeSearch={handleGetVesselType}
                options={optionVesselType}
              />
            </Col>
            <Col className="pe-0">
              <Input
                label={t('txCallSign')}
                {...register('callSign')}
                disabled={loading || !!vesselDetail?.callSign}
                placeholder={t('txPlaceHolder.txCallSign')}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
          </Row>
          <Row className="mx-0 pt-2">
            <Col className="ps-0">
              <Row className="mx-0">
                <Col sm={9} className="ps-0">
                  <DateTimePicker
                    messageRequired={errors?.buildDate?.message || ''}
                    label={t('txDateBuilt')}
                    isRequired
                    className="w-100"
                    maxDate={moment()}
                    control={control}
                    name="buildDate"
                    disabled={loading || !!vesselDetail?.buildDate}
                  />
                </Col>
                <Col sm={3} className="pe-0 ps-0">
                  <Input label={t('txAge')} disabled {...register('age')} />
                </Col>
              </Row>
            </Col>
            <Col>
              <Input
                label={t('txShipyardName')}
                placeholder={t('txPlaceHolder.txShipyardName')}
                {...register('shipyardName')}
                disabled={loading || !!vesselDetail?.shipyardName}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
            <Col className="pe-0">
              <SelectAsyncForm
                messageRequired={errors?.shipyardCountry?.message}
                control={control}
                name="shipyardCountry"
                disabled={loading || !!vesselDetail?.shipyardCountry}
                labelSelect="Shipyard country"
                titleResults="Selected cities"
                placeholder="Please select"
                searchContent="Country"
                textSelectAll="Select all"
                textBtnConfirm="Confirm"
                hasImage
                onChangeSearch={filterShipyardCountry}
                options={shipyardCountryOptions}
                flagImage
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0">
              <Input
                label={t('txOfficialNumber')}
                {...register('officialNumber')}
                disabled={loading || !!vesselDetail?.officialNumber}
                placeholder={t('txPlaceHolder.txOfficialNumber')}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
            <Col>
              <SelectAsyncForm
                messageRequired={errors?.classificationSocietyId?.message}
                control={control}
                name="classificationSocietyId"
                disabled={loading || !!vesselDetail?.classificationSocietyId}
                labelSelect={t('txClassificationSociety')}
                isRequired
                titleResults="Selected classification society"
                placeholder="Please select"
                searchContent="Classification society"
                textSelectAll="Select all"
                textBtnConfirm="Confirm"
                hasImage
                onChangeSearch={handleSearchClassificationSocietyOptionProps}
                options={classSocietyOptionsProps}
              />
            </Col>
            <Col className="pe-0">
              <Input
                label={t('txClassNumber')}
                {...register('vesselClass')}
                disabled={loading || !!vesselDetail?.vesselClass}
                placeholder={t('txPlaceHolder.txClassNumber')}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0" xs={4}>
              <Input
                label={t('txHullNumber')}
                {...register('hullNumber')}
                disabled={loading || !!vesselDetail?.hullNumber}
                placeholder={t('txPlaceHolder.txHullNumber')}
                maxLength={MAX_LENGTH_CODE}
              />
            </Col>
            <Col>
              <Input
                label={t('txFleet')}
                {...register('fleetName')}
                disabled={loading || !!vesselDetail?.fleetName}
                placeholder={t('txPlaceHolder.txFleet')}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
            <Col className="pe-0">
              <SelectAsyncForm
                control={control}
                name="divisionId"
                disabled={
                  loading || !!vesselDetail?.divisionMapping?.division?.id
                }
                labelSelect={t('txBusinessDivision')}
                titleResults="Selected business division"
                placeholder="Please select"
                searchContent="Business division"
                textSelectAll="Select all"
                textBtnConfirm="Confirm"
                hasImage
                onChangeSearch={handleSearchDivisionOptionProps}
                options={divisionOptionsProps}
              />
            </Col>
          </Row>
        </div>
      </Container>
    ),
    [
      t,
      errors?.imoNumber?.message,
      errors?.name?.message,
      errors?.code?.message,
      errors?.countryFlag?.message,
      errors?.vesselTypeId?.message,
      errors?.buildDate?.message,
      errors?.shipyardCountry?.message,
      errors?.classificationSocietyId?.message,
      register,
      loading,
      vesselDetail?.imoNumber,
      vesselDetail?.name,
      vesselDetail?.code,
      vesselDetail?.countryFlag,
      vesselDetail?.vesselTypeId,
      vesselDetail?.callSign,
      vesselDetail?.buildDate,
      vesselDetail?.shipyardName,
      vesselDetail?.shipyardCountry,
      vesselDetail?.officialNumber,
      vesselDetail?.classificationSocietyId,
      vesselDetail?.vesselClass,
      vesselDetail?.hullNumber,
      vesselDetail?.fleetName,
      vesselDetail?.divisionMapping?.division?.id,
      control,
      filterFlagCountry,
      flagCountryOptions,
      handleGetVesselType,
      optionVesselType,
      filterShipyardCountry,
      shipyardCountryOptions,
      handleSearchClassificationSocietyOptionProps,
      classSocietyOptionsProps,
      handleSearchDivisionOptionProps,
      divisionOptionsProps,
    ],
  );

  const renderManagementOwnership = useMemo(
    () => (
      <Container className={cx(styles.container, 'mt-3')}>
        <div className={styles.containerForm}>
          <div className={cx(styles.titleContainer, 'pb-2')}>
            {t('txManagementOwnership')}
          </div>
        </div>

        <Controller
          control={control}
          name="vesselDocHolders"
          render={({ field }) => (
            <DocHolder
              loading={false}
              value={field.value}
              onchange={field.onChange}
              className="mb-3"
              disable
            />
          )}
        />
      </Container>
    ),
    [control, t],
  );

  const renderDetailInformation = useMemo(
    () => (
      <Container className={cx(styles.container, 'mt-3', 'pb-3')}>
        <div className={styles.containerForm}>
          <div className={cx(styles.titleContainer, 'pb-2')}>
            {t('txDetailInformation')}
          </div>
          <Row className="mx-0">
            <Col className="ps-0">
              <InputForm
                messageRequired={errors?.deadWeightTonnage?.message || ''}
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txDeadWeight')}
                label={t('txDeadWeight')}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="deadWeightTonnage"
                disabled={loading || !!vesselDetail?.deadWeightTonnage}
                isRequired
              />
            </Col>
            <Col>
              <InputForm
                messageRequired={errors?.grt?.message || ''}
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txGRT')}
                label={t('txGRT')}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="grt"
                disabled={loading || !!vesselDetail?.grt}
                isRequired
              />
            </Col>
            <Col className="pe-0">
              <InputForm
                messageRequired={errors?.nrt?.message || ''}
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txNRT')}
                label={t('txNRT')}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="nrt"
                disabled={loading || !!vesselDetail?.nrt}
                isRequired
              />
            </Col>
          </Row>
          <Row className="mx-0 pt-2">
            <Col className="ps-0">
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txTEUCapacity')}
                label={t('txTEUCapacity')}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="teuCapacity"
                disabled={loading || !!vesselDetail?.teuCapacity}
              />
            </Col>
            <Col>
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txMaxDraft')}
                label={
                  <span>
                    {t('txMaxDraft')}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="maxDraft"
                disabled={loading || !!vesselDetail?.maxDraft}
              />
            </Col>
            <Col className="pe-0">
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txLightShip')}
                label={t('txLightShip')}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="lightShip"
                disabled={loading || !!vesselDetail?.lightShip}
              />
            </Col>
          </Row>
          <div className={cx(styles.titleContainer, 'pt-2 pb-2')}>
            {t('txDimension')}
          </div>
          <Row className="mx-0">
            <Col className="ps-0">
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txLOA')}
                label={
                  <span>
                    {t('txLOA')}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="loa"
                disabled={loading || !!vesselDetail?.loa}
              />
            </Col>
            <Col>
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txLBP')}
                label={
                  <span>
                    {t('txLBP')}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="lbp"
                disabled={loading || !!vesselDetail?.lbp}
              />
            </Col>
            <Col className="pe-0">
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txBreath')}
                label={
                  <span>
                    {t('txBreath')}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="breath"
                disabled={loading || !!vesselDetail?.breath}
              />
            </Col>
          </Row>
          <Row className="mx-0 pt-2">
            <Col className="ps-0">
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txHeight')}
                label={
                  <span>
                    {t('txHeight')}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="height"
                disabled={loading || !!vesselDetail?.height}
              />
            </Col>
            <Col>
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={t('txPlaceHolder.txDepth')}
                label={
                  <span>
                    {t('txDepth')}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="depth"
                disabled={loading || !!vesselDetail?.depth}
              />
            </Col>
            <Col className="pe-0" />
          </Row>
        </div>
      </Container>
    ),
    [
      t,
      errors?.deadWeightTonnage?.message,
      errors?.grt?.message,
      errors?.nrt?.message,
      control,
      loading,
      vesselDetail?.deadWeightTonnage,
      vesselDetail?.grt,
      vesselDetail?.nrt,
      vesselDetail?.teuCapacity,
      vesselDetail?.maxDraft,
      vesselDetail?.lightShip,
      vesselDetail?.loa,
      vesselDetail?.lbp,
      vesselDetail?.breath,
      vesselDetail?.height,
      vesselDetail?.depth,
      renderTooltip,
    ],
  );

  const renderCrewInformation = useMemo(
    () => (
      <Container className={cx(styles.container, 'mt-3')}>
        <div className={styles.containerForm}>
          <div className={cx(styles.titleContainer, 'pb-2')}>
            {t('txCrewInformation')}
          </div>
          <div className={cx(styles.subTitleContainer, 'pb-2')}>
            {t('txCrewNationality')}
          </div>
          <Row className="mx-0">
            <Col className="ps-0">
              <SelectAsyncForm
                labelSelect={t('txCrewGrouping')}
                name="crewGroupingId"
                disabled={loading || !!vesselDetail?.crewGroupingId}
                control={control}
                placeholder="Please select"
                searchContent={t('txCrewGrouping')}
                textSelectAll="Select all"
                textBtnConfirm="Confirm"
                hasImage
                onChangeSearch={handleSearchCrewGrouping}
                options={crewGroupingOptionsProps}
              />
            </Col>
            <Col>
              <ModalListForm
                name="officers"
                labelSelect={t('txOfficers')}
                title={t('txOfficers')}
                disable
                control={control}
                data={muiltiCompanyOptions || []}
                rowLabels={rowLabelsOfficers}
                verticalResultClassName={styles.resultBox}
              />
            </Col>
            <Col className="pe-0">
              <ModalListForm
                name="rating"
                labelSelect={t('txRating')}
                title={t('txRating')}
                disable
                control={control}
                data={muiltiCompanyOptions || []}
                rowLabels={rowLabelsRatings}
                verticalResultClassName={styles.resultBox}
              />
            </Col>
          </Row>
        </div>
      </Container>
    ),
    [
      t,
      loading,
      vesselDetail?.crewGroupingId,
      control,
      handleSearchCrewGrouping,
      crewGroupingOptionsProps,
      muiltiCompanyOptions,
      rowLabelsOfficers,
      rowLabelsRatings,
    ],
  );

  // const renderSpecificFeature = useMemo(
  //   () => (
  //     <Container>
  //       <div className={styles.containerForm}>
  //         <div className={cx(styles.titleContainer, 'pb-2')}>
  //           {t('txSpecificFeature')}
  //         </div>
  //         <Row className="mx-0">
  //           <Col className="ps-0">
  //             <ModalListForm
  //               name="ownerIds"
  //               disable={loading || !!vesselDetail?.owners}
  //               isRequired
  //               labelSelect={t('txListOwner')}
  //               title={t('txListOwner')}
  //               control={control}
  //               data={userOptions || []}
  //               rowLabels={rowLabels}
  //               error={errors?.ownerIds?.message || ''}
  //               verticalResultClassName={styles.resultBox}
  //             />
  //           </Col>
  //           <Col>
  //             <div className={styles.label}>{t('txCustomerRestricted')}</div>
  //             <RadioForm
  //               name="customerRestricted"
  //               disabled={
  //                 loading || isBoolean(vesselDetail?.customerRestricted)
  //               }
  //               control={control}
  //               radioOptions={[
  //                 {
  //                   value: true,
  //                   label: 'Yes',
  //                 },
  //                 {
  //                   value: false,
  //                   label: 'No',
  //                 },
  //               ]}
  //             />
  //           </Col>
  //           <Col className="pe-0">
  //             <div className={styles.label}>{t('txBlacklistOnMOUWebsite')}</div>
  //             <RadioForm
  //               name="blacklistOnMOUWebsite"
  //               disabled={
  //                 loading || isBoolean(vesselDetail?.blacklistOnMOUWebsite)
  //               }
  //               control={control}
  //               radioOptions={[
  //                 {
  //                   value: true,
  //                   label: 'Yes',
  //                 },
  //                 {
  //                   value: false,
  //                   label: 'No',
  //                 },
  //               ]}
  //             />
  //           </Col>
  //         </Row>
  //       </div>
  //     </Container>
  //   ),
  //   [
  //     t,
  //     loading,
  //     vesselDetail?.owners,
  //     vesselDetail?.customerRestricted,
  //     vesselDetail?.blacklistOnMOUWebsite,
  //     control,
  //     userOptions,
  //     rowLabels,
  //     errors?.ownerIds?.message,
  //   ],
  // );

  if (loading) {
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
    <div className={cx(styles.wrapperContainer)}>
      {renderBasicInformation}
      {renderManagementOwnership}
      {renderDetailInformation}
      {renderCrewInformation}
      {/* {renderSpecificFeature} */}
    </div>
  );
};

export default ShipParticulars;
