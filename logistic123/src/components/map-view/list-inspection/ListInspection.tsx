import {
  FC,
  memo,
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import Button from 'components/ui/button/Button';
import { formatDateNoTime } from 'helpers/date.helper';
import { LoadingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
// import cx from 'classnames';
import Tooltip from 'antd/lib/tooltip';
import 'swiper/swiper.scss';
// import PREFIX_API from 'constants/api.const';
import images from 'assets/images/images';
import { SwiperOptions } from 'swiper';
import NoDataImg from 'components/common/no-data/NoData';
import cx from 'classnames';
import Swiper from 'react-id-swiper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAP_VIEW_DYNAMIC_FIELDS } from 'constants/dynamic/map-view.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import classes from './list-inspection.module.scss';
import { MAP_VIEW_TABS } from '../filter-map-view/filter.const';

interface Props {
  isOpen?: boolean;
  handleSelectItem?: (item?: any) => void;
  inspectionSelected?: any;
  activeTab?: string;
  dynamicLabels?: IDynamicLabel;
}

const slideOptions: SwiperOptions = {
  slidesPerView: 1.2,
  spaceBetween: 8,
  passiveListeners: true,
  breakpoints: {
    576: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 6,
      spaceBetween: 16,
    },
    1450: {
      slidesPerView: 7,
      spaceBetween: 16,
    },
  },
};

const ListInspection: FC<Props> = ({
  isOpen,
  handleSelectItem,
  inspectionSelected,
  activeTab,
  dynamicLabels,
}) => {
  const swiperRef = useRef<any>(null);
  const [btnPrevShow, setBtnPrevVisible] = useState<boolean>(false);
  const [btnNextShow, setBtnNextVisible] = useState<boolean>(true);
  const { listInspection, listInspector, loading } = useSelector(
    (state) => state.mapView,
  );

  const [itemsShow, setItemsShow] = useState<number>(20);
  const [listDataRender, setListDataRender] = useState<any>([]);
  const [existRef, setExistRef] = useState<boolean>(false);

  const onChangeData = useCallback(
    (size) => {
      if (activeTab === MAP_VIEW_TABS.INSPECTION) {
        setItemsShow(size || 20);
        setListDataRender(
          listInspection?.data?.length
            ? listInspection?.data?.slice(0, size || 20)
            : [],
        );
      } else {
        setItemsShow(size || 20);
        setListDataRender(
          listInspector?.selectedInspectorsInfo?.length
            ? listInspector?.selectedInspectorsInfo?.slice(0, size || 20)
            : [],
        );
      }
    },
    [activeTab, listInspection?.data, listInspector?.selectedInspectorsInfo],
  );

  const toggleBtnWhenSlideChange = useCallback(() => {
    setBtnPrevVisible(!swiperRef?.current?.swiper?.isBeginning);
    if (swiperRef?.current?.swiper?.isEnd) {
      onChangeData(itemsShow + 20);
      if (itemsShow >= listInspection?.totalItem) {
        setBtnNextVisible(!swiperRef?.current?.swiper?.isEnd);
      }
    }
  }, [itemsShow, listInspection?.totalItem, onChangeData]);

  const runListen = useCallback(() => {
    const swiperInstance = swiperRef?.current?.swiper;
    swiperInstance?.on?.('reachEnd', toggleBtnWhenSlideChange);
    swiperInstance?.on?.('slideChange', toggleBtnWhenSlideChange);
    swiperInstance?.on?.('reachBeginning', toggleBtnWhenSlideChange);
  }, [toggleBtnWhenSlideChange]);

  useEffect(() => {
    onChangeData(20);
  }, [activeTab, onChangeData]);

  useEffect(() => {
    const swiperInstance = swiperRef?.current?.swiper;

    if (swiperInstance) {
      // use 3 event because just slide change not working right sometime
      setExistRef(true);
      runListen();
    }

    return () => {
      if (swiperInstance) {
        swiperInstance?.off?.('reachEnd');
        swiperInstance?.off?.('slideChange');
        swiperInstance?.off?.('reachBeginning');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swiperRef?.current?.swiper]);

  const goNext = useCallback(() => {
    if (!existRef) {
      setExistRef(true);
      runListen();
    }
    swiperRef?.current?.swiper?.slideNext();
  }, [existRef, runListen]);

  const goPrev = useCallback(() => {
    if (!existRef) {
      setExistRef(true);
      runListen();
    }
    swiperRef?.current?.swiper?.slidePrev();
  }, [existRef, runListen]);

  const renderBtnPrev = useMemo(
    () =>
      btnPrevShow && (
        <Button onClick={goPrev} className={classes.prevIcon}>
          <img src={images.icons.icChevronLeft} alt="Prev Icon" />
        </Button>
      ),
    [btnPrevShow, goPrev],
  );

  const renderBtnNext = useMemo(
    () =>
      btnNextShow && (
        <Button
          onClick={goNext}
          className={cx(classes.nextIcon, { [classes.collapseList]: isOpen })}
        >
          <img src={images.icons.icChevronRight} alt="Next Icon" />
        </Button>
      ),
    [btnNextShow, goNext, isOpen],
  );

  const renderSwiper = useMemo(() => {
    if (loading) {
      return (
        <div className="text-center">
          <LoadingOutlined />
        </div>
      );
    }
    if (listDataRender?.length === 0) {
      return (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <NoDataImg />
        </div>
      );
    }

    if (activeTab === MAP_VIEW_TABS.INSPECTION) {
      return (
        <Swiper
          {...slideOptions}
          rebuildOnUpdate
          shouldSwiperUpdate
          ref={swiperRef}
        >
          {listDataRender?.map((item) => (
            <div
              key={item?.id}
              className={cx(classes.inspectionItem, {
                [classes.inspectionItemSelected]:
                  inspectionSelected?.id === item?.id,
              })}
              onClick={() => handleSelectItem(item)}
            >
              <img
                src={
                  item?.logo && item?.logo?.link
                    ? item?.logo?.link
                    : images.common.imageDefault
                }
                onError={({ currentTarget }) => {
                  if (currentTarget && currentTarget?.src) {
                    // eslint-disable-next-line no-param-reassign
                    currentTarget.src = images.common.imageDefault;
                  }
                }}
                alt="inspection-item"
              />
              <div className={classes.info}>
                <div className={cx(classes.name, classes.overFlowText)}>
                  {item?.entityType === 'Office'
                    ? item?.auditCompany?.name
                    : item?.vessel?.name}
                </div>
                <Tooltip
                  placement="topLeft"
                  destroyTooltipOnHide
                  title={
                    item?.auditTypes?.length
                      ? item?.auditTypes?.map((e) => e?.name)?.join(', ')
                      : '-'
                  }
                  // color="#3B9FF3"
                >
                  <div className={cx(classes.company, classes.overFlowText)}>
                    {item?.auditTypes?.length
                      ? item?.auditTypes?.map((e) => e?.name)?.join(', ')
                      : '-'}
                  </div>
                </Tooltip>

                <div className={classes.content}>
                  <div className={classes.overFlowText}>
                    {' '}
                    {renderDynamicLabel(
                      dynamicLabels,
                      MAP_VIEW_DYNAMIC_FIELDS['Inspection no'],
                    )}
                    : {item?.auditNo}
                  </div>
                  <div className={classes.overFlowText}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      MAP_VIEW_DYNAMIC_FIELDS.From,
                    )}
                    : {formatDateNoTime(item?.plannedFromDate)}
                  </div>
                  <div className={classes.overFlowText}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      MAP_VIEW_DYNAMIC_FIELDS.To,
                    )}
                    : {formatDateNoTime(item?.plannedToDate)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Swiper>
      );
    }

    return (
      <Swiper
        {...slideOptions}
        rebuildOnUpdate
        shouldSwiperUpdate
        ref={swiperRef}
      >
        {listDataRender?.map((item) => (
          <div
            key={item?.id}
            className={cx(classes.inspectionItem, {
              [classes.inspectionItemSelected]:
                inspectionSelected?.id === item?.id,
            })}
            onClick={() => handleSelectItem(item)}
          >
            <img
              src={
                item?.avatarUrl?.link
                  ? `${item?.avatarUrl?.link}`
                  : images.common.imageDefault
              }
              onError={({ currentTarget }) => {
                if (currentTarget && currentTarget?.src) {
                  // eslint-disable-next-line no-param-reassign
                  currentTarget.src = images.common.imageDefault;
                }
              }}
              alt="inspection-item"
            />
            <div className={classes.info}>
              <div className={cx(classes.name, classes.overFlowText)}>
                {item?.username}
              </div>
              <div>{item?.company?.name || '-'}</div>
              <Tooltip
                placement="topLeft"
                destroyTooltipOnHide
                title={item?.company?.jobTitle || '-'}
                // color="#3B9FF3"
              >
                <div className={cx(classes.overFlowText)}>
                  {item?.jobTitle || '-'}
                </div>
              </Tooltip>

              <div className={classes.content}>
                <div className={classes.overFlowText}>{item?.phoneNumber}</div>
                <div className={classes.overFlowText}>{item?.email}</div>
              </div>
            </div>
          </div>
        ))}
      </Swiper>
    );
  }, [
    activeTab,
    dynamicLabels,
    handleSelectItem,
    inspectionSelected?.id,
    listDataRender,
    loading,
  ]);

  return (
    <div className={classes.wrap}>
      <div className={classes.wrapSwiper}>
        {renderBtnPrev}
        {renderSwiper}
        {renderBtnNext}
      </div>
    </div>
  );
};

export default memo(ListInspection);
