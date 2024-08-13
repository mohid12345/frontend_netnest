import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

function UsersGallery({user}) {
  const selectedUser = (state) => state.auth.user;
  const userData = useSelector(selectedUser);
  const userDataId = userData._id;

  return (
    // <div style={{width: '360px'}}>
    //   <div className="w-full group before:hover:scale-95 before:hover:h-72 before:hover:w-80 before:hover:h-44 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-sky-200 via-orange-100 to-slate-200 before:absolute before:top-0 w-80 h-72 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden">
    //     <div className="w-28 h-28 bg-blue-700 mt-8 rounded-full border-4 border-slate-50 z-10 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500 relative overflow-hidden">
    //       <img src={user.profileImg} alt="Profile" className="w-full h-full object-cover rounded-full transition-opacity duration-500 group-hover:opacity-0" />
    //     </div>
    //     <div className="z-10 group-hover:-translate-y-10 transition-all duration-500">
    //       <span className="text-2xl font-semibold">{user.userName}</span>
    //       <p>{user.name}</p>
    //     </div>
    //     <Link 
    //       to={user._id === userDataId
    //         ? "/profile"
    //         : `/user-profile/${user._id}`
    //       }
    //       className="bg-blue-700 px-4 py-1 text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-blue-500" href="#">
    //       View Profile
    //     </Link>
    //   </div>
    // </div>

    <div >
      <div className="lg:w-full w-10/12 group before:hover:scale-95 before:hover:h-80 before:hover:w-80 before:hover:h-44 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-20 before:rounded-t-2xl before:bg-gradient-to-bl from-sky-200 via-orange-100 to-slate-200 before:absolute before:top-0  h-64 relative bg-slate-50 flex dark:bg-gray-200 flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden">
        <div className="w-24 h-24 bg-blue-700 mt-8 rounded-full border-4 border-slate-50 z-10 relative overflow-hidden">
          <img src={user.profileImg} alt="Profile" className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-95" />
        </div>
        <div className="z-10 ">
          <span className="text-xl font-semibold">{user.userName}</span>
          <p>{user.name}</p>
          <div className="flex justify-center gap-4 mt-0">
            <div className='flex items-center'>
              <span className="font-semibold">{user.followersCount}</span>
              <p className="text-sm text-gray-600 pl-2">Followers</p>
            </div>
            <div className='flex items-center'>
              <span className="font-semibold">{user.followingCount}</span>
              <p className="text-sm text-gray-600 pl-2">Following</p>
            </div>
          </div>
        </div>
        <Link 
          to={user._id === userDataId
            ? "/profile"
            : `/user-profile/${user._id}`}
          className="bg-blue-700 px-4 py-0 mb-2  text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-blue-500" href="#">
          View Profile
        </Link>
      </div>
    </div>
  )
}

export default UsersGallery