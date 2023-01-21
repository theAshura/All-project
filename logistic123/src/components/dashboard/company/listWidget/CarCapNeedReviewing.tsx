import Modal, { ModalType } from 'components/ui/modal/Modal';
import cx from 'classnames';
import TableAntd from 'components/common/table-antd/TableAntd';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { DEFAULT_COL_DEF_TYPE_FLEX } from 'constants/components/ag-grid.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-dashboard.const';
import DetectEsc from 'components/common/modal/DetectEsc';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyCarCapNeedReviewingActions } from 'store/dashboard/dashboard.action';
import { openNewPage } from 'helpers/utils.helper';
import { AppRouteConst } from 'constants/route.const';
import { columnCarCapNeedReviewing } from 'constants/widget.const';
import styles from './style/car-cap-need-reviewing.module.scss';

const CarCapNeedReviewing = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const [isMultiColumnFilter, setIsMultiColumnFilter] =
    useState<boolean>(false);
  const { companyCarCapNeedReviewing } = useSelector(
    (globalState) => globalState.dashboard,
  );
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionDashboard,
    modulePage: ModulePage.List,
  });

  const handleGetList = useCallback(() => {
    dispatch(
      getCompanyCarCapNeedReviewingActions.request({
        pageSize: -1,
      }),
    );
  }, [dispatch]);

  const data = useMemo(
    () =>
      companyCarCapNeedReviewing?.data?.map((item) => ({
        ...item,
        id: item?.id || undefined,
      })) || [],
    [companyCarCapNeedReviewing?.data],
  );

  const handleViewMore = useCallback(() => {
    setModal(true);
  }, []);

  const handleClickOnHighLight = useCallback((data) => {
    if (data?.id) {
      openNewPage(AppRouteConst.getInspectionFollowUpById(data?.id));
    }
  }, []);

  const minimalData = useCallback((list) => {
    if (list.length > 4) {
      return [0, 1, 2, 3].map((number) => list[number]);
    }

    return list;
  }, []);

  const columns = useMemo(
    () => [
      {
        field: 'refId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: ({ data }) => (
          <div
            className="cell-high-light"
            onClick={() => handleClickOnHighLight(data)}
          >
            {data?.refId}
          </div>
        ),
      },
      {
        field: 'cap',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS.CAP,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'estimatedClosureDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Estimated closure date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'numberOfFindings',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Number of findings'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, handleClickOnHighLight, isMultiColumnFilter],
  );

  const renderModal = useMemo(() => {
    if (!modal) {
      return null;
    }
    return (
      <Modal
        isOpen={modal}
        content={
          <AGGridModule
            loading={false}
            params={null}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            hasRangePicker={false}
            columnDefs={columns}
            dataFilter={null}
            moduleTemplate="s"
            fileName={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['CAR/CAP needs reviewing'],
            )}
            dataTable={data}
            height="400px"
            colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
            getList={handleGetList}
            pageSizeDefault={10}
          />
        }
        toggle={() => setModal(false)}
        title={
          <span className={styles.fontWeight600}>
            {renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS['CAR/CAP needs reviewing'],
            )}
          </span>
        }
        modalType={ModalType.LARGE}
        bodyClassName={styles.height450}
      />
    );
  }, [columns, data, dynamicLabels, handleGetList, modal]);

  useEffect(() => {
    handleGetList();
  }, [handleGetList]);

  return (
    <div className={cx(styles.TOAAndIA)}>
      <div className={cx(styles.title, 'mt-2')}>
        {renderDynamicLabel(
          dynamicLabels,
          INSPECTION_DASHBOARD_DYNAMIC_FIELDS['CAR/CAP needs reviewing'],
        )}
      </div>

      <div className="mt-3">
        <TableAntd
          columns={columnCarCapNeedReviewing?.map((item) => ({
            ...item,
            title: renderDynamicLabel(
              dynamicLabels,
              INSPECTION_DASHBOARD_DYNAMIC_FIELDS[item.title],
            ),
          }))}
          dynamicLabels={dynamicLabels}
          dataSource={minimalData(data)}
          handleClick={handleClickOnHighLight}
          isViewMore={data.length > 4}
          onViewMore={handleViewMore}
        />
      </div>
      {renderModal}
      <DetectEsc close={() => setModal(false)} />
    </div>
  );
};

export default memo(CarCapNeedReviewing);
