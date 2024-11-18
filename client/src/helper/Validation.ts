import * as Yup from 'yup'
 const signupSchema = Yup.object().shape({
    
    name: Yup.string()
    .required('name is required')
    .min(3, ' name must be at least 6 characters'),
    emailAddress: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
phoneNumber: Yup.string()
    .required('Phone Number is required')
    .min(10,'Phone Number is too short'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), " "], 'Passwords must match'),
  consent: Yup.boolean()
})

const SigninSchema = Yup.object().shape({

  emailAddress: Yup.string()
  .required('Email is required')
  .email('Invalid email format'),

password: Yup.string()
  .required('Password is required')
  .min(6, 'Password must be at least 6 characters'),

})

export {signupSchema, SigninSchema}