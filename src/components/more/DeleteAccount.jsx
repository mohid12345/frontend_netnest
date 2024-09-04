import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../../services/user/apiMethods';
import { logout } from '../../utils/context/reducers/authSlice';
import { toast } from 'sonner';

function DeleteAccount({onClose, user}) {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const submitDeleteAccount = () => {
    const userId = user._id
    deleteAccount({userId})
      .then((response) => {
        handleLogout()
      })
  }

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("email")
    toast.info("Your account has been deleted")
    navigate('/login')
  }

  return (
    <div className='fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-md'>
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white p-10 space-y-4 w-full max-w-xl rounded-md'>
          <div className='flex justify-between items-center'>
            <h2 className='font-medium text-xl'>Delete {user?.userName}/Account</h2>
            <button onClick={onClose} className="text-gray-800 dark:text-white px-2 py-2 rounded">
              <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
            </button>
          </div>  

          <span className="flex border-t border-gray-400"></span>

          <div className='max-w-md mx-auto space-y-4'>

            {/* deleting accoun */}
            <div className="flex flex-col items-center justify-center mt-8">
              <p className="inline-flex items-center text-xs rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-0 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {/* Delete your Account */}
              </p>
              <p className="py-2 text-lg font-semibold text-gray-600">{user.userName}</p>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <p className="py-2 text-lg font-normal text-gray-600">To confirm, type "{user.userName}" in the box below</p>
              <div className="relative max-w-96 flex overflow-hidden rounded-md border-2 transition focus-within:border-green-600">
                <input
                  type="text"
                  id="deleteAccount"
                  name="deleteAccount"
                  value={inputValue}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-96 max-w-96 flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Enter your username"
                />
              </div>
              {inputValue === user.userName ? ( 
                <button
                onClick={submitDeleteAccount} 
                className='relative max-w-96 w-96 py-2 px-2 justify-center flex rounded-md border-2 mt-4 bg-red-700 text-white '>
                Delete Account
              </button>
              ) : (
                <button className='relative max-w-96 w-96 py-2 px-2 justify-center flex rounded-md border-2 mt-4 bg-red-500'>
                Delete Account
              </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccount