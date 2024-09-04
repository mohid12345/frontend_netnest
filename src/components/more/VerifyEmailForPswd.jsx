import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup'
import React, { useState } from 'react'
// import { forgotOTP, forgotPassword, postResendOTP, verifyOTPForPswd } from '../../services/user/apiMethods';
import { forgotOTP, forgotPassword, postResendOTP } from '../../services/user/apiMethods';
import { toast } from 'sonner';

function VerifyEmailForPswd({onClose, handleForgotPswd}) {

  const [otpField, setOtpField] = useState(false)
  
  // verify email
  const emailInitialValues = {
    email: "",
  };
  const emailValidationSchema = Yup.object({
    email: Yup.string()
    .required("Email is required")
    .email("Invalid email address")
  });

  const handleVerifyEmail = (value, { resetForm }) => {
    console.log("email ", value);
    forgotPassword({email: value.email})
      .then((response) => {
        const data = response.data  
        toast.success(data.message)
        resetForm()
        setOtpField(!otpField)
      })
      .catch((error) => {
        toast.error(error?.message)
        console.log(error?.message);
      })
  }

  // verify otp
  const otpInitialValues = {
    otp: "",
  };
  const otpValidationSchema = Yup.object({
    otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{4}$/, "OTP must be exactly 4 digits")
    .length(4, "OTP must be exactly 4 digits"),
  });

  const handleVerifyOTP = (otp, { resetForm }) => {
    // verifyOTPForPswd(otp)
    forgotOTP(otp)
      .then((response) => {
        if(response.status === 200) {
          const data = response.data
          resetForm()
          onClose()
          handleForgotPswd()
          toast.success(data.message)
        }
      })
      .catch((error) => {
        toast.error(error?.message)
      })
  }

  // resend otp
  const handleResendOTP = (value) => {
    postResendOTP({email: value.email})
    .then((response) => {
      toast.success("OTP has been resend to " + response.data.email);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className='fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-md'>
    <div className='flex justify-center items-center h-full'>
      <div className='bg-white p-10 space-y-4 w-full max-w-lg rounded-md'>
        <div className='flex justify-between items-center'>
          {!otpField && <h2 className='font-semibold text-xl'>Verify Email</h2>}
          {otpField && <h2 className='font-semibold text-xl'>Verify OTP</h2>}
          <button onClick={onClose} className="text-gray-800 dark:text-white px-2 py-2 rounded">
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
            </svg>
          </button>
        </div>
        <span className="flex border-t border-gray-400"></span>
        <div className='max-w-md mx-auto space-y-6'>
          {!otpField && (
            <div className='py-2'>
            <Formik
              initialValues={emailInitialValues}
              validationSchema={emailValidationSchema}
              onSubmit={handleVerifyEmail}
            >
              {({ values }) => {
                const isEmailEmpty = !values.email.trim();

                return (
                  <Form>
                    <div className="relative mt-4 pb-0">
                      <div className="relative mt-4 pb-0">
                        <Field
                          name="email"
                          placeholder="Enter your email"
                          aria-label="Enter your email"
                          autoComplete="off"
                          autoCorrect="off"
                          className="block w-full rounded-2xl border border-neutral-300 bg-transparent py-3 pl-6 pr-20 text-lg text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                        />
                        <div className="absolute inset-y-1 right-1 flex justify-end">
                          <button
                            type="submit"
                            aria-label="Submit"
                            className={`flex aspect-square h-full items-center justify-center rounded-xl transition ${
                              isEmailEmpty ? 'bg-neutral-950 hover:bg-neutral-800' : 'bg-blue-500 hover:bg-blue-400'
                            } text-white`}
                            disabled={isEmailEmpty}
                          >
                            <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                              <path
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="h-4">
                        <ErrorMessage name="email" component="div" className="text-red-600 text-sm text-center" />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          )}

          {otpField && (
            <div className='py-2'>
            <Formik
              initialValues={otpInitialValues}
              validationSchema={otpValidationSchema}
              onSubmit={handleVerifyOTP}
            >
              {({ values }) => {
                const isOTPEmpty = !values.otp.trim();

                return (
                  <Form>
                    <div className="relative mt-4 pb-0">
                      <div className="relative mt-4 pb-0">
                        <Field
                          name="otp"
                          placeholder="Enter your OTP"
                          aria-label="Enter your OTP"
                          autoComplete="off"
                          autoCorrect="off"
                          className="block w-full rounded-2xl border border-neutral-300 bg-transparent text-center py-3  text-lg font-semibold text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                          // style={{ letterSpacing: '0.5rem' }}
                        />
                        <div className="absolute inset-y-1 right-1 flex justify-end">
                          <button
                            type="submit"
                            aria-label="Submit"
                            className={`flex aspect-square h-full items-center justify-center rounded-xl transition ${
                              isOTPEmpty ? 'bg-neutral-950 hover:bg-neutral-800' : 'bg-blue-500 hover:bg-blue-400'
                            } text-white`}
                            disabled={isOTPEmpty}
                          >
                            <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                              <path
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="h-4">
                        <ErrorMessage name="otp" component="div" className="text-red-600 text-sm text-center" />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default VerifyEmailForPswd