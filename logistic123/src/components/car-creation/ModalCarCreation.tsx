import cx from 'classnames';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC } from 'react';
import { Modal, ModalProps } from 'reactstrap';
import CarFormProvider from './CarFormContext';
import CarSteps from './CarSteps';
import styles from './modal-car-creation.module.scss';

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: (isReGetDetail?: boolean) => void;
  onSaveData?: void;
  modalClassName?: string;
  contentClassName?: string;
  classesName?: string;
  planningAndRequestId: string;
  rofId?: string;
  carId?: string;
  isEdit: boolean;
  sNo?: string;
  capOnly?: boolean;
  featurePage: Features;
  subFeaturePage: SubFeatures;
  dynamicLabels?: IDynamicLabel;
}

const ModalCARCreation: FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  onSaveData,
  planningAndRequestId,
  modalClassName,
  contentClassName,
  classesName,
  carId,
  isEdit,
  rofId,
  sNo,
  featurePage,
  subFeaturePage,
  capOnly,
  dynamicLabels,
  ...other
}) => (
  <Modal
    className={cx(styles.wrapModal, classesName)}
    modalClassName={cx(styles.modalClassName, modalClassName)}
    contentClassName={cx(styles.contentClassName, contentClassName)}
    isOpen={isOpen}
    {...other}
  >
    <CarFormProvider
      onClose={onClose}
      capOnly={capOnly}
      rofId={rofId}
      isEdit={isEdit}
    >
      <CarSteps
        featurePage={featurePage}
        subFeaturePage={subFeaturePage}
        onClose={onClose}
        planningAndRequestId={planningAndRequestId}
        carId={carId}
        sNo={sNo}
        dynamicLabels={dynamicLabels}
      />
    </CarFormProvider>
  </Modal>
);

export default ModalCARCreation;
