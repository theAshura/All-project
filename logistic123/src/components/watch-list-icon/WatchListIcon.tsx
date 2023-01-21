import { Tooltip } from 'antd/lib';
import images from 'assets/images/images';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { WATCH_LIST_DYNAMIC_LABELS } from 'constants/dynamic/watch-list.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkWatchListActions,
  createWatchListActions,
  unWatchListActions,
} from 'store/watch-list/watch-list.actions';
import styles from './watch-list-icon.module.scss';

interface WatchListIconProps {
  referenceId: string;
  referenceModuleName: string;
  referenceRefId?: string;
  dynamicLabels: IDynamicLabel;
}

const WatchListManagement: FC<WatchListIconProps> = ({
  referenceId,
  referenceModuleName,
  referenceRefId,
  dynamicLabels,
}) => {
  const ICWatchingEye = images.icons.IWatchingEye;
  const ICUnWatchedEye = images.icons.IUnWatchedEye;

  const dispatch = useDispatch();
  const { isWatchingList } = useSelector((state) => state.watchList);

  useEffect(() => {
    if (referenceRefId && referenceModuleName) {
      dispatch(
        checkWatchListActions.request({
          referenceId,
          referenceModuleName,
        }),
      );
    }
  }, [dispatch, referenceId, referenceModuleName, referenceRefId]);

  const handleClickWatchList = useCallback(() => {
    if (isWatchingList === false) {
      dispatch(
        createWatchListActions.request({
          referenceId,
          referenceModuleName,
          referenceRefId,
        }),
      );
    } else if (isWatchingList === true) {
      dispatch(
        unWatchListActions.request({
          referenceId,
          referenceModuleName,
        }),
      );
    }
    dispatch(
      checkWatchListActions.request({
        referenceId,
        referenceModuleName,
      }),
    );
  }, [
    dispatch,
    isWatchingList,
    referenceId,
    referenceModuleName,
    referenceRefId,
  ]);

  const handleConfirm = useCallback(() => {
    showConfirmBase({
      isDelete: false,
      txTitle: !isWatchingList
        ? renderDynamicLabel(
            dynamicLabels,
            WATCH_LIST_DYNAMIC_LABELS['Start to watch'],
          )
        : renderDynamicLabel(
            dynamicLabels,
            WATCH_LIST_DYNAMIC_LABELS['Stop to watch'],
          ),
      txMsg: !isWatchingList
        ? renderDynamicLabel(
            dynamicLabels,
            WATCH_LIST_DYNAMIC_LABELS[
              'Are you sure you want to add this record from My Watchlist ?'
            ],
          )
        : renderDynamicLabel(
            dynamicLabels,
            WATCH_LIST_DYNAMIC_LABELS[
              'Are you sure you want to remove this record from My Watchlist ?'
            ],
          ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Confirm,
      ),
      onPressButtonRight: () => handleClickWatchList(),
    });
  }, [dynamicLabels, handleClickWatchList, isWatchingList]);

  return (
    <div className={styles.watchListIcon} onClick={handleConfirm}>
      <Tooltip
        placement="topLeft"
        title={
          !isWatchingList
            ? renderDynamicLabel(
                dynamicLabels,
                WATCH_LIST_DYNAMIC_LABELS['Start to watch'],
              )
            : renderDynamicLabel(
                dynamicLabels,
                WATCH_LIST_DYNAMIC_LABELS['Stop to watch'],
              )
        }
        overlayStyle={{ maxWidth: '245px', fontSize: '11px' }}
      >
        <Button className={styles.eyeContainer} buttonSize={ButtonSize.XSmall}>
          {!isWatchingList ? <ICWatchingEye /> : <ICUnWatchedEye />}
        </Button>
      </Tooltip>
    </div>
  );
};

export default WatchListManagement;
