import { FC, memo } from 'react';
import TextAreaUI from 'components/ui/text-area/TextArea';
import { InternalAuditComment } from 'contexts/internal-audit-report/IARFormContext';
import textareaStyles from 'components/react-hook-form/text-area/text-area.module.scss';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';

interface Props {
  isEdit: boolean;
  handleOnChangeComment: (field: string, value: string) => void;
  dynamicLabels?: IDynamicLabel;
  placeholder?: string;
}

const Comment: FC<InternalAuditComment & Props> = (props) => {
  const { label, name, isEdit, handleOnChangeComment, placeholder, value } =
    props;
  return (
    <div>
      <div className="d-flex align-items-start pb-2">
        <h6 className="m-0">{label}</h6>
      </div>
      <div className={textareaStyles.TextAreaWrapper}>
        <TextAreaUI
          value={value}
          onChange={(e) => {
            handleOnChangeComment(name, e.target.value);
          }}
          maxLength={500}
          disabled={!isEdit}
          className={textareaStyles.textAreaForm}
          autoSize={{ minRows: 1, maxRows: 3 }}
          placeholder={placeholder || ''}
        />
      </div>
    </div>
  );
};

export const CommentComponent = memo(Comment);
