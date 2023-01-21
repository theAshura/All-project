import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';

export const filterContentSelect = (
  content: string,
  data: NewAsyncOptions[],
) => {
  const contentSearch = content.trim().toUpperCase();
  const result =
    data.filter((item) =>
      item.label.toString().toUpperCase().includes(contentSearch),
    ) || [];
  return result;
};
