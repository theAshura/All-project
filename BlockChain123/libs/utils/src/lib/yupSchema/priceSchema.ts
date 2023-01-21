import * as Yup from 'yup';
import {
  MAX_VALUE,
  SET_NFT_FOR_RENT_FIELDS,
  VALIDATE_MESSAGE,
} from './setNftForRentSchema';
const priceSchema = Yup.object().shape({
  min: Yup.number()
    .transform((val) => (val ? +val : 0))
    .typeError(VALIDATE_MESSAGE.INVALID_AMOUNT)
    .positive(VALIDATE_MESSAGE.INVALID_AMOUNT)
    .test(
      SET_NFT_FOR_RENT_FIELDS.PRICE,
      VALIDATE_MESSAGE.MAX_VALUE,
      (number) => !!number && number <= MAX_VALUE
    )
    .nullable(),
  max: Yup.number()
    .transform((val) => (val ? +val : 0))
    .typeError(VALIDATE_MESSAGE.INVALID_AMOUNT)
    .positive(VALIDATE_MESSAGE.INVALID_AMOUNT)
    .test(
      SET_NFT_FOR_RENT_FIELDS.PRICE,
      VALIDATE_MESSAGE.MAX_VALUE,
      (number) => !!number && number <= MAX_VALUE
    )
    .nullable(),
});
export default priceSchema;
