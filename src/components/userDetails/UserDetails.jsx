import React, { useEffect, useState } from 'react'
import { followUser, unFollowUser, getUserConnection, rejectFollowRequest } from '../../services/user/apiMethods';
import PostGallery from '../profile/postGallery';
import emptypost from '../../../public/images/userNoPost.jpg'
import { useSelector } from 'react-redux';
import FollowersList from '../profile/FollowersList';
import FollowingList from '../profile/FollowingList';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function UserDetails({user, connections, posts}) {
  // console.log("connetions data", connections);
  const selectUser = (state) => state.auth.user;
  const userData = useSelector(selectUser);
  const userId = userData._id || ""
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFollowRequested, setIsFollowRequested] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowingModal, setIsFollowingModal] = useState(false);
  const [isFollowersgModal, setIsFollowersgModal] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const followingUserId = user?._id
    getUserConnection({userId: followingUserId})
    .then((response) => {
      const connectionData = response.data.connection
      setFollowers(connectionData.followers)
      setFollowing(connectionData.following)
      setIsFollowed(connections.followers.includes(userId))
      setIsFollowRequested(connections.requested.includes(userId))
    })
    .catch((error) => {
      console.log(error.message);
    })
  },[])
  
  const handleFollow = () => {
    const followingUser = user._id
    followUser({userId, followingUser})
      .then((response) => {
        response.data.followed?
        setIsFollowed(true):
        setIsFollowRequested(true)
      })
      .catch((error) => {
        console.log(error.message);
      })
  }
  const handleUnFollow = () => {
    const unfollowingUser = user._id
    unFollowUser({userId, unfollowingUser})
      .then((response) => {
        console.log(response.data);
        setIsFollowed(false)
      })
      .catch((error) => {
        console.log(error.message);
      })
  }
  const handleReject = () => {
    const userId = user._id
    const requestedUser = userData._id
    rejectFollowRequest({userId, requestedUser}) 
      .then((response) => {
        console.log(response.data);
        setIsFollowRequested(false)
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  const handleFollowingModal = () => {
    {isFollowed || !user.isPrivate ? (
      setIsFollowingModal(!isFollowingModal)
    ): (
      toast.error("This account is private")
    )}
  } 
  const handleFollowersModal = () => {
    {isFollowed || !user.isPrivate ? (
      setIsFollowersgModal(!isFollowersgModal)
    ): (
      toast.error("This account is private")
    )}
  }

  const handleNavigate = (user) => {
    // console.log("to messg this user");
    if (user) {
      navigate('/chat', { state: { MessageThisUser: user } });
    } else {
      toast("Something went wrong");
    }
  };

  return (
    <div className='w-full h-screen p-4 mr-2 bg-white dark:bg-black'>
      <div className='flex w-full justify-center mb-6 lg:px-10'>
          <div className='flex bg-white dark:bg-black w-full rounded-md shadow-md dark:shadow-gray-500 relative overflow-hidden'>
            <div className='lg:flex lg:p-8 ml-4 justify-center gap-8 relative z-10 lg:mb-0 mb-2 '>
              <div className="flex lg:ml-8 ml-4 justify-center">
                <img
                  className=" lg:h-40 lg:w-40 h-36 w-36 rounded-full"
                  src={user?.profileImg}
                  alt="Profile image"
                />
              </div>
              <div className='block lg:ml-10 ml-4 lg:text-start text-center text-black dark:text-white'>
                <div className='font-semibold text-3xl pb-2'>{user?.userName}</div>
                <div className='pb-0'>{user?.name}</div>
                <div className='pb-1'>{user?.bio}</div>
                <div className='flex justify-between  mt-2 cursor-pointer lg:gap-10 lg:px-0 px-4'>
                  <div className='flex flex-col cursor-pointer items-center'>
                    <p className="font-medium text-lg">{posts?.length}</p>
                    <p className="text-sm">Posts</p>
                  </div>
                  <div
                  onClick={handleFollowersModal} 
                  className='flex flex-col cursor-pointer items-center lg:ml-0 ml-4'>
                    <p className="font-medium text-lg">{followers?.length}</p>
                    <p className="text-sm">Followers</p>
                  </div>
                  <div
                  onClick={handleFollowingModal} 
                  className='flex flex-col cursor-pointer items-center'>
                    <p className="font-medium text-lg">{following?.length}</p>
                    <p className="text-sm">Following</p>
                  </div>
                </div>  
              </div>
              <div className='flex lg:mt-0 mt-2'>
              <div>
                
                {isFollowed ? (
                <button
                onClick={handleUnFollow} 
                class="bg-neutral-950 lg:ml-10 ml-6 lg:w-32 w-28 text-neutral-400 border border-neutral-400 border-b-4 font-medium overflow-hidden relative px-4 lg:py-2 py-1 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                  <span class="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                  Following
                </button>
                ) : isFollowRequested ? (
                  <button
                onClick={handleReject} 
                class="bg-neutral-950 lg:ml-10 ml-6 lg:w-32 w-28 text-neutral-400 border border-neutral-400 border-b-4 font-medium overflow-hidden relative px-4 lg:py-2 py-1 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                  <span class="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                  Requested
                </button>
                ) : (
                //   <button 
                //   onClick={handleFollow}
                //   className='lg:bg-black lg:text-white lg:h-10 lg:w-28 py-2 px-4 rounded ml-10 items-center'>
                //     Follow
                // </button>
                  
                <button
                onClick={handleFollow} 
                class="bg-neutral-950 lg:ml-10 ml-6 lg:w-32 w-28 text-neutral-400 border border-neutral-400 border-b-4 font-medium overflow-hidden relative px-4 lg:py-2 py-1 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                  <span class="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                  Follow
                </button>
                )}
              </div>
              <div>
                {/* <button className='lg:bg-black lg:text-white lg:h-10 lg:w-28 py-2 px-4 rounded ml-8 items-center'>
                  Message
                </button> */}

                <button 
                  onClick={() => handleNavigate(user)}
                  class="bg-neutral-950 lg:ml-10 ml-6 lg:w-32 w-28 text-neutral-400 border border-neutral-400 border-b-4 font-medium overflow-hidden relative px-4 lg:py-2 py-1 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                  <span class="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                  Message
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>

      {!isFollowed && user?.isPrivate ? (
        <div className='flex flex-col justify-center items-center mt-0 left-10 fixed text-black w-full h-auto '>
          <div className='flex items-center gap-2'>
            <svg class="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clipRule="evenodd"/>
            </svg>
            <span>
              <p className='font-semibold'>This account is private</p>
              <p>Follow to see their photos and videos.</p>
            </span>
          </div>
      </div>
      ): (
        <div>
          {posts?.length === 0? (
            <div className='flex flex-col justify-center items-center mt-0 left-10 fixed text-black w-full h-auto '>
              <p>Empty post</p>
              <img className='w-96' src={emptypost} alt="" />
            </div>
            ) : (
            <div className='w-full mt-5  rounded-md  bg-white dark:bg-black flex justify-center'>
              <div className='w-full'>
              <div className='flex justify-between px-10  gap-10 p-2 font-normal text-lg'>
                <div className='bg-white dark:bg-black dark:text-white w-full text-center h-10 flex items-center justify-center rounded hover:shadow-md border-b border-gray-400'>
                  <button>Posts</button>
                </div>
                {/* <div className='bg-white w-full text-center h-10 flex items-center justify-center rounded hover:shadow-md border-b border-gray-400'>
                  <button>Saved</button>
                </div> */}
              </div>
            
              <div className='grid grid-cols-2 md:grid-cols-3 gap-5 bg-white dark:bg-black p-2 lg:px-10'>
                {
                  posts.map((post) => (
                    <div key={post._id}>
                      <PostGallery post={post}/> 
                    </div>
                  ))
                }
              </div>
              </div>
            </div>
          )}
        </div>
      )}            
      

        {isFollowersgModal && <FollowersList 
        followers={followers}
        followingUsers={following}
        setFollowingUsers={setFollowing}
        onClose={handleFollowersModal} /> }

        {isFollowingModal && <FollowingList 
        currentUser={userId}
        followingUsers={following}
        setFollowingUsers={setFollowing}
        onClose={handleFollowingModal} />}

    </div>
  )
}

export default UserDetails