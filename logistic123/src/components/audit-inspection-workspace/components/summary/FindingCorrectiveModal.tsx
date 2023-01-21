import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import DetectEsc from 'components/common/modal/DetectEsc';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonType } from 'components/ui/button/Button';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { TOOLTIP_COLOR } from 'constants/common.const';
import { FC, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Modal, ModalProps } from 'reactstrap';
import styles from './summary.module.scss';

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  classesName?: string;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  dynamicLabels?: IDynamicLabel;
}

const ModalFindingCorrective: FC<ModalComponentProps> = ({
  isOpen,
  classesName,
  modalClassName,
  contentClassName,
  title,
  onClose,
  content,
  onConfirm,
  dynamicLabels,
  ...other
}) => {
  const { inspectionSummary } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );

  const rowLabels = useMemo(
    () => [
      {
        id: 'auditType',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['Inspection type'],
        ),
        sort: true,
        width: '100',
        maxWidth: '300',
      },
      {
        id: 'totalNoFinding',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
            'Total no of findings'
          ],
        ),
        sort: true,
        width: '120',
        maxWidth: '120',
      },
      {
        id: 'totalNoOfCar',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['Total no of CAR'],
        ),
        width: '170',
        maxWidth: '170',
        sort: true,
      },
      {
        id: 'totalNoOfOpenCar',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
            'Total no of open CAR'
          ],
        ),
        sort: true,
        width: '170',
        maxWidth: '170',
      },
      {
        id: 'totalNoOfClosedCar',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
            'Total no of closed CAR'
          ],
        ),
        sort: true,
        width: '170',
        maxWidth: '170',
      },
      {
        id: 'totalNoOfCap',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['Total no of CAP'],
        ),
        sort: true,
        width: '170',
        maxWidth: '170',
      },
      {
        id: 'totalNoOfAcceptedCap',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
            'Total no of accepted CAP'
          ],
        ),
        sort: true,
        width: '170',
        maxWidth: '170',
      },
      {
        id: 'totalNoOfDeniedCap',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
            'Total no of denied CAP'
          ],
        ),
        sort: true,
        width: '170',
        maxWidth: '170',
      },
    ],
    [dynamicLabels],
  );
  const sanitizeData = useCallback(() => {
    const auditTypes =
      inspectionSummary?.reportOfFinding?.auditTypes?.length > 0
        ? inspectionSummary?.reportOfFinding?.auditTypes
            ?.map((item) => item)
            ?.join(', ')
        : '';
    const finalData = {
      auditType: (
        <Tooltip placement="topLeft" title={auditTypes} color={TOOLTIP_COLOR}>
          <span className="limit-line-text">{auditTypes}</span>
        </Tooltip>
      ),
      totalNoFinding:
        inspectionSummary?.reportOfFinding?.totalNoOfFindings || 0,
      totalNoOfCar: inspectionSummary?.reportOfFinding?.totalCar || 0,
      totalNoOfOpenCar: inspectionSummary?.reportOfFinding?.totalOpenCar || 0,
      totalNoOfClosedCar:
        inspectionSummary?.reportOfFinding?.totalCloseCar || 0,
      totalNoOfCap: inspectionSummary?.reportOfFinding?.totalCap || 0,
      totalNoOfAcceptedCap:
        inspectionSummary?.reportOfFinding?.totalAcceptCar || 0,
      totalNoOfDeniedCap:
        inspectionSummary?.reportOfFinding?.totalDeniedCar || 0,
    };
    return finalData;
  }, [
    inspectionSummary?.reportOfFinding?.auditTypes,
    inspectionSummary?.reportOfFinding?.totalAcceptCar,
    inspectionSummary?.reportOfFinding?.totalCap,
    inspectionSummary?.reportOfFinding?.totalCar,
    inspectionSummary?.reportOfFinding?.totalCloseCar,
    inspectionSummary?.reportOfFinding?.totalDeniedCar,
    inspectionSummary?.reportOfFinding?.totalNoOfFindings,
    inspectionSummary?.reportOfFinding?.totalOpenCar,
  ]);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      const finalData = sanitizeData();
      return (
        <tbody>
          <RowComponent
            isScrollable={isScrollable}
            data={finalData}
            onClickRow={undefined}
            rowLabels={rowLabels}
          />
        </tbody>
      );
    },
    [rowLabels, sanitizeData],
  );
  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div className={styles.header}>
        <DetectEsc close={onClose} />
        <div>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
              'Findings/Corrective action request summary'
            ],
          )}{' '}
        </div>
        <div className={styles.closeBtn} onClick={onClose}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary[
              'Findings/Corrective action request summary'
            ],
          )}
        </div>
        <TableCp
          isHiddenAction
          loading={false}
          rowLabels={rowLabels}
          isEmpty={false}
          renderRow={renderRow}
        />
      </div>
      <div className={styles.footer}>
        <Button buttonType={ButtonType.CancelOutline} onClick={onClose}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Close,
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalFindingCorrective;
