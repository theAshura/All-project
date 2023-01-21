import InvisibleBackdrop from 'components/common/backdrop/InvisibleBackdrop';
import { FC, useCallback, useEffect } from 'react';
import cx from 'classnames';
import { v4 } from 'uuid';
import styles from './input-with-tags.module.scss';
import InputAutoScaling from './InputAutoScaling';

interface Tag {
  id: string;
  value: string;
  isFocus: boolean;
  isTag: boolean;
}

interface Props {
  onChange?: (e) => void;
  listTags?: Tag[];
  disabled?: boolean;
  placeholder?: string;
  onDelete?: (id?: string) => void;
  maxLength?: number;
  inputClassName?: string;
}

const InputWithTags: FC<Props> = ({
  onChange,
  listTags,
  onDelete,
  disabled,
  placeholder,
  maxLength,
  inputClassName,
}) => {
  // const [listTags, setListTags] = useState<Tag[]>([
  //   { id: '', value: '', isFocus: false, isTag: false },
  // ]);

  const removeDuplicateData = useCallback((data) => {
    const listDataNotDuplicate = [];
    data.forEach((item) => {
      if (!listDataNotDuplicate.find((i) => i.value === item.value)) {
        listDataNotDuplicate.push(item);
      }
    });
    return listDataNotDuplicate;
  }, []);

  const setListTags = useCallback(
    (e) => {
      if (onChange) {
        onChange(e);
      }
    },
    [onChange],
  );

  useEffect(() => {
    if (!listTags?.length && onChange) {
      onChange([{ id: v4(), value: '', isFocus: false, isTag: false }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTags]);

  // useEffect(() => {
  //   if (
  //     onChange &&
  //     listTags?.length &&
  //     JSON.stringify(value) !== JSON.stringify(listTags)
  //   ) {
  //     const newData = cloneDeep(listTags);
  //     onChange(newData);
  //   }
  // }, [listTags]);

  // useEffect(() => {
  //   if (value && JSON.stringify(value) !== JSON.stringify(listTags)) {
  //     if (value?.some((i) => !i.isTag)) {
  //       setListTags(value);
  //     } else {
  //       setListTags(
  //         value.concat({ id: '', value: '', isFocus: false, isTag: false }),
  //       );
  //     }
  //   }
  // }, [value, listTags]);

  const handleChange = useCallback(
    (value, id) => {
      const valuesChange = listTags?.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            value,
          };
        }
        return i;
      });

      setListTags(valuesChange);
    },
    [listTags, setListTags],
  );

  const handleFocus = useCallback(() => {
    const position = listTags?.length;
    const valuesChange = listTags?.map((i, index) => {
      if (position === index + 1) {
        return {
          ...i,
          isFocus: true,
        };
      }
      return i;
    });
    setListTags(valuesChange);
  }, [listTags, setListTags]);

  const onKeyDown = useCallback(
    (e, id) => {
      if (e.key === 'Enter') {
        const valuesChange = listTags
          ?.filter((i) => !!i.value)
          ?.map((i) => {
            if (i.id === id) {
              return {
                ...i,
                value: String(i.value)?.trim(),
                isFocus: false,
                isTag: true,
              };
            }
            return { ...i, isFocus: false, isTag: true };
          });
        valuesChange.push({
          id: v4(),
          value: '',
          isFocus: true,
          isTag: false,
        });
        setListTags(removeDuplicateData(valuesChange));
      }
    },
    [listTags, removeDuplicateData, setListTags],
  );

  const unFocus = useCallback(() => {
    if (!listTags?.some((i) => !!i.isFocus)) {
      return;
    }
    const valuesChange = listTags
      ?.filter((i) => !!i.value)
      ?.map((i) => ({
        ...i,
        value: String(i.value)?.trim(),
        isTag: true,
        isFocus: false,
      }));
    if (valuesChange?.length) {
      valuesChange.push({
        id: v4(),
        value: '',
        isFocus: false,
        isTag: false,
      });
    }

    setListTags(removeDuplicateData(valuesChange));
  }, [listTags, removeDuplicateData, setListTags]);

  const onDoubleClick = useCallback(
    (id) => {
      const valuesChange = listTags
        ?.filter((i) => !!i?.value)
        ?.map((i) => {
          if (i.id === id) {
            return {
              ...i,
              isFocus: true,
              isTag: false,
            };
          }
          return { ...i, isFocus: false, isTag: true };
        });
      setListTags(valuesChange);
    },
    [listTags, setListTags],
  );

  const onDeleteTag = useCallback(
    (e, id) => {
      e.stopPropagation();
      const valuesChange = listTags
        .filter((i) => i.id !== id)
        ?.map((i) => ({ ...i, isFocus: false }));

      setListTags(valuesChange);
      if (onDelete) {
        onDelete(id);
      }
    },
    [listTags, onDelete, setListTags],
  );

  return (
    <InvisibleBackdrop onClick={unFocus}>
      <div
        className={cx({ [styles.disable]: disabled }, styles.wrapInput)}
        onClick={handleFocus}
      >
        {listTags?.map((item) => (
          <InputAutoScaling
            disabled={disabled}
            key={item?.id}
            autoFocus={item?.isFocus}
            isTag={item.isTag}
            value={item?.value}
            onKeyDown={(e) => !disabled && onKeyDown(e, item.id)}
            onChange={(e) =>
              !disabled && handleChange(e?.target?.value, item?.id)
            }
            onDeleteTag={(e) => !disabled && onDeleteTag(e, item?.id)}
            onDoubleClick={(e) => !disabled && onDoubleClick(item?.id)}
            placeholder={listTags?.length === 1 ? placeholder : ''}
            maxLength={maxLength || 250}
            inputClassName={inputClassName}
          />
        ))}
      </div>
    </InvisibleBackdrop>
  );
};

export default InputWithTags;
