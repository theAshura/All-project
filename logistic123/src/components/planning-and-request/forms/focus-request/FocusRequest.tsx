import cx from 'classnames';
import TextAreaUI from 'components/ui/text-area/TextArea';
import RadioCustomer from 'components/common/radio/Radio';
import { IFocusRequest } from 'models/api/planning-and-request/planning-and-request.model';
import { MaxLength } from 'constants/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './focus-request.module.scss';

interface FocusRequestProp {
  index: number;
  data: IFocusRequest;
  onChange: (value: string, field: string, id: string) => void;
  isReadOnly?: boolean;
  dynamicLabels?: IDynamicLabel;
}
export default function FocusRequest(props: FocusRequestProp) {
  const { index, data, onChange, isReadOnly, dynamicLabels } = props;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <span className={cx(styles.labelMemo, 'm-0')}>{`${index + 1}. ${
          data.question || ''
        }`}</span>
        <div className={styles.wrapAnswer}>
          <RadioCustomer
            onChange={(e) => {
              onChange(e, 'answer', data.focusRequestId);
            }}
            disabled={isReadOnly}
            value={data.answer}
            radioOptions={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' },
            ]}
            className={styles.radioInput}
          />
        </div>
      </div>
      <div className={cx(styles.labelMemo, 'mt-2')}>
        {renderDynamicLabel(dynamicLabels, DETAIL_PLANNING_DYNAMIC_FIELDS.Memo)}
      </div>
      <TextAreaUI
        value={data.memo}
        placeholder={
          isReadOnly
            ? ''
            : renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Enter memo'],
              )
        }
        onChange={(e) => onChange(e.target.value, 'memo', data.focusRequestId)}
        minRows={2}
        maxRows={6}
        maxLength={MaxLength.MAX_LENGTH_COMMENTS}
        readOnly={isReadOnly}
      />
    </div>
  );
}
