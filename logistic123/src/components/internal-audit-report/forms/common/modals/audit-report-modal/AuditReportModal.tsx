import {
  forwardRef,
  useState,
  useImperativeHandle,
  createRef,
  Fragment,
} from 'react';

import { InternalAuditComment } from 'contexts/internal-audit-report/IARFormContext';
// import { RowComponent } from 'components/common/table/row/rowCp';
// import cx from 'classnames';
import TableCp from 'components/common/table/TableCp';
// import images from 'assets/images/images';
import Input from 'components/ui/input/Input';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { CommonQuery } from 'constants/common.const';
import { useLocation } from 'react-router-dom';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import styles from 'components/internal-audit-report/forms/form.module.scss';
import 'components/internal-audit-report/forms/form.scss';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';

interface AuditReportModalData {
  internalAuditComments: InternalAuditComment[];
}

const AuditReportModalComponent = forwardRef((_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [internalAuditComments, setInternalAuditComments] = useState<
    InternalAuditComment[]
  >([]);

  const { search } = useLocation();

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });

  useImperativeHandle(ref, () => ({
    showAuditReportModal: (data: AuditReportModalData) => {
      setVisible(true);
      setInternalAuditComments(data.internalAuditComments || []);
    },
  }));

  const rowLabels = [
    // {
    //   id: 'action',
    //   label: t('action'),
    //   sort: false,
    //   width: '120',
    // },
    {
      id: 'auditNumber',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Inspection number'],
      ),
      sort: false,
      width: '180',
    },
    {
      id: 'auditDate',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Inspection date'],
      ),
      sort: false,
      width: '160',
    },
    {
      id: 'auditType',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
      ),
      sort: false,
      width: '160',
    },
    {
      id: 'natureOfFindings',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Nature of findings'],
      ),
      sort: false,
      width: '150',
    },
    {
      id: 'findings',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS.Findings,
      ),
      sort: false,
      width: '160',
    },
    {
      id: 'ncVerification',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['NC verification'],
      ),
      sort: false,
      width: '150',
    },
    {
      id: 'ncStatus',
      label: renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['NC status'],
      ),
      sort: false,
      width: '150',
    },
  ];

  return (
    <Modal
      isOpen={visible}
      modalType={ModalType.CENTER}
      title={renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Inspection report'],
      )}
      toggle={() => {
        setVisible((prev) => !prev);
        setInternalAuditComments([]);
      }}
      content={
        <div className={styles.auditReportModal}>
          {internalAuditComments?.map((i) => {
            if (i.name.includes('Status of Last Audit Findings')) {
              return (
                <Fragment key={i.name}>
                  <Input
                    label={i.name}
                    value={i.value}
                    className={styles.disabledInput}
                    disabled
                  />
                  <TableCp
                    isEmpty={false}
                    isHiddenAction
                    rowLabels={rowLabels}
                    loading={false}
                    renderRow={() => {}}
                  />
                </Fragment>
              );
            }
            return (
              <Input
                key={i.name}
                label={i.name}
                value={i.value}
                className={styles.disabledInput}
                disabled
              />
            );
          })}
        </div>
      }
    />
  );
});

type ModalRef = { showAuditReportModal: (data: AuditReportModalData) => void };
const modalRef = createRef<ModalRef>();
export const AuditReportModal = () => (
  <AuditReportModalComponent ref={modalRef} />
);
export const showAuditReportModal = (data: AuditReportModalData) => {
  modalRef.current?.showAuditReportModal(data);
};
