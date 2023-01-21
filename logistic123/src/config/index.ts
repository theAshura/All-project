export interface ConfigModel {
  NAME: string;
  BASE_URL: string;
  CDN: string;
  REACT_APP_LICENSE_KEY_AG_GRID: string;
}

export const CONFIG: ConfigModel = {
  NAME: process.env.REACT_APP_NAME,
  BASE_URL: process.env.REACT_APP_BASE_URL,
  CDN: process.env.REACT_APP_CDN,
  REACT_APP_LICENSE_KEY_AG_GRID: process.env.REACT_APP_LICENSE_KEY_AG_GRID,
};
