import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import loginimage from "../../../../public/images/adminLoginImg.png"
import { initialValues, validationSchema } from '../../../utils/validations/loginValidation';
import { toast } from "sonner";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminPostLogin } from '../../../services/admin/apiMethods';
import { AdminLoginSuccess } from '../../../utils/context/reducers/adminAuthSlice';


function AdminLogin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const selectAdmin = (state) => state.adminAuth.admin
  const admin = useSelector(selectAdmin)
  useEffect(() => {
    if(admin) {
      navigate("/admin")
    }
  },[admin, navigate])

  const submit = (values) => {
    adminPostLogin(values)
      .then((respone) => {
        const data = respone.data
        console.log(data);
        if(respone.status == 200) {
          toast.success(data.message)
          dispatch(AdminLoginSuccess({admin: data}))
          navigate('/admin/')
        } else {
          console.log(respone.error);
          toast.error(data.message);
        }
      })
      .catch((error) => {
         console.log(error?.message);
         toast.error(error?.message);
      })
  }

  return (
    <div className="flex flex-col md:flex-row justify-center bg-white h-screen">
      {/* Left side: Login form */}
      <div className="flex items-center justify-center md:w-1/2 ">
        <div className="max-w-md w-full p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>

          <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submit}
            >
            <Form>
              <div className="mb-4">
                <label className="block text-gray-500 text-xs font-semibold mb-2" htmlFor="email">Email</label>
                <Field 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="email" name="email" type="email" placeholder="Enter your email" autoComplete="off" />
                <ErrorMessage name="email" component="div" className="text-red-600 text-xs" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-500 text-xs font-semibold mb-2" htmlFor="password">Password</label>
                <Field 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" 
                id="password" name="password" type="password" placeholder="Enter your password" autoComplete="off" />
                <ErrorMessage name="password" component="div" className="text-red-600 text-xs" />
              </div>
              {/* signIn button */}
              <div className="flex items-center justify-between mb-3">
                <button 
                className="w-full bg-gray-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="submit">Sign In</button>
              </div>
            </Form>
          </Formik>

        </div>
      </div>
      {/* Right side: Image */}
      <div className='hidden md:flex md:w-1/2 items-center bg-white'>
        <div className='p-14'>
          <img className='w-full p-10' src={loginimage} alt="" />
        </div>
      </div>
    </div>
  );
}

export default AdminLogin