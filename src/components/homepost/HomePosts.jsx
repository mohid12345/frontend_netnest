import React, {useEffect, useRef, useState} from "react";
import { formatDistanceToNow} from 'date-fns'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SavePost, deletePost, getCommentsCount,handleComment,handleLike,likePost } from "../../services/user/apiMethods";
import {toast} from 'sonner'
import { loginSuccess, setPosts } from "../../utils/context/reducers/authSlice";
import EditPost from "./EditPost";
import ReportModal from './ReportModal'
import { Heart, MessageCircle } from 'lucide-react';
import LikedUsers from './LikedUsers'
import ViewPost from './ViewPost'
import ConfirmationModal from './ConfirmationModal'



function HomePosts({post, fetchPosts}) {
  console.log("updatedpost for like", post);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const selectedUser = (state) => state.auth.user
  const user = useSelector(selectedUser)
  const userId = user._id
  const postIds = user.savedPost
  console.log("post :",post);
  const [isSavedByUser, setIsSavedByUser] = useState(
    user?.savedPost?.includes(post._id)
  )

  //data for post showcase
  
  const imageUrlArray = post.imgUrl; 
  const postDate = formatDistanceToNow(new Date(post.date), { addSuffix: true });
  const postUserId = post.userId; 
  console.log('dat 1',postUserId);
  
  const profileImg = postUserId.profileImg; 
  console.log('dat 22 :',profileImg);
  
  const userName = postUserId.userName;
  console.log('dat 33 :',userName );
  

  // navigate to user profile
  const handleSearch = (postUserId) => {
    // console.log("postUserId", postUserId);
    if(postUserId === userId) {
      navigate('/profile')
    } else {
      navigate(`/user-profile/${postUserId}`)
    }
  }

  //save post
  const handleSave =(postId, userId) => {
    try {
      SavePost({postId, userId})
      .then((response)=> {
        const userData = response.data
        dispatch(loginSuccess({user: userData}))
        setIsSavedByUser(!isSavedByUser)
        toast.info(userData.message) 
      })
      .catch((error) =>{
        toast.error(error.message)
      })
    } catch(error){
      console.log(error.message);
      
    }
  }

  //handle dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCommentsEnabled, setIsCommentsEnabled] = useState(!post.hideComment)
  const [isLikesEnabled, setIsLikesEnabled]  = useState(post.hideLikes)
  const dropdownRef = useRef(null)
  
  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  const handleClickOutside = (event) => {
    if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return() => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  //delete post
  const[isModalOpen, setIsModalOpen] = useState(false) 
  const[postIdToDelete, setPostIdToDelete] = useState(null)

  const openModal = (postId) => {
    setPostIdToDelete(postId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setPostIdToDelete(null)
  }

  const confirmDeletePost =()=> {
    if(postIdToDelete){
      deletePost({ postId: postIdToDelete, userId})
      .then((response)=> {
        const postData = response.data;
        dispatch(setPosts({posts: postData.posts}))
        fetchPosts()
        toast.info('Post deleted')
      })
      .catch((error) => {
        toast.error(error.message)
      })
      closeModal()
    }
  }


  //edit post
  const [IsEditPostOpen, setEditPostOpen] = useState
  (false)
  const [currentPostId, setCurrentPostId] = useState
  (null);
  const handlePostEdit = (postId) => {
    setCurrentPostId(postId)
    setEditPostOpen(!IsEditPostOpen)
  }


  //report post
  const [reportModal, setReportModal] = useState(false)
  const handleReportModal = () => {
    setReportModal(!reportModal)
    handleClickOutside()
  }


  //like post
  const [showLikedUsersPopup, setShowLikedUsersPopup] =useState(false)
  const [likeCount, setLikeCount]  = useState(post.likes.length)
  const [likedUsers, setLikedUsers] = useState(post.likes)
  const [isLikedByUser, setIsLikedByUser] = useState(post.likes.includes(userId))

  useEffect(()=> {
    setIsLikedByUser(likedUsers.some((likedUser) => likedUser._id === user._id))
  }, [likedUsers, user._id])

  const toHandleLike = (postId, userId)=>{
    try{
      likePost({ postId, userId })
      .then((response) => {
        const postData = response.data
        dispatch(setPosts({ posts: postData.posts }))
        setIsLikedByUser(!isLikedByUser)
        if(isLikedByUser){
          setLikedUsers((prevLikedUsers) => 
            prevLikedUsers.filter((likedUser) => likedUser._id !== userId)
          )
          setLikeCount((prev)=> prev-1)
        } else {
          setLikedUsers((prevLikedUsers) => [...prevLikedUsers, user])
          setLikeCount((prev) => prev + 1)
        }
      })
      .catch((error) => {
        toast.error(error.message)
      })
    } catch (error){
      console.log(error.message);
      
    }
  }

const handleLikedUsersPopup =() => {
  setShowLikedUsersPopup(!showLikedUsersPopup)
}

  //comment
  const [showCommentModal, setShowCommentModal] = useState(false)
  const handlePostPopup = () => {
    setShowCommentModal(!showCommentModal)
  }


  //manage comment
  const manageComment = (postId, userId) => {
    console.log("in comment", postId);
    handleComment({postId, userId})
    .then((response) => {
      if(response.statuse == 200 ){
        setIsCommentsEnabled(!isCommentsEnabled)
      }
      const postData = response.data
      dispatch(setPosts({posts: postData.posts}))
      console.log("data", postData);
      toast.success(postData.message)      
    })
    .catch((error) => {
      console.error("Error handling comment :", error)
    })
  }


  //manage like
  const manageLikes = (postId, userId) => {
    console.log(("postId, userId", postId, userId));
    handleLike({postId, userId})
    .then((response) => {
      if(response.status === 200){
        setIsLikesEnabled(!isLikesEnabled)
      }
      const postData = response.data
      dispatch(setPosts({posts: postData.posts}))
      toast.success(postData.message)
    })
    .catch((error) => {
      console.error("Error handling likes :", error)
    })
    }

  //comment count
  const [commentsCount, setCommentsCount] = useState('')

  useEffect(()=> {
    const postId = post._id
    getCommentsCount(postId)
    .then((response)=>{

    })
  })

















  return (
    <div className="w-full lg:px-10 lg:p-0 mb-8 mr-2 h-max rounded-md border-none shadow-md bg-white border dark:bg-slate-800 dark:text-white dark:border-gray-400">
      
      <div>
      <div className='flex justify-between items-center'>
        {/* user details */}
        <div
        onClick={() => handleSearch(postUserId._id)} 
        className='flex cursor-pointer'>
          <div className="flex items-center justify-center bg-white rounded-full w-12 h-12 overflow-hidden ">
            <img className='rounded-full object-cover w-full h-full' src={profileImg} alt="" />
          </div>
          <div className=' mb-1'>
            <p className='text-black lg:ml-4 ml-2 font-medium lg:text-xl dark:text-white'>{userName}</p>
            <p className='text-black lg:ml-4 ml-2 font-normal lg:text-sm dark:text-white'>{postDate}</p>
          </div>
        </div>

        
        {postUserId._id == userId ? ( 

          <div className='relative'>
            {/* edit or delete post */}
          <div onClick={handleToggleDropdown} 
          // <div
          className='flex cursor-pointer'>
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="4" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
            </svg>
          </div>

          {isDropdownOpen && (
            <div ref={dropdownRef} className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
              <button
              onClick={() => handlePostEdit(post._id)} 
              className='w-full px-4 py-2 text-left text-gray-800 hover:text-blue-600 hover:bg-gray-200 rounded-md'>
                Edit
              </button>
              <button
                onClick={() => handleDeletePost(post._id, userId)}
                className="w-full px-4 py-2 text-left text-gray-800 hover:text-red-600 hover:bg-gray-200 rounded-md">
                Delete
              </button>
              
            </div>
          )}
        </div>
        ) : (
          <div className='relative'>
            {/* report post */}
            <div onClick={handleToggleDropdown} 
            className='flex cursor-pointer'>
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="3" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
              </svg>
            </div>

            {isDropdownOpen && (
              <div ref={dropdownRef} className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
                <button 
                onClick={() => handleReportModal()}
                className='w-full px-4 py-2 text-left hover:text-red-600 hover:bg-gray-200 rounded-md'>
                  Report
                </button>
              </div>
            )}
          </div>
        )}
        
      </div>
    
      <div
        onDoubleClick={() => toHandleLike(post._id, user._id)} 
        className=" lg:p-4 sm:p-0"> 
        <div id="controls-carousel" className="relative w-full bg-gray-200 rounded-md " >
          <div className="relative h-56 overflow-hidden  md:h-96 rounded-md">
            <div className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" data-carousel-item>
              {imageUrlArray.map((imageUrl, index) => {
                return <img src={imageUrl} alt={`post ${index}`} />
              })}
            </div>
          </div>
      
        <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg className="w-4 h-4 text-black dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                </svg>
                <span className="sr-only">Previous</span>
            </span>
        </button>
        <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg className="w-4 h-4 text-black dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="sr-only">Next</span>
            </span>
        </button>
      </div>
      </div>
        
        <div className='text-gray-200  flex justify-between'>
          {/* like, comment, share */}
          <div className='py-1 mt-0 flex gap-3'>
              
            <div className='group relative'>
              <button
              onClick={() => toHandleLike(post._id, user._id)} 
              className='transition-transform transform group-hover:scale-110 group-hover:text-red-600 duration-200'>
                {isLikedByUser ? 
                <Heart className='text-red-600 fill-red-600'/> :
                <Heart className='text-black hover:text-gray-600'/>
                } 
              </button>
            </div>

            <div className='group relative'>
              <button
              onClick={() => handlePostPopup()} 
              className='transition-transform transform group-hover:scale-110 duration-200'>
              <MessageCircle className='text-black hover:text-gray-600'/>
              </button>
            </div>
              
            {/* <div className='group relative'>
              <div onClick={handleSharePostModal} className='transition-transform transform group-hover:scale-110 duration-200'>
              <Share2 className='text-black hover:text-gray-600'/>
              </div>
            </div> */}
            </div>
            {/* save post */}

            {(
              isSavedByUser ? (
              // saved
              <div 
                onClick={() => handleSave(post._id, userId)}
                className='py-1 mt-0 flex cursor-pointer relative group'>
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z"/>
                </svg>
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className='text-center'>Unsave Post</p>
                </div>
              </div>
            ) : 
            (
              // save
              <div 
                onClick={() => handleSave(post._id, userId)} 
                className='py-1 mt-0 flex cursor-pointer relative group'
              >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m17 21-5-4-5 4V3.889a.92.92 0 0 1 .244-.629.808.808 0 0 1 .59-.26h8.333a.81.81 0 0 1 .589.26.92.92 0 0 1 .244.63V21Z"/>
                </svg>
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Save Post
                </div>
              </div>
            ))}

          </div>
          {likeCount > 0 ?
              <div>
              {!isLikesEnabled && (
              <div>
                {/* <span className='font-semibold cursor-pointer ml-2 py-0 text-slate-600'>
                likes are hidden
              </span> */}
              </div>
              )}
              {isLikesEnabled && (
                <div className='flex'>
                  <span onClick={handleLikedUsersPopup} className='font-semibold cursor-pointer ml-2 py-0 text-gray-700 dark:text-white hover:text-black'>
                    {likeCount} likes 
                  </span>
                  {commentsCount > 0 && (
                    <span 
                      onClick={() => handlePostPopup()} 
                      className='font-semibold cursor-pointer ml-2 text-gray-700 dark:text-white hover:text-black'>
                    & view all {commentsCount} comments
                   </span>
                  )}
                </div>
              )}
            </div> : '' 
          }
          <div className='text-black block pb-2'>
            <p className='font-semibold'>{post.title}</p>
            <p className='text-sm'>{post.description}</p>
          </div>
        </div>

        {<ConfirmationModal
          isOpen = {isModalOpen}
          onClose = {closeModal}
          onConfirm = {confirmDeletePost}
          message = "Are you sure you want to delete this post?"
        />}

        {showCommentModal && (
          <ViewPost
          post = {post}
          onClose = {handlePostPopup}
          toHandleLike = {toHandleLike}
          isLikedByUser = {isLikedByUser}
          likeCount = {likeCount}
          likedUsers = {likedUsers}
          handleLikedUsersPopup = {handleLikedUsersPopup}
          showLikedUsersPopup = {showLikedUsersPopup}
          isSavedByUser = {isSavedByUser}
          handleSave = {handleSave}
          isCommentsEnabled = {isCommentsEnabled}
          isLikesEnabled = {isLikesEnabled}
          manageComment = {manageComment}
          manageLikes = {manageLikes}
          fetchPosts = {fetchPosts}
          commentsCount = {commentsCount}
          getCommentsCount = {getCommentsCount}
          />
        )}

        {showLikedUsersPopup && (
          <LikedUsers likedUsers = {likedUsers} onClose=
          {handleLikedUsersPopup} />
        )}

        {/* {sharePostModal && (
          <SharePost onClick={handleSharePostModal} post= {post}/>
        )} */}

        {IsEditPostOpen && <EditPost handlePostEdit = {handlePostEdit}
        postId = {currentPostId} userId = {usesId} fetchPosts = {fetchPosts} /> }

        {reportModal && <ReportModal closeModal = {handleReportModal}
      postId = {post._id} userId = {userId} /> }
      
    </div>
  )
}

export default HomePosts
