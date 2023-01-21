import { useEffect, useState, useCallback, useMemo } from 'react';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { formatDateIso } from 'helpers/date.helper';
import moment from 'moment';
import uniq from 'lodash/uniq';
import images from 'assets/images/images';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAP_VIEW_DYNAMIC_FIELDS } from 'constants/dynamic/map-view.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { convertDMSToDD } from 'helpers/google.map.helper';
import ListInspection from 'components/map-view/list-inspection/ListInspection';
import DetailInspection from 'components/map-view/detail-inspection/DetailInspection';
import FilterMapView from 'components/map-view/filter-map-view/FilterMapView';
import cx from 'classnames';
import { MAP_VIEW_TABS } from 'components/map-view/filter-map-view/filter.const';
import { useDispatch, useSelector } from 'react-redux';
import GoogleMapCP from './components/GoogleMapCP';
import classes from './map-view.module.scss';
import {
  getListMapViewInspectionActions,
  getListMapViewInspectorActions,
} from './store/action';
import { GetListInspectionInspector } from './utils/model';

const MapView = () => {
  const { listInspection, listInspector } = useSelector(
    (state) => state.mapView,
  );

  const [listInspectionVisible, setListInspectionVisible] = useState(false);
  const [detailInspectionVisible, setDetailInspectionVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [inspectionSelected, setInspectionSelected] = useState(null);
  const [prevFilter, setPrevFilter] = useState<any>({});
  const { userInfo } = useSelector((state) => state.authenticate);
  const [activeTab, setActiveTab] = useState(MAP_VIEW_TABS.INSPECTOR);
  const [markerSelect, setMarkerSelect] = useState(null);
  const [markerSelected, setMarkerSelected] = useState<{
    lat: string | number;
    lng: string | number;
  }>({
    lat: 1.287953, // singapore for default
    lng: 103.851784,
  });

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionMapView,
    modulePage: ModulePage.View,
  });
  const dispatch = useDispatch();

  const handleCheckLocation = useCallback((data, type) => {
    if (type === MAP_VIEW_TABS.INSPECTION) {
      const nearLocation = data?.find(
        (item) =>
          item?.auditCompany?.geoLocation?.coordinates?.[0] ||
          item?.toPort?.latitude,
      );
      const laditute = nearLocation?.auditCompany
        ? nearLocation?.auditCompany?.geoLocation?.coordinates?.[1]
        : convertDMSToDD(nearLocation?.fromPort?.latitude);
      const long = nearLocation?.auditCompany
        ? nearLocation?.auditCompany?.geoLocation?.coordinates?.[0]
        : convertDMSToDD(nearLocation?.fromPort?.longitude);
      setMarkerSelected({
        lat: laditute || null,
        lng: long || null,
      });
    } else {
      const nearLocation = data?.find(
        (item) => item?.geoLocation?.coordinates?.[0],
      );
      if (nearLocation?.geoLocation?.coordinates?.[0]) {
        setMarkerSelected({
          lat: nearLocation?.geoLocation?.coordinates?.[1],
          lng: nearLocation?.geoLocation?.coordinates?.[0],
        });
      }
    }
  }, []);

  const handleGetListInspection = useCallback(
    (params?: GetListInspectionInspector) => {
      setDetailInspectionVisible(false);
      setListInspectionVisible(true);
      if (activeTab === MAP_VIEW_TABS.INSPECTION) {
        const search = {
          page: 1,
          pageSize: -1,
          planningType: 'All',
          // companyId: userInfo?.companyId,
          entityTypes: ['Vessel', 'Office'],
          fromDate: formatDateIso(moment()?.subtract(3, 'months')?.format('L')),
          toDate: formatDateIso(moment()?.format('L')),
          handleSuccesss: handleCheckLocation,
          ...prevFilter?.inspection,
          ...params,
        };
        setPrevFilter((prev) => ({ ...prev, inspection: search }));
        dispatch(getListMapViewInspectionActions.request(search));
      } else {
        const search = {
          page: 1,
          pageSize: -1,
          searchAvailability: 'All',
          // companyId: userInfo?.companyId,
          childCompanyIds: [userInfo?.parentCompanyId || userInfo?.companyId],
          fromDate: formatDateIso(moment()?.subtract(3, 'months')?.format('L')),
          toDate: formatDateIso(moment()?.format('L')),
          handleSuccesss: handleCheckLocation,
          baseLocation: true,
          includeServiceArea: true,
          ...prevFilter?.inspector,
          ...params,
        };
        setPrevFilter((prev) => ({ ...prev, inspector: search }));
        dispatch(getListMapViewInspectorActions.request(search));
      }
    },

    [
      activeTab,
      dispatch,
      handleCheckLocation,
      prevFilter?.inspection,
      prevFilter?.inspector,
      userInfo?.companyId,
      userInfo?.parentCompanyId,
    ],
  );

  useEffect(() => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMarkerSelected({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
    // handleGetListInspection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleGetListInspection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleSelectItem = useCallback(
    (item: any) => {
      if (activeTab === MAP_VIEW_TABS.INSPECTION) {
        const laditute = item?.auditCompany
          ? item?.auditCompany?.geoLocation?.coordinates?.[1]
          : convertDMSToDD(item?.fromPort?.latitude);
        const long = item?.auditCompany
          ? item?.auditCompany?.geoLocation?.coordinates?.[0]
          : convertDMSToDD(item?.fromPort?.longitude);
        setMarkerSelected({
          lat: laditute || null,
          lng: long || null,
        });
      } else if (item?.geoLocation?.coordinates?.[0]) {
        setMarkerSelected({
          lat: item?.geoLocation?.coordinates?.[1],
          lng: item?.geoLocation?.coordinates?.[0],
        });
      }
      setInspectionSelected(item);
      setDetailInspectionVisible(true);
      setFilterVisible(false);
    },
    [activeTab],
  );

  const onCheckRemarks = useCallback(
    (ids) => {
      const idsFiltered = uniq(ids)?.filter((id) => id);

      if (activeTab === MAP_VIEW_TABS.INSPECTION) {
        const data = listInspection?.data?.filter((item) =>
          idsFiltered?.includes(item?.id),
        );
        dispatch(
          getListMapViewInspectionActions.success({
            ...listInspection,
            data,
            totalItem: data?.length || 0,
          }),
        );
      } else {
        const data = listInspector?.selectedInspectorsInfo?.filter((item) =>
          idsFiltered?.includes(item?.id),
        );
        const dataPlanning = listInspector?.pickedPlanningRequests?.filter(
          (item) => idsFiltered?.includes(item?.auditors?.id),
        );

        dispatch(
          getListMapViewInspectorActions.success({
            ...listInspector,
            pickedPlanningRequests: dataPlanning || [],
            selectedInspectorsInfo: data || [],
          }),
        );
      }
    },
    [activeTab, dispatch, listInspection, listInspector],
  );

  const renderTotalSize = useMemo(() => {
    if (activeTab === MAP_VIEW_TABS.INSPECTION) {
      return (
        <div
          className={classes.wrapToggleList}
          onClick={() => setListInspectionVisible((prev) => !prev)}
        >
          {renderDynamicLabel(dynamicLabels, MAP_VIEW_DYNAMIC_FIELDS.Results)}{' '}
          {listInspection?.totalItem ? 1 : 0} - {listInspection?.totalItem || 0}{' '}
          <img
            src={images.icons.icChevronDoubleDown}
            alt="icChevronDoubleDown"
            className={classes.iconDown}
          />
        </div>
      );
    }
    return (
      <div
        className={classes.wrapToggleList}
        onClick={() => setListInspectionVisible((prev) => !prev)}
      >
        {renderDynamicLabel(dynamicLabels, MAP_VIEW_DYNAMIC_FIELDS.Results)}{' '}
        {listInspector?.selectedInspectorsInfo?.length ? 1 : 0} -{' '}
        {listInspector?.selectedInspectorsInfo?.length || 0}{' '}
        <img
          src={images.icons.icChevronDoubleDown}
          alt="icChevronDoubleDown"
          className={classes.iconDown}
        />
      </div>
    );
  }, [
    activeTab,
    dynamicLabels,
    listInspection?.totalItem,
    listInspector?.selectedInspectorsInfo?.length,
  ]);

  return (
    <div>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.MAP_VIEW}
        titlePage={renderDynamicLabel(
          dynamicLabels,
          MAP_VIEW_DYNAMIC_FIELDS['Map view'],
        )}
      />

      <div className={classes.wrap}>
        <div className={classes.wrapDetail}>
          <DetailInspection
            isOpen={detailInspectionVisible}
            activeTab={activeTab}
            inspectionSelected={inspectionSelected}
            toggle={() => {
              if (!detailInspectionVisible) {
                setFilterVisible(false);
              }
              setDetailInspectionVisible((prev) => !prev);
            }}
          />
        </div>
        <div className="d-flex align-items-center">
          <div className={classes.wrapLeftContent}>
            <GoogleMapCP
              activeTab={activeTab}
              idSelected={markerSelect?.id}
              currentPosition={markerSelected}
              getMarker={(marker) => {
                setMarkerSelect(marker);
                setMarkerSelected({
                  lat: marker.coordinates.lat,
                  lng: marker.coordinates.lng,
                });
              }}
              getMarkerIds={onCheckRemarks}
            />
            <div
              className={cx(classes.wrapList, {
                [classes.hideList]: !listInspectionVisible,
              })}
            >
              {renderTotalSize}
              <ListInspection
                isOpen={detailInspectionVisible}
                inspectionSelected={inspectionSelected}
                activeTab={activeTab}
                handleSelectItem={handleSelectItem}
              />
            </div>
          </div>
        </div>
        <FilterMapView
          isOpen={filterVisible}
          toggle={() => {
            setFilterVisible((prev) => !prev);
          }}
          onSearch={handleGetListInspection}
          activeTab={activeTab}
          clearData={() => setInspectionSelected(null)}
          setActiveTab={(value) => {
            setActiveTab(value);
          }}
        />
        <div
          className={classes.toggleFilter}
          onClick={() => {
            setFilterVisible(true);
            setDetailInspectionVisible(false);
            setListInspectionVisible(false);
          }}
        >
          <img src={images.icons.icFilter} alt="icFilter" />
        </div>
      </div>
    </div>
  );
};

export default MapView;
