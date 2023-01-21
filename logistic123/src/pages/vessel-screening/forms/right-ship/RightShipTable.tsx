import { getListRightShipActionsApi } from 'api/right-ship.api';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';

import {
  formatDateLocalNoTime,
  formatDateLocalWithTime,
} from 'helpers/date.helper';

import {
  RightShipResponse,
  Filters,
} from 'models/store/right-ship/right-ship.model';
import NoDataImg from 'components/common/no-data/NoData';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { FORMAT_DATE_TIME_SECOND } from 'constants/common.const';
import styles from './right-ship.module.scss';
import {
  ROW_DOC_SAFE_SCORE,
  ROW_GHG_RATING,
  ROW_LAST_DATE,
  ROW_RIGHT_SHIP,
  ROW_SAFE_SCORE,
} from './right-ship.const';

interface RightShipProps {
  isFilter?: boolean;
  // reload: boolean;
  filter: any;
  title: string;
}

const RightShipTable: FC<RightShipProps> = (props) => {
  const { title, filter, isFilter = false } = props;
  // const [scoreData, setScoreData] = useState([]);
  const [rightShipResponse, setRightShipResponse] =
    useState<RightShipResponse>();
  const [loading, setLoading] = useState(false);
  const { vesselDetail } = useSelector((state) => state.vessel);

  const getListDataFilter = useCallback(
    async (pageNumber: number) => {
      try {
        setLoading(true);
        const updatedFilter = filter === 'rightShip' ? undefined : filter;
        const dataRes = await getListRightShipActionsApi({
          vesselId: vesselDetail?.id,
          filterFor: updatedFilter,
          pageSize: isFilter ? 3 : 10,
          page: pageNumber,
        });

        setLoading(false);
        setRightShipResponse(dataRes?.data);
      } catch (error) {
        setLoading(false);
      }
    },
    [filter, isFilter, vesselDetail?.id],
  );

  const getListData = useCallback(
    async (pageNumber: number) => {
      try {
        setLoading(true);
        const dataRes = await getListRightShipActionsApi({
          vesselId: vesselDetail?.id,
          pageSize: isFilter ? 3 : 10,
          page: pageNumber,
        });

        setLoading(false);
        setRightShipResponse(dataRes?.data);
      } catch (error) {
        setLoading(false);
      }
    },
    [isFilter, vesselDetail?.id],
  );

  useEffect(
    () => {
      if (isFilter && vesselDetail?.id) {
        getListDataFilter(1);
      }
      if (!isFilter && vesselDetail?.id) {
        getListData(1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vesselDetail?.id, isFilter],
  );

  const onChangePageFilter = useCallback(
    (pageNumber: number) => {
      getListDataFilter(pageNumber);
    },
    [getListDataFilter],
  );

  const onChangePage = useCallback(
    (pageNumber: number) => {
      getListData(pageNumber);
    },
    [getListData],
  );

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    // reload &&
    getListDataFilter(1);
  }, [getListDataFilter]);

  const convertGhgRating = useCallback((data: string) => {
    if (data === 'U') return 'Unknown';
    return data;
  }, []);

  const convertDataNA = useCallback((data: string) => {
    const sub = '/5';
    if (data === 'None' || !data) return 'N/A';
    const result = data.concat(sub);
    return result;
  }, []);
  const convertNAUpperCase = useCallback((data: string) => {
    if (data === 'None' || !data) return 'N/A';
    return data.toUpperCase();
  }, []);
  const convertNANormal = useCallback((data: string) => {
    if (data === 'None' || !data) return 'N/A';
    return data;
  }, []);

  const sanitizeData = useCallback(
    (scoreData) => {
      let finalData;
      if (filter === Filters.ghgRating) {
        finalData = {
          updateValue: convertGhgRating(scoreData?.[filter]) || 'N/A',
          ratingDate:
            formatDateLocalWithTime(
              scoreData?.ghgRatingDate,
              FORMAT_DATE_TIME_SECOND,
            ) || 'N/A',
        };
      }
      if (filter === Filters.lastInspectionValidity) {
        finalData = {
          updateValue: formatDateLocalWithTime(scoreData?.[filter]) || 'N/A',
        };
      }
      if (filter === Filters.safetyScore) {
        finalData = {
          updateValue: convertDataNA(scoreData?.[filter]) || 'N/A',
          scoreDate:
            formatDateLocalWithTime(
              scoreData?.safetyScoreDate,
              FORMAT_DATE_TIME_SECOND,
            ) || 'N/A',
        };
      }
      if (filter === Filters.docSafetyScore) {
        finalData = {
          updateValue: convertDataNA(scoreData?.[filter]) || 'N/A',
          docCompanyName: convertNANormal(scoreData?.docHolderName),
        };
      }
      if (filter === 'rightShip') {
        finalData = {
          imo: vesselDetail?.imoNumber || 'N/A',
          dateOfBuild: formatDateLocalNoTime(scoreData?.buildDate) || 'N/A',
          docCompanyName: convertNANormal(scoreData?.docHolderName),
          docCompanyOwCode: convertNANormal(scoreData?.docHolderCode),
          ghgRating: convertGhgRating(scoreData?.ghgRating) || 'N/A',
          ghgRatingDate:
            formatDateLocalWithTime(
              scoreData?.ghgRatingDate,
              FORMAT_DATE_TIME_SECOND,
            ) || 'N/A',
          ghgEvdi: convertNANormal(scoreData?.evdi),
          ghgVerified: convertNAUpperCase(scoreData?.verified?.toString()),
          ghgPlus: convertNAUpperCase(scoreData?.plus),
          safetyScore: convertDataNA(scoreData?.safetyScore),
          safetyScoreDate:
            formatDateLocalWithTime(
              scoreData?.safetyScoreDate,
              FORMAT_DATE_TIME_SECOND,
            ) || 'N/A',
          docSafetyScore: convertDataNA(scoreData?.docSafetyScore),
          docSafetyScoreIndicative: convertNAUpperCase(
            scoreData?.indicativeScore?.toString(),
          ),
          inspectionRequired: convertNAUpperCase(scoreData?.inspectionRequired),
          lastInspectionOC: convertNAUpperCase(scoreData?.latInspectionOutcome),
          lastInspectionVal:
            formatDateLocalWithTime(
              scoreData?.lastInspectionValidity || 'N/A',
              FORMAT_DATE_TIME_SECOND,
            ) || 'N/A',
          technicalManagerName: convertNANormal(
            scoreData?.technicalManagerName,
          ),
          technicalManagerCode: convertNANormal(
            scoreData?.technicalManagerOwCode,
          ),
        };
      }
      return finalData;
    },
    [
      convertDataNA,
      convertGhgRating,
      convertNANormal,
      convertNAUpperCase,
      filter,
      vesselDetail?.imoNumber,
    ],
  );
  const rowLabels = useMemo(() => {
    switch (filter) {
      case Filters.safetyScore: {
        return ROW_SAFE_SCORE;
      }

      case Filters.docSafetyScore: {
        return ROW_DOC_SAFE_SCORE;
      }

      case Filters.ghgRating: {
        return ROW_GHG_RATING;
      }

      case Filters.lastInspectionValidity: {
        return ROW_LAST_DATE;
      }
      case Filters.rightShip: {
        return ROW_RIGHT_SHIP;
      }

      default:
        return ROW_LAST_DATE;
    }
  }, [filter]);

  const renderRow = useCallback(
    // eslint-disable-next-line consistent-return
    (isScrollable?: boolean) => {
      if (rightShipResponse?.data?.length > 0) {
        return (
          <tbody>
            {rightShipResponse?.data?.map((item, index) => {
              const finalData = sanitizeData(item);
              return (
                <RowComponent
                  key={item?.id}
                  isScrollable={isScrollable}
                  data={finalData}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [rightShipResponse?.data, sanitizeData],
  );

  return (
    <div
      className={cx(styles.containerForm)}
      style={{ height: isFilter ? 250 : 420 }}
    >
      <div className={cx(styles.titleForm)}>{title}</div>
      {!loading &&
      (rightShipResponse?.data?.length === 0 || !rightShipResponse?.data) ? (
        <div>
          <NoDataImg />
        </div>
      ) : (
        <TableCp
          rowLabels={rowLabels}
          isEmpty={false}
          renderRow={renderRow}
          page={rightShipResponse?.page}
          pageSize={isFilter ? 3 : 10}
          totalItem={rightShipResponse?.totalItem}
          totalPage={rightShipResponse?.totalPage}
          handleChangePage={isFilter ? onChangePage : onChangePageFilter}
          optionPageSizes={isFilter ? ['3'] : ['10']}
          classNameNodataWrapper={styles.dataWrapperEmpty}
          loading={loading}
          disableLoadingDefaultContainer
        />
      )}
    </div>
  );
};

export default RightShipTable;
