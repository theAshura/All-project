import { CellFocusedEvent } from 'ag-grid-community';

export const preventBubblingWhenClickOnAGGridCell = (
  e: CellFocusedEvent,
  condition: boolean,
) => {
  if (condition) {
    // @ts-ignore
    e.api.gridOptionsWrapper.gridOptions.suppressRowClickSelection = true;
  } else {
    // @ts-ignore
    e.api.gridOptionsWrapper.gridOptions.suppressRowClickSelection = false;
  }
};
