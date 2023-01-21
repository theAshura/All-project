import {
  forwardRef,
  useState,
  useImperativeHandle,
  createRef,
  useRef,
  ReactNode,
} from 'react';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import 'components/internal-audit-report/forms/form.scss';
import { useLocation } from 'react-router-dom';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { CommonQuery } from 'constants/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';

interface ConfirmationModalData {
  isOpen: boolean;
  toggle: () => void;
  content: string | ReactNode;
}

const ConfirmationModalComponent = forwardRef((_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string | ReactNode>();
  const toggleRef = useRef<() => void | null>();
  const { search } = useLocation();
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });
  const toggle = () => {
    setVisible((prev) => !prev);
    if (toggleRef.current) {
      toggleRef.current();
      toggleRef.current = null;
    }
  };

  const close = () => {
    toggle();
    setContent(undefined);
  };

  useImperativeHandle(ref, () => ({
    showConfirmationModal: (data: ConfirmationModalData) => {
      setVisible(data.isOpen);
      setContent(data.content);
      toggleRef.current = data.toggle;
    },
    closeConfirmationModal: () => {
      setVisible(false);
    },
  }));

  return (
    <Modal
      isOpen={visible}
      title={renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS.Confirmation,
      )}
      modalType={ModalType.NORMAL}
      toggle={close}
      content={content}
      w={500}
    />
  );
});

type ModalRef = {
  showConfirmationModal: (data: ConfirmationModalData) => void;
  closeConfirmationModal: () => void;
};
const modalRef = createRef<ModalRef>();
export const ConfirmationModal = () => (
  <ConfirmationModalComponent ref={modalRef} />
);
export const showConfirmationModal = (data: ConfirmationModalData) => {
  modalRef.current?.showConfirmationModal(data);
};

export const closeConfirmationModal = () => {
  modalRef.current?.closeConfirmationModal();
};
