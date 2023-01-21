import React, { ReactNode } from "react";
import { Modal } from "antd";

export interface Props {
  isModalOpen?: boolean;
  description?: ReactNode | ReactNode[];
  footer?: ReactNode | ReactNode[];
  centered?: boolean;
  okText?: string;
  onSubmit?: (e?: React.MouseEvent<HTMLElement>) => void;
  onClose?: (e?: React.MouseEvent<HTMLElement>) => void;
}

const ModalDelete = ({
  isModalOpen,
  footer,
  centered = true,
  okText,
  onSubmit,
  onClose,
}: Props) => {
  return (
    <>
      <Modal
        title={"Delete?"}
        open={isModalOpen}
        onOk={onSubmit}
        onCancel={onClose}
        footer={footer}
        centered={centered}
        okText={"Yes"}
        cancelText={"No"}
      >
        Are you sure you want to delete this record? This action cannot be
        undone and you will not be able to recover any data.
      </Modal>
    </>
  );
};

export default ModalDelete;
