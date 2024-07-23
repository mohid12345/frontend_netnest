import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../utils/context/reducers/authSlice'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import PostGallery from '../../components/profile/postGallery'
import emptypost from '../../../public/images/nopost.jpg'
import Loader from '../../components/loader/loader'


function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedUser = (state) => state.auth.user;
  const selectPosts = (state) => state.auth.posts;
  const user = useSelector(selectedUser);
  const userId = user._id;
  const posts =  useSelector(selectPosts) || []

  const [loading, setLoading] = useState(false);
  const [savedPost, setSavedPost] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [IsEditProfileOpen, SetEditProfileOpen] = useState(false)
  const [isFollowingModal, setIsFollowingModal] = useState(false);
  const [isFollowersgModal, setIsFollowersgModal] = useState(false);
  const [currentView, setCurrentView] = useState('posts');
  const userimg = user.profileImg

  const handleEditModal = () => {
    SetEditProfileOpen(!IsEditProfileOpen)
  }
  const handleFollowingModal = () => {
    setIsFollowingModal(!isFollowingModal)
  } 
  const handleFollowersModal = () => {
    setIsFollowersgModal(!isFollowersgModal)
  }


  // logout
  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("email")
    toast.info("Logout succussfull")
    navigate('/login')
  }

  return (
      <div className='w-full p-4 mr-2'>
        {loading && <Loader/> }
        {!loading && 
        <div>
          <div className='flex w-full justify-center mb-6'>
            <div className='flex bg-white w-full rounded-md shadow-md'>
              <div className='lg:flex lg:p-8 ml-4 justify-center gap-8'>
                <div className="flex lg:ml-8 justify-center">
                  <img
                    className=" h-40 w-40 rounded-full"
                    src={userimg}
                    alt=""
                  />
                </div>
                <div className='block ml-10'>
                  <div className='font-semibold text-3xl pb-2'>{user.userName}</div>
                  <div className='pb-0'>{user.name}</div>
                  <div className='pb-1'>{user.bio}</div>
                  <div className='flex justify-between  mt-2 cursor-pointer'>
                    <div className='flex flex-col cursor-pointer items-center'>
                      <p className="font-medium text-lg">{posts.length}</p>
                      <p className="text-sm">Posts</p>
                    </div>
                    <div 
                    onClick={handleFollowersModal}
                    className='flex flex-col cursor-pointer items-center'>
                      <p className="font-medium text-lg">{followers.length}</p>
                      <p className="text-sm">Followers</p>
                    </div>
                    <div 
                    onClick={handleFollowingModal}
                    className='flex flex-col cursor-pointer items-center'>
                      <p className="font-medium text-lg">{following.length}</p>
                      <p className="text-sm">Following</p>
                    </div>
                  </div>  
                </div>
                <div className='flex lg:ml-4'>
                <div>
                  <button 
                  onClick={handleEditModal}
                  // className='lg:bg-black lg:text-white lg:h-10 lg:w-28 py-2 px-4 rounded ml-10 '>
                  class="bg-neutral-950 ml-10 lg:w-32 text-neutral-400 border border-neutral-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                    <span class="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Edit Profile
                  </button>
                </div>
                <div>
                  <button 
                  onClick={handleLogout}
                  // className=' lg:bg-black lg:text-white lg:h-10 lg:w-28 py-2 px-4 rounded ml-10 '>
                  class="bg-neutral-950 ml-10 lg:w-32 text-neutral-400 border border-neutral-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                    <span class="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Logout
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>
          
          
          <div className='w-full mt-5 rounded-md bg-white'>
            <div className='flex justify-between px-10 gap-10 p-2 font-normal text-lg'>
              <div
                className={`bg-white w-full text-center h-10 flex items-center justify-center rounded hover:shadow-md border-b border-gray-400 ${
                  currentView === 'posts' ? 'border-b-2 border-blue-500' : ''
                }`}
              >
                <button onClick={() => setCurrentView('posts')}>Posts</button>
              </div>
              <div
                className={`bg-white w-full text-center h-10 flex items-center justify-center rounded hover:shadow-md border-b border-gray-400 ${
                  currentView === 'saved' ? 'border-b-2 border-blue-500' : ''
                }`}
              >
                <button onClick={() => setCurrentView('saved')}>Saved</button>
              </div>
            </div>

            {currentView === 'posts' ? (
              posts.length === 0 ? (
                <div className='flex flex-col justify-center items-center mt-4 text-black w-full h-auto'>
                  <img className='w-96' src={emptypost} alt="" />
                  <p>Create your first post.</p>
                </div>
              ) : (
                <div className='grid grid-cols-2 md:grid-cols-3 gap-5 bg-white p-2'>
                  {posts.map((post) => (
                    <div key={post._id}>
                      <PostGallery post={post} />
                    </div>
                  ))}
                </div>
              )
            ) : savedPost.length === 0 ? (
              <div className='flex flex-col justify-center items-center mt-4 text-black w-full h-auto'>
                <img className='w-96' src={emptypost} alt="" />
                <p>No saved post</p>
              </div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-5 bg-white p-2'>
                {savedPost.map((post) => (
                  <div key={post._id}>
                    <PostGallery post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        }
      </div>
  )
}


export default Profile