import * as Yup from 'yup';

export const initialValues = {
  images: [],
  title: "",
  description: "",
}

export const validationSchema = Yup.object({
  images: Yup.array()
    .min(1, "At least one image is required")
    .required("Image file required"),
  title: Yup.string()
    .trim() // Trim leading and trailing spaces
    .required("Title is required")
    .matches(/^\S+.*\S$/, "Title cannot contain only spaces"),
  description: Yup.string()
    .trim() // Trim leading and trailing spaces
    .required("Description is required")
    .matches(/^\S+.*\S$/, "Description cannot contain only spaces"),
})