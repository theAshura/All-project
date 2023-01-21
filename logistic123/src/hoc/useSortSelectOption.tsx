import { useMemo } from 'react';

const useSortSelectOption = (
  notAllowSortData,
  options,
  params?,
  lang = 'en',
) => {
  const sortOptions = useMemo(() => {
    const cloneOptions = options?.length ? [...options] : [];
    return cloneOptions?.sort((a, b) =>
      a?.label?.toString().localeCompare(b?.label?.toString(), lang, {
        ignorePunctuation: true,
        numeric: true,
        sensitivity: 'base',
        ...params,
      }),
    );
  }, [options, params, lang]);

  const optionProps = useMemo(
    () => (notAllowSortData ? options : sortOptions),
    [notAllowSortData, options, sortOptions],
  );
  return {
    optionProps,
  };
};

export default useSortSelectOption;
