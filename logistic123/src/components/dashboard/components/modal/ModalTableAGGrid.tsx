import cx from 'classnames';
import { FC, ReactElement, useCallback, Dispatch, SetStateAction } from 'react';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import { useDispatch } from 'react-redux';
import { DEFAULT_COL_DEF_TYPE_FLEX } from 'constants/components/ag-grid.const';
import Button, { ButtonSize } from 'components/ui/button/Button';
import images from 'assets/images/images';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './modal.module.scss';

export interface ModalTableProps {
  isOpen: boolean;
  title: string | ReactElement;
  dataSource: any[];
  columns: any[];
  handleClick?: (
    data,
    key?: string,
    keyInArray?: string,
    rowIndex?: number,
  ) => void;
  toggle?: () => void;
  w?: string | number;
  h?: string | number;
  onSort?: (value: string) => void;
  sort?: string;
  scroll?: { x?: string | number | true; y?: string | number };
  total?: number | string;
  titleClasseName?: string;
  moduleTemplate?: string;
  setIsMultiColumnFilter?: Dispatch<SetStateAction<boolean>>;
  fileName?: string;
  aggridId?: string;
  modalType?: typeof ModalType[keyof typeof ModalType];
  className?: string;
  hasAddButton?: boolean;
  setOpenRemarkModalAdd?: (value: boolean) => void;
  setOpenRemarkModalList?: (value: boolean) => void;
  dynamicLabels?: IDynamicLabel;
  handleOpenAddRemarkModal?: () => void;
}

const ModalTableAGGrid: FC<ModalTableProps> = ({
  isOpen,
  toggle,
  title,
  dataSource,
  handleClick,
  columns,
  w,
  h,
  onSort,
  scroll,
  sort,
  total,
  titleClasseName,
  moduleTemplate,
  setIsMultiColumnFilter,
  fileName,
  aggridId,
  modalType,
  className,
  hasAddButton,
  handleOpenAddRemarkModal,
  dynamicLabels,
}) => {
  const dispatch = useDispatch();

  const renderTitle = useCallback(
    () => (
      <div className={styles.titleModalContainer}>
        <div>{title}</div>
        <div className={styles.modalTotal}>{`${renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS.Total,
        )}: ${total}`}</div>
      </div>
    ),
    [dynamicLabels, title, total],
  );
  const handleGetList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: moduleTemplate,
      }),
    );
  }, [dispatch, moduleTemplate]);
  return (
    <Modal
      isOpen={isOpen}
      title={total ? renderTitle() : title}
      titleClasseName={titleClasseName}
      toggle={toggle}
      w={w || 800}
      h={h}
      content={
        <div className={cx(styles.contentWrapper)}>
          {hasAddButton && (
            <div className="d-flex justify-content-end align-items-center mb-2">
              <Button
                onClick={() => {
                  handleOpenAddRemarkModal();
                }}
                buttonSize={ButtonSize.Medium}
                className="button_create"
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  MAIN_DASHBOARD_DYNAMIC_FIELDS['Create New'],
                )}
              </Button>
            </div>
          )}
          <div className={cx(styles.table, styles.bodyContent)}>
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
      modalType={modalType}
      className={className}
    />
  );
};

export default ModalTableAGGrid;
