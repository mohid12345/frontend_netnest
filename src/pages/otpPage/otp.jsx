import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { postOTP, postResendOTP } from '../../services/user/apiMethods'
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../utils/context/reducers/authSlice';



function Otp() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [getOtp, setOtp] = useState("")

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const initialTimer = parseInt(localStorage.getItem("otpTimer") || "60")
  const [timer, setTimer] = useState(initialTimer)
  const [resend, setResend] = useState(false)

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if(timer > 0) {
        setTimer(timer - 1);
        localStorage.setItem("otpTimer", (timer-1).toString)
      } else{
        clearInterval(countdownInterval)
        setResend(true)
        toast.error("Time expired please resend OTP")
      }
    }, 1000);
    return () => clearInterval(countdownInterval)
  },[timer])

  const startResendTimer = () => {
    setResend(false)
    setTimer(60)
    localStorage.setItem("otpTimer", "60")
  }

  const handleResendOTP = () => { 
    startResendTimer()
    setOtp("")
    postResendOTP({email: email})
      .then((response) => {
        toast.success("OTP has been resend to " + response.data.email);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const otp = getOtp || ""
    console.log("otp in :", otp );
    if(otp.trim().length !==4 || otp == "") {
      // toast.error("invalid OTP")
      return
    }

    postOTP({otp: otp}) 
      .then((response) => {
        console.log("In response 1z:", response);
        const data = response.data
        console.log("In response 2z:", data);
        
        if(response.status == 200) {
          toast.success(data.message)
          localStorage.removeItem("otpTimer");
          dispatch(loginSuccess({user: data}))
              navigate('/')
        } else {
          toast.error(data.message)
        }
      })
      .catch((error) => {
        toast.error(error?.message)
      })
  }

  return (
    <div className='flex  justify-center h-screen bg-white'>
      {/* left side */}
      <div className='flex items-center justify-center md:w-1/2 flex-col md:flex-row hover:scale-105 transition-transform duration-500'>
        <div className='max-w-md w-full p-8 shadow-lg'>
          <h2 className='text-2xl font-semibold text-start mb-2'>Enter Your OTP</h2>
          <h2 className=' text-start mb-6'>OTP has been send to your email</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <input type="text" 
                value={getOtp}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded-xl py-2 px-2 text-2xl text-center focus:outline-none focus:border-blue-500"
                autoComplete="off'
              />
            </div>

            {/* <div className='flex px-2 items-center justify-between mb-4'>
              <div className='w-full flex justify-between'>
                <div className='w-4/12 border py-1.5 px-4  flex justify-center'>
                  Timer
                </div>
                <div className='w-4/12'>
                  <button 
                    onClick={handleResendOTP}
                    className=' hover:font-semibold hover:text-blue-700 hover:shadow-md border py-1.5 px-4 rounded'>
                      Resend OTP
                  </button>
                </div>
              </div>
            </div> */}

            <div className="flex justify-between mb-4  items-center ">
              <div className="flex gap-2  items-center">
                {!resend ? (
                  <p className="text-s text-grey-600">
                    OTP expires in{" "}
                    <span className="text-blue-600 text-lg">{timer}</span>{" "}
                    seconds
                  </p>
                ) : (
                  ""
                )}
              </div>

              {resend ? (
                <button 
                onClick={handleResendOTP}
                className=' hover:text-red-600 hover:underline'>
                  Resend OTP
              </button>
              ) : (
                ""
              )}
            </div>

            <button 
            type='submit'
            className='w-full bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline'
            >Verify</button>
          </form>
        </div>
      </div>
      {/* right side */}
      <div className='hidden md:flex md:w-1/2 items-center bg-white'>
        <div className='p-20'>
          {/* <img className='w-full p-20 hover:scale-105 transition-transform duration-500' src={otpImg} alt="" /> */}
        </div>
      </div>
    </div>
  )
}

export default Otp