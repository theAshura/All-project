import { useState, useRef, useEffect, useMemo } from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import isNaN from 'lodash/isNaN';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { parseDMS } from 'helpers/google.map.helper';
import './google-map.scss';
import { MAP } from 'react-google-maps/lib/constants';

export enum TypeDataGoogleMap {
  INSPECTOR = 'Inspector',
  INSPECTION = 'Inspection',
}

export enum ColorDataGoogleMap {
  ORANGE = '#FF6E01',
  BLUE = '#3B6FF3',
  GREEN = '#2AAF60',
  RED = '#F53E3E',
  YELLOW = '#FFAE00',
}

export interface LatLngLiteral {
  lat: number | string;
  lng: number | string;
}
export interface MarkerProp {
  id: string;
  idData?: string;
  iconSelected?: string;
  iconUnSelected?: string;
  isCheckIcon?: boolean;
  coordinates?: LatLngLiteral;
  color?: ColorDataGoogleMap;
  address?: string;
  createdAt?: string;
}

export interface PropMap {
  markers?: MarkerProp[];
  typeGroups?: number;
  idSelected?: string;
  currentPosition: LatLngLiteral;
  typeDataGoogleMap?: TypeDataGoogleMap;
  getMarker: (marker: MarkerProp) => void;
  getMarkerIds?: (ids: string[]) => void;
}

const clusterStyles = [
  {
    textColor: '#AE4AFD',
    url: 'https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/map/icInspectionsUnselected.svg',
    height: 42,
    width: 42,
    anchorText: [-27, -2],
  },
  {
    textColor: '#AE4AFD',
    url: 'https://svm-inautix-dev1.s3.ap-southeast-1.amazonaws.com/publics/map/icInspectorsUnselected.svg',
    height: 42,
    width: 42,
    anchorText: [-27, -2],
  },
];

function markerLayerClass() {
  this.getPanes().markerLayer.className = 'marker-icon';
}
function markerLayer2Class() {
  this.getPanes().markerLayer.className = 'marker-icon2';
}

const MapComponent = (props: PropMap) => {
  const {
    markers,
    currentPosition,
    idSelected,
    getMarker,
    getMarkerIds,
    typeGroups = 1,
  } = props;
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(10);
  // const { loading } = useSelector((state) => state.mapView);

  useEffect(() => {
    if (currentPosition) {
      setZoom(10);
    }
  }, [currentPosition]);

  const markerClustererCalculator = (markers, numStyles) => ({
    index: typeGroups,
    text: markers.length,
  });

  const dataMap: MarkerProp[] = useMemo(
    () =>
      markers
        ?.map((item) => {
          if (typeof item.coordinates?.lat === 'number') {
            return item;
          }
          const dataCode = parseDMS(
            item.coordinates?.lat?.toString(),
            item.coordinates?.lng?.toString(),
          );
          const lat = Math.round(dataCode?.lat * 10000000) / 10000000;
          const lng = Math.round(dataCode?.lng * 10000000) / 10000000;
          return {
            ...item,
            coordinates: {
              lat,
              lng,
            },
          };
        })
        ?.filter(
          (t) =>
            !(
              isNaN(t?.coordinates?.lat) ||
              isNaN(t?.coordinates?.lng) ||
              typeof t?.coordinates?.lat !== 'number' ||
              typeof t?.coordinates?.lng !== 'number'
            ),
        ),
    [markers],
  );

  useEffect(() => {
    const myOverLay = new window.google.maps.OverlayView();
    if (typeGroups === 2) {
      myOverLay.draw = markerLayerClass;
    } else {
      myOverLay.draw = markerLayer2Class;
    }
    myOverLay.setMap(mapRef.current.context[MAP]);
  }, [typeGroups]);

  return (
    <GoogleMap
      zoom={zoom || 10}
      center={{
        lat: Number(currentPosition?.lat),
        lng: Number(currentPosition?.lng),
      }}
      ref={mapRef}
      options={{ minZoom: 3 }}
      // onZoomChanged={() => setZoom(mapRef.current.getZoom())}
    >
      <MarkerClusterer
        styles={clusterStyles}
        minimumClusterSize={2}
        onClick={(cluster) => {
          const dataCluster = cluster.getMarkers()?.map((i) => {
            const idMarker = i.title?.split('--')?.[0];
            return idMarker;
          });
          getMarkerIds?.(dataCluster);
        }}
        // defaultMaxZoom={10}
        calculator={markerClustererCalculator}
        // enableRetinaIcons={false}
        // defaultImagePath="https://img4.thuthuatphanmem.vn/uploads/2020/03/08/hinh-anh-nhung-con-cho-de-thuong_092948873.jpg"
      >
        {dataMap?.map((marker, index) => (
          <Marker
            title={`${marker.idData}--${index}`}
            key={marker.id}
            position={{
              lat: Number(marker.coordinates.lat),
              lng: Number(marker.coordinates.lng),
            }}
            onClick={() => {
              getMarker(marker);
            }}
            icon={{
              url:
                idSelected === marker.id
                  ? marker.iconSelected
                  : marker.iconUnSelected,
              scaledSize: new window.google.maps.Size(36, 36),
            }}
          />
        ))}
        {/* {dataMap?.length > 0 && (
          <Marker
            title={dataMap[0].idData}
            key={dataMap[0].id}
            position={{
              lat: Number(dataMap[0].coordinates.lat),
              lng: Number(dataMap[0].coordinates.lng),
            }}
            onClick={() => {
              getMarker(dataMap[0]);
            }}
            icon={{
              url:
                idSelected === dataMap[0].id
                  ? dataMap[0].iconSelected
                  : dataMap[0].iconUnSelected,
              scaledSize: new window.google.maps.Size(36, 36),
            }}
          />
        )} */}
      </MarkerClusterer>
    </GoogleMap>
  );
};

const MapComponentWithScript = withScriptjs(withGoogleMap(MapComponent));
export const MapWrapped = (props: PropMap) => {
  const {
    markers,
    currentPosition,
    idSelected,
    getMarker,
    getMarkerIds,
    typeGroups,
  } = props;
  // console.log('render');
  return (
    <MapComponentWithScript
      markers={markers}
      typeGroups={typeGroups}
      idSelected={idSelected}
      getMarker={getMarker}
      getMarkerIds={getMarkerIds}
      currentPosition={currentPosition}
      googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={
        <div id="mapViewContainer" style={{ height: `100%` }} />
      }
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
};
