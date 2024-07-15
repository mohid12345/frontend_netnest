import * as Yup from 'yup';

export const initialValues = {
  password: "",
  confirmPassword: "",
};

export const validationSchema =  Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
})