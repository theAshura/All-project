import { FC, useMemo } from 'react';
import { CommonQuery } from 'constants/common.const';
import { useLocation } from 'react-router-dom';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './inspector-detail.module.scss';
import ProvidedInspection from './provided-inspection/ProvidedInspection';
import TravelDocument from './travel-document/TravelDocument';
import Experience from './experience/Experience';
import LicensesCertificationList from './licenses-certification/LicensesCertification';

interface InspectorDetailProps {
  disabled?: boolean;
  isCreate?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const InspectorDetail: FC<InspectorDetailProps> = ({
  isCreate,
  dynamicLabels,
}) => {
  const { search } = useLocation();
  const isEdit = useMemo(
    () => search === CommonQuery.EDIT || isCreate,
    [isCreate, search],
  );
  return (
    <div className={styles.wrap}>
      <Experience dynamicLabels={dynamicLabels} />
      <LicensesCertificationList dynamicLabels={dynamicLabels} />
      <ProvidedInspection disabled={!isEdit} dynamicLabels={dynamicLabels} />
      <TravelDocument disabled={!isEdit} dynamicLabels={dynamicLabels} />
    </div>
  );
};

export default InspectorDetail;
