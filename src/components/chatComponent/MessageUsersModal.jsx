import React from 'react'
import { Link } from 'react-router-dom'
import { addConversation } from '../../services/user/apiMethods1'

function MessageUsersModal({
  user,
  setMessageUsersModal,
  chatEligibleUsers,
  conversations,
  setConversations,
  setCurrentChat,
  handleMessage,
}) {

  const userId = user._id

  return (
    <div className='fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-40 backdrop-blur-md'>
    <div className='flex justify-center items-center h-full'>
      <div className='bg-white p-8 space-y-4 w-full   max-w-md rounded-md'>
        <div className='flex justify-between items-center'>
          <h2 className='font-semibold text-xl'>New Message</h2>
          
          <button onClick={() => setMessageUsersModal(false)} className="text-gray-800 dark:text-white px-2 py-2 rounded">
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
            </svg>
          </button>
        </div>

        <span className="flex border-t border-gray-400"></span>

        <div className='h-64 overflow-y-auto px-2'>
          {chatEligibleUsers?.map((user) => (
            <div key={user.id} className='flex justify-between items-center mb-4'>
              <Link
                to={user._id === userId
                  ? "/profile"
                  : `/user-profile/${user._id}`
                }
                className='flex items-center cursor-pointer'>
                <div className="flex items-center justify-center bg-white rounded-full w-12 h-12 overflow-hidden">
                  <img className='rounded-full object-cover w-full h-full' src={user.profileImg} alt={user.userName} />
                </div>
                <div className='ml-4'>
                  <p className='text-black font-medium'>{user.userName}</p>
                  <p className='text-gray-500 text-sm'>{user.name}</p>
                </div>
              </Link>

              {userId !== user._id && (
                <div> 
                  <button 
                    onClick={() => {handleMessage(user)}}
                    className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 lg:w-24 rounded-md'>
                    Message
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  </div>
  )
}

export default MessageUsersModal