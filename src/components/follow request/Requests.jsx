import React from 'react'
import { Link } from 'react-router-dom';

function Requests({ user, request, handleAcceptRequest, handleReject }) {
  console.log("request to follow",request);
  return (
    <div className='w-full py-2 mt-4 bg-gray-50 dark:bg-black rounded shadow flex items-center hover:bg-gray-100 dark:hover:bg-slate-800'>

      <Link 
        to={user._id === request._id
          ? "/profile"
          : `/user-profile/${request._id}`}
        tabIndex="0" 
        aria-label="group icon" 
        role="img" 
        className="focus:outline-none w-14 h-12 border rounded-full border-gray-200 dark:border-black flex items-center justify-center cursor-pointer ml-2">
        <img 
          className='focus:outline-none w-12 h-12 border rounded-full border-gray-200 flex items-center justify-center' 
          src={request.profileImg} 
          alt="" 
        />
      </Link>

      <div className="pl-3 w-full">
        <div className="flex items-center justify-between w-full cursor-pointer text-black dark:text-white">
          <div>
            <p tabIndex="0" className="focus:outline-none text-sm leading-none">
              <Link 
                to={user._id === request._id
                  ? "/profile"
                  : `/user-profile/${request._id}`}
                className="text-blue-700">
                <span className='font-semibold'>{request.userName}</span>
              </Link> requested to follow
            </p>
            {/* <p className='text-sm'>{request.name}</p> */}
            <span className='flex justify-center gap-4 mt-2'>
              <button onClick={() => {handleAcceptRequest(request._id)}} className='bg-blue-500 px-4 py-1 text-white text-sm rounded-md'>Confirm</button>
              <button onClick={() => {handleReject(request._id)}} className='bg-gray-800 px-4 py-1 text-white text-sm rounded-md'>Delete</button>
            </span>
          </div>
        </div>
        
      </div>  

    </div>
  )
}

export default Requests