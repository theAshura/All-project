import { FC, useContext, useMemo } from 'react';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { IARReportHeaders } from 'models/api/internal-audit-report/internal-audit-report.model';
import CkEditorClassic from 'components/common/ck-editor/CkEditorBuildClassic';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import '../form.scss';

interface Props {
  isEdit: boolean;
  headerItem?: IARReportHeaders;
  dynamicLabels?: IDynamicLabel;
}

const EditorType: FC<Props> = ({ isEdit, headerItem }) => {
  const { handleGetOverview, handleChangeOverview, setTouched } = useContext(
    InternalAuditReportFormContext,
  );

  return useMemo(
    () => (
      <div className="mt-3 mb-3">
        <CkEditorClassic
          data={handleGetOverview(headerItem?.id)}
          disabled={!isEdit}
          onChange={(e) => {
            handleChangeOverview(e?.data, headerItem?.id);
            setTouched(true);
          }}
        />
      </div>
    ),
    [
      handleGetOverview,
      headerItem?.id,
      isEdit,
      handleChangeOverview,
      setTouched,
    ],
  );
};

export default EditorType;
