export const REGEXP_INPUT_PHONE: RegExp = /^[0-9()+-]+$/g;
export const REGEXP_INPUT_PHONE_NUMBER: RegExp = /^[0-9()+-]+$/i;
export const REGEXP_INPUT_NUMBER: RegExp = /^[0-9]+$/i;
export const REGEXP_INPUT_DECIMAL: RegExp = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
export const REGEXP_INPUT_NUMBER_WITHOUT_0: RegExp = /^[1-9]+$/i;
export const REGEXP_INPUT_MIN_VALUE_POSITIVE: RegExp = /^[1-9][0-9]*$/i;

export const REGEXP_INPUT_NUMBER_2_DECIMAL_POSITIVE: RegExp =
  /^[0-9]+(?:\.[0-9]{1,2})?$/i;
export const REGEXP_INPUT_FAX_NUMBER: RegExp = /^[0-9()+]+$/i;

export const REGEXP_INPUT_SCORE: RegExp = /^[0-2][0-9]?$|^30?$/;

export const REGEXP_VALIDATE_PHONE: RegExp =
  // eslint-disable-next-line no-useless-escape
  /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
export const REGEXP_VALIDATE_EMAIL: RegExp =
  // eslint-disable-next-line max-len
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const REGEXP_NUMERIC_VALUE: RegExp = /^[0-9\b]+$/;
