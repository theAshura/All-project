export const MAP_VIEW_TABS = {
  INSPECTOR: 'inspector',
  INSPECTION: 'inspection',
};

export const AVAILABILITY_OPTIONS_ENUM = {
  ALL: 'All',
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
  PARTIALLY: 'Partially',
};

export const AVAILABILITY_OPTIONS = [
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Available',
    value: 'Available',
  },
  {
    label: 'Unavailable',
    value: 'Unavailable',
  },
  {
    label: 'Partially',
    value: 'Partially',
  },
];

export const PLANNING_TYPE_OPTIONS = [
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Assigned',
    value: 'Assigned',
  },
  {
    label: 'Unassigned',
    value: 'Unassigned',
  },
];

export const ENTITY_TYPE_OPTIONS = [
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Vessel',
    value: 'Vessel',
  },
  {
    label: 'Office',
    value: 'Office',
  },
];

export const defaultValues = {
  inspector: {
    availability: null,
    dateTime: null,
    byCountry: false,
    byPort: false,
    entityVessel: false,
    entityOffice: false,
    searchAvailability: 'All',
    baseLocation: true,
    includeServiceArea: true,
    auditorIds: null,
  },
  inspection: {
    availability: null,
    dateTime: null,
    byCountry: false,
    byPort: false,
    entityVessel: false,
    entityOffice: false,
    planningType: 'All',
    auditorIds: null,
  },
};
