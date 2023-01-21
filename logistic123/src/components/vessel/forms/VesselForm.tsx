import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import SelectUI from 'components/ui/select/Select';
import { MAX_LENGTH_TEXT } from 'constants/common.const';
import { Option, statusOptions } from 'constants/filter.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError } from 'helpers/notification.helper';
import { CreateVesselParams, Vessel } from 'models/api/vessel/vessel.model';
import { VesselType } from 'models/api/vessel-type/vessel-type.model';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import {
  clearUserManagementReducer,
  getCountryActions,
  getListUserActions,
} from 'store/user/user.action';
import { uploadFileActions } from 'store/vessel/vessel.action';
import {
  clearParamsVesselTypeReducer,
  clearVesselTypeReducer,
  getListVesselTypeActions,
} from 'store/vessel-type/vessel-type.action';
import * as yup from 'yup';
import isEqual from 'lodash/isEqual';
import Container from 'components/common/container/Container';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import ModalListForm from 'components/react-hook-form/modal-list-form/ModalListForm';
import { getListClassificationSocietyActionsApi } from 'api/vessel.api';
import { convertToAgeDecimal } from 'helpers/utils.helper';
import { CommonApiParam } from 'models/common.model';
import { formatDateIso } from 'helpers/date.helper';
import InputForm from 'components/react-hook-form/input-form/InputForm';

import { VESSEL_DETAIL_DYNAMIC_FIELDS } from 'constants/dynamic/vessel.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';

import {
  clearCrewGroupingReducer,
  getListCrewGroupingActions,
} from 'pages/crew-grouping/store/action';
import { getListDivisionActions } from 'pages/division/store/action';
import useEffectOnce from 'hoc/useEffectOnce';
import isEmpty from 'lodash/isEmpty';
import Tooltip from 'antd/lib/tooltip';
import { REGEXP_INPUT_MIN_VALUE_POSITIVE } from 'constants/regExpValidate.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import SelectAsyncForm from 'components/react-hook-form/async-select/SelectAsyncForm';
import isNaN from 'lodash/isNaN';
import styles from './form.module.scss';
import { TableCharterer } from './TableCharterer';
import { TableVesselOwner } from './TableVesselOwner';
import DocHolder from './management-ownership/doc-holder/DocHolder';
import {
  checkTimeLine,
  TIME_LINE,
} from './management-ownership/doc-holder/doc.func';

interface VesselManagementFormProps {
  screen: 'detail' | 'edit' | 'create';
  data: Vessel;
  onSubmit?: (CreateVesselTypeParams: CreateVesselParams) => void;
  dynamicLabels?: IDynamicLabel;
}

const FLAG_UNKNOWN = 'Unknown';

const defaultValues = {
  image: '',
  imoNumber: '',
  name: '',
  code: '',
  countryFlag: [FLAG_UNKNOWN],
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
  divisionId: undefined,
  status: 'active',
  deadWeightTonnage: '',
  // ownerIds: [],
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
// Only allow numbers, one dot and two decimal places
const PARTTERN_DECIMAL = /^\d+\.{0,1}\d{0,2}$/;

const MAX_LENGTH_NUMBER = 9;

const VesselManagementForm: FC<VesselManagementFormProps> = ({
  screen,
  data,
  onSubmit,
  dynamicLabels,
}) => {
  const dispatch = useDispatch();

  const { loading, errorList, avatarVessel } = useSelector(
    (state) => state.vessel,
  );
  const isImported = data?.isImported;
  const [firstErrorId, setFirstErrorId] = useState('');
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

  // const rowLabels = useMemo(
  //   () => [
  //     {
  //       label: 'checkbox',
  //       id: 'checkbox',
  //       width: 80,
  //     },
  //     {
  //       label: t('txListOwner'),
  //       id: 'name',
  //       width: 710,
  //     },
  //   ],
  //   [t],
  // );

  const rowLabelsOfficers = useMemo(
    () => [
      {
        label: 'checkbox',
        id: 'checkbox',
        width: 80,
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS.Officers,
        ),
        id: 'name',
        width: 710,
      },
    ],
    [dynamicLabels],
  );

  const rowLabelsRatings = useMemo(
    () => [
      {
        label: 'checkbox',
        id: 'checkbox',
        width: 80,
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS.Rating,
        ),
        id: 'name',
        width: 710,
      },
    ],
    [dynamicLabels],
  );

  const schema = yup.object().shape({
    imoNumber: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    code: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    name: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    vesselTypeId: yup
      .array()
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    countryFlag: yup
      .array()
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    buildDate: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    classificationSocietyId: yup
      .array()
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    // docHolderId: yup
    //   .array()
    //   .min(1, 'This field is required')
    //   .required(t('txFieldRequired')),
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
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
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
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
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
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    // ownerIds: yup
    //   .array()
    //   .min(1, t('txFieldRequired'))
    //   .required(t('txFieldRequired')),
  });

  const uploadFile = useRef(null);
  const {
    register,
    control,
    watch,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchBuildDate = watch('buildDate');
  // const watchDocHolder = watch('docHolderId');
  const watchCrewGrouping = watch('crewGroupingId');

  const sortPosition = useMemo(
    () => [
      'imoNumber',
      'code',
      'name',
      'vesselTypeId',
      'countryFlag',
      'buildDate',
      'classificationSocietyId',
      // 'docHolderId',
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
          setFirstErrorId(firstError);
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [sortPosition],
  );

  const optionVesselType = useMemo(() => {
    const options: Array<Option> = [];
    listVesselTypes?.data
      .filter((e) => e.status === 'active')
      .forEach((e: VesselType) => {
        options.push({ value: e.id, label: e.name });
      });
    return options;
  }, [listVesselTypes]);

  // const userOptions = useMemo(() => {
  //   let isOption = false;
  //   const listUserIds = listUser?.data?.map((item) => item.id) || [];
  //   let newData =
  //     listUser?.data?.map((item) => ({
  //       id: item.id,
  //       label: [item?.firstName, item?.lastName].join(' '),
  //       name: [item?.firstName, item?.lastName].join(' '),
  //     })) || [];

  //   if (screen !== 'create') {
  //     data?.owners?.forEach((itemOwner) => {
  //       isOption = listUserIds.includes(itemOwner?.id);
  //       if (!isOption) {
  //         newData = [
  //           ...newData,
  //           {
  //             id: itemOwner?.id,
  //             label: itemOwner?.username,
  //             name: itemOwner?.username,
  //           },
  //         ];
  //       }
  //     });
  //   }
  //   return newData;
  // }, [listUser?.data, screen, data?.owners]);

  const muiltiCompanyOptions = useMemo(() => {
    const newData =
      listCountry?.map((item) => ({
        id: item.name,
        name: item.name,
        label: item.name,
      })) || [];

    return newData;
  }, [listCountry]);

  const onSubmitForm = (formData) => {
    if (onSubmit) {
      const countryFlag = formData.countryFlag?.[0] || null;
      const vesselTypeId = formData.vesselTypeId?.[0] || null;
      const dateIso = getValues('buildDate')?.toISOString();
      const shipyardCountry = formData.shipyardCountry?.[0] || null;
      const classificationSocietyId =
        formData.classificationSocietyId?.[0] || null;
      const divisionId = formData.divisionId?.[0] || null;
      // const docHolderId = formData.docHolderId?.[0] || null;
      const crewGroupingId = formData.crewGroupingId?.[0] || null;
      const deadWeightTonnage = formData.deadWeightTonnage || null;
      const grt = formData.grt || null;
      const nrt = formData.nrt || null;
      const vesselDocHolders = formData.vesselDocHolders?.map((item) => ({
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
      if (!vesselDocHolders?.length) {
        toastError('DOC holder is required');
        return;
      }
      const dataSubmit = {
        ...formData,
        countryFlag,
        vesselTypeId,
        buildDate: dateIso,
        shipyardCountry,
        classificationSocietyId,
        divisionId,
        // docHolderId,
        docResponsiblePartyInspection: false,
        docResponsiblePartyQA: false,
        crewGroupingId,
        deadWeightTonnage,
        grt,
        nrt,
        vesselCharterers,
        vesselDocHolders,
        vesselOwners,
      };
      onSubmit(dataSubmit);
    }
  };

  const handleSearchCrewGrouping = useCallback(
    (searchName?: string) => {
      const newSearchCrewGrouping = crewGroupingOptions.filter((e) =>
        e.label
          ?.toString()
          .toLowerCase()
          .includes(searchName?.trim()?.toLowerCase()),
      );
      setCrewGroupingOptionsProps(newSearchCrewGrouping);
    },
    [crewGroupingOptions],
  );

  // Division

  const handleSearchDivisionOptionProps = useCallback(
    (searchName?: string) => {
      const newSearchDivision = divisionOptions.filter((e) =>
        e.label
          ?.toString()
          .toLowerCase()
          .includes(searchName?.trim()?.toLowerCase()),
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
      const newClassSocietyOptions = classSocietyOptions.filter((e) =>
        e.label
          ?.toString()
          .toLowerCase()
          .includes(searchName?.trim()?.toLowerCase()),
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
        label:
          String(item?.code)?.toLocaleLowerCase() !== 'unknown'
            ? `${item.name} - ${item.code}`
            : item.name,
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
      const newFlagCountryOptions = countryOptions.filter((e) =>
        e.label
          ?.toString()
          .toLowerCase()
          .includes(searchName?.trim()?.toLowerCase()),
      );
      setFlagCountryOptions(newFlagCountryOptions);
    },
    [countryOptions],
  );

  useEffect(() => {
    if (listCountry?.length) {
      const countryOptionList = listCountry.map((item) => ({
        value: item.name,
        label: item.name,
        image: item?.flagImg || '',
      }));
      setCountryOptions(countryOptionList);
      setFlagCountryOptions(countryOptionList);
      setShipyardCountryOptions(countryOptionList);
    }
  }, [listCountry]);

  const filterShipyardCountry = useCallback(
    (searchName?: string) => {
      const newShipyardCountryOptions = countryOptions.filter((e) =>
        e.label
          ?.toString()
          .toLowerCase()
          .includes(searchName?.trim()?.toLowerCase()),
      );
      setShipyardCountryOptions(newShipyardCountryOptions);
    },
    [countryOptions],
  );

  const fillUser = useCallback((data) => data?.map((e) => e.id), []);

  const onChangeFile = useCallback(
    (event) => {
      const { files } = event.target;
      const typeFile: string[] = (files && files[0]?.type?.split('/')) || [];
      const formDataImages = new FormData();
      formDataImages.append('files', files[0]);
      formDataImages.append('fileType', 'image');
      formDataImages.append('prefix', 'avatars');
      if (
        typeFile[0] === 'image' &&
        files[0]?.size < 5242881 &&
        (typeFile[1] === 'jpg' ||
          typeFile[1] === 'png' ||
          typeFile[1] === 'jpeg')
      ) {
        dispatch(uploadFileActions.request(formDataImages));
        return null;
      }

      if (
        typeFile[0] === 'image' &&
        files[0]?.size > 5242880 &&
        (typeFile[1] === 'jpg' ||
          typeFile[1] === 'png' ||
          typeFile[1] === 'jpeg')
      ) {
        // toastError('Please choose your avatar image that size is up to 3MB');
        toastError(
          `This specified file ${
            files[0]?.name
          } could not be uploaded. The file is ${
            // eslint-disable-next-line no-restricted-properties
            files[0]?.size / Math.pow(2, 20)
          } exceeding the maximum file size of 5 MB`,
        );
        return null;
      }
      if (files[0]?.size > 1) {
        toastError('This type is not supported');
      }
      return null;
    },
    [dispatch],
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

  const resetDefault = useCallback(() => {
    window.location.reload();
    history.goBack();
  }, []);

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const params = getValues();
    defaultParams = defaultValues;

    if (isEqual(defaultParams, params)) {
      if (screen === 'create') {
        history.push(AppRouteConst.VESSEL);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Cancel?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () =>
          screen === 'create'
            ? history.push(AppRouteConst.VESSEL)
            : resetDefault(),
      });
    }
  }, [dynamicLabels, getValues, resetDefault, screen]);

  const clearReducer = useCallback(async () => {
    await dispatch(clearUserManagementReducer());
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
    if (watchCrewGrouping) {
      const crewGrouping = crewGroupingOptions?.find(
        (i) => i.value === watchCrewGrouping[0],
      );
      const initOfficers = crewGrouping?.officers || [];
      const initRating = crewGrouping?.rating || [];
      setValue('officers', initOfficers);
      setValue('rating', initRating);
    }
  }, [setValue, watchCrewGrouping, crewGroupingOptions]);

  useEffect(() => {
    if (data) {
      const vesselCharterersData = data.vesselCharterers?.map(
        (item, index) => ({
          sNo: index + 1,
          id: item?.id,
          company: item.company,
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
      const vesselOwnersData = data?.vesselOwners?.map((item, index) => ({
        sNo: index + 1,
        id: item?.id,
        company: item.company,
        companyId: item.companyId,
        code: item?.company?.code,
        name: item?.company?.name,
        cimo: item?.company?.companyIMO,
        fromDate: item?.fromDate ? moment(item?.fromDate) : null,
        toDate: item?.toDate ? moment(item?.toDate) : null,
        responsiblePartyInspection: item?.responsiblePartyInspection,
        responsiblePartyQA: item?.responsiblePartyQA,
        remark: item?.remark || '',
      }));
      const vesselDocHolders = data?.vesselDocHolders?.map((item, index) => ({
        sNo: index + 1,
        id: item?.id,
        company: item.company,
        companyId: item.companyId,
        code: item?.company?.code,
        name: item?.company?.name,
        cimo: item?.company?.companyIMO,
        responsiblePartyInspection: item?.responsiblePartyInspection,
        responsiblePartyQA: item?.responsiblePartyQA,
        fromDate: item?.fromDate ? moment(item?.fromDate) : null,
        toDate: item?.toDate ? moment(item?.toDate) : null,
        remark: item?.remark || '',
      }));
      setValue('imoNumber', data.imoNumber);
      setValue('name', data.name);
      setValue('code', data.code);
      setValue('callSign', data.callSign);
      setValue('shipyardName', data.shipyardName);
      setValue(
        'countryFlag',
        data.countryFlag ? [data.countryFlag] : [FLAG_UNKNOWN],
      );
      setValue('vesselTypeId', data.vesselTypeId ? [data.vesselTypeId] : []);
      setValue('buildDate', moment(data.buildDate));
      setValue(
        'shipyardCountry',
        data.shipyardCountry ? [data.shipyardCountry] : [],
      );
      setValue('officialNumber', data.officialNumber);
      setValue('vesselClass', data.vesselClass);
      setValue('fleetName', data.fleetName);
      setValue('hullNumber', data.hullNumber);
      setValue('status', data.status);
      setValue(
        'divisionId',
        data.divisionMapping?.division?.id
          ? [data.divisionMapping?.division?.id]
          : [],
      );
      setValue(
        'classificationSocietyId',
        data.classificationSocietyId ? [data.classificationSocietyId] : [],
      );

      // setValue('docHolderId', data.docHolderId ? [data.docHolderId] : []);
      setValue('deadWeightTonnage', Number(data.deadWeightTonnage));
      setValue('grt', isNaN(data.grt) ? null : String(data.grt));
      setValue('nrt', isNaN(data.nrt) ? null : String(data.nrt));
      setValue('teuCapacity', data.teuCapacity);
      setValue(
        'maxDraft',
        data.maxDraft ? Number(data.maxDraft)?.toFixed(2) : null,
      );
      setValue('lightShip', data.lightShip);
      setValue('loa', data.loa);
      setValue('lbp', data.lbp);
      setValue('breath', data.breath);
      setValue('height', data.height);
      setValue('depth', data.depth);
      setValue(
        'crewGroupingId',
        data.crewGroupingId ? [data.crewGroupingId] : [],
      );
      // setValue('ownerIds', fillUser(data.owners));
      setValue('blacklistOnMOUWebsite', data.blacklistOnMOUWebsite);
      setValue('customerRestricted', data.customerRestricted);
      // setValue(
      //   'docResponsiblePartyInspection',
      //   data.docResponsiblePartyInspection,
      // );
      setValue('vesselDocHolders', vesselDocHolders || []);
      setValue('vesselCharterers', vesselCharterersData || []);
      setValue('vesselOwners', vesselOwnersData || []);
    }
  }, [data, fillUser, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            scrollToView({
              code: true,
            });
            setError('code', { message: item.message });
            break;
          case 'name':
            scrollToView({
              name: true,
            });
            setError('name', { message: item.message });
            break;
          case 'imoNumber':
            scrollToView({
              imoNumber: true,
            });
            setError('imoNumber', { message: item.message });
            break;
          case 'buildDate':
            scrollToView({
              buildDate: true,
            });
            setError('buildDate', { message: item.message });
            break;
          case 'vesselType':
            scrollToView({
              vesselTypeId: true,
            });
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
  }, [errorList, scrollToView, setError]);

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

  useEffect(() => {
    if (avatarVessel) {
      setValue('image', avatarVessel.id);
    }
  }, [avatarVessel, setValue]);

  const isDisabledFromRS = useMemo(() => {
    if (screen === 'detail' || loading || isImported) {
      return true;
    }
    return false;
  }, [isImported, loading, screen]);

  const isNormalDisabled = useMemo(() => {
    if (screen === 'detail' || loading) {
      return true;
    }
    return false;
  }, [loading, screen]);

  const renderTooltip = useMemo(
    () => (
      <Tooltip
        placement="top"
        title={
          <div className={styles.infoText}>
            {renderDynamicLabel(
              dynamicLabels,
              VESSEL_DETAIL_DYNAMIC_FIELDS[
                'User can use decimal point. User can enter up to 2 numbers after the decimal point. Example: 145.26'
              ],
            )}
          </div>
        }
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
    [dynamicLabels],
  );

  const renderImage = useMemo(
    () => (
      <Container id="image">
        <div className={cx('d-flex align-items-center', styles.card)}>
          <img
            src={avatarVessel?.url || images.default.icVesselDefault}
            onError={({ currentTarget }) => {
              if (currentTarget && currentTarget?.src) {
                // eslint-disable-next-line no-param-reassign
                currentTarget.src = images.default.icVesselDefault;
              }
            }}
            alt="avatar"
            className={styles.avatar}
          />
          {screen !== 'detail' && (
            <div className="ps-3">
              <p className={styles.titleUploadFile}>
                {renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Select an image'],
                )}
              </p>
              <label htmlFor="file-input">
                <input
                  type="file"
                  ref={uploadFile}
                  accept=".png, .jpg"
                  className={styles.inputFile}
                  onChange={onChangeFile}
                />
                <Button
                  buttonSize={ButtonSize.Small}
                  onClick={() => uploadFile.current.click()}
                >
                  {renderDynamicLabel(
                    dynamicLabels,
                    VESSEL_DETAIL_DYNAMIC_FIELDS.Browser,
                  )}
                </Button>
              </label>
            </div>
          )}
        </div>
      </Container>
    ),
    [avatarVessel?.url, dynamicLabels, onChangeFile, screen],
  );

  const renderBasicInformation = () => (
    <Container>
      <div className={styles.containerForm}>
        <div className={cx(styles.titleContainer, 'pb-2')}>
          {renderDynamicLabel(
            dynamicLabels,
            VESSEL_DETAIL_DYNAMIC_FIELDS['Basic information'],
          )}
        </div>
        <Row className="mx-0">
          <Col className="ps-0">
            <Input
              id="imoNumber"
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['IMO number'],
              )}
              readOnly={isDisabledFromRS}
              disabledCss={isDisabledFromRS}
              isRequired
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Enter IMO number'],
              )}
              messageRequired={errors?.imoNumber?.message || ''}
              autoFocus={firstErrorId === 'imoNumber'}
              {...register('imoNumber')}
              maxLength={MAX_LENGTH_NUMBER}
            />
          </Col>
          <Col>
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Vessel name'],
              )}
              {...register('name')}
              id="name"
              readOnly={isDisabledFromRS}
              disabledCss={isDisabledFromRS}
              messageRequired={errors?.name?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Enter vessel name'],
              )}
              maxLength={MAX_LENGTH_TEXT}
              autoFocus={firstErrorId === 'name'}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Vessel code'],
              )}
              {...register('code')}
              id="code"
              isRequired
              disabledCss={isDisabledFromRS}
              messageRequired={errors?.code?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Enter vessel code'],
              )}
              maxLength={15}
              autoFocus={firstErrorId === 'code'}
            />
          </Col>
        </Row>
        <Row className="mx-0 pt-2">
          <Col className="ps-0">
            <SelectAsyncForm
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS.Flag,
              )}
              name="countryFlag"
              id="countryFlag"
              disabled={isDisabledFromRS}
              dynamicLabels={dynamicLabels}
              isRequired
              control={control}
              placeholder={
                screen !== 'detail'
                  ? renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )
                  : ''
              }
              searchContent={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS.Flag,
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
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
              dynamicLabels={dynamicLabels}
              name="vesselTypeId"
              id="vesselTypeId"
              disabled={isDisabledFromRS}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Vessel type'],
              )}
              isRequired
              titleResults={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Selected vessel type'],
              )}
              placeholder={
                screen !== 'detail'
                  ? renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )
                  : ''
              }
              searchContent={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Vessel type'],
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              hasImage
              onChangeSearch={handleGetVesselType}
              options={optionVesselType}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Call sign'],
              )}
              {...register('callSign')}
              disabled={isDisabledFromRS}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Enter call sign'],
              )}
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>
        <Row className="mx-0 pt-2">
          <Col className="ps-0">
            <Row className="mx-0">
              <Col sm={9} className="ps-0">
                <DateTimePicker
                  disabled={isDisabledFromRS}
                  messageRequired={errors?.buildDate?.message || ''}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    VESSEL_DETAIL_DYNAMIC_FIELDS['Date built'],
                  )}
                  isRequired
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Please select'],
                  )}
                  className="w-100"
                  inputReadOnly={screen === 'detail'}
                  maxDate={moment()}
                  control={control}
                  name="buildDate"
                  id="buildDate"
                />
              </Col>
              <Col sm={3} className="pe-0 ps-0">
                <Input
                  label={renderDynamicLabel(
                    dynamicLabels,
                    VESSEL_DETAIL_DYNAMIC_FIELDS.Age,
                  )}
                  disabled
                  {...register('age')}
                  hideCountCharacters
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Shipyard name'],
              )}
              disabled={isNormalDisabled}
              placeholder={
                screen !== 'detail'
                  ? renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['Enter shipyard name'],
                    )
                  : ''
              }
              {...register('shipyardName')}
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
          <Col className="pe-0">
            <SelectAsyncForm
              control={control}
              name="shipyardCountry"
              dynamicLabels={dynamicLabels}
              disabled={isNormalDisabled}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Shipyard country'],
              )}
              titleResults={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Selected cities'],
              )}
              placeholder={
                screen !== 'detail'
                  ? renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )
                  : ''
              }
              searchContent={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS.Country,
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
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
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Official number'],
              )}
              {...register('officialNumber')}
              disabled={isNormalDisabled}
              placeholder={
                screen !== 'detail'
                  ? renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['Enter official number'],
                    )
                  : ''
              }
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
          <Col>
            <SelectAsyncForm
              messageRequired={errors?.classificationSocietyId?.message}
              control={control}
              dynamicLabels={dynamicLabels}
              name="classificationSocietyId"
              id="classificationSocietyId"
              disabled={isNormalDisabled}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Classification society'],
              )}
              isRequired
              titleResults={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Selected classification society'],
              )}
              placeholder={
                screen !== 'detail'
                  ? renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )
                  : ''
              }
              searchContent={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Classification society'],
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              hasImage
              onChangeSearch={handleSearchClassificationSocietyOptionProps}
              options={classSocietyOptionsProps}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Class number'],
              )}
              {...register('vesselClass')}
              disabled={isNormalDisabled}
              placeholder={
                screen !== 'detail'
                  ? renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['Enter class number'],
                    )
                  : ''
              }
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0" xs={4}>
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Hull number'],
              )}
              {...register('hullNumber')}
              disabled={isNormalDisabled}
              placeholder={
                screen !== 'detail'
                  ? renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['Enter hull number'],
                    )
                  : ''
              }
              maxLength={20}
            />
          </Col>
          <Col>
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS.Fleet,
              )}
              {...register('fleetName')}
              disabled={isNormalDisabled}
              placeholder={
                screen !== 'detail'
                  ? renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['Enter fleet'],
                    )
                  : ''
              }
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
          <Col className="pe-0">
            <SelectAsyncForm
              control={control}
              name="divisionId"
              dynamicLabels={dynamicLabels}
              disabled={isNormalDisabled}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Business division'],
              )}
              titleResults={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Selected business division'],
              )}
              placeholder={
                screen !== 'detail'
                  ? renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )
                  : ''
              }
              searchContent={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Business division'],
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              hasImage
              onChangeSearch={handleSearchDivisionOptionProps}
              options={divisionOptionsProps}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0" xs={4}>
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS.Status,
              )}
              data={statusOptions}
              disabled={isDisabledFromRS}
              name="status"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
            />
          </Col>
        </Row>
      </div>
    </Container>
  );

  const renderManagementOwnership = useMemo(
    () => (
      <Container>
        <div className={styles.containerForm}>
          <div className={cx(styles.titleContainer, 'pb-2')}>
            {renderDynamicLabel(
              dynamicLabels,
              VESSEL_DETAIL_DYNAMIC_FIELDS['Management/Ownership'],
            )}
          </div>
          <div className={styles.titleNote}>
            {renderDynamicLabel(
              dynamicLabels,
              VESSEL_DETAIL_DYNAMIC_FIELDS[
                'You can add management / charterer / owner companies for vessel in this section.'
              ],
            )}
          </div>
          <PermissionCheck
            options={{
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY,
              action: ActionTypeEnum.CREATE,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
                <div className="pb-2">
                  <span className={cx(styles.subTitleContainer)}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS.Note,
                    )}
                    :
                  </span>
                  <span className={styles.titleNote}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS[
                        'If you cannot find companies you want to add, then please '
                      ],
                    )}
                  </span>
                  <span className={cx(styles.subTitleContainer)}>
                    <a
                      href={AppRouteConst.COMPANY_CREATE}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {renderDynamicLabel(
                        dynamicLabels,
                        VESSEL_DETAIL_DYNAMIC_FIELDS['Create new company'],
                      )}
                    </a>
                  </span>
                </div>
              )
            }
          </PermissionCheck>
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
              disable={isNormalDisabled}
              initialData={data?.vesselDocHolders}
              dynamicLabels={dynamicLabels}
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
              disable={isNormalDisabled}
              initialData={data?.vesselCharterers}
              dynamicLabels={dynamicLabels}
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
              disable={isNormalDisabled}
              initialData={data?.vesselOwners}
              dynamicLabels={dynamicLabels}
            />
          )}
        />
      </Container>
    ),
    [
      dynamicLabels,
      control,
      isNormalDisabled,
      data?.vesselDocHolders,
      data?.vesselCharterers,
      data?.vesselOwners,
    ],
  );

  const renderDetailInformation = useMemo(
    () => (
      <Container className="pb-4">
        <div className={styles.containerForm}>
          <div className={cx(styles.titleContainer, 'pb-2')}>
            {renderDynamicLabel(
              dynamicLabels,
              VESSEL_DETAIL_DYNAMIC_FIELDS['Detailed information'],
            )}
          </div>
          <Row className="mx-0">
            <Col className="ps-0">
              <InputForm
                messageRequired={errors?.deadWeightTonnage?.message || ''}
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter dead weight (Summer)'],
                )}
                label={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Dead weight (Summer)'],
                )}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="deadWeightTonnage"
                id="deadWeightTonnage"
                isRequired
                disabled={isDisabledFromRS}
                autoFocus={firstErrorId === 'deadWeightTonnage'}
              />
            </Col>
            <Col>
              <InputForm
                messageRequired={errors?.grt?.message || ''}
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter GRT'],
                )}
                label={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS.GRT,
                )}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="grt"
                id="grt"
                isRequired
                disabled={isDisabledFromRS}
                autoFocus={firstErrorId === 'grt'}
              />
            </Col>
            <Col className="pe-0">
              <InputForm
                messageRequired={errors?.nrt?.message || ''}
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter NRT'],
                )}
                label={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS.NRT,
                )}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="nrt"
                id="nrt"
                isRequired
                readOnly={isDisabledFromRS}
                disabledCss={isDisabledFromRS}
                autoFocus={firstErrorId === 'nrt'}
              />
            </Col>
          </Row>
          <Row className="mx-0 pt-2">
            <Col className="ps-0">
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter TEU capacity'],
                )}
                label={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['TEU capacity'],
                )}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="teuCapacity"
                disabled={isNormalDisabled}
              />
            </Col>
            <Col>
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter max draft (Summer) (m)'],
                )}
                label={
                  <span>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['Max draft (Summer) (m)'],
                    )}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="maxDraft"
                disabled={isDisabledFromRS}
              />
            </Col>
            <Col className="pe-0">
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter light ship'],
                )}
                label={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Light ship'],
                )}
                patternValidate={REGEXP_INPUT_MIN_VALUE_POSITIVE}
                control={control}
                name="lightShip"
                disabled={isNormalDisabled}
              />
            </Col>
          </Row>
          <div className={cx(styles.titleContainer, 'pt-2 pb-2')}>
            {renderDynamicLabel(
              dynamicLabels,
              VESSEL_DETAIL_DYNAMIC_FIELDS.Dimension,
            )}
          </div>
          <Row className="mx-0">
            <Col className="ps-0">
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter LOA (m)'],
                )}
                label={
                  <span>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['LOA (m)'],
                    )}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="loa"
                disabled={isDisabledFromRS}
              />
            </Col>
            <Col>
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter LBP (m)'],
                )}
                label={
                  <span>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['LBP (m)'],
                    )}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="lbp"
                disabled={isNormalDisabled}
              />
            </Col>
            <Col className="pe-0">
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter breath (m)'],
                )}
                label={
                  <span>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['Breath (m)'],
                    )}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="breath"
                disabled={isNormalDisabled}
              />
            </Col>
          </Row>
          <Row className="mx-0 pt-2">
            <Col className="ps-0">
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter height (m)'],
                )}
                label={
                  <span>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['Height (m)'],
                    )}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="height"
                disabled={isNormalDisabled}
              />
            </Col>
            <Col>
              <InputForm
                maxLength={MAX_LENGTH_NUMBER}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Enter depth (m)'],
                )}
                label={
                  <span>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_DETAIL_DYNAMIC_FIELDS['Depth (m)'],
                    )}
                    {renderTooltip}
                  </span>
                }
                patternValidate={PARTTERN_DECIMAL}
                control={control}
                name="depth"
                disabled={isDisabledFromRS}
              />
            </Col>
            <Col className="pe-0" />
          </Row>
        </div>
      </Container>
    ),
    [
      dynamicLabels,
      errors?.deadWeightTonnage?.message,
      errors?.grt?.message,
      errors?.nrt?.message,
      control,
      isDisabledFromRS,
      firstErrorId,
      isNormalDisabled,
      renderTooltip,
    ],
  );

  const renderCrewInformation = useMemo(
    () => (
      <Container>
        <div className={styles.containerForm}>
          <div className={cx(styles.titleContainer, 'pb-2')}>
            {renderDynamicLabel(
              dynamicLabels,
              VESSEL_DETAIL_DYNAMIC_FIELDS['Crew information'],
            )}
          </div>
          <div className={cx(styles.subTitleContainer, 'pb-2')}>
            {renderDynamicLabel(
              dynamicLabels,
              VESSEL_DETAIL_DYNAMIC_FIELDS['Crew nationality'],
            )}
          </div>
          <Row className="mx-0">
            <Col className="ps-0">
              <SelectAsyncForm
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Crew grouping'],
                )}
                dynamicLabels={dynamicLabels}
                name="crewGroupingId"
                disabled={isNormalDisabled}
                control={control}
                placeholder={
                  screen !== 'detail'
                    ? renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS['Please select'],
                      )
                    : ''
                }
                searchContent={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Crew grouping'],
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Select all'],
                )}
                textBtnConfirm={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Confirm,
                )}
                hasImage
                onChangeSearch={handleSearchCrewGrouping}
                options={crewGroupingOptionsProps}
              />
            </Col>
            <Col>
              <ModalListForm
                name="officers"
                dynamicLabels={dynamicLabels}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS.Officers,
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS.Officers,
                )}
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
                dynamicLabels={dynamicLabels}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS.Rating,
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS.Rating,
                )}
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
      dynamicLabels,
      isNormalDisabled,
      control,
      screen,
      handleSearchCrewGrouping,
      crewGroupingOptionsProps,
      muiltiCompanyOptions,
      rowLabelsOfficers,
      rowLabelsRatings,
    ],
  );

  const renderSpecificFeature = useMemo(
    () => (
      <Container>
        <div className={styles.containerForm}>
          <div className={cx(styles.titleContainer, 'pb-2')}>
            {renderDynamicLabel(
              dynamicLabels,
              VESSEL_DETAIL_DYNAMIC_FIELDS['i-Nautix specific feature'],
            )}
          </div>
          <Row className="mx-0">
            {/* <Col className="ps-0">
              <ModalListForm
                name="ownerIds"
                id="ownerIds"
                isRequired
                labelSelect={t('txListOwner')}
                title={t('txListOwner')}
                disable={screen === 'detail'}
                control={control}
                data={userOptions || []}
                rowLabels={rowLabels}
                error={errors?.ownerIds?.message || ''}
                verticalResultClassName={styles.resultBox}
              />
            </Col> */}
            <Col>
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Customer restricted'],
                )}
              </div>
              <RadioForm
                name="customerRestricted"
                control={control}
                disabled={isNormalDisabled}
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
            <Col className="pe-0">
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  VESSEL_DETAIL_DYNAMIC_FIELDS['Blacklist on MOU website'],
                )}
              </div>
              <RadioForm
                name="blacklistOnMOUWebsite"
                control={control}
                disabled={isNormalDisabled}
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
    [dynamicLabels, control, isNormalDisabled],
  );

  return loading && screen !== 'create' ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <>
      {renderImage}
      {renderBasicInformation()}
      {renderManagementOwnership}
      {renderDetailInformation}
      {renderCrewInformation}
      {renderSpecificFeature}
      {screen !== 'detail' && (
        <GroupButton
          className={styles.GroupButton}
          dynamicLabels={dynamicLabels}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm, scrollToView)}
          disable={loading}
        />
      )}
    </>
  );
};

export default VesselManagementForm;
