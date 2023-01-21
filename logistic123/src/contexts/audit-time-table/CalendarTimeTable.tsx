import { createContext, useState, Dispatch, SetStateAction } from 'react';
import { CalendarDate } from 'models/api/audit-time-table/audit-time-table.model';

export interface OptionEditor {
  value: string;
  label: string;
}

interface CalendarTimeTableProp {
  listEvent: CalendarDate[];
  dateEvent: string;
  optionEditor: OptionEditor[];
  setListEvent: Dispatch<SetStateAction<CalendarDate[]>>;
  setDateEvent: Dispatch<SetStateAction<string>>;
  setOptionEditor: Dispatch<SetStateAction<OptionEditor[]>>;
}

export const CalendarTimeTableContext = createContext<
  CalendarTimeTableProp | undefined
>(undefined);

const CalendarTimeTableProvider = ({ children }) => {
  const [dateEvent, setDateEvent] = useState('');
  const [optionEditor, setOptionEditor] = useState<OptionEditor[]>([]);
  const [listEvent, setListEvent] = useState<CalendarDate[]>([]);

  const themeContextData = {
    listEvent,
    dateEvent,
    optionEditor,
    setListEvent,
    setDateEvent,
    setOptionEditor,
  };

  return (
    <CalendarTimeTableContext.Provider value={themeContextData}>
      {children}
    </CalendarTimeTableContext.Provider>
  );
};
export default CalendarTimeTableProvider;
