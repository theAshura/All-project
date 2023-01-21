import * as Yup from 'yup';

const subscriptionSchema = Yup.object().shape({
  email: Yup.string()
    .email(
      // /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/,
      'Entered value does not match email format.'
    )
    .max(250, 'Maximum 250 characters')
    .required('Email must not be blank.'),
});

export default subscriptionSchema;
