import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import useEffectOnce from 'hoc/useEffectOnce';
import { getLatLngByAddress, loadGoogleMap } from 'helpers/google.map.helper';

import Checkbox from 'antd/lib/checkbox';
import { Row as RowAnt, Col as ColAnt } from 'antd/lib/grid';

import cx from 'classnames';
import Container from 'components/common/container/Container';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import {
  NewAsyncOptions,
  OptionProps,
} from 'components/ui/async-select/NewAsyncSelect';
import moment from 'moment';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import SelectUI from 'components/ui/select/Select';
import { statusOptions } from 'constants/filter.const';
import {
  REGEXP_INPUT_FAX_NUMBER,
  REGEXP_INPUT_PHONE_NUMBER,
} from 'constants/regExpValidate.const';
import { RoleScope, ROLES_SCOPE } from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError } from 'helpers/notification.helper';
import {
  AllowedSubscriptionsEnum,
  CompanyLevelEnum,
  CompanyManagementDetail,
  CreateManagementParams,
  SubscriptionAsEnum,
} from 'models/store/company/company.model';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import {
  clearCompanyManagementReducer,
  createCompanyManagementActions,
  getListCompanyManagementActions,
  uploadFileActions,
} from 'store/company/company.action';

import {
  clearUserManagementReducer,
  getCountryActions,
  getProvinceActions,
} from 'store/user/user.action';
import sortBy from 'lodash/sortBy';
import { formatDateIso } from 'helpers/date.helper';
import { scrollIntoErrors, validateEmail } from 'helpers/utils.helper';
import * as yup from 'yup';
import upperCase from 'lodash/upperCase';
import union from 'lodash/union';
import { CompanyTypeEnum } from 'pages/company-type/modal/ModalFormCompanyType';
import { getListCompanyTypeActions } from 'pages/company-type/store/action';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_IMO,
  MAX_LENGTH_TEXT,
} from 'constants/common.const';

import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { COMPANY_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/company.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import styles from './form.module.scss';
import './form.scss';
import MailManagement from '../mail-management/MailManagement';
import SubscriptionPackage from '../subscription-package/SubscriptionPackage';

interface CompanyManagementFormProps {
  isView: boolean;
  data: CompanyManagementDetail;
  onSubmit: (data: CreateManagementParams) => void;
  isCreate?: boolean;
  loading?: boolean;
}
const defaultValues = {
  code: '',
  name: '',
  logo: null,
  status: 'active',
  country: [],
  companyLevel: '',
  allowedSubscriptions: [],
  subscriptionAs: [],
  senderEmail: '',
  isUseSystemEmail: true,
  recipientEmails: [],
  companyTypeIds: [],
  abbreviation: '',
  companyIMO: '',
  stateOrProvince: [],
  townOrCity: '',
  address: '',
  phone: '',
  fax: '',
  email: '',
  firstName: '',
  lastName: '',
  latitude: 0,
  longitude: 0,
  subscription: null,
};

let isFirstLoad: boolean = true;

enum CompanyTypeMulti {
  'SHIP_OWNER_CHARTERER' = 'Ship Owner - Charterer',
  'SHIP_OWNER' = 'Ship Owner',
  'CHARTERER' = 'Charterer',
}

const CompanyManagementForm: FC<CompanyManagementFormProps> = ({
  isView,
  data,
  onSubmit,
  isCreate,
  loading,
}) => {
  const { userInfo } = useSelector((state) => state.authenticate);
  const { errorList, avatarCompany } = useSelector(
    (state) => state.companyManagement,
  );
  const { id } = useParams<{ id: string }>();

  const { listData } = useSelector((state) => state.companyType);
  const [CompanyTypeOptionList, setCompanyTypeOptionList] = useState<
    NewAsyncOptions[]
  >([]);
  const { listCompanyManagementTypes } = useSelector(
    (state) => state.companyManagement,
  );

  const uploadFile = useRef(null);
  const dispatch = useDispatch();
  const { disable, listCountry, listProvince } = useSelector(
    (state) => state.user,
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.GroupCompanyCompany,
    modulePage: getCurrentModulePageByStatus(!isView, isCreate),
  });

  const schemaShape = useMemo(
    () => ({
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
      companyIMO: yup
        .string()
        .trim()
        .nullable()
        .when('companyTypeIds', ([companyTypeIds], schema) =>
          companyTypeIds?.label === 'Ship management (DOC holder)' ||
          companyTypeIds?.[0]?.label === 'Ship management (DOC holder)'
            ? schema.required(
                renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['This field is required'],
                ),
              )
            : schema,
        ),
      abbreviation: yup
        .string()
        .trim()
        .nullable()
        .required(
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
      companyLevel: yup
        .string()
        .trim()
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
      status: yup
        .string()
        .trim()
        .nullable()
        .required(
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
      companyTypeIds: yup
        .array()
        .nullable()
        .required(
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        )
        .min(
          1,
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
      stateOrProvince: yup
        .array()
        .nullable()
        .when('allowedSubscriptions', (allowedSubscriptions, schema) =>
          allowedSubscriptions?.includes(AllowedSubscriptionsEnum.INSPECTION)
            ? schema
                .required(
                  renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['This field is required'],
                  ),
                )
                .min(
                  1,
                  renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['This field is required'],
                  ),
                )
            : schema.min(0),
        ),
      allowedSubscriptions: yup
        .array()
        .nullable()
        .required(
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        )
        .min(
          1,
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
      subscriptionAs: yup
        .array()
        .nullable()
        .required(
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        )
        .min(
          1,
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
      country: yup
        .array()
        .nullable()
        .when('allowedSubscriptions', (allowedSubscriptions, schema) =>
          allowedSubscriptions?.includes(AllowedSubscriptionsEnum.INSPECTION)
            ? schema.min(
                1,
                renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['This field is required'],
                ),
              )
            : schema,
        ),
      townOrCity: yup
        .string()
        .trim()
        .nullable()
        .when('allowedSubscriptions', (allowedSubscriptions, schema) =>
          allowedSubscriptions?.includes(AllowedSubscriptionsEnum.INSPECTION)
            ? schema.required(
                renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['This field is required'],
                ),
              )
            : schema,
        ),
      address: yup
        .string()
        .trim()
        .nullable()
        .when('allowedSubscriptions', (allowedSubscriptions, schema) =>
          allowedSubscriptions?.includes(AllowedSubscriptionsEnum.INSPECTION)
            ? schema.required(
                renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['This field is required'],
                ),
              )
            : schema,
        ),
      phone: yup.string().trim().nullable(),
      email: yup
        .string()
        .trim()
        .nullable()
        .email('The email format is wrong, please correct it')
        .required(
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
      firstName: yup
        .string()
        .trim()
        .nullable()
        .required(
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
      lastName: yup
        .string()
        .trim()
        .nullable()
        .required(
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        ),
      senderEmail: yup
        .string()
        .nullable()
        .when(['isUseSystemEmail', 'companyLevel'], {
          is: (isUseSystemEmail, companyLevel) =>
            isUseSystemEmail === false &&
            companyLevel !== CompanyLevelEnum.EXTERNAL_COMPANY &&
            companyLevel !== CompanyLevelEnum.INTERNAL_COMPANY,
          then: yup
            .string()
            .trim()
            .email('The email format is wrong, please correct it')
            .required(
              renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['This field is required'],
              ),
            ),
        }),
    }),
    [dynamicLabels],
  );

  const isCurrentCompany = useMemo(
    () => userInfo.companyId === id,
    [id, userInfo.companyId],
  );

  const schema = useMemo(() => {
    if (userInfo?.roleScope === 'SuperAdmin') {
      return yup.object().shape({
        ...schemaShape,

        numberOfUser: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        numberOfJob: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        startDate: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        endDate: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      });
    }
    return yup.object().shape(schemaShape);
  }, [dynamicLabels, schemaShape, userInfo?.roleScope]);

  const {
    watch,
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchCompanyTypeId = watch('companyTypeIds');
  const watchShowCountry = watch('country');
  const watchAllowedSubscriptions: string[] = watch('allowedSubscriptions');
  const watchSubscriptionAs: string[] = watch('subscriptionAs');
  const faxValue = watch('fax');
  const phoneValue = watch('phone');
  const companyLevelValue = watch('companyLevel');

  const nationalityOptionProps: OptionProps[] = useMemo(
    () =>
      listProvince.map((item) => ({
        value: item.name,
        label: item.name,
        selected: false,
      })),
    [listProvince],
  );

  const countryOptionProps: NewAsyncOptions[] = useMemo(
    () =>
      listCountry.map((item) => ({
        value: item.name,
        label: item.name,
        image: item?.flagImg || '',
      })),
    [listCountry],
  );

  const companyTypeOptionProps: NewAsyncOptions[] = useMemo(() => {
    const options =
      listData?.data
        ?.map((item) => ({
          value: item.id,
          label: item.companyType,
        }))
        .filter(
          (i) =>
            i.label !== CompanyTypeMulti.SHIP_OWNER &&
            i.label !== CompanyTypeMulti.CHARTERER,
        ) || [];

    const shipOwner = listData?.data?.find(
      (i) => i.companyType === CompanyTypeMulti.SHIP_OWNER,
    );
    const charterer = listData?.data?.find(
      (i) => i.companyType === CompanyTypeMulti.CHARTERER,
    );
    const sortArr = sortBy(options, ['label']);

    return [
      {
        value: shipOwner?.id,
        label: CompanyTypeMulti.SHIP_OWNER,
      },
      {
        value: charterer?.id,
        label: CompanyTypeMulti.CHARTERER,
      },
      {
        value: CompanyTypeMulti.SHIP_OWNER_CHARTERER,
        label: CompanyTypeMulti.SHIP_OWNER_CHARTERER,
      },
      ...sortArr,
    ]?.filter((i) => i.value);
  }, [listData?.data]);

  const companyOptionProps: NewAsyncOptions[] = useMemo(
    () =>
      listCompanyManagementTypes?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listCompanyManagementTypes?.data],
  );

  const getSubscriptionAsByCompanyType = useCallback(
    (valueFinding) => {
      if (valueFinding === CompanyTypeMulti.SHIP_OWNER_CHARTERER) {
        const shipOwner = listData?.data?.find(
          (i) => i.companyType === CompanyTypeMulti.SHIP_OWNER,
        );
        const charterer = listData?.data?.find(
          (i) => i.companyType === CompanyTypeMulti.CHARTERER,
        );
        return union(shipOwner?.actors || [], charterer?.actors || []);
      }
      return (
        listData?.data?.find((item) => item.id === valueFinding)?.actors || []
      );
    },
    [listData?.data],
  );

  const onChangeFile = (event) => {
    const { files } = event.target;
    const typeFile: string[] = (files && files[0]?.type?.split('/')) || [];
    const formDataImages = new FormData();
    formDataImages.append('files', files[0]);
    formDataImages.append('fileType', 'image');
    formDataImages.append('prefix', 'avatars');
    if (
      typeFile[0] === 'image' &&
      files[0]?.size < 3145728 &&
      (typeFile[1] === 'jpg' || typeFile[1] === 'png' || typeFile[1] === 'jpeg')
    ) {
      dispatch(uploadFileActions.request(formDataImages));
      return null;
    }

    if (
      typeFile[0] === 'image' &&
      files[0]?.size > 5242880 &&
      (typeFile[1] === 'jpg' || typeFile[1] === 'png' || typeFile[1] === 'jpeg')
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
  };

  const clearReducer = async () => {
    await dispatch(clearUserManagementReducer());
    await dispatch(clearCompanyManagementReducer());
  };

  const onChangeCompanyLevel = useCallback(
    (checked: Boolean, value: CompanyLevelEnum) => {
      if (checked) {
        setError('companyLevel', null);
      }
      setValue('companyLevel', checked ? value : '');
    },
    [setError, setValue],
  );

  const handleChangeCompanyType = useCallback(
    (value) => {
      const subscriptionAs = getSubscriptionAsByCompanyType(value?.[0]?.value);
      const allowedSubscriptions = [];
      if (
        subscriptionAs?.includes(CompanyTypeEnum.CONSUMER) ||
        subscriptionAs?.includes(CompanyTypeEnum.PROVIDER)
      ) {
        allowedSubscriptions.push(AllowedSubscriptionsEnum.INSPECTION);
      }
      if (
        subscriptionAs?.includes(CompanyTypeEnum.MAIN) ||
        subscriptionAs?.includes(CompanyTypeEnum.EXTERNAL)
      ) {
        allowedSubscriptions.push(AllowedSubscriptionsEnum.QA);
      }
      const convertSubscriptionAs = subscriptionAs?.map((item) => {
        switch (item) {
          case CompanyTypeEnum.CONSUMER:
            return SubscriptionAsEnum.CONSUMER;
          case CompanyTypeEnum.PROVIDER:
            return SubscriptionAsEnum.PROVIDER;
          case CompanyTypeEnum.MAIN:
            return SubscriptionAsEnum.MAIN;
          default:
            return SubscriptionAsEnum.EXTERNAL;
        }
      });
      setValue('subscriptionAs', convertSubscriptionAs);
      setValue('allowedSubscriptions', allowedSubscriptions);
      clearErrors(['subscriptionAs', 'allowedSubscriptions']);
    },
    [clearErrors, getSubscriptionAsByCompanyType, setValue],
  );

  const handleCancel = useCallback(() => {
    showConfirmBase({
      isDelete: false,
      txTitle: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Confirmation?'],
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
        isCreate ? history.push(AppRouteConst.COMPANY) : history.goBack(),
    });
  }, [dynamicLabels, isCreate]);

  const onSubmitForm = async (data) => {
    const {
      fax,
      recipientEmails,
      numberOfUser,
      numberOfJob,
      startDate,
      endDate,
      companyTypeIds,
      allowedSubscriptions,
      companyIMO,
      phone,
      ...dataOther
    } = data;
    const shipOwner = listData?.data?.find(
      (i) => i.companyType === CompanyTypeMulti.SHIP_OWNER,
    );
    const charterer = listData?.data?.find(
      (i) => i.companyType === CompanyTypeMulti.CHARTERER,
    );

    const companyTypes =
      companyTypeIds?.[0]?.value === CompanyTypeMulti.SHIP_OWNER_CHARTERER
        ? [shipOwner?.id, charterer?.id]
        : [companyTypeIds?.[0]?.value];

    const invalidRecipientEmail = recipientEmails?.some(
      (i) => !validateEmail(i?.value) && i?.value,
    );

    if (invalidRecipientEmail) {
      setError('recipientEmails', {
        message: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_DETAIL_FIELDS[
            'The email has a wrong format, please update it. For example: abc@gmail.com'
          ],
        ),
      });
      return;
    }

    const listRecipientEmails = recipientEmails
      ?.filter((i) => validateEmail(i?.value))
      ?.map((i) => i?.value);

    let dataParam: CreateManagementParams = {
      ...dataOther,
      isUseSystemEmail: data?.isUseSystemEmail,
      recipientEmails: listRecipientEmails || [],
      companyTypeIds: companyTypes,
      isInspection: allowedSubscriptions?.includes(
        AllowedSubscriptionsEnum.INSPECTION,
      ),
      isQA: allowedSubscriptions?.includes(AllowedSubscriptionsEnum.QA),
    };
    if (companyIMO) {
      dataParam = {
        ...dataParam,
        companyIMO,
      };
    }
    if (numberOfUser && numberOfJob) {
      dataParam = {
        ...dataParam,
        subscription: {
          numUsers: Number(numberOfUser),
          numJobs: Number(numberOfJob),
          startDate: formatDateIso(startDate, { startDay: true }),
          endDate: formatDateIso(endDate, { endDay: true }),
        },
      };
    }

    if (
      data?.isUseSystemEmail === false &&
      companyLevelValue !== CompanyLevelEnum.EXTERNAL_COMPANY &&
      companyLevelValue !== CompanyLevelEnum.INTERNAL_COMPANY
    ) {
      dataParam = {
        ...dataParam,
        senderEmail: data?.senderEmail || [],
      };
    }

    dataParam = {
      ...dataParam,
      phone: data?.phone,
      stateOrProvince: String(data?.stateOrProvince?.[0]?.value),
      country: String(data?.country?.[0]?.value),
    };

    const location = await getLatLngByAddress(
      `${dataParam?.address?.trim() || ''}`,
    );
    dataParam = {
      ...dataParam,
      fax: fax || null,
      latitude: location?.lat,
      longitude: location?.lng,
    };

    const { subscription, ...other } = dataParam;
    let params: CreateManagementParams = { ...other };
    if (subscription) {
      params = { ...params, subscription };
    }

    if (fax.length > 0 && fax.length < 5) {
      setError('fax', {
        message: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_DETAIL_FIELDS['Minimum length is 5 characters'],
        ),
      });
    } else if (fax?.length > 15) {
      setError('fax', {
        message: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_DETAIL_FIELDS['Maximum length is 15 characters'],
        ),
      });
    } else if (phone.length > 0 && phone.length < 5) {
      setError('phone', {
        message: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_DETAIL_FIELDS['Minimum length is 5 characters'],
        ),
      });
    } else if (phone?.length > 15) {
      setError('phone', {
        message: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_DETAIL_FIELDS['Maximum length is 15 characters'],
        ),
      });
    } else {
      onSubmit(params);
    }
  };

  useEffect(() => {
    if (errorList?.length > 0) {
      scrollIntoErrors(
        { [errorList[0]?.fieldName]: '' },
        '.wrap-company-form ',
      );
      errorList.forEach((item) => {
        setError(item?.fieldName, { message: item?.message });
      });
    }
  }, [errorList, setError]);

  useEffect(() => {
    if (avatarCompany) {
      setValue('logo', avatarCompany?.id);
    }
  }, [avatarCompany, setValue]);

  useEffect(() => {
    if (!data && userInfo?.roleScope === RoleScope.SuperAdmin) {
      setValue('companyLevel', CompanyLevelEnum.MAIN_COMPANY);
    } else if (!data && userInfo?.roleScope === RoleScope.SuperAdmin) {
      setValue('companyLevel', CompanyLevelEnum.INTERNAL_COMPANY);
    }
  }, [data, setValue, userInfo?.roleScope]);

  useEffect(() => {
    dispatch(
      getListCompanyTypeActions.request({ pageSize: -1, status: 'active' }),
    );
    dispatch(
      getListCompanyManagementActions.request({
        pageSize: -1,
        status: 'active',
        isRefreshLoading: true,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (companyOptionProps?.length) {
      setCompanyTypeOptionList(companyOptionProps);
    }
  }, [companyOptionProps]);

  useEffectOnce(() => {
    loadGoogleMap(
      `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`,
    );
    return () => {
      clearReducer();
      setValue('isUseSystemEmail', true);
    };
  });

  useEffect(() => {
    if (data && ROLES_SCOPE[0] === userInfo.roleScope) {
      setValue('code', data.code || '');
      setValue('name', data.name || '');
      setValue('status', data.status || '');
      setValue('country', data.country || []);
      setValue('stateOrProvince', data.stateOrProvince || []);
      setValue('townOrCity', data.townOrCity || '');
      setValue('address', data.address || '');
      setValue('phone', data.phone || '');
      setValue('fax', data.fax || '');
      setValue('email', data.email || '');
      setValue('firstName', data.firstName || '');
      setValue('lastName', data.lastName || '');
      isFirstLoad = true;
    }

    if (data && ROLES_SCOPE[0] !== userInfo.roleScope && userInfo?.group) {
      setValue('code', data.code || '');
      setValue('name', data.name || '');
      setValue('status', data.status || '');
      setValue('country', data.country || []);
      setValue('stateOrProvince', data.stateOrProvince || []);
      setValue('townOrCity', data.townOrCity || '');
      setValue('address', data.address || '');
      setValue('phone', data.phone || '');
      setValue('fax', data.fax || '');
      setValue('email', data.email || '');
      setValue('firstName', data.firstName || '');
      setValue('lastName', data.lastName || '');
      isFirstLoad = true;
    }

    if (data) {
      let allowedSubscriptions = [];
      if (data?.isInspection) {
        allowedSubscriptions = [AllowedSubscriptionsEnum.INSPECTION];
      }
      if (data?.isQA) {
        allowedSubscriptions = [
          ...allowedSubscriptions,
          AllowedSubscriptionsEnum.QA,
        ];
      }
      setValue('abbreviation', data?.abbreviation || '');
      setValue('companyLevel', data?.companyLevel || '');
      setValue('senderEmail', data?.senderEmail || '');
      setValue('allowedSubscriptions', allowedSubscriptions);
      setValue('subscriptionAs', data?.subscriptionAs || []);

      setValue(
        'isUseSystemEmail',
        String(data?.isUseSystemEmail) === 'false'
          ? data?.isUseSystemEmail
          : true,
      );
      setValue('numberOfUser', data?.subscription?.numUsers || '');
      setValue('numberOfJob', data?.subscription?.numJobs || '');
      const companyTypeIds =
        data?.companyTypes?.length === 2
          ? [
              {
                value: CompanyTypeMulti.SHIP_OWNER_CHARTERER,
                label: CompanyTypeMulti.SHIP_OWNER_CHARTERER,
              },
            ]
          : [
              {
                value: data?.companyTypes?.[0]?.id,
                label: data?.companyTypes?.[0]?.companyType,
              },
            ];
      setValue('companyTypeIds', companyTypeIds || []);
      setValue(
        'startDate',
        data?.subscription?.startDate
          ? moment(data?.subscription?.startDate)
          : null,
      );
      setValue(
        'endDate',
        data?.subscription?.endDate
          ? moment(data?.subscription?.endDate)
          : null,
      );
      setValue('companyIMO', data?.companyIMO || '');
      setValue(
        'recipientEmails',
        data?.recipientEmails?.length
          ? data?.recipientEmails
              ?.map((i) => ({
                id: v4(),
                value: i || '',
                isFocus: false,
                isTag: true,
              }))
              ?.concat({
                id: v4(),
                value: '',
                isFocus: false,
                isTag: false,
              })
          : [],
      );
    }
    return () => {
      dispatch(createCompanyManagementActions.failure([]));
    };
  }, [data, dispatch, setValue, userInfo?.group, userInfo.roleScope]);

  useEffect(() => {
    scrollIntoErrors(errors, '.wrap-company-form ');
  }, [errors]);
  useEffect(() => {
    if (!isFirstLoad) {
      setValue('stateOrProvince', []);
      setValue('stateOrProvince', []);
      setValue('townOrCity', '');
      setValue('address', '');
    } else {
      isFirstLoad = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchShowCountry]);

  useEffect(() => {
    if (faxValue.length >= 1 && faxValue.length < 5) {
      setError('fax', {
        message: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_DETAIL_FIELDS['Minimum length is 5 characters'],
        ),
      });
    } else if (faxValue.length > 15) {
      setError('fax', {
        message: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_DETAIL_FIELDS['Maximum length is 15 characters'],
        ),
      });
    } else {
      clearErrors('fax');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faxValue]);

  useEffect(() => {
    if (phoneValue.length >= 1 && phoneValue.length < 5) {
      setError('phone', {
        message: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_DETAIL_FIELDS['Minimum length is 5 characters'],
        ),
      });
    } else if (phoneValue.length > 15) {
      setError('phone', {
        message: renderDynamicLabel(
          dynamicLabels,
          COMPANY_DYNAMIC_DETAIL_FIELDS['Maximum length is 15 characters'],
        ),
      });
    } else {
      clearErrors('phone');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneValue]);

  const mailManagementVisible = useMemo(() => {
    if (userInfo?.companyId === data?.id) {
      return true;
    }
    if (
      companyLevelValue === CompanyLevelEnum.EXTERNAL_COMPANY ||
      companyLevelValue === CompanyLevelEnum.INTERNAL_COMPANY ||
      !companyLevelValue
    ) {
      return false;
    }
    return true;
  }, [companyLevelValue, data?.id, userInfo?.companyId]);

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <div className="wrap-company-form">
      <Container>
        <div className={cx('d-flex align-items-center', styles.card)}>
          <img
            src={avatarCompany?.url || images.default.icCompanyDefault}
            onError={({ currentTarget }) => {
              if (currentTarget && currentTarget?.src) {
                // eslint-disable-next-line no-param-reassign
                currentTarget.src = images.default.icCompanyDefault;
              }
            }}
            alt="avatar"
            id="logo"
            className={styles.avatar}
          />
          {!isView && !isCurrentCompany && (
            <div className="ps-3">
              <p className={styles.titleUploadFile}>
                {renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Select an image'],
                )}
              </p>
              <label htmlFor="file-input">
                <input
                  type="file"
                  {...register('logo')}
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
                    COMPANY_DYNAMIC_DETAIL_FIELDS.Browser,
                  )}
                </Button>
              </label>
            </div>
          )}
        </div>
      </Container>
      <Container>
        <div className={cx(styles.containerForm)}>
          <p className={cx('mt-2 fw-bold mb-0', styles.titleForm)}>
            {renderDynamicLabel(
              dynamicLabels,
              COMPANY_DYNAMIC_DETAIL_FIELDS['General information'],
            )}
          </p>
          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 pe-3')} xs={6} md={6} id="companyTypeIds">
              <AsyncSelectForm
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Company type'],
                )}
                name="companyTypeIds"
                id="companyTypeIds"
                disabled={isView || isCurrentCompany}
                isRequired
                control={control}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                searchContent={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Company type'],
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Select all'],
                )}
                textBtnConfirm={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Confirm,
                )}
                onChange={handleChangeCompanyType}
                onChangeSearch={(value: string) => {
                  if (!value) {
                    setCompanyTypeOptionList(companyTypeOptionProps);
                  } else {
                    const newState = companyTypeOptionProps?.filter(
                      (item: { label: string; value: string }) =>
                        upperCase(item.label)?.includes(upperCase(value)),
                    );

                    setCompanyTypeOptionList(newState);
                  }
                }}
                messageRequired={errors?.companyTypeIds?.message || ''}
                options={CompanyTypeOptionList}
              />
            </Col>

            <Col className={cx('p-0 ps-3')} xs={6} md={6} id="name">
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Company name'],
                )}
                className={cx({
                  [styles.disabledInput]: isView || isCurrentCompany,
                })}
                isRequired={!isView || !isCurrentCompany}
                readOnly={isView || isCurrentCompany}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Enter company name'],
                )}
                messageRequired={errors?.name?.message || ''}
                {...register('name')}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>
          </Row>

          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 pe-3')} xs={6} md={6} id="abbreviation">
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Company abbreviation'],
                )}
                className={cx({
                  [styles.disabledInput]: isView || isCurrentCompany,
                })}
                isRequired={!isView || !isCurrentCompany}
                readOnly={isView || isCurrentCompany}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Enter company abbreviation'],
                )}
                messageRequired={errors?.abbreviation?.message || ''}
                {...register('abbreviation')}
                maxLength={50}
              />
            </Col>
            <Col className={cx('p-0 ps-3')} xs={6} md={6} id="code">
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Company code'],
                )}
                className={cx({
                  [styles.disabledInput]: isView || isCurrentCompany,
                })}
                isRequired={!isView || !isCurrentCompany}
                readOnly={isView || isCurrentCompany}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Enter company code'],
                )}
                messageRequired={errors?.code?.message || ''}
                {...register('code')}
                maxLength={MAX_LENGTH_CODE}
              />
            </Col>
          </Row>

          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 pe-3')} xs={6} md={6} id="companyIMO">
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Company IMO'],
                )}
                className={cx({
                  [styles.disabledInput]: isView || isCurrentCompany,
                })}
                isRequired={
                  ((!isView || !isCurrentCompany) &&
                    watchCompanyTypeId?.label ===
                      'Ship management (DOC holder)') ||
                  watchCompanyTypeId?.[0]?.label ===
                    'Ship management (DOC holder)'
                }
                readOnly={isView || isCurrentCompany}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Enter company IMO'],
                )}
                messageRequired={errors?.companyIMO?.message || ''}
                {...register('companyIMO')}
                maxLength={MAX_LENGTH_IMO}
              />
            </Col>
            <Col className={cx('p-0 ps-3')} xs={6} md={6} id="status">
              <SelectUI
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS.Status,
                )}
                messageRequired={errors?.status?.message || ''}
                data={statusOptions}
                disabled={isView || isCurrentCompany}
                name="status"
                id="status"
                className="w-100"
                control={control}
                notAllowSortData
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
            </Col>
          </Row>
        </div>
      </Container>

      <Container>
        <div className={cx(styles.containerForm)}>
          <p className={cx('mt-3 fw-bold mb-0', styles.titleForm)}>
            {renderDynamicLabel(
              dynamicLabels,
              COMPANY_DYNAMIC_DETAIL_FIELDS['Subscription type'],
            )}
          </p>
          <RowAnt className="pt-2 mx-0">
            <ColAnt xs={16} md={16} id="companyLevel">
              <Controller
                control={control}
                name="companyLevel"
                render={({ field }) => (
                  <RowAnt>
                    <ColAnt span={24}>
                      <p className={cx(' fw-bold mb-0', styles.titleText)}>
                        {renderDynamicLabel(
                          dynamicLabels,
                          COMPANY_DYNAMIC_DETAIL_FIELDS["Company's level"],
                        )}
                      </p>
                    </ColAnt>
                    {(userInfo?.roleScope === RoleScope.SuperAdmin ||
                      companyLevelValue === CompanyLevelEnum.MAIN_COMPANY) && (
                      <ColAnt xs={9} md={9}>
                        <Checkbox
                          className={cx('input-radio-label radio-button pt-1')}
                          checked={
                            CompanyLevelEnum.MAIN_COMPANY === field.value
                          }
                          onChange={(e) =>
                            onChangeCompanyLevel(
                              e.target.checked,
                              CompanyLevelEnum.MAIN_COMPANY,
                            )
                          }
                          disabled
                          key={CompanyLevelEnum.MAIN_COMPANY}
                        >
                          {CompanyLevelEnum.MAIN_COMPANY}
                        </Checkbox>
                      </ColAnt>
                    )}
                    {userInfo?.roleScope !== RoleScope.SuperAdmin &&
                      companyLevelValue !== CompanyLevelEnum.MAIN_COMPANY && (
                        <ColAnt xs={9} md={9}>
                          <Checkbox
                            className={cx(
                              'input-radio-label radio-button pt-1',
                            )}
                            checked={
                              CompanyLevelEnum.INTERNAL_COMPANY === field.value
                            }
                            disabled={isView || isCurrentCompany}
                            key={CompanyLevelEnum.INTERNAL_COMPANY}
                            onChange={(e) => {
                              onChangeCompanyLevel(
                                e.target.checked,
                                CompanyLevelEnum.INTERNAL_COMPANY,
                              );
                            }}
                          >
                            {CompanyLevelEnum.INTERNAL_COMPANY}
                          </Checkbox>
                        </ColAnt>
                      )}

                    {userInfo?.roleScope !== RoleScope.SuperAdmin &&
                      companyLevelValue !== CompanyLevelEnum.MAIN_COMPANY && (
                        <ColAnt xs={6} md={6}>
                          <Checkbox
                            className={cx(
                              'input-radio-label radio-button pt-1',
                            )}
                            checked={
                              CompanyLevelEnum.EXTERNAL_COMPANY === field.value
                            }
                            onChange={(e) =>
                              onChangeCompanyLevel(
                                e.target.checked,
                                CompanyLevelEnum.EXTERNAL_COMPANY,
                              )
                            }
                            disabled={isView || isCurrentCompany}
                            key={CompanyLevelEnum.EXTERNAL_COMPANY}
                          >
                            {CompanyLevelEnum.EXTERNAL_COMPANY}
                          </Checkbox>
                        </ColAnt>
                      )}
                    <ColAnt span={24}>
                      {errors?.companyLevel?.message && (
                        <div className="message-required mt-2">
                          {errors?.companyLevel?.message}
                        </div>
                      )}
                    </ColAnt>
                  </RowAnt>
                )}
              />
            </ColAnt>
          </RowAnt>
          {(userInfo?.roleScope === RoleScope.SuperAdmin ||
            companyLevelValue === CompanyLevelEnum.MAIN_COMPANY) && (
            <>
              <p
                className={cx('mt-3 fw-bold mb-0', styles.titleText)}
                id="allowedSubscriptions"
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Allowed subscriptions'],
                )}
              </p>
              <Controller
                control={control}
                name="allowedSubscriptions"
                render={({ field }) => (
                  <Checkbox.Group
                    onChange={(value) => {
                      field.onChange(value);
                      if (
                        value?.includes(AllowedSubscriptionsEnum.INSPECTION) &&
                        !value?.includes(AllowedSubscriptionsEnum.QA)
                      ) {
                        const valueSubscriptionAs = watchSubscriptionAs?.filter(
                          (item) =>
                            item !== SubscriptionAsEnum.MAIN &&
                            item !== SubscriptionAsEnum.EXTERNAL,
                        );

                        setValue('subscriptionAs', valueSubscriptionAs);
                      } else if (
                        value?.includes(AllowedSubscriptionsEnum.QA) &&
                        !value?.includes(AllowedSubscriptionsEnum.INSPECTION)
                      ) {
                        const valueSubscriptionAs = watchSubscriptionAs?.filter(
                          (item) =>
                            item !== SubscriptionAsEnum.PROVIDER &&
                            item !== SubscriptionAsEnum.CONSUMER,
                        );
                        setValue('subscriptionAs', valueSubscriptionAs);
                      } else if (!value?.length) {
                        const valueSubscriptionAs = watchSubscriptionAs?.filter(
                          (item) =>
                            item !== SubscriptionAsEnum.PROVIDER &&
                            item !== SubscriptionAsEnum.CONSUMER &&
                            item !== SubscriptionAsEnum.MAIN &&
                            item !== SubscriptionAsEnum.EXTERNAL,
                        );
                        setValue('subscriptionAs', valueSubscriptionAs);
                      }
                    }}
                    disabled={isView || isCurrentCompany}
                    value={field.value}
                    className="w-100"
                  >
                    <RowAnt>
                      <ColAnt xs={6} md={6}>
                        <Checkbox
                          className={cx('input-radio-label radio-button pt-1')}
                          value={AllowedSubscriptionsEnum.INSPECTION}
                        >
                          {renderDynamicLabel(
                            dynamicLabels,
                            COMPANY_DYNAMIC_DETAIL_FIELDS[
                              'Inspections/Services'
                            ],
                          )}
                        </Checkbox>
                      </ColAnt>
                      <ColAnt xs={6} md={6}>
                        <Checkbox
                          className={cx('input-radio-label radio-button pt-1')}
                          value={AllowedSubscriptionsEnum.QA}
                        >
                          {renderDynamicLabel(
                            dynamicLabels,
                            COMPANY_DYNAMIC_DETAIL_FIELDS['Quality assurance'],
                          )}
                        </Checkbox>
                      </ColAnt>
                      <ColAnt span={24}>
                        {errors?.allowedSubscriptions?.message && (
                          <div className="message-required mt-2">
                            {errors?.allowedSubscriptions?.message}
                          </div>
                        )}
                      </ColAnt>
                    </RowAnt>
                  </Checkbox.Group>
                )}
              />
            </>
          )}

          {(userInfo?.roleScope === RoleScope.SuperAdmin ||
            companyLevelValue === CompanyLevelEnum.MAIN_COMPANY) && (
            <>
              <p
                className={cx('mt-3 fw-bold mb-0', styles.titleText)}
                id="subscriptionAs"
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Subscription as'],
                )}
              </p>
              <Controller
                control={control}
                name="subscriptionAs"
                render={({ field }) => (
                  <Checkbox.Group
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    disabled={isView || isCurrentCompany}
                    value={field.value}
                    className="w-100"
                  >
                    <RowAnt>
                      <ColAnt xs={6} md={6}>
                        <Checkbox
                          className={cx('input-radio-label radio-button pt-2')}
                          disabled={
                            !watchAllowedSubscriptions?.includes(
                              AllowedSubscriptionsEnum.INSPECTION,
                            ) || !watchAllowedSubscriptions?.length
                          }
                          value={SubscriptionAsEnum.PROVIDER}
                        >
                          {renderDynamicLabel(
                            dynamicLabels,
                            COMPANY_DYNAMIC_DETAIL_FIELDS[
                              'Service provider inspection'
                            ],
                          )}
                        </Checkbox>
                      </ColAnt>
                      <ColAnt xs={6} md={6}>
                        <Checkbox
                          className={cx('input-radio-label radio-button pt-2')}
                          disabled={
                            !watchAllowedSubscriptions?.includes(
                              AllowedSubscriptionsEnum.INSPECTION,
                            ) || !watchAllowedSubscriptions?.length
                          }
                          value={SubscriptionAsEnum.CONSUMER}
                        >
                          {renderDynamicLabel(
                            dynamicLabels,
                            COMPANY_DYNAMIC_DETAIL_FIELDS[
                              'Service consumer inspection'
                            ],
                          )}
                        </Checkbox>
                      </ColAnt>
                      <ColAnt xs={4} md={4}>
                        <Checkbox
                          className={cx('input-radio-label radio-button pt-2')}
                          disabled={
                            !watchAllowedSubscriptions?.includes(
                              AllowedSubscriptionsEnum.QA,
                            ) || !watchAllowedSubscriptions?.length
                          }
                          value={SubscriptionAsEnum.MAIN}
                        >
                          {renderDynamicLabel(
                            dynamicLabels,
                            COMPANY_DYNAMIC_DETAIL_FIELDS['Main - QA'],
                          )}
                        </Checkbox>
                      </ColAnt>
                      <ColAnt xs={8} md={8}>
                        <Checkbox
                          className={cx('input-radio-label radio-button pt-2')}
                          disabled={
                            !watchAllowedSubscriptions?.includes(
                              AllowedSubscriptionsEnum.QA,
                            ) || !watchAllowedSubscriptions?.length
                          }
                          value={SubscriptionAsEnum.EXTERNAL}
                        >
                          {renderDynamicLabel(
                            dynamicLabels,
                            COMPANY_DYNAMIC_DETAIL_FIELDS['External - QA'],
                          )}
                        </Checkbox>
                      </ColAnt>
                      <ColAnt xs={6} md={6}>
                        <Checkbox
                          className={cx('input-radio-label radio-button pt-2')}
                          value={
                            SubscriptionAsEnum.VISIBLE_IN_GLOBAL_MARKETPLACE
                          }
                        >
                          {renderDynamicLabel(
                            dynamicLabels,
                            COMPANY_DYNAMIC_DETAIL_FIELDS[
                              'Visible in Global Marketplace'
                            ],
                          )}
                        </Checkbox>
                      </ColAnt>
                      <ColAnt span={24}>
                        {errors?.subscriptionAs?.message && (
                          <div className="message-required mt-2">
                            {errors?.subscriptionAs?.message}
                          </div>
                        )}
                      </ColAnt>
                    </RowAnt>
                  </Checkbox.Group>
                )}
              />
            </>
          )}
        </div>
      </Container>
      {(userInfo?.roleScope === RoleScope.SuperAdmin ||
        companyLevelValue === CompanyLevelEnum.MAIN_COMPANY) && (
        <Container>
          {/* //TODO */}
          <SubscriptionPackage
            control={control}
            setValue={setValue}
            watch={watch}
            errors={errors}
            setError={setError}
            disabled={isView || isCurrentCompany}
            dynamicLabels={dynamicLabels}
          />
        </Container>
      )}

      <Container>
        <div className={cx(styles.containerForm)}>
          <p className={cx('mt-3 fw-bold mb-0', styles.titleForm)}>
            {renderDynamicLabel(
              dynamicLabels,
              COMPANY_DYNAMIC_DETAIL_FIELDS['Address information'],
            )}
          </p>
          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 pe-3')} xs={6} md={6}>
              <AsyncSelectForm
                disabled={isView || disable}
                control={control}
                name="country"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS.Country,
                )}
                isRequired={
                  !isView &&
                  watchAllowedSubscriptions?.includes(
                    AllowedSubscriptionsEnum.INSPECTION,
                  )
                }
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                searchContent={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS.Country,
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Select all'],
                )}
                id="country"
                textBtnConfirm={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Confirm,
                )}
                hasImage
                messageRequired={errors?.country?.message || ''}
                onChangeSearch={(value: string) =>
                  dispatch(getCountryActions.request({ content: value }))
                }
                options={countryOptionProps}
                flagImage
              />
            </Col>
            <Col className={cx('p-0 ps-3')} xs={6} md={6}>
              <AsyncSelectForm
                disabled={
                  disable ||
                  isView ||
                  (!getValues('country')[0]?.value && !data)
                }
                control={control}
                name="stateOrProvince"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['State/ Province'],
                )}
                isRequired={
                  !isView &&
                  watchAllowedSubscriptions?.includes(
                    AllowedSubscriptionsEnum.INSPECTION,
                  )
                }
                id="stateOrProvince"
                titleResults={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Selected cities'],
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                searchContent={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['State/ Province'],
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Select all'],
                )}
                textBtnConfirm={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Confirm,
                )}
                messageRequired={errors?.stateOrProvince?.message || ''}
                onChangeSearch={(value: string) =>
                  dispatch(
                    getProvinceActions.request({
                      countryId: getValues('country')[0]?.value || '',
                      data: { content: value },
                    }),
                  )
                }
                options={nationalityOptionProps}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 pe-3')} xs={6} md={6}>
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Town/ City'],
                )}
                className={cx({ [styles.disabledInput]: isView })}
                isRequired={
                  !isView &&
                  watchAllowedSubscriptions?.includes(
                    AllowedSubscriptionsEnum.INSPECTION,
                  )
                }
                readOnly={isView}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Enter town/ city'],
                )}
                id="townOrCity"
                messageRequired={errors?.townOrCity?.message || ''}
                {...register('townOrCity')}
                maxLength={MAX_LENGTH_TEXT}
              />
            </Col>

            <Col className={cx('p-0 ps-3')} xs={6} md={6}>
              <Input
                maxLength={MAX_LENGTH_TEXT}
                messageRequired={errors?.address?.message || ''}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS['Enter address'],
                )}
                label={renderDynamicLabel(
                  dynamicLabels,
                  COMPANY_DYNAMIC_DETAIL_FIELDS.Address,
                )}
                id="address"
                {...register('address')}
                isRequired={
                  !isView &&
                  watchAllowedSubscriptions?.includes(
                    AllowedSubscriptionsEnum.INSPECTION,
                  )
                }
                readOnly={isView}
                disabledCss={isView}
              />
            </Col>
          </Row>
        </div>
      </Container>

      <Container className="pb-4">
        <p className={cx('mt-3 fw-bold mb-0', styles.titleForm)}>
          {renderDynamicLabel(
            dynamicLabels,
            COMPANY_DYNAMIC_DETAIL_FIELDS['Contact information'],
          )}
        </p>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 pe-3')} xs={6} md={6}>
            <Input
              maxLength={MAX_LENGTH_TEXT}
              messageRequired={errors?.firstName?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS['Enter first name'],
              )}
              label={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS['First name'],
              )}
              id="firstName"
              {...register('firstName')}
              isRequired={!isView}
              readOnly={isView}
              disabledCss={isView}
            />
          </Col>
          <Col className={cx('p-0 ps-3')} xs={6} md={6}>
            <Input
              maxLength={MAX_LENGTH_TEXT}
              messageRequired={errors?.lastName?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS['Enter last name'],
              )}
              label={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS['Last name'],
              )}
              id="lastName"
              {...register('lastName')}
              isRequired={!isView}
              disabled={isView}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 pe-3')} xs={6} md={6}>
            <Input
              maxLength={MAX_LENGTH_TEXT}
              messageRequired={errors?.email?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS['Enter email'],
              )}
              label={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS.Email,
              )}
              id="email"
              {...register('email')}
              isRequired={!isView}
              disabled={isView}
            />
          </Col>
          <Col className={cx('p-0 ps-3')} xs={6} md={6}>
            <InputForm
              messageRequired={errors?.phone?.message || ''}
              maxLength={15}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS['Enter phone number'],
              )}
              label={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS['Phone number'],
              )}
              patternValidate={REGEXP_INPUT_PHONE_NUMBER}
              control={control}
              id="phone"
              name="phone"
              disabled={isView}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 pe-3')} xs={6} md={6}>
            <InputForm
              maxLength={15}
              messageRequired={faxValue?.length ? errors?.fax?.message : ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS['Enter fax'],
              )}
              label={renderDynamicLabel(
                dynamicLabels,
                COMPANY_DYNAMIC_DETAIL_FIELDS.Fax,
              )}
              id="fax"
              patternValidate={REGEXP_INPUT_FAX_NUMBER}
              control={control}
              name="fax"
              disabled={isView}
            />
          </Col>
          <Col className={cx('p-0 ps-3')} xs={6} md={6} />
        </Row>
      </Container>

      {mailManagementVisible && (
        <Container>
          <MailManagement
            control={control}
            setValue={setValue}
            watch={watch}
            errors={errors}
            register={register}
            setError={setError}
            clearErrors={clearErrors}
            disabled={isView || isCurrentCompany}
            dynamicLabels={dynamicLabels}
          />
        </Container>
      )}

      {!isView && (
        <GroupButton
          className={styles.GroupButton}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={isView}
          dynamicLabels={dynamicLabels}
        />
      )}
    </div>
  );
};

export default CompanyManagementForm;
