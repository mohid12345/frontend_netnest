import * as Yup from 'yup';

export const initialValues = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const validationSchema = Yup.object({
  userName: Yup.string().trim()
  .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .test('password-complexity', 'Password must contain at least one number, one uppercase letter, and one lowercase letter.', value => {
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/;
      return regex.test(value);
    }),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
})