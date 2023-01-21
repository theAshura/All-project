import { Button } from 'antd/lib/radio';
import './itemOption.module.scss';
import { useRef } from 'react';
import { Item } from '../ListOption';

interface Props {
  item?: Item;
  onClose: (i) => void;
  onChangValue: (i) => void;
}
export default function ItemOption(props: Props) {
  const { item, onClose, onChangValue } = props;

  const inputRef = useRef(null);
  return (
    <>
      <input
        type="radio"
        ref={inputRef}
        checked={item.value}
        onClick={(value) => {
          const valueChange = { ...item };
          valueChange.value = !value;
          onChangValue(valueChange);
        }}
      />
      <input
        type="text"
        placeholder={`Option ${item.index}`}
        onChange={(value) => {
          const valueChange = { ...item };
          valueChange.text = value.target.value;
          onChangValue(valueChange);
        }}
        value={item.text || ''}
      />
      <Button onClick={() => onClose(item.index)}>close</Button>
    </>
  );
}
