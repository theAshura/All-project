import images from 'assets/images/images';
import { memo, useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import styles from './inputMention.module.scss';

const defaultStyle = {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
    borderRadius: 8,
  },
  highlighter: {
    overflow: 'unset',
  },
  input: {
    margin: 0,
    overflow: 'auto',
    fontWeight: 400,
  },
  '&multiLine': {
    control: {
      border: '1px solid silver',
    },
    highlighter: {
      padding: 9,
    },
    input: {
      padding: 9,
      minHeight: 3,
      outline: 0,
      border: 0,
    },
  },
  suggestions: {
    bottom: '0',
    top: 'unset',
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#198cf0',
        color: 'white',
      },
    },
  },
};

export enum MessageType {
  INFO = 'info',
  ERROR = 'error',
}

export interface MentionModel {
  id: string;
  display: string;
}

export interface InputMentionProps {
  placeholder?: string;
  messageType?: typeof MessageType[keyof typeof MessageType];
  defaultValue?: string;
  label?: string;
  isRequired?: boolean;
  maxLength?: number;
  messageRequired?: string;
  onChange?: (value: string) => void;
  mentions?: MentionModel[];
  mentions2?: MentionModel[];
  value?: string;
  disabled?: boolean;
}

function InputMention({
  placeholder,
  label,
  isRequired,
  maxLength,
  messageRequired,
  mentions,
  onChange,
  mentions2,
  disabled,
  value = '',
}: InputMentionProps) {
  const [idMention, setIdMention] = useState('');
  return (
    <div className={styles.wrapContentInputMention}>
      {label && (
        <div className="d-flex align-items-start mg__b-1">
          <div className={styles.label}>{label}</div>
          {isRequired && (
            <img src={images.icons.icRequiredAsterisk} alt="required" />
          )}
        </div>
      )}

      <MentionsInput
        value={value}
        onChange={onChange}
        maxLength={maxLength || 200}
        style={defaultStyle}
        placeholder={placeholder}
        disabled={disabled}
      >
        <Mention
          trigger="@"
          displayTransform={(id, display) => `${id}`}
          markup="{{__id__}}"
          appendSpaceOnAdd
          data={mentions}
          onAdd={(id, display, startPos, endPos) => {
            setIdMention(id);
          }}
          className={`wrap__input-mentions ${idMention}`}
        />
        <Mention
          trigger="#"
          data={mentions2}
          displayTransform={(id, display) => `${id}`}
          markup="{{__id__}}"
          appendSpaceOnAdd
        />
      </MentionsInput>

      {messageRequired && (
        <div className="message-required mt-2">{messageRequired} </div>
      )}
    </div>
  );
}
export default memo(InputMention);
