import images from 'assets/images/images';
import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';
import { MAX_LENGTH_CODE, MAX_LENGTH_TEXT } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row } from 'reactstrap';
import Input from 'components/ui/input/Input';
import { useLocation } from 'react-router';
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
import DocHolder from 'components/vessel/forms/management-ownership/doc-holder/DocHolder';
import { convertToAgeDecimal } from 'helpers/utils.helper';
import { getListDivisionActions } from 'pages/division/store/action';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import SelectAsyncForm from 'components/react-hook-form/async-select/SelectAsyncForm';

import isBoolean from 'lodash/isBoolean';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { TableCharterer } from 'components/vessel/forms/TableCharterer';
import { TableVesselOwner } from 'components/vessel/forms/TableVesselOwner';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import useEffectOnce from 'hoc/useEffectOnce';
import { REGEXP_INPUT_MIN_VALUE_POSITIVE } from 'constants/regExpValidate.const';
import Tooltip from 'antd/lib/tooltip';
import styles from './ship-particulars.module.scss';

interface Props {
  loading?: boolean;
}

// Only allow numbers, one dot and two decimal places
const PARTTERN_DECIMAL = /^\d+\.{0,1}\d{0,2}$/;

const MAX_LENGTH_NUMBER = 9;

const ShipParticulars = ({ loading }: Props) => {
  const { t } = useTranslation([I18nNamespace.VESSEL, I18nNamespace.COMMON]);

  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const editMode = useMemo(() => pathname.includes('edit'), [pathname]);
  const { vesselDetail, errorList } = useSelector((state) => state.vessel);

  const { listCountry } = useSelector((state) => state.user);
  const { listVesselTypes } = useSelector((state) => state.vesselType);
  const { listCompanyManagementTypes } = useSelector(
    (state) => state.companyManagement,
  );
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
  const [docHolderOptions, setDocHolderOptions] = useState([]);

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
  const watchDocHolder = watch('docHolderId');
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

  // Doc Holder

  useEffect(() => {
    if (listCompanyManagementTypes) {
      const newDocHolderOptions = listCompanyManagementTypes?.data?.map(
        (item) => ({
          value: item.id,
          label: item.name,
          code: item?.code,
          imo: item?.companyIMO,
        }),
      );
      setDocHolderOptions(newDocHolderOptions);
    }
  }, [listCompanyManagementTypes]);

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
    if (watchDocHolder) {
      const docHolder = docHolderOptions?.find(
        (i) => i.value === watchDocHolder[0],
      );
      setValue('docHolderCode', docHolder?.code);
      setValue('cimoNumber', docHolder?.imo);
    }
  }, [docHolderOptions, setValue, watchDocHolder]);

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
      setValue('vesselCharterers', vesselCharterersData);
      setValue('vesselOwners', vesselOwnersData);
      setValue('vesselDocHolders', vesselDocHolders || []);
      setValue('imoNumber', vesselDetail?.imoNumber);
      setValue('name', vesselDetail?.name);
      setValue('code', vesselDetail?.code);
      setValue('callSign', vesselDetail?.callSign);
      setValue('shipyardName', vesselDetail?.shipyardName);
      setValue('countryFlag', [vesselDetail?.countryFlag]);
      setValue('vesselTypeId', [vesselDetail?.vesselTypeId]);
      setValue('buildDate', moment(vesselDetail?.buildDate));
      setValue('shipyardCountry', [vesselDetail?.shipyardCountry]);
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
      setValue('classificationSocietyId', [
        vesselDetail?.classificationSocietyId,
      ]);

      setValue('docHolderId', [vesselDetail?.docHolderId]);
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
      setValue('crewGroupingId', [vesselDetail?.crewGroupingId]);
      setValue('ownerIds', vesselDetail?.owners?.map((i) => i.id) || []);
      setValue('blacklistOnMOUWebsite', vesselDetail?.blacklistOnMOUWebsite);
      setValue('customerRestricted', vesselDetail?.customerRestricted);
      setValue(
        'docResponsiblePartyInspection',
        vesselDetail?.docResponsiblePartyInspection,
      );
      setValue('docResponsiblePartyQA', vesselDetail?.docResponsiblePartyQA);
    }
  }, [setValue, vesselDetail]);

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
      setError('code', { message: '' });
      setError('name', { message: '' });
      setError('imoNumber', { message: '' });
      setError('buildDate', { message: '' });
      setError('vesselTypeId', { message: '' });
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
                readOnly={loading || !editMode || !!vesselDetail?.imoNumber}
                disabledCss={loading || !editMode || !!vesselDetail?.imoNumber}
                maxLength={MAX_LENGTH_NUMBER}
              />
            </Col>
            <Col>
              <Input
                isRequired
                label={t('txVesselNameForm')}
                {...register('name')}
                readOnly={loading || !editMode || !!vesselDetail?.name}
                disabledCss={loading || !editMode || !!vesselDetail?.name}
                messageRequired={errors?.name?.message || ''}
                placeholder={t('txPlaceHolder.txVesselName')}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
            <Col className="pe-0">
              <Input
                label={t('txVesselCodeForm')}
                {...register('code')}
                readOnly={loading || !editMode || !!vesselDetail?.code}
                disabledCss={loading || !editMode || !!vesselDetail?.code}
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
                disabled={loading || !editMode || !!vesselDetail?.countryFlag}
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
                disabled={loading || !editMode || !!vesselDetail?.vesselTypeId}
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
                disabled={loading || !editMode || !!vesselDetail?.callSign}
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
                    inputReadOnly={!editMode}
                    maxDate={moment()}
                    control={control}
                    name="buildDate"
                    disabled={loading || !editMode || !!vesselDetail?.buildDate}
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
                placeholder={editMode ? t('txPlaceHolder.txShipyardName') : ''}
                {...register('shipyardName')}
                disabled={loading || !editMode || !!vesselDetail?.shipyardName}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>

            <Col className="pe-0">
              <SelectAsyncForm
                messageRequired={errors?.shipyardCountry?.message}
                control={control}
                name="shipyardCountry"
                disabled={
                  loading || !editMode || !!vesselDetail?.shipyardCountry
                }
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
                disabled={
                  loading || !editMode || !!vesselDetail?.officialNumber
                }
                placeholder={
                  editMode ? t('txPlaceHolder.txOfficialNumber') : ''
                }
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
            <Col>
              <SelectAsyncForm
                messageRequired={errors?.classificationSocietyId?.message}
                control={control}
                name="classificationSocietyId"
                disabled={
                  loading ||
                  !editMode ||
                  !!vesselDetail?.classificationSocietyId
                }
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
                disabled={loading || !editMode || !!vesselDetail?.vesselClass}
                placeholder={editMode ? t('txPlaceHolder.txClassNumber') : ''}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0" xs={4}>
              <Input
                label={t('txHullNumber')}
                {...register('hullNumber')}
                disabled={loading || !editMode || !!vesselDetail?.hullNumber}
                placeholder={editMode ? t('txPlaceHolder.txHullNumber') : ''}
                maxLength={MAX_LENGTH_CODE}
              />
            </Col>
            <Col>
              <Input
                label={t('txFleet')}
                {...register('fleetName')}
                disabled={loading || !editMode || !!vesselDetail?.fleetName}
                placeholder={editMode ? t('txPlaceHolder.txFleet') : ''}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
            <Col className="pe-0">
              <SelectAsyncForm
                control={control}
                name="divisionId"
                disabled={
                  loading ||
                  !editMode ||
                  !!vesselDetail?.divisionMapping?.division?.id
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
          <Row className="pt-2 mx-0">
            <Col className="ps-0" xs={4}>
              <div className={cx(styles.label, styles.fontWeight400)}>
                {t('txCustomerRestricted')}
              </div>
              <RadioForm
                name="customerRestricted"
                disabled={
                  loading ||
                  !editMode ||
                  isBoolean(vesselDetail?.customerRestricted)
                }
                control={control}
                radioOptions={[
                  {
                    value: true,
                    label: 'Yes',
                  },
                  {
                    value: false,
                    label: 'No',
                  },
                ]}
              />
            </Col>
            <Col className="pe-0" xs={4}>
              <div className={cx(styles.label, styles.fontWeight400)}>
                {t('txBlacklistOnMOUWebsite')}
              </div>
              <RadioForm
                name="blacklistOnMOUWebsite"
                disabled={
                  loading ||
                  !editMode ||
                  isBoolean(vesselDetail?.blacklistOnMOUWebsite)
                }
                control={control}
                radioOptions={[
                  {
                    value: true,
                    label: 'Yes',
                  },
                  {
                    value: false,
                    label: 'No',
                  },
                ]}
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
      editMode,
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
      vesselDetail?.customerRestricted,
      vesselDetail?.blacklistOnMOUWebsite,
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

        <Controller
          control={control}
          name="vesselCharterers"
          render={({ field }) => (
            <TableCharterer
              loading={false}
              value={field.value}
              onchange={field.onChange}
              className="mb-3"
              disable
            />
          )}
        />
        <Controller
          control={control}
          name="vesselOwners"
          render={({ field }) => (
            <TableVesselOwner
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
                disabled={
                  loading || !editMode || !!vesselDetail?.deadWeightTonnage
                }
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
                disabled={loading || !editMode || !!vesselDetail?.grt}
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
                disabled={loading || !editMode || !!vesselDetail?.nrt}
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
                disabled={loading || !editMode || !!vesselDetail?.teuCapacity}
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
                disabled={loading || !editMode || !!vesselDetail?.maxDraft}
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
                disabled={loading || !editMode || !!vesselDetail?.lightShip}
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
                disabled={loading || !editMode || !!vesselDetail?.loa}
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
                disabled={loading || !editMode || !!vesselDetail?.lbp}
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
                disabled={loading || !editMode || !!vesselDetail?.breath}
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
                disabled={loading || !editMode || !!vesselDetail?.height}
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
                disabled={loading || !editMode || !!vesselDetail?.depth}
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
      editMode,
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
      <Container className={cx(styles.container, 'mt-3', 'pb-3')}>
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
                disabled={
                  loading || !editMode || !!vesselDetail?.crewGroupingId
                }
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
      editMode,
      vesselDetail?.crewGroupingId,
      control,
      handleSearchCrewGrouping,
      crewGroupingOptionsProps,
      muiltiCompanyOptions,
      rowLabelsOfficers,
      rowLabelsRatings,
    ],
  );

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
    </div>
  );
};

export default ShipParticulars;
