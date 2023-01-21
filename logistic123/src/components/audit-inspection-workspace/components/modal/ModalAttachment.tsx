import { FC } from 'react';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { TableAttachment } from 'components/audit-checklist/common/attachment/TableAttachment';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './modal.module.scss';

interface ModalFindingProps {
  isOpen: boolean;
  title: string;
  isAdd?: boolean;
  data: string[];
  dynamicLabels?: IDynamicLabel;
  toggle?: () => void;
}
const ModalAttachment: FC<ModalFindingProps> = ({
  isOpen,
  toggle,
  title,
  data,
  dynamicLabels,
}) => (
  <Modal
    isOpen={isOpen}
    title={title}
    toggle={toggle}
    hiddenFooter
    bodyClassName={styles.bodyModal}
    content={
      <div className={styles.modalReferencesAndCategories}>
        <TableAttachment
          featurePage={Features.AUDIT_INSPECTION}
          subFeaturePage={SubFeatures.AUDIT_INSPECTION_WORKSPACE}
          loading={false}
          isModal
          isEdit={false}
          value={data || []}
          buttonName={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Attach,
          )}
        />
      </div>
    }
    w={800}
    modalType={ModalType.CENTER}
  />
);

export default ModalAttachment;
