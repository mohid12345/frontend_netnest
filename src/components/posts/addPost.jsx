import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useFormik } from 'formik';
import axios from 'axios';
import { useSelector } from 'react-redux';
import  { addPost } from "../../services/user/apiMethods"
import { useNavigate } from 'react-router-dom';
import { initialValues, validationSchema } from '../../utils/validations/postValidation';
import Loader from '../loader/loader';

function AddPost({ closeAddPost }) {
  const selectedUser = (state) => state.auth.user || "";
  const user = useSelector(selectedUser);
  const userId = user._id || "";
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    formik.resetForm();
    setSelectedFiles([]);
  };

  const handleFileChange = useCallback((event) => {
    const files = Array.from(event.target.files);
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error("Please select only image files (JPEG, PNG, GIF)");
      return;
    }
    setSelectedFiles(files);
    formik.setFieldValue('images', files);
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async () => {
      setLoading(!loading)
      const { title, description, images } = formik.values;
      const imageUrls = [];

      for (const imageFile of images) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

        try {
          const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData);
          imageUrls.push(res.data.url);
        } catch (error) {
          toast.error("Error uploading image");
          return;
        }
      }

      try {
        const response = await addPost({ userId, imgUrl: imageUrls, title, description });
        if (response.status === 200) {
          toast.info(response.data.message);
          resetState();
          setLoading(!loading)
          handleCancelClick();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }

    },
  });

  const handleCancelClick = () => {
    resetState();
    closeAddPost();
    navigate('/');
  };

  return (
    <div className='fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-md'>
      <div className='flex justify-center items-center h-full'>
        <div className='dark:bg-black bg-white p-10 space-y-4 w-full md:mx-80 rounded-md'>
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold text-xl'>Add Post</h2>
            <button onClick={closeAddPost} className="text-white px-2 py-2 rounded">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
            </button>
          </div>
          <div className='max-w-md mx-auto'>
          {loading && 
            <div className='relative flex flex-col justify-center z-0 items-center h-96'>
              <Loader/>
              <p className='mt-6'>Uploading...</p>
            </div>
          }
          {!loading && 
            <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto">
              <div className="relative z-0 w-full mb-5 group">
                <label htmlFor="custom-file-upload" className="block text-sm font-medium text-gray-700">
                  Upload multiple files
                </label>
                <div className="flex items-center mt-2">
                  <label htmlFor="custom-file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Choose Files
                  </label>
                  <input id="custom-file-upload" type="file"  className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              {!selectedFiles.length && (
                <div className="flex flex-col items-center">
                  <p className="text-red-600 text-xs">{formik.errors.images}</p>
                  <img src="https://img.freepik.com/premium-vector/cloud-images-icon-vector-image-can-be-used-networking-data-sharing_120816-84093.jpg?w=740" alt="Upload" className="w-24 h-24 mt-4" />
                  <p className="text-blue-700 mt-2">Select Image From Choose Files</p>
                </div>
              )}


              {formik.values.images.length > 0 && !formik.errors.images && (
                <div className="mt-4">
                  <p className="font-medium">Selected Images:</p>
                  <div className="flex flex-wrap gap-4 mt-2 mb-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="w-36 h-32 border border-gray-300 rounded-md overflow-hidden">
                        <img src={URL.createObjectURL(file)} alt={`Image ${index}`} className="w-full h-full object-cover" />
                        <p className="text-xs text-center">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                  type="text"
                  name="title"
                  id="title"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label htmlFor="title" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Title *
                </label>
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-600 text-xs">{formik.errors.title}</p>
                )}
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                  name="description"
                  id="description"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label htmlFor="description" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Description *
                </label>
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-600 text-xs mb-4">{formik.errors.description}</p>
                )}
              </div>

              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </form>
          }
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddPost;

