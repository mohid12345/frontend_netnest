import React, { useState } from 'react'
import { logout } from '../../utils/context/reducers/authSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

function Settings({onClose}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
   // logout
   const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("email")
    toast.info("Logout succussfull")
    navigate('/login')
  }

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState();

  const handleToggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  const handleLinkClick = () => {
    navigate('/more')
    onClose()
  }


  return (
    <div className='fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-md'>
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white p-10 space-y-4 w-full max-w-xl rounded-md'>
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold text-xl'>Settings</h2>
            <button onClick={onClose} className="text-gray-800 dark:text-white px-2 py-2 rounded">
              <svg className="w-6 h-6 text-black dark:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
            </button>
          </div>

          <span className="flex border-t border-gray-400"></span>

          <div className='max-w-md mx-auto space-y-6'>
            
            {/* Toggle Notifications */}
            {/* <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-black">Enable Notifications</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isNotificationsEnabled}
                  onChange={handleToggleNotifications}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-black peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div> */}

            {/* Change Password */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-black">Change Password</span>
              <button onClick={handleLinkClick}  className="text-blue-600 hover:text-blue-800">Change</button>
            </div>

            {/* Logout Button */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-black">Logout</span>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-700">Logout</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings