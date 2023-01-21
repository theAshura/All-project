import { formatDateIso } from 'helpers/date.helper';
import { EntityType } from 'models/common.model';
import isEmpty from 'lodash/isEmpty';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';

export const handleDataSumit = (
  values,
  focusRequest,
  isCreate,
  userAssignmentFromDetail,
  departmentDueDateData,
) => {
  const {
    vesselTypeId,
    fleetId,
    additionalReviewers,
    workingType,
    auditorIds,
    leadAuditorId,
    userAssignment,
    dueDate,
    dateOfLastInspection,
    departmentIds,
    ...other
  } = values;

  let vesselId;
  const isVesselType = other?.entityType === EntityType.Vessel;

  if (other?.vesselId?.length > 0) {
    other?.vesselId?.forEach((element) => {
      vesselId = element.value;
    });
  }
  const auditTypeIds =
    other?.auditTypeIds?.length > 0
      ? other?.auditTypeIds?.map((item) => item.value)
      : [];

  const departments = departmentIds?.map((item) => item?.value) || undefined;

  const officeComments = other?.officeComments;
  if (other?.officeComments?.length > 0) {
    other?.officeComments?.forEach((element, index) => {
      officeComments[index].serialNumber = index + 1;
    });
  }
  const fromPortId = other?.fromPortId?.[0]?.value || undefined;
  const toPortId = other?.toPortId?.[0]?.value || undefined;

  const plannedFromDate = formatDateIso(other?.plannedFromDate);
  const plannedToDate = formatDateIso(other?.plannedToDate);
  const fromPortEstimatedTimeArrival = formatDateIso(
    other?.fromPortEstimatedTimeArrival,
  );

  const toPortEstimatedTimeArrival = formatDateIso(
    other?.toPortEstimatedTimeArrival,
  );

  const fromPortEstimatedTimeDeparture = formatDateIso(
    other?.fromPortEstimatedTimeDeparture,
  );

  const toPortEstimatedTimeDeparture = formatDateIso(
    other?.toPortEstimatedTimeDeparture,
  );

  const entityValues: any = {};
  if (isVesselType) {
    // case vessel
    entityValues.auditCompanyId = null;
    entityValues.departmentIds = null;
  } else {
    // case company
    entityValues.vesselId = null;
    entityValues.vesselTypeId = null;
    entityValues.fleetId = null;
  }

  entityValues.workingType =
    !workingType || workingType === 'false' || workingType === 'Physical'
      ? 'Physical'
      : 'Remote';
  let dueDateAndDateOfLastInspections = null;
  if (isVesselType) {
    dueDateAndDateOfLastInspections = dueDate
      ? [
          {
            dueDate: formatDateIso(dueDate),
            dateOfLastInspection: formatDateIso(dateOfLastInspection),
          },
        ]
      : [];
  } else {
    dueDateAndDateOfLastInspections = departmentDueDateData?.length
      ? departmentDueDateData?.map((item) => ({
          dateOfLastInspection: formatDateIso(item?.dateOfLastInspection),
          dueDate: formatDateIso(item?.dueDate),
          name: item?.name || null,
          departmentId: item?.departmentId || null,
        }))
      : [];
  }

  const focusRequests = focusRequest.map((item) => {
    if (isCreate) {
      return item;
    }
    const { question, ...others } = item;
    return others;
  });

  let dataSubmit = {
    ...other,
    vesselId,
    fromPortId,
    toPortId,
    departmentIds: departments,
    auditTypeIds,
    attachments:
      other?.attachments?.length === 0 ? undefined : other?.attachments,
    plannedFromDate,
    plannedToDate,
    additionalReviewers:
      additionalReviewers?.length === 0 ? undefined : additionalReviewers,
    officeComments: officeComments?.length === 0 ? undefined : officeComments,
    fromPortEstimatedTimeArrival,
    fromPortEstimatedTimeDeparture,
    toPortEstimatedTimeArrival,
    toPortEstimatedTimeDeparture,
    dueDateAndDateOfLastInspections,
    focusRequests,
    ...entityValues,
  };
  if (auditorIds?.length > 0) {
    dataSubmit = { ...dataSubmit, auditorIds };
  }

  if (leadAuditorId?.length > 0) {
    dataSubmit = { ...dataSubmit, leadAuditorId };
  }

  if (userAssignment) {
    dataSubmit = { ...dataSubmit, userAssignment };
  }
  if (!userAssignment && userAssignmentFromDetail?.length) {
    dataSubmit = {
      ...dataSubmit,
      userAssignment: { usersPermissions: userAssignmentFromDetail },
    };
  }
  return dataSubmit;
};

export const auditorRowLabels = (dynamicLabels) => [
  {
    label: 'checkbox',
    id: 'checkbox',
    width: 80,
  },
  {
    label: renderDynamicLabel(
      dynamicLabels,
      DETAIL_PLANNING_DYNAMIC_FIELDS['Inspector name'],
    ),
    id: 'name',
    width: '100%',
  },
];

export const departmentRowLabels = (dynamicLabels) => [
  {
    id: 'name',
    label: renderDynamicLabel(
      dynamicLabels,
      DETAIL_PLANNING_DYNAMIC_FIELDS.Department,
    ),
    sort: true,
    fixedWidth: '20%',
    maxWidth: '20%',
  },
  {
    id: 'dateOfLastInspection',
    label: renderDynamicLabel(
      dynamicLabels,
      DETAIL_PLANNING_DYNAMIC_FIELDS['Date of last inspection'],
    ),
    sort: true,
    fixedWidth: '20%',
    maxWidth: '20%',
  },
  {
    id: 'dueDate',
    label: renderDynamicLabel(
      dynamicLabels,
      DETAIL_PLANNING_DYNAMIC_FIELDS['Due date'],
    ),
    sort: true,
  },
];

export const populateAuditorData = (
  dataUser,
  auditors,
  listAuditorUnAvailable,
) => {
  const aditionalAuditor =
    auditors?.filter(
      (item) => !listAuditorUnAvailable?.some((i) => i === item?.id),
    ) || [];

  const sortDataUser = dataUser?.sort((a, b) =>
    a?.label?.toString().localeCompare(b?.label?.toString(), 'en', {
      ignorePunctuation: true,
      numeric: true,
      sensitivity: 'base',
    }),
  );
  const newData =
    sortDataUser
      ?.map((item) => ({
        ...item,
        styleRow: listAuditorUnAvailable?.some((i) => i === item?.id)
          ? { background: '#e5e5e5' }
          : {},
      }))
      ?.concat(aditionalAuditor) || [];

  const dataTop = newData?.filter((i) => !isEmpty(i.styleRow)) || [];
  const dataBottom = newData?.filter((i) => isEmpty(i.styleRow)) || [];
  const result = [...dataBottom, ...dataTop];

  return result?.map((i) => ({
    ...i,
    label: i?.label || i?.username,
    name: i?.name || i?.username,
  }));
};
