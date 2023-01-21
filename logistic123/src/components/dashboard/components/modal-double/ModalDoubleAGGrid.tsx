import cx from 'classnames';
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { ColumnTableType } from 'components/common/table-antd/TableAntd';
// import SelectUI, { OptionProp } from 'components/ui/select/Select';
// import Button, { ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import { Row, Col } from 'reactstrap';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { useDispatch } from 'react-redux';
import { DEFAULT_COL_DEF_TYPE_FLEX } from 'constants/components/ag-grid.const';

import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './modal.module.scss';

export interface DataDetailModal {
  vesselCode: string;
  vesselName: string;
  labelTotal: string;
  auditCompanyName?: string;
}
export interface ModalTableProps {
  isOpen: boolean;
  title: string;
  dataDetailModal: DataDetailModal;
  subTitle?: string;
  dataSource: any[];
  columns: ColumnTableType[];
  handleClick?: (data) => void;
  toggle?: () => void;
  handleBack?: () => void;
  w?: string | number;
  isDetail?: boolean;
  titleClassName?: string;
  moduleTemplate?: string;
  setIsMultiColumnFilter?: Dispatch<SetStateAction<boolean>>;
  fileName?: string;
  aggridId?: string;
  modalType?: typeof ModalType[keyof typeof ModalType];
  hasVesselName?: boolean;
  companyNameTitle?: string;
  vesselNameTitle?: string;
  dynamicLabels?: IDynamicLabel;
}

const ModalDoubleAGGrid: FC<ModalTableProps> = ({
  isOpen,
  toggle,
  title,
  subTitle,
  dataSource,
  handleClick,
  handleBack,
  columns,
  w,
  isDetail,
  dataDetailModal,
  titleClassName = '',
  setIsMultiColumnFilter,
  moduleTemplate,
  fileName,
  aggridId,
  modalType,
  hasVesselName,
  vesselNameTitle,
  companyNameTitle,
  dynamicLabels,
}) => {
  const dispatch = useDispatch();
  const handleGetList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: moduleTemplate,
      }),
    );
  }, [dispatch, moduleTemplate]);

  const renderVesselName = useMemo(() => {
    if (vesselNameTitle) {
      return vesselNameTitle;
    }

    return 'Vessel name';
  }, [vesselNameTitle]);

  const renderCompanyName = useMemo(() => {
    if (companyNameTitle) {
      return companyNameTitle;
    }

    return 'Company name';
  }, [companyNameTitle]);

  return (
    <Modal
      isOpen={isOpen}
      title={<span className={titleClassName}>{title}</span>}
      toggle={toggle}
      bodyClassName={cx(styles.bodyModal)}
      w={w || 800}
      headerDouble={
        isDetail && (
          <div className={styles.titleWrapper}>
            <div className={styles.icBack} onClick={handleBack}>
              <img src={images.icons.icArrowChevronBack} alt="ic-back-modal" />
            </div>
            <div className={cx(styles.titleModalDetail, titleClassName)}>
              {title}
            </div>
          </div>
        )
      }
      content={
        <div className={cx(styles.contentWrapper)}>
          {isDetail ? (
            <>
              <Row className="mb-2">
                {!hasVesselName && (
                  <Col sm={3} lg={3}>
                    <span className="fw-bold">Vessel code</span>
                  </Col>
                )}
                <Col sm={5} lg={5}>
                  <span className="fw-bold">
                    {dataDetailModal?.vesselName
                      ? renderVesselName
                      : renderCompanyName}
                  </span>
                </Col>
                <Col sm={4} lg={4}>
                  <span className="fw-bold">{dataDetailModal?.labelTotal}</span>
                </Col>
              </Row>
              <Row className="mb-3">
                {!hasVesselName && (
                  <Col sm={3} lg={3}>
                    {dataDetailModal?.vesselCode}
                  </Col>
                )}
                <Col sm={5} lg={5}>
                  {dataDetailModal?.vesselName ||
                    dataDetailModal?.auditCompanyName}
                </Col>
                <Col sm={4} lg={4}>
                  {dataSource?.length}
                </Col>
              </Row>
            </>
          ) : (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-bold">{subTitle}</div>
              <div className="d-flex justify-content-end" />
            </div>
          )}

          <div className={cx(styles.table, styles.tableContainer)}>
            <AGGridModule
              loading={false}
              params={null}
              setIsMultiColumnFilter={setIsMultiColumnFilter}
              hasRangePicker={false}
              columnDefs={columns}
              dataFilter={null}
              moduleTemplate={moduleTemplate}
              fileName={fileName}
              dataTable={dataSource}
              height="400px"
              colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
              getList={handleGetList}
              classNameHeader={styles.header}
              aggridId={aggridId}
              dynamicLabels={dynamicLabels}
            />
          </div>
        </div>
      }
      modalType={ModalType.LARGE}
    />
  );
};

export default ModalDoubleAGGrid;
