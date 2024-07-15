import React from 'react'
import * as Yup from "yup";
import { toast } from "sonner";
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { renewPassword } from '../../services/user/apiMethods';
// import resetpswdImg from "../../../public/images/resetpswdImg.jpg"
import { initialValues, validationSchema } from '../../utils/validations/renewPasswordValidation';

function RenewPassword() {  
  const navigate = useNavigate()
  
  const submit = (values) => {
    renewPassword(values) 
      .then((response) => {
        toast.success(response?.data?.message)
        navigate('/login')
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  return (
    <div className="flex flex-col md:flex-row justify-center bg-white h-screen">
      {/* Left side: Login form */}
      <div className="flex items-center justify-center md:w-1/2 ">
        <div className="max-w-md w-full p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>

          <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submit}
            >
            <Form>
              {/* <div className="mb-3">
                <label className="block text-gray-500 text-xs font-semibold mb-2" htmlFor="password">New Password</label>
                <Field 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                id="password" name="password" type="password" placeholder="Enter your password" autoComplete="off" />
                <ErrorMessage name="password" component="div" className="text-red-600 text-xs" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-500 text-xs font-semibold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                <Field 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password" autoComplete="off" />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-xs" />
              </div> */}

              <div className="relative z-0 w-full mb-4 group">
                <Field 
                  type="password" 
                  name="password" 
                  id="password" 
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                  placeholder=" " 
                  autoComplete="off" // Add this line
                />
                <label 
                  htmlFor="password" 
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Password
                </label>
                <ErrorMessage name="password" component="div" className="text-red-600 text-xs" />
              </div>
              <div className="relative z-0 w-full mb-8 group">
                <Field 
                  type="password" 
                  name="confirmPassword" 
                  id="confirmPassword" 
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                  placeholder=" " 
                  autoComplete="off" // Add this line
                />
                <label 
                  htmlFor="password" 
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Confim Password
                </label>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-xs" />
              </div>
              {/* signIn button */}
              <div className="flex items-center justify-between mb-6">
                <button 
                className="w-full bg-gray-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="submit">Update</button>
              </div>
            </Form>
          </Formik>

          <div className="text-center mt-4">
            Get back to login?{' '}
            <Link to="/login" className="hover:text-blue-700 text-gray-800 font-semibold py-1 px-1 rounded focus:outline-none focus:shadow-outline">
              Click here
            </Link>
          </div>
        </div>
      </div>
      {/* Right side: Image */}
      <div className='hidden md:flex md:w-1/2 items-center bg-white'>
        <div className='p-20'>
          <img className='w-full p-20 hover:scale-105 transition-transform duration-500' src={resetpswdImg} alt="" />
        </div>
      </div>
    </div>
  );
}

export default RenewPassword