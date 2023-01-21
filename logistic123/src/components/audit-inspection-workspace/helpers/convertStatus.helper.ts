export const convertStatus = (status: string) => {
  const statusCheck = (status && status?.toLowerCase()) || '';

  switch (statusCheck) {
    case 'new':
      return 'Draft';
    case 'draft':
      return 'In progress';
    case 'final':
      return 'Submitted';
    default:
      return 'Draft';
  }
};
