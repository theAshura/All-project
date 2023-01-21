import * as yup from 'yup';
import moment from 'moment';
import { CompanyLevelEnum } from 'constants/common.const';
import { EntityType } from 'models/common.model';
import { AuditVisitTypeValues } from 'constants/components/planning.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';

export const sortPosition = [
  'vesselId',
  'auditTypeIds',
  'typeOfAudit',
  'toPortId',
  'toPortEstimatedTimeArrival',
  'toPortEstimatedTimeDeparture',
  'fromPortId',
  'fromPortEstimatedTimeArrival',
  'fromPortEstimatedTimeDeparture',
  'plannedFromDate',
  'plannedToDate',
  'auditorIds',
  'leadAuditorId',
];

export const defaultValues = {
  entityType: EntityType.Vessel,
  vesselId: '',
  vesselTypeId: '',
  fleetId: '',
  auditCompanyId: null,
  departmentId: null,
  dueDate: undefined,
  dateOfLastInspection: undefined,
  attachments: [],
  officeComments: [],
  additionalReviewers: [],
  fromPortId: '',
  toPortId: '',
  plannedFromDate: '',
  plannedToDate: '',
  auditTypeIds: [],
  memo: '',
  auditorIds: [],
  fromPortEstimatedTimeArrival: undefined,
  fromPortEstimatedTimeDeparture: undefined,
  leadAuditorId: undefined,
  toPortEstimatedTimeArrival: undefined,
  toPortEstimatedTimeDeparture: undefined,
  locationId: undefined,
  typeOfAudit: 'port',
};

export const fillOptions = (data) => {
  if (data.length > 0) {
    return data?.map((e) => ({
      value: e?.id,
      label: e?.name,
    }));
  }
  return undefined;
};

export const checkTimePlanIsInprogress = (
  createDate: string | Date,
  fromDate: string,
  toDate: string,
) => {
  const fromDateUnix = moment(fromDate)?.startOf('day').unix() || 0;
  const toDateUnix = toDate ? moment(toDate)?.endOf('day')?.unix() : 0;
  const createDateUnix = moment(createDate)?.startOf('day').unix() || 0;
  if (
    fromDateUnix <= createDateUnix &&
    (createDateUnix < toDateUnix || !toDateUnix)
  ) {
    return true;
  }
  return false;
};

export const checkDocHolderChartererVesselOwner = (
  data: {
    vesselDocHolders?: any;
    vesselCharterers?: any;
    vesselOwners?: any;
    createdAt?: string | Date;
    entityType?: string;
  },
  userInfo,
): boolean => {
  if (
    userInfo.companyLevel === CompanyLevelEnum.MAIN_COMPANY ||
    userInfo.companyLevel === CompanyLevelEnum.INTERNAL_COMPANY
  ) {
    return true;
  }
  if (data?.entityType === 'Office') {
    return true;
  }
  // check with external company and entity = vessel
  // check with current company not main company
  const isDocHolder = data?.vesselDocHolders?.some(
    (item) =>
      item?.companyId === userInfo?.company?.id &&
      checkTimePlanIsInprogress(
        data?.createdAt,
        item?.fromDate,
        item?.toDate,
      ) &&
      item?.status === 'active',
  );
  const isChaterer = data?.vesselCharterers?.some(
    (item) =>
      item?.companyId === userInfo?.company?.id &&
      checkTimePlanIsInprogress(
        data?.createdAt,
        item?.fromDate,
        item?.toDate,
      ) &&
      item?.status === 'active',
  );
  const isVesselOwner = data?.vesselOwners?.some(
    (item) =>
      item?.companyId === userInfo?.company?.id &&
      checkTimePlanIsInprogress(
        data?.createdAt,
        item?.fromDate,
        item?.toDate,
      ) &&
      item?.status === 'active',
  );
  if (isDocHolder || isChaterer || isVesselOwner) {
    return true;
  }
  return false;
};

export const planningSchema = (dynamicLabels) =>
  yup.object().shape({
    entityType: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    vesselId: yup
      .array()
      .nullable()
      .when('entityType', {
        is: (value) => value === EntityType.Vessel,
        then: yup
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
      }),
    auditCompanyId: yup
      .string()
      .nullable()
      .when('entityType', {
        is: (value) => value === EntityType.Office,
        then: yup
          .string()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    departmentIds: yup.array().nullable(),
    dateOfLastInspection: yup.string().trim().nullable(),
    dueDate: yup.string().trim().nullable(),
    auditTypeIds: yup
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
    plannedFromDate: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    plannedToDate: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    auditorIds: yup
      .array()
      .nullable()
      .min(
        0,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    leadAuditorId: yup.string().trim().nullable(),
    typeOfAudit: yup
      .string()
      .nullable()
      .when('entityType', {
        is: (value) => value === EntityType.Vessel,
        then: yup
          .string()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    locationId: yup
      .string()
      .nullable()
      .when('entityType', {
        is: (value) => value === EntityType.Office,
        then: yup
          .string()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    fromPortId: yup
      .array()
      .nullable()
      .when(['typeOfAudit', 'entityType'], {
        is: (typeOfAudit, entityType) =>
          [AuditVisitTypeValues.PORT, AuditVisitTypeValues.SAILING]?.includes(
            typeOfAudit,
          ) && entityType === EntityType.Vessel,
        then: yup
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
      }),
    toPortId: yup
      .array()
      .nullable()
      .when(['typeOfAudit', 'entityType'], {
        is: (typeOfAudit, entityType) =>
          [AuditVisitTypeValues.SAILING].includes(typeOfAudit) &&
          entityType === EntityType.Vessel,
        then: yup
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
      }),
    // fromPortEstimatedTimeArrival: yup
    //   .string()
    //   .nullable()
    //   .when(['typeOfAudit', 'entityType'], {
    //     is: (typeOfAudit, entityType) =>
    //       [AuditVisitTypeValues.PORT, AuditVisitTypeValues.SAILING].includes(
    //         typeOfAudit,
    //       ) && entityType === EntityType.Vessel,
    //     then: yup.string().nullable().required(t('errors.required')),
    //   }),
    // fromPortEstimatedTimeDeparture: yup
    //   .string()
    //   .nullable()
    //   .when(['typeOfAudit', 'entityType'], {
    //     is: (typeOfAudit, entityType) =>
    //       [AuditVisitTypeValues.PORT, AuditVisitTypeValues.SAILING].includes(
    //         typeOfAudit,
    //       ) && entityType === EntityType.Vessel,
    //     then: yup.string().nullable().trim().required(t('errors.required')),
    //   }),
    // toPortEstimatedTimeArrival: yup
    //   .string()
    //   .nullable()
    //   .when(['typeOfAudit', 'entityType'], {
    //     is: (typeOfAudit, entityType) =>
    //       [AuditVisitTypeValues.SAILING].includes(typeOfAudit) &&
    //       entityType === EntityType.Vessel,
    //     then: yup.string().nullable().trim().required(t('errors.required')),
    //   }),
    // toPortEstimatedTimeDeparture: yup
    //   .string()
    //   .nullable()
    //   .when(['typeOfAudit', 'entityType'], {
    //     is: (typeOfAudit, entityType) =>
    //       [AuditVisitTypeValues.SAILING].includes(typeOfAudit) &&
    //       entityType === EntityType.Vessel,
    //     then: yup.string().nullable().trim().required(t('errors.required')),
    //   }),
    workingType: yup.string().nullable(),
  });
