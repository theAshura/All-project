import moment from "moment";

export const formatDateLocalNoTime = (date: string | Date) => {
  if (!date) {
    return null;
  }
  if (!moment(date).isValid()) {
    return null;
  }
  return moment(date).local().format("DD/MM/YYYY");
};
