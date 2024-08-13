import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { followUser, getUserConnection, rejectFollowRequest, unFollowUser } from '../../services/user/apiMethods'

function LikedUsers({likedUsers, onClose}) {
  const selectUser = (state) => state.auth.user
  const user = useSelector(selectUser)
  const userId = user._id || ''
  const [following, setFollowing] = useState([]);
  const [requested, setRequested] = useState([]);

  useEffect(() => {
    getUserConnection({userId})
      .then((response) => {
        const connectionData = response.data.connection
        const followingIds = connectionData.following.map((user) => user._id)
        console.log("following ids", followingIds);
        setFollowing(followingIds)
        const requestedIds = connectionData.requestSent.map((user) => user._id);
        setRequested(requestedIds);
      })
      .catch((error) => {
        console.log(error.message);
      });
  },[])

  const handleFollow = (likedUserId) => {
    followUser({userId, followingUser: likedUserId})
      .then((response) => {
        if(response.data.followed) {
          setFollowing([...following, likedUserId])
        } else {
          setRequested((prevRequested) => [...prevRequested, likedUserId])
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const handleUnFollow = (likedUserId) => {
    unFollowUser({userId, unfollowingUser:likedUserId})
      .then((response) => {
        setFollowing(following.filter((userId) => userId !== likedUserId))
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const hadleReject = (likedUserId) => {
    rejectFollowRequest({userId, requestedUser: likedUserId}) 
      .then((response) => {
        setRequested(requested.filter((userid) => userid !== likedUserId))
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const isFollowing = (likedUserId) => {
    return following.includes(likedUserId)
  }
  const isRequested = (likedUserId) => {
    return requested.includes(likedUserId)
  }
  return (
    <div className='fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-md'>
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white px-10 py-8 space-y-4 w-full max-w-md mx-auto rounded-md'>
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold text-xl'>Liked Users</h2>
            <button onClick={onClose} className="text-gray-800 dark:text-white px-2 py-2 rounded">
              <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>
            </button>
          </div>
          <hr className="border-t-2 border-gray-200" />
          <div className='space-y-4'>
            {likedUsers.map((user) => (
              <div>
                <div key={user.id} className='flex justify-between items-center'>
                  <Link
                    to={user._id === userId
                      ? "/profile"
                      : `/user-profile/${user._id}`
                    }
                    className='flex items-center cursor-pointer'>
                    <div className="flex items-center justify-center bg-white rounded-full w-10 h-10 overflow-hidden">
                      <img className='rounded-full object-cover w-full h-full' src={user.profileImg} alt={user.userName} />
                    </div>
                    <div className='ml-4'>
                      <p className='text-black font-medium'>{user.userName}</p>
                      {console.log("liked usrname", user.userName)}
                      <p className='text-gray-500 text-sm'>{user.name}</p>
                    </div>
                  </Link>

                  {userId !== user._id && (
                    <div>
                      {!isFollowing(user._id) && !isRequested(user._id) && (
                      <button 
                      onClick={() => handleFollow(user._id)}
                      className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 lg:w-24 rounded-md'>
                      Follow
                      </button>
                      )}
                      {isFollowing(user._id) && (
                        <button
                        onClick={() => handleUnFollow(user._id)} 
                        className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 lg:w-24 rounded-md'>
                        Following  
                      </button>
                      )}
                      {isRequested(user._id) && (
                        <button
                        onClick={() => hadleReject(user._id) } 
                        className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 lg:w-24 rounded-md'>
                        Requested
                      </button>
                      )}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LikedUsers