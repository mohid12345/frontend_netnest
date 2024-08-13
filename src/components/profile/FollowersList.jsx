import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { followUser, getUserConnection, rejectFollowRequest, unFollowUser } from '../../services/user/apiMethods';
import { Link, useNavigate } from 'react-router-dom';

function FollowersList(
{onClose, followers, followingUsers, setFollowingUsers}
) {

  const navigate = useNavigate()
  const selectUser = (state) => state.auth.user;
  const user = useSelector(selectUser);
  const userId = user._id || "";
  const [following, setFollowing] = useState([]);
  const [requested, setRequested] = useState([]);

  useEffect(() => {
    console.log("in useeffect");
    getUserConnection({userId})
      .then((response) => {
        // console.log(response);
        const connectionData = response.data.connection
        console.log("following connection data", connectionData.following);
        setFollowing(connectionData.following);
        setRequested(connectionData.requestSent);
      })
      .catch((error) => {
        console.log(error.message);
      });
  },[])

  const handleFollow = (selectedUserId) => {
    followUser({userId, followingUser: selectedUserId})
      .then((response) => {
        if(response.data.followed) {
          const followedUser = followers.find((user) => user._id === selectedUserId)
          setFollowing([...following, followedUser])
          setFollowingUsers([...followingUsers, followedUser])
        } else {
          setRequested([...requested, selectedUserId])
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const handleUnFollow = (selectedUserId) => {
    unFollowUser({userId, unfollowingUser: selectedUserId})
      .then((response) => {
        setFollowing(following.filter((user) => user._id !== selectedUserId))
        setFollowingUsers(followingUsers.filter((user) => user._id !== selectedUserId))
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const hadleReject = (selectedUserId) => {
    rejectFollowRequest({userId, requestedUser: selectedUserId}) 
      .then((response) => {
        setRequested(requested.filter((userid) => userid !== selectedUserId))
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const isFollowing = (selectedUserId) => {
    // return following.includes(selectedUserId)
    
    return following.some((user) => user._id === selectedUserId)
  }
  const isRequested = (selectedUserId) => {
    return requested?.includes(selectedUserId)
  }

  return (
    <div className='fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-md'>
  <div className='flex justify-center items-center h-full'>
    <div className='bg-white p-8 w-full max-w-md mx-auto rounded-md'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='font-semibold text-xl'>Followers</h2>
        <button onClick={onClose} className="text-gray-800 dark:text-white px-2 py-2 rounded">
          <svg className="w-6 h-6 dark:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
          </svg>
        </button>
      </div>
      <hr className="border-t-2 border-gray-200 mb-4" />
      <div className='h-64 overflow-y-auto px-2'>
        <div className='space-y-4'>
          {followers.map((user) => (
            <div key={user.id} className='flex justify-between items-center'>
              <Link
                to={user._id === userId ? "/profile" : `/user-profile/${user._id}`}
                className='flex items-center cursor-pointer'
              >
                <div className="flex items-center justify-center bg-white rounded-full w-10 h-10 overflow-hidden">
                  <img className='rounded-full object-cover w-full h-full' src={user.profileImg} alt={user.userName} />
                </div>
                <div className='ml-4'>
                  <p className='text-black font-medium'>{user.userName}</p>
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
                      onClick={() => hadleReject(user._id)} 
                      className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 lg:w-24 rounded-md'>
                      Requested
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default FollowersList