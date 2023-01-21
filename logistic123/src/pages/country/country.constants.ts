import * as yup from 'yup';

export enum DialCodeStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
}

export enum FileExtension {
  SVG = 'svg',
}

export const defaultCountryValues = {
  code: '',
  code3: '',
  dialCode: '',
  name: '',
  nationality: '',
  status: true,
};

export const countrySchema = yup.object().shape({
  code: yup
    .string()
    .trim()
    .test(
      'length',
      'ISO alpha-2 code must be 2 characters',
      (value) => value.length === 2,
    )
    .required('This field is required'),
  code3: yup
    .string()
    .trim()
    .test(
      'length',
      'ISO alpha-3 code must be 3 characters',
      (value) => value.length === 3,
    )
    .required('This field is required'),
  name: yup
    .string()
    .trim()
    .max(250, "Country name shouldn't exceed 250 characters")
    .required('This field is required'),
  nationality: yup
    .string()
    .trim()
    .max(250, "Nationality shouldn't exceed 250 characters")
    .required('This field is required'),
  dialCode: yup
    .string()
    .trim()
    .max(4, "Dial code shouldn't exceed 4 characters"),
});

export const CountryAGTimeFormat = 'DD/MM/YYYY HH:mm:ss';

export const DISABLE = true;
