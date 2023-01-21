import { ColorDataGoogleMap } from 'components/common/google-map/GoogleMap';

export const VESSEL_ICONS = [
  {
    name: 'Boat',
    path: 'boat.png',
  },
  {
    name: 'Bulker',
    path: 'bulker.png',
  },
  {
    name: 'Container Ship',
    path: 'container-ship.png',
  },
  {
    name: 'Dingey',
    path: 'dingey.png',
  },
  {
    name: 'Dry Cargo',
    path: 'dry-cargo.png',
  },
  {
    name: 'Ferry Boat',
    path: 'ferry-boat.png',
  },
  {
    name: 'Fishing Boat',
    path: 'fishing-boat.png',
  },
  {
    name: 'Kayak',
    path: 'kayak.png',
  },
  {
    name: 'Marine Liner',
    path: 'marine-liner.png',
  },
  {
    name: 'Power Boat',
    path: 'power-boat.png',
  },
  {
    name: 'Ro ro',
    path: 'ro-ro.png',
  },
  {
    name: 'Sail boat',
    path: 'sail-boat.png',
  },
  {
    name: 'Yacht',
    path: 'yacht.png',
  },
];

export const URL_ICON = [
  {
    color: ColorDataGoogleMap.BLUE,
    status: 'urlAssignedFullySelected',
    url: `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/assigned_fully_selected/`,
  },
  {
    color: ColorDataGoogleMap.BLUE,
    status: 'urlAssignedFully',
    url: `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/assigned_fully/`,
  },
  {
    color: ColorDataGoogleMap.GREEN,
    status: 'urlAssignedPartialSelected',
    url: `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/assigned_partial_selected/`,
  },
  {
    color: ColorDataGoogleMap.GREEN,
    status: 'urlAssignedPartial',
    url: `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/assigned_partial/`,
  },
  {
    color: ColorDataGoogleMap.ORANGE,
    status: 'urlUnAssignedFullySelected',
    url: `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/unassigned_fully_selected/`,
  },
  {
    color: ColorDataGoogleMap.ORANGE,
    status: 'urlUnAssignedFully',
    url: `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/unassigned_fully/`,
  },
  {
    color: ColorDataGoogleMap.GREEN,
    status: 'urlUnAssignedPartialSelected',
    url: `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/unassigned_partial_selected/`,
  },
  {
    color: ColorDataGoogleMap.GREEN,
    status: 'urlUnAssignedPartial',
    url: `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/unassigned_partial/`,
  },
];
