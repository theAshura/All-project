import cx from 'classnames';
import { useCallback, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import styles from '../../tabs/common.module.scss';
import {
  IOnChangeParams,
  REVIEW_STATUSES,
} from '../../components/object-review/object-review';
import {
  getSummaryByTabActions,
  getVesselSummaryActions,
  updateVesselSummaryActions,
} from '../../store/vessel-summary.action';
import {
  RISK_FIELD,
  RISK_LEVEL_TO_SCORE,
  RISK_LEVEL_TO_VALUE,
} from '../constant';

interface DefaultValues {
  [table: string]: {
    isExpanded: boolean;
  };
}

const useVesselObjectReview = (defaultValues: DefaultValues) => {
  const dispatch = useDispatch();
  const { vesselScreeningDetail } = useSelector(
    (store) => store.vesselScreening,
  );
  const { summary } = useSelector((store) => store.vesselSummary, shallowEqual);
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const [state, setState] = useState(defaultValues);

  const onChange = useCallback(
    ({ tab, table, field, value }: IOnChangeParams) => {
      const params: any = {};

      switch (field) {
        case RISK_FIELD.POTENTIAL_RISK:
          params.potentialRisk = RISK_LEVEL_TO_VALUE[value];
          params.potentialScore = RISK_LEVEL_TO_SCORE[value];
          break;

        case RISK_FIELD.OBSERVED_RISK:
          params.observedRisk = RISK_LEVEL_TO_VALUE[value];
          params.observedScore = RISK_LEVEL_TO_SCORE[value];
          break;

        case RISK_FIELD.TIMELOSS:
          params.timeLoss = !!value;
          break;

        case RISK_FIELD.STATUS:
          params.status = value;
          break;

        default:
          break;
      }

      dispatch(
        updateVesselSummaryActions.request({
          vesselId: vesselScreeningDetail?.id,
          reference: table,
          tabName: tab,
          ...params,
          handleSuccess: () => {
            dispatch(
              getVesselSummaryActions.request({
                vesselId: vesselScreeningDetail?.id,
                reference: table,
              }),
            );
            dispatch(
              getSummaryByTabActions.request({
                vesselScreeningId: vesselScreeningDetail?.id,
                tabName: tab,
              }),
            );
          },
        }),
      );
    },
    [dispatch, vesselScreeningDetail?.id],
  );

  const renderBadge = useCallback(
    (table: string) => (
      <div
        className={cx(styles.reviewStatusBadge, {
          [styles.open]: summary?.[table]?.status === REVIEW_STATUSES.OPEN,
          [styles.completed]:
            summary?.[table]?.status === REVIEW_STATUSES.COMPLETED,
          [styles.inprogress]:
            summary?.[table]?.status === REVIEW_STATUSES.INPROGRESS,
          [styles.pendingInfo]:
            summary?.[table]?.status === REVIEW_STATUSES.PENDING_INFO,
          [styles.disapproved]:
            summary?.[table]?.status === REVIEW_STATUSES.DISAPPROVED,
        })}
      >
        {t(summary?.[table]?.status)}
      </div>
    ),
    [summary, t],
  );

  const toggle = useCallback(
    (table: string) => () =>
      setState((prev) => ({
        ...prev,
        [table]: {
          isExpanded: !prev[table]?.isExpanded,
        },
      })),
    [],
  );

  const getLists = useCallback(() => {
    if (vesselScreeningDetail?.id) {
      Object.keys(defaultValues).forEach((table) => {
        dispatch(
          getVesselSummaryActions.request({
            vesselId: vesselScreeningDetail?.id,
            reference: table,
          }),
        );
      });
    }
  }, [defaultValues, dispatch, vesselScreeningDetail?.id]);

  const getListByTable = useCallback(
    (table: string, tabName: string) => () => {
      if (vesselScreeningDetail?.id) {
        dispatch(
          getVesselSummaryActions.request({
            vesselId: vesselScreeningDetail?.id,
            reference: table,
          }),
        );
        dispatch(
          getSummaryByTabActions.request({
            vesselScreeningId: vesselScreeningDetail?.id,
            tabName,
          }),
        );
      }
    },
    [dispatch, vesselScreeningDetail?.id],
  );

  return {
    expandState: state,
    getLists,
    toggle,
    renderBadge,
    onChange,
    getListByTable,
  };
};

export default useVesselObjectReview;
