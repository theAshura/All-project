/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { StepItemType } from 'components/ui/step-item/StepItem';
import { FormProvider, FieldValues, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { handleCheckPassword } from 'helpers/utils.helper';

import { CreateUserFormContext } from 'models/api/user/user.model';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
// import { useTranslation } from 'react-i18next';
// import { I18nNamespace } from 'constants/i18n.const';
import { useLocation, useParams } from 'react-router';
import { CommonQuery } from 'constants/common.const';
import { AvailableAreaDetail } from 'models/store/user/user.model';
import { REGEXP_VALIDATE_EMAIL } from 'constants/regExpValidate.const';
import { useSelector } from 'react-redux';
import { LIST_INSPECTORS } from 'constants/roleAndPermission.const';

export enum TabName {
  ACCOUNT_INFORMATION = 'account_information',
  ROLE_AND_PERMISSION = 'role_and_permission',
  AVAILABLE_AREA = 'available_area',
  PASSWORD = 'password',
  INSPECTOR_DETAIL = 'inspector_detail',
}

export enum StatusPage {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  CREATE = 'CREATE',
}

export interface StatusTypeStep {
  [TabName.ACCOUNT_INFORMATION]: StepItemType;
  [TabName.ROLE_AND_PERMISSION]: StepItemType;
  [TabName.AVAILABLE_AREA]: StepItemType;
  [TabName.PASSWORD]: StepItemType;
  [TabName.INSPECTOR_DETAIL]: StepItemType;
}

export type AccountInformation = Omit<
  CreateUserFormContext,
  'availableAreas' | 'roles' | 'password'
>;

export interface CreateUserParamsContext {
  accountInformation: AccountInformation;
  password: string;
  roles: string[];
  availableAreas: AvailableAreaDetail;
  switchableCompanies?: any;
}

const defaultValues: CreateUserParamsContext = {
  accountInformation: {
    country: null,
    nationality: null,
    stateOrProvince: null,
    firstName: null,
    lastName: null,
    jobTitle: null,
    companyId: null,
    status: 'active',
    email: null,
    address: null,
    phoneNumber: null,
    gender: 'male',
    dob: null,
    townOrCity: null,
    postCode: null,
  },
  password: null,
  roles: [],
  availableAreas: {},
};

interface UserContextValues {
  currentTab: TabName;
  handleSetCurrentTab: (value: TabName) => void;
  activeTabs: TabName[];
  handleSetActiveTabs: (value: TabName[]) => void;
  statusPage: StatusPage;
  handleSetStatusPage: (value: StatusPage) => void;
  statusStep: StatusTypeStep;
  setStatusStep: (value: StatusTypeStep) => void;
  isInspector: boolean;
  listRoleAndPermissionAdmin: any;
  setListRoleAndPermissionAdmin: (value: any) => void;
}

export const UserContext = createContext<UserContextValues | undefined>(
  undefined,
);

const UserProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabName>(
    TabName.ACCOUNT_INFORMATION,
  );
  const [statusPage, setStatusPage] = useState<StatusPage>(null);
  const [statusStep, setStatusStep] = useState<StatusTypeStep>({
    [TabName.ACCOUNT_INFORMATION]: StepItemType.ACTIVE,
    [TabName.ROLE_AND_PERMISSION]: StepItemType.INACTIVE,
    [TabName.AVAILABLE_AREA]: StepItemType.INACTIVE,
    [TabName.PASSWORD]: StepItemType.INACTIVE,
    [TabName.INSPECTOR_DETAIL]: StepItemType.INACTIVE,
  });

  const [activeTabs, setActiveTabs] = useState<TabName[]>([
    TabName.ACCOUNT_INFORMATION,
  ]);
  const [listRoleAndPermissionAdmin, setListRoleAndPermissionAdmin] = useState(
    [],
  );
  const { userDetailResponse, messageError } = useSelector(
    (state) => state.user,
  );

  // const { t } = useTranslation([I18nNamespace.USER, I18nNamespace.COMMON]);
  const { search } = useLocation();
  const { id } = useParams<{ id: string }>();

  const schema = useMemo(
    () =>
      yup.object().shape({
        accountInformation: yup.object().shape({
          country: yup
            .array()
            .nullable()
            .required('This field is required')
            .min(1, 'This field is required'),
          nationality: yup.array().nullable(),
          stateOrProvince: yup
            .array()
            .nullable()
            .required('This field is required')
            .min(1, 'This field is required'),
          firstName: yup
            .string()
            .nullable()
            .trim()
            .required('This field is required'),
          lastName: yup
            .string()
            .nullable()
            .trim()
            .required('This field is required'),
          jobTitle: yup
            .string()
            .nullable()
            .trim()
            .required('This field is required'),
          // companyId: yup
          //   .string()
          //   .nullable()
          //   .trim()
          //   .required('This field is required'),
          status: yup
            .string()
            .nullable()
            .trim()
            .required('This field is required'),
          email: yup
            .string()
            .nullable()
            .trim()
            .required('This field is required')
            .test('email', 'Email is wrong format', (value: string) =>
              REGEXP_VALIDATE_EMAIL.test(value),
            ),
          address: yup
            .string()
            .nullable()
            .trim()
            .required('This field is required'),
          phoneNumber: yup.string().nullable().trim(),
          gender: yup
            .string()
            .nullable()
            .trim()
            .required('This field is required'),
          dob: yup.string().nullable().trim(),
          townOrCity: yup
            .string()
            .nullable()
            .trim()
            .required('This field is required'),
          postCode: yup.string().nullable().trim(),
        }),
        password: yup
          .string()
          .trim()
          .nullable()
          .test('password', 'wrong format', (value: string) =>
            statusPage !== StatusPage.VIEW ? handleCheckPassword(value) : true,
          ),
        roles: yup.array().nullable().min(1, 'This field is required'),
        availableAreas: yup.object().shape({
          no: yup.array().of(
            yup.object().shape({
              ports: yup.array().nullable().min(1, 'This field is required'),
            }),
          ),
          strong: yup.array().of(
            yup.object().shape({
              ports: yup.array().nullable().min(1, 'This field is required'),
            }),
          ),
          neutral: yup.array().of(
            yup.object().shape({
              ports: yup.array().nullable().min(1, 'This field is required'),
            }),
          ),
        }),
      }),
    [statusPage],
  );

  const methods = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    watch,
    setError,
    formState: { errors, isSubmitted },
  } = methods;

  const watchRoles: string[] = watch('roles');

  const isInspector = useMemo(
    () =>
      userDetailResponse?.roles?.some((i) => LIST_INSPECTORS?.includes(i.name)),
    [userDetailResponse?.roles],
  );

  const handleSetCurrentTab = useCallback((value: TabName) => {
    setCurrentTab(value);
  }, []);
  const handleSetStatusPage = useCallback((value: StatusPage) => {
    setStatusPage(value);
  }, []);

  const handleSetActiveTabs = useCallback((values: TabName[]) => {
    setActiveTabs((prev) => uniqBy([...prev, ...values], (e) => e));
  }, []);

  // useEffect

  useEffect(() => {
    if (id) {
      if (search !== CommonQuery.EDIT) {
        setStatusPage(StatusPage.VIEW);
      } else {
        setStatusPage(StatusPage.EDIT);
      }
    } else {
      setStatusPage(StatusPage.CREATE);
    }
  }, [id, search]);

  useEffect(() => {
    if (messageError?.length) {
      messageError?.forEach((err) => {
        switch (err.fieldName) {
          case 'password':
            setError(`accountInformation.password`, {
              message: err?.message,
            });
            break;
          case 'phoneNumber':
            setError(`accountInformation.phoneNumber`, {
              message: err?.message,
            });
            break;
          // case 'secondaryPhoneNumber':
          //   setError(`accountInformation.secondaryPhoneNumber`, {
          //     message: err?.message,
          //   });
          //   break;

          default:
            break;
        }
      });
    }
  }, [messageError, setError]);

  useEffect(() => {
    let newStatusType = {
      [TabName.ACCOUNT_INFORMATION]: StepItemType.NORMAL,
      [TabName.ROLE_AND_PERMISSION]: StepItemType.NORMAL,
      [TabName.AVAILABLE_AREA]: StepItemType.NORMAL,
      [TabName.PASSWORD]: StepItemType.NORMAL,
      [TabName.INSPECTOR_DETAIL]: StepItemType.NORMAL,
    };

    let statusAccountInformation = StepItemType.NORMAL;
    let statusPassword = StepItemType.NORMAL;
    let statusRoles = StepItemType.NORMAL;
    let statusAvailableArea = StepItemType.INACTIVE;
    let statusInspectorDetail = StepItemType.INACTIVE;

    switch (statusPage) {
      case StatusPage.VIEW:
        newStatusType = {
          [TabName.ACCOUNT_INFORMATION]: StepItemType.INACTIVE_VIEW,
          [TabName.ROLE_AND_PERMISSION]: StepItemType.INACTIVE_VIEW,
          [TabName.AVAILABLE_AREA]: StepItemType.INACTIVE_VIEW,
          [TabName.PASSWORD]: StepItemType.INACTIVE_VIEW,
          [TabName.INSPECTOR_DETAIL]: StepItemType.INACTIVE_VIEW,
        };
        setStatusStep({
          ...newStatusType,
          [currentTab]: StepItemType.ACTIVE_VIEW,
        });
        break;

      case StatusPage.CREATE:
        if (isSubmitted && !isEmpty(errors?.accountInformation)) {
          // error
          statusAccountInformation = StepItemType.ERROR;
        } else if (isSubmitted && isEmpty(errors?.accountInformation)) {
          // format ok
          statusAccountInformation = StepItemType.ACTIVE;
        } else {
          // new
          statusAccountInformation = StepItemType.NORMAL;
        }

        if (!activeTabs?.includes(TabName.PASSWORD)) {
          // disable tab
          statusPassword = StepItemType.INACTIVE;
        } else if (errors?.password?.message) {
          // error
          statusPassword = StepItemType.ERROR;
        } else if (isEmpty(errors?.password)) {
          // format ok
          statusPassword = StepItemType.ACTIVE;
        }

        if (!activeTabs?.includes(TabName.ROLE_AND_PERMISSION)) {
          // disable tab
          statusRoles = StepItemType.INACTIVE;
        } else if (errors?.roles?.message) {
          // error
          statusRoles = StepItemType.ERROR;
        } else if (isEmpty(errors?.roles)) {
          // format ok
          statusRoles = StepItemType.ACTIVE;
        }

        if (!activeTabs?.includes(TabName.AVAILABLE_AREA)) {
          // disable tab
          statusAvailableArea = StepItemType.INACTIVE;
        } else if (errors?.availableAreas) {
          // error
          statusAvailableArea = StepItemType.ERROR;
        } else if (isEmpty(errors?.availableAreas)) {
          // format ok
          statusAvailableArea = StepItemType.ACTIVE;
        }

        newStatusType = {
          [TabName.ACCOUNT_INFORMATION]: statusAccountInformation,
          [TabName.PASSWORD]: statusPassword,
          [TabName.ROLE_AND_PERMISSION]: statusRoles,
          [TabName.AVAILABLE_AREA]: statusAvailableArea,
          [TabName.INSPECTOR_DETAIL]: statusInspectorDetail,
        };

        setStatusStep({
          ...newStatusType,
        });
        break;
      case StatusPage.EDIT:
        if (!isEmpty(errors?.accountInformation)) {
          // error
          statusAccountInformation = StepItemType.ERROR;
        } else {
          // new
          statusAccountInformation = StepItemType.ACTIVE;
        }

        statusPassword = StepItemType.ACTIVE;

        if (!isEmpty(errors?.roles?.message)) {
          // error
          statusRoles = StepItemType.ERROR;
        } else if (isEmpty(errors?.roles?.message)) {
          // format ok
          statusRoles = StepItemType.ACTIVE;
        }

        if (!isEmpty(errors?.availableAreas)) {
          // error
          statusAvailableArea = StepItemType.ERROR;
        } else if (isEmpty(errors?.availableAreas)) {
          // format ok
          statusAvailableArea = StepItemType.ACTIVE;
        }

        if (activeTabs?.includes(TabName.INSPECTOR_DETAIL)) {
          // disable tab
          statusInspectorDetail = StepItemType.ACTIVE;
        }

        newStatusType = {
          [TabName.ACCOUNT_INFORMATION]: statusAccountInformation,
          [TabName.PASSWORD]: statusPassword,
          [TabName.ROLE_AND_PERMISSION]: statusRoles,
          [TabName.AVAILABLE_AREA]: statusAvailableArea,
          [TabName.INSPECTOR_DETAIL]: statusInspectorDetail,
        };

        setStatusStep({
          ...newStatusType,
        });
        break;
      default:
        break;
    }
  }, [
    activeTabs,
    currentTab,
    errors?.accountInformation,
    errors?.availableAreas,
    errors?.password,
    errors?.roles,
    isSubmitted,
    statusPage,
  ]);

  const themeContextData = {
    currentTab,
    handleSetCurrentTab,
    activeTabs,
    handleSetActiveTabs,
    statusPage,
    handleSetStatusPage,
    statusStep,
    setStatusStep,
    isInspector,
    listRoleAndPermissionAdmin,
    setListRoleAndPermissionAdmin,
  };

  return (
    <UserContext.Provider value={themeContextData}>
      <FormProvider {...methods}>{children}</FormProvider>
    </UserContext.Provider>
  );
};

export default UserProvider;
