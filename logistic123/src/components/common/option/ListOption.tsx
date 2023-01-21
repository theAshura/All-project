import { useState } from 'react';
import ItemOption from './item/ItemOption';

export interface Item {
  value?: boolean;
  text?: string;
  index?: number;
}

interface Props {
  values: Item[];
  getList: () => Item[];
}
export default function ListOption(props: Props) {
  const { values } = props;
  const [listOption, setListOption] = useState(values);

  const onChangValue = (item) => {
    // getList(item);
  };

  // const onChange = useCallback((value, i) => {
  //   console.log(value);

  //   myList[i] = !value;
  //   console.log(myList);
  // }, [myList]);

  // const onChange = (value, i) => {
  //   // console.log(' i value ', i , item);

  //   const cloneOption = [...listOption];
  //   cloneOption[i].value= !value;
  //   console.log('change value ', cloneOption);

  //   setListOption(cloneOption);

  // };

  const removeItem = (i) => {
    const cloneOption = [...listOption];
    cloneOption[i].text = undefined;
    const newList = cloneOption.filter((item, index) => index !== i);
    setListOption(newList);
  };

  // const onChangeText = (str, i) =>{
  //   const cloneList = [...listOption];
  //   cloneList[i].text = str;
  //   console.log('change text

  //   setListOption(cloneList);
  // }

  // const onChangValueItem = (item) => {

  // }

  return (
    <>
      {listOption.map((item, i) => (
        <ItemOption
          key={String(item.text) + String(i)}
          item={item}
          onChangValue={() => onChangValue(item)}
          onClose={() => removeItem(item)}
        />
      ))}

      <button
        onClick={() => {
          const cloneOption = [...listOption];
          cloneOption.push({ value: false });
          // setListOption(cloneOption);
        }}
      >
        {' '}
        ADD ITEM{' '}
      </button>
    </>
  );
}
