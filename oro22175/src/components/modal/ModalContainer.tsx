import React, { ReactNode } from "react";
import { Modal } from "antd";

export interface Props {
  title?: string;
  isModalOpen?: boolean;
  description?: ReactNode | ReactNode[];
  footer?: ReactNode | ReactNode[];
  centered?: boolean;
  okText?: string;
  onSubmit?: (e?: React.MouseEvent<HTMLElement>) => void;
  onClose?: (e?: React.MouseEvent<HTMLElement>) => void;
  children?: ReactNode | ReactNode[];
  hideFooter?: boolean;
  closable?: boolean;
  isLoadingButton?: boolean;
}

const ModalContainer = ({
  title,
  isModalOpen,
  footer,
  hideFooter,
  centered,
  okText,
  onSubmit,
  onClose,
  closable,
  children,
  isLoadingButton,
}: Props) => {
  return (
    <>
      <Modal
        title={title}
        open={isModalOpen}
        onOk={onSubmit}
        onCancel={onClose}
        footer={!hideFooter && footer}
        centered={centered}
        okText={okText}
        closable={closable}
        confirmLoading={isLoadingButton}
      >
        {children}
      </Modal>
    </>
  );
};

export default ModalContainer;
