import { FC, useCallback, useMemo } from 'react';
import {
  MapWrapped,
  PropMap,
  MarkerProp,
  ColorDataGoogleMap,
  // TypeDataGoogleMap,
} from 'components/common/google-map/GoogleMap';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';
import cx from 'classnames';

import {
  MAP_VIEW_TABS,
  // AVAILABILITY_OPTIONS_ENUM,
} from 'components/map-view/filter-map-view/filter.const';

import classes from '../map-view.module.scss';

const urlAssignedFullySelected = `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/assigned_fully_selected/`;
const urlAssignedFully = `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/assigned_fully/`;
const urlAssignedPartialSelected = `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/assigned_partial_selected/`;
const urlAssignedPartial = `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/assigned_partial/`;
const urlUnAssignedFullySelected = `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/unassigned_fully_selected/`;
const urlUnAssignedFully = `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/unassigned_fully/`;
const urlUnAssignedPartialSelected = `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/unassigned_partial_selected/`;
const urlUnAssignedPartial = `https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/vessel_icon/unassigned_partial/`;

const AVAILABILITY_TYPE = {
  ALL: 'All',
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
  PARTIALLY: 'Partially',
};

interface GoogleMapCPModal {
  activeTab: string;
  getMarkerIds?: (ids: string[]) => void;
}
const GoogleMapCP: FC<GoogleMapCPModal & PropMap> = ({
  activeTab,
  currentPosition,
  idSelected,
  getMarker,
  getMarkerIds,
  ...other
}) => {
  const { listInspection, listInspector } = useSelector(
    (state) => state.mapView,
  );

  const convertUrlIcon = useCallback((marker, isOffice) => {
    const isAssigned = marker?.auditors?.length > 0;
    let dataIcon;
    if (isAssigned && marker?.partial) {
      dataIcon = {
        iconSelected: urlAssignedPartialSelected,
        iconUnSelected: urlAssignedPartial,
        color: ColorDataGoogleMap.GREEN,
      };
    }
    if (isAssigned && !marker?.partial) {
      dataIcon = {
        iconSelected: urlAssignedFullySelected,
        iconUnSelected: urlAssignedFully,
        color: ColorDataGoogleMap.BLUE,
      };
    }
    if (!isAssigned && marker?.partial) {
      dataIcon = {
        iconSelected: urlUnAssignedPartialSelected,
        iconUnSelected: urlUnAssignedPartial,
        color: ColorDataGoogleMap.GREEN,
      };
    }
    if (!isAssigned && !marker?.partial) {
      dataIcon = {
        iconSelected: urlUnAssignedFullySelected,
        iconUnSelected: urlUnAssignedFully,
        color: ColorDataGoogleMap.ORANGE,
      };
    }
    if (isOffice) {
      return {
        iconSelected: `${dataIcon.iconSelected}office.png`,
        iconUnSelected: `${dataIcon.iconUnSelected}office.png`,
      };
    }
    return {
      iconSelected: `${dataIcon.iconSelected}${marker?.vessel?.vesselType?.icon}`,
      iconUnSelected: `${dataIcon.iconUnSelected}${marker?.vessel?.vesselType?.icon}`,
      color: dataIcon?.color,
    };
  }, []);

  const convertColor = useCallback((typeGlobal: string) => {
    switch (typeGlobal) {
      case AVAILABILITY_TYPE.UNAVAILABLE:
        return ColorDataGoogleMap.RED;
      case AVAILABILITY_TYPE.PARTIALLY:
        return ColorDataGoogleMap.YELLOW;
      // case AVAILABILITY_TYPE.AVAILABLE:
      //   return ColorDataGoogleMap.YELLOW;
      default:
        return '';
    }
  }, []);

  const listInspectionData: MarkerProp[] = useMemo(() => {
    const newData: MarkerProp[] = [];
    if (activeTab === MAP_VIEW_TABS.INSPECTION) {
      listInspection?.data?.forEach((item) => {
        let address;
        let dataIcon;
        let isCheckIcon = false;
        if (item?.vessel) {
          dataIcon = convertUrlIcon(item, false);
          isCheckIcon = true;

          newData.push({
            id: v4(),
            idData: item.id,
            ...dataIcon,
            address,
            isCheckIcon,
            coordinates: {
              lat: item?.toPort?.latitude,
              lng: item?.toPort?.longitude,
            },
          });
          if (
            item?.fromPort?.latitude !== item?.toPort?.latitude ||
            item?.fromPort?.longitude !== item?.toPort?.longitude
          ) {
            newData.push({
              id: v4(),
              idData: item.id,
              ...dataIcon,
              address,
              isCheckIcon,
              coordinates: {
                lat: item?.fromPort?.latitude,
                lng: item?.fromPort?.longitude,
              },
            });
          }
        }
        if (item?.auditCompany) {
          address = item?.auditCompany?.address;
          dataIcon = convertUrlIcon(item, true);
          newData.push({
            id: v4(),
            idData: item.id,
            ...dataIcon,
            address,
            isCheckIcon,
            coordinates: {
              lat: item?.auditCompany?.geoLocation?.coordinates?.[1],
              lng: item?.auditCompany?.geoLocation?.coordinates?.[0],
            },
          });
        }
      });
    } else {
      listInspector?.selectedInspectorsInfo?.forEach((inspector) => {
        const colorPlanning = convertColor(listInspector?.searchAvailability);

        if (inspector?.availableAreas?.length) {
          inspector?.availableAreas?.forEach((availableAre) => {
            if (availableAre?.preference === 'strong') {
              availableAre?.ports?.forEach((port) => {
                newData.push({
                  id: v4(),
                  idData: inspector.id,
                  iconSelected: inspector?.avatarUrl?.link,
                  iconUnSelected: inspector?.avatarUrl?.link,
                  createdAt: '',
                  color: colorPlanning || ColorDataGoogleMap.BLUE,
                  address: '',
                  isCheckIcon: false,
                  coordinates: {
                    lat: port?.latitude,
                    lng: port?.longitude,
                  },
                });
              });
            }
          });
        }

        if (inspector?.address) {
          newData.push({
            id: v4(),
            idData: inspector.id,
            iconSelected: inspector?.avatarUrl?.link,
            iconUnSelected: inspector?.avatarUrl?.link,
            createdAt: '',
            color: colorPlanning || ColorDataGoogleMap.ORANGE,
            address: `${inspector?.address} ${inspector?.country}`,
            isCheckIcon: false,
            coordinates: {
              lat: inspector?.geoLocation?.coordinates?.[1],
              lng: inspector?.geoLocation?.coordinates?.[0],
            },
          });
        }
      });
    }

    return newData;
  }, [
    activeTab,
    listInspection?.data,
    convertUrlIcon,
    listInspector?.selectedInspectorsInfo,
    listInspector?.searchAvailability,
    convertColor,
  ]);

  const styleMarker = useMemo(
    () =>
      listInspectionData?.map((item, index) => {
        if (idSelected === item.id) {
          return (
            <style
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `
   .wrap-google-map div[title="${item?.idData}--${index}"] {
    border:3px solid ${item.color} !important;
    width: 42px !important;
    height: 42px !important;
    border-radius: 50% !important;
    margin-top: -3px;
    margin-left: -3px;
  }
  .wrap-google-map div[title="${item?.idData}--${index}"] > img {
    border:3px solid white !important;
    border-radius: 50% !important;
  }
`,
              }}
            />
          );
        }
        return (
          <style
            key={item.id}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
         .wrap-google-map div[title="${item?.idData}--${index}"] {
          border:3px solid ${item.color}35 !important;
          width: 42px !important;
          height: 42px !important;
          border-radius: 50% !important;
          margin-top: -3px;
          margin-left: -3px;
        }
        .wrap-google-map div[title="${item?.idData}--${index}"] > img {
          border-radius: 50% !important;
          border:3px solid ${item.color} !important;
        }
      `,
            }}
          />
        );
      }),
    [listInspectionData, idSelected],
  );

  return (
    <div className={cx('wrap-google-map', classes.wrapMap)}>
      <MapWrapped
        markers={listInspectionData}
        getMarker={getMarker}
        typeGroups={activeTab === MAP_VIEW_TABS.INSPECTION ? 1 : 2}
        idSelected={idSelected}
        currentPosition={currentPosition}
        getMarkerIds={getMarkerIds}
      />
      {activeTab === MAP_VIEW_TABS.INSPECTOR && styleMarker}
    </div>
  );
};
export default GoogleMapCP;
