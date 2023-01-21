import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';

interface Props {
  moduleKey: DynamicLabelModuleName;
  modulePage: ModulePage;
}

const useDynamicLabels = ({ moduleKey, modulePage }: Props): IDynamicLabel => {
  const { listDynamicLabels, loading } = useSelector((state) => state.dynamic);
  const [dynamicFields, setDynamicFields] = useState<IDynamicLabel>(null);

  useEffect(() => {
    if (moduleKey && modulePage && listDynamicLabels?.length) {
      const dynamicLabels = listDynamicLabels?.find(
        (item) => item.moduleKey === moduleKey,
      );
      setDynamicFields(dynamicLabels?.[modulePage]);
    }
  }, [moduleKey, listDynamicLabels, loading, modulePage]);

  return dynamicFields;
};

export default useDynamicLabels;
