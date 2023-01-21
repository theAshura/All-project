import { createReducer } from 'typesafe-actions';
import { VesselSummaryStoreModel } from '../utils/models/summary.model';
import {
  getSummaryAttachmentsAndRemarksActions,
  updateSummaryAttachmentsAndRemarksActions,
  createSummaryAttachmentsAndRemarksActions,
  deleteSummaryAttachmentsAndRemarksActions,
  getVesselSummaryActions,
  updateVesselSummaryActions,
  clearAttachmentAndRemarksReducer,
  clearSummaryObjectsReducer,
  getFeedbackAndRemarksActions,
  createFeedbackAndRemarksActions,
  updateFeedbackAndRemarksActions,
  deleteFeedbackAndRemarksActions,
  getSummaryByTabActions,
  getSummaryWebServicesActions,
  createSummaryWebServicesActions,
  updateSummaryWebServicesActions,
  deleteSummaryWebServicesActions,
} from './vessel-summary.action';

const INITIAL_STATE: VesselSummaryStoreModel = {
  loading: false,
  errorList: null,
  listRemarks: null,
  listAttachmentAndRemark: null,
  listWebServices: null,
  summaryByTab: null,
  summary: null,
};

const VesselSummaryReducer = createReducer<VesselSummaryStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getFeedbackAndRemarksActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getFeedbackAndRemarksActions.success, (state, { payload }) => ({
    ...state,
    listRemarks: payload,
    loading: false,
  }))
  .handleAction(getFeedbackAndRemarksActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(createFeedbackAndRemarksActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    createFeedbackAndRemarksActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )
  .handleAction(
    createFeedbackAndRemarksActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errors: payload,
    }),
  )

  .handleAction(updateFeedbackAndRemarksActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    updateFeedbackAndRemarksActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )
  .handleAction(
    updateFeedbackAndRemarksActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errors: payload,
    }),
  )

  .handleAction(
    deleteFeedbackAndRemarksActions.request,
    (state, { payload }) => ({
      ...state,
      loading: true,
    }),
  )
  .handleAction(
    deleteFeedbackAndRemarksActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )
  .handleAction(
    deleteFeedbackAndRemarksActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errors: payload,
    }),
  )
  .handleAction(getSummaryAttachmentsAndRemarksActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getSummaryAttachmentsAndRemarksActions.success,
    (state, { payload }) => ({
      ...state,
      listAttachmentAndRemark: payload,
      loading: false,
    }),
  )
  .handleAction(getSummaryAttachmentsAndRemarksActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(createSummaryAttachmentsAndRemarksActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createSummaryAttachmentsAndRemarksActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    createSummaryAttachmentsAndRemarksActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errors: payload,
    }),
  )

  .handleAction(updateSummaryAttachmentsAndRemarksActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateSummaryAttachmentsAndRemarksActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updateSummaryAttachmentsAndRemarksActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errors: payload,
    }),
  )

  .handleAction(deleteSummaryAttachmentsAndRemarksActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    deleteSummaryAttachmentsAndRemarksActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )
  .handleAction(
    deleteSummaryAttachmentsAndRemarksActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errors: payload,
    }),
  )

  .handleAction(getVesselSummaryActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getVesselSummaryActions.success, (state, { payload }) => ({
    ...state,
    summary: {
      ...state.summary,
      [payload?.reference]: payload,
    },
    loading: false,
  }))
  .handleAction(getVesselSummaryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errors: payload,
  }))

  .handleAction(updateVesselSummaryActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateVesselSummaryActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateVesselSummaryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errors: payload,
  }))
  .handleAction(getSummaryByTabActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getSummaryByTabActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    summaryByTab: payload,
  }))
  .handleAction(getSummaryByTabActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errors: payload,
  }))

  .handleAction(getSummaryWebServicesActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getSummaryWebServicesActions.success, (state, { payload }) => ({
    ...state,
    listWebServices: payload,
    loading: false,
  }))
  .handleAction(getSummaryWebServicesActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(createSummaryWebServicesActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    createSummaryWebServicesActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )
  .handleAction(
    createSummaryWebServicesActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errors: payload,
    }),
  )

  .handleAction(updateSummaryWebServicesActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    updateSummaryWebServicesActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )
  .handleAction(
    updateSummaryWebServicesActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errors: payload,
    }),
  )

  .handleAction(
    deleteSummaryWebServicesActions.request,
    (state, { payload }) => ({
      ...state,
      loading: true,
    }),
  )
  .handleAction(
    deleteSummaryWebServicesActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )
  .handleAction(
    deleteSummaryWebServicesActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errors: payload,
    }),
  )

  .handleAction(clearAttachmentAndRemarksReducer, () => ({
    ...INITIAL_STATE,
  }))

  .handleAction(clearSummaryObjectsReducer, (state) => ({
    ...state,
    summary: null,
  }));

export default VesselSummaryReducer;
