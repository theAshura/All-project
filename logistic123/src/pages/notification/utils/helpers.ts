export const parseSocketData = (msg: string) => {
  const stringData = msg.slice(1);
  const result = {
    type: '',
    data: null,
    message: '',
    totalUnreadNotification: 0,
  };

  let arr = null;
  try {
    arr = JSON.parse(stringData);
  } catch (error) {
    arr = null;
  }

  if (!arr) {
    return result;
  }

  let data = null;
  try {
    data = JSON.parse(arr?.[1]?.data);
  } catch (error) {
    data = null;
  }

  return {
    ...result,
    type: arr?.[0] || '',
    message: arr?.[1]?.message || '',
    totalUnreadNotification: arr?.[1]?.totalUnreadNotification || 0,
    data,
  };
};

export const parseStatus = (rawStatus: any) => {
  if (!rawStatus) {
    return '';
  }
  let displayStatus = rawStatus.replaceAll(/[_-]/g, ' ');
  displayStatus = displayStatus.toUpperCase();
  return displayStatus || '';
};
