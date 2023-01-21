import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { toastError } from 'helpers/notification.helper';
import uniq from 'lodash/uniq';
import { MAP_VIEW_TABS } from 'components/map-view/filter-map-view/filter.const';
import { getListFileApi } from 'api/dms.api';
import {
  getListMapViewInspection,
  getListMapViewInspector,
} from '../utils/api';
import {
  getListMapViewInspectionActions,
  getListMapViewInspectorActions,
} from './action';

function* getListInspection(action) {
  try {
    const { handleSuccesss, ...params } = action.payload;
    const response = yield call(getListMapViewInspection, params);

    const listCompanyIds =
      response?.data?.data?.map((item) => item?.auditCompany?.logo) || [];
    const listVesselIds =
      response?.data?.data?.map((item) => item?.vessel?.image) || [];

    const listIds = listCompanyIds
      ?.concat(listVesselIds)
      ?.filter((item) => item);

    const listLogo = listIds?.length
      ? yield call(getListFileApi, {
          ids: uniq(listIds),
        })
      : [];

    const { data } = response;

    const listInspection = data?.data?.map((item) => ({
      ...item,
      logo:
        listLogo?.data?.find(
          (i) =>
            i?.id === item?.auditCompany?.logo || i?.id === item?.vessel?.image,
        ) || '',
    }));

    if (handleSuccesss) {
      handleSuccesss(listInspection, MAP_VIEW_TABS.INSPECTION);
    }

    yield put(
      getListMapViewInspectionActions.success({
        ...data,
        data: listInspection,
      }),
    );
  } catch (e) {
    toastError(e);
    yield put(getListMapViewInspectionActions.failure());
  }
}
function* getListInspector(action) {
  try {
    const { handleSuccesss, ...params } = action.payload;
    const response = yield call(getListMapViewInspector, params);
    const listAvatarIds =
      response?.data?.selectedInspectorsInfo?.map((item) => item?.avatar) || [];
    const listCompanyIds =
      response?.data?.selectedInspectorsInfo?.map(
        (item) => item?.company?.logo,
      ) || [];

    const listIdsLogo = listAvatarIds
      ?.concat(listCompanyIds)
      ?.filter((item) => item);

    const listLogo = listIdsLogo?.length
      ? yield call(getListFileApi, {
          ids: uniq(listIdsLogo),
        })
      : [];

    const { data } = response;

    const listInspector = data?.selectedInspectorsInfo?.map((item) => ({
      ...item,
      company: {
        ...item.company,
        companyLogo:
          listLogo?.data?.find((i) => i?.id === item?.company?.logo) || null,
      },
      avatarUrl: listLogo?.data?.find((i) => i?.id === item?.avatar) || null,
    }));

    if (handleSuccesss) {
      handleSuccesss(listInspector);
    }

    yield put(
      getListMapViewInspectorActions.success({
        ...data,
        selectedInspectorsInfo: listInspector,
      }),
    );
  } catch (e) {
    toastError(e);
    yield put(getListMapViewInspectorActions.failure());
  }
}

export default function* MapViewSaga() {
  yield all([
    yield takeLatest(
      getListMapViewInspectionActions.request,
      getListInspection,
    ),
    yield takeLatest(getListMapViewInspectorActions.request, getListInspector),
  ]);
}
