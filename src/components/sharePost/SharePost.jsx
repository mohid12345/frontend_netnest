import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getChatElibleUsers, getUserSearch } from '../../services/user/apiMethods'
import { Forward, Share2 } from 'lucide-react'
import Chat from '../../pages/chat/Chat'
import { toast } from 'sonner'

function SharePost({onClose, post}) {

  const selectedUser = (state) => state.auth.user
  const userData = useSelector(selectedUser)
  const userId = userData._id
  const [users, setUsers] = useState([])
  const [shareUsers, setShareUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [chatEligibleUsers, setChatEligibleUsers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    // const userId = user._id
    getChatElibleUsers({userId})
      .then((response) => {
        setChatEligibleUsers(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  },[])

  useEffect(() => {
    if (searchQuery.length >= 2) { 
      getUserSearch({searchQuery: searchQuery})
       .then((response) => {
          setUsers(response.data.suggestedUsers);
        })
       .catch((error) => {
          console.error(error.message);
        });
    } else {
      setUsers([])
    }
  }, [searchQuery, setSearchQuery]); 

  const searchUser = (event) => {
    setSearchQuery(event.target.value); 
  };

  const handleNavigate = (user) => {
    if (user && post) {
      navigate('/chat', { state: { shareUser: user, sharePost: post } });
      onClose();
    } else {
      toast("Unable to share the post");
      onClose();
    }
  };

  return (
    <div className='fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-md'>
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white px-10 pt-4 pb-8 space-y-2 w-full h-max max-w-md mx-auto rounded-md'>
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold text-xl'>Share Post</h2>
            <button onClick={onClose} className="text-gray-800 dark:text-white px-2 py-2 rounded">
              <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>
            </button>
          </div>
          <hr className="border-t-2 border-gray-200" />

          <div className="flex justify-center items-start h-14 mx-0">
            <input 
              onChange={searchUser} 
              type="text" 
              placeholder="To..." 
              className="w-full max-w-md p-2 lg:mr-0  border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0" 
            />
          </div>
          
          <div className='h-72 w-96 overflow-y-auto px-2'>
            {searchQuery == 0 ? (
              <div className='space-y-4 pt-2'>
                {chatEligibleUsers.map((user) => (
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
                        <div
                              class="flex justify-center items-center border-2 border-radius border-white-200 overflow-hidden p-1 rounded-full shadow-lg"
                            >
                              <button
                                onClick={() => handleNavigate(user)}
                                class="bg-[linear-gradient(#e9e9e9,#e9e9e9_50%,#fff)] group w-28 h-10 inline-flex transition-all duration-300 overflow-visible p-1 rounded-full group"
                              >
                                <div
                                  class="w-full h-full bg-[linear-gradient(to_top,#ececec,#fff)] overflow-hidden shadow-[0_0_1px_rgba(0,0,0,0.07),0_0_1px_rgba(0,0,0,0.05),0_3px_3px_rgba(0,0,0,0.25),0_1px_3px_rgba(0,0,0,0.12)] p-1 rounded-full hover:shadow-none duration-300"
                                >
                                  <div
                                    class="w-full h-full text-xl gap-x-0.5 gap-y-0.5 justify-center text-[#101010] bg-[linear-gradient(#f4f4f4,#fefefe)] group-hover:bg-[linear-gradient(#e2e2e2,#fefefe)] duration-200 items-center text-[18px] font-medium gap-4 inline-flex overflow-hidden px-4 py-2 rounded-full black group-hover:text-blue-600"
                                  >
                                    <Share2 size={14}/>
                                    <span class="ml-2 text-sm">Share</span>
                                  </div>
                                </div>
                              </button>
                            </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ): (
              <div className='space-y-4 pt-2 overflow-y-auto'>
                {users.length > 0 ? (
                  <div className='space-y-4 pt-2'>
                    {users.map((user) => (
                      <div key={user.id} className='flex justify-between items-center'>
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
                            {/* <button 
                              onClick={() => handleNavigate(user)}
                              className='flex justify-center text-md items-center text-center bg-gray-400 hover:bg-gray-500 rounded-md text-white relative font-bold font-sans overflow-hidden px-4 py-1 lg:w-24'>
                              <p className='mb-0'>Send</p> <Forward size={'20px'} className='ml-1' /> 
                            </button> */}

                            <div
                              class="flex justify-center items-center border-2 border-radius border-white-200 overflow-hidden p-1 rounded-full shadow-lg"
                            >
                              <button
                                onClick={() => handleNavigate(user)}
                                class="bg-[linear-gradient(#e9e9e9,#e9e9e9_50%,#fff)] group w-28 h-10 inline-flex transition-all duration-300 overflow-visible p-1 rounded-full group"
                              >
                                <div
                                  class="w-full h-full bg-[linear-gradient(to_top,#ececec,#fff)] overflow-hidden shadow-[0_0_1px_rgba(0,0,0,0.07),0_0_1px_rgba(0,0,0,0.05),0_3px_3px_rgba(0,0,0,0.25),0_1px_3px_rgba(0,0,0,0.12)] p-1 rounded-full hover:shadow-none duration-300"
                                >
                                  <div
                                    class="w-full h-full text-xl gap-x-0.5 gap-y-0.5 justify-center text-[#101010] bg-[linear-gradient(#f4f4f4,#fefefe)] group-hover:bg-[linear-gradient(#e2e2e2,#fefefe)] duration-200 items-center text-[18px] font-medium gap-4 inline-flex overflow-hidden px-4 py-2 rounded-full black group-hover:text-blue-600"
                                  >
                                    <Share2 size={14}/>
                                    <span class="ml-2 text-sm">Share</span>
                                  </div>
                                </div>
                              </button>
                            </div>

                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                ): (
                  <span className='flex justify-center items-center'>No users found</span>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default SharePost