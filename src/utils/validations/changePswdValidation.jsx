import * as Yup from 'yup'

export const pswdInitialValues = {
  currentPassword: "",
  newPassword: "",
  // confirmPassword: "",
}

export const pswdValidationSchema = Yup.object({
  currentPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .test('password-complexity', 'Password must contain at least one number, one uppercase letter, and one lowercase letter.', value => {
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/;
      return regex.test(value);
    })
    .test(
      'no-whitespace',
      'Password cannot contain only whitespace',
      value => value && value.trim().length > 0
    ),
    // confirmPassword: Yup.string()
    //   .oneOf([Yup.ref("newPassword")], "Passwords must match")
    //   .required("Confirm Password is required"),
})