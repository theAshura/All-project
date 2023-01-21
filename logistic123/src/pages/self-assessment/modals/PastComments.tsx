import ModalComponent from 'components/ui/modal/Modal';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import TablePastComments from '../tables/PastComments';

interface ModalPastCommentsProps {
  isOpen: boolean;
  toggle: () => void;
}

const ModalPastComments = ({ toggle, isOpen }: ModalPastCommentsProps) => {
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);
  const { listLookUpCompanyComment, loading } = useSelector(
    (state) => state.selfAssessment,
  );

  return (
    <ModalComponent
      w={1000}
      isOpen={isOpen}
      toggle={toggle}
      title={t('button.lookUpPastComments')}
      content={
        <TablePastComments
          data={listLookUpCompanyComment?.data}
          loading={loading}
        />
      }
    />
  );
};

export default ModalPastComments;
