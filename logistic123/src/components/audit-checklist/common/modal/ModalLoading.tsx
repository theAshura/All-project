import { FC } from 'react';
import { Modal } from 'reactstrap';
import images from 'assets/images/images';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import styles from './modal-loading.module.scss';

interface ModalLoadingProps {
  isOpen: boolean;
  dynamicLabel: IDynamicLabel;
}

const ModalLoading: FC<ModalLoadingProps> = (props) => {
  const { isOpen, dynamicLabel } = props;

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {}}
      modalClassName={styles.wrapper}
      contentClassName={styles.wrapperInner}
      fade={false}
    >
      <div className={styles.modalContainer}>
        <div className="d-flex justify-content-center">
          <img
            src={images.common.loading}
            className={styles.loading}
            alt="loading"
          />
        </div>
        <p className={styles.text}>
          {renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              "We are processing your file and will notify you after it's done"
            ],
          )}
        </p>
        <p>
          {renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Importing will continue even if you leave the page'
            ],
          )}
        </p>
      </div>
    </Modal>
  );
};

export default ModalLoading;
