import React from "react";
import { Button, Modal, ModalFuncProps } from "antd";

export enum TYPE_MODAL {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  WARNING = "WARNING",
}

export interface Props {
  type: TYPE_MODAL;
  title: string;
  content: string;
  open: boolean;
  onOk?: (e: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
  modalFuncProps?: ModalFuncProps;
}

const ModalInformation = ({
  type,
  title,
  content,
  open,
  onOk,
  onCancel,
  ...modalFuncProps
}: Props) => {
  const render = () => {
    const config = {
      title,
      content,
      open,
      onOk,
      onCancel,
      ...modalFuncProps,
    };
    switch (type) {
      case TYPE_MODAL.INFO:
        Modal.info(config);
        break;
      case TYPE_MODAL.SUCCESS:
        Modal.success(config);
        break;
      case TYPE_MODAL.ERROR:
        Modal.error(config);
        break;
      case TYPE_MODAL.WARNING:
        Modal.warning(config);
        break;
      default:
        Modal.info(config);
    }
  };

  return <>{render()}</>;
};

export default ModalInformation;
