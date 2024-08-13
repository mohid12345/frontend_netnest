import React, { useEffect, useRef, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";
import { toast } from 'sonner';
import { Formik, Form, Field } from "formik";
import { data } from 'autoprefixer';
import { CircleX, Heart, MessageCircle, Share2, Trash2, X } from 'lucide-react';
import { SavePost, addComment, deleteComment, deletePost, deleteReplyComment, getPostComments, handleComment, handleLike, likePost, replyComment } from '../../services/user/apiMethods';
import LikedUsers from './LikedUsers';
import EditPost from './EditPost';
import ReportModal from './ReportModal';
import ConfirmationModal from './ConfirmationModal';
import { loginSuccess, setPosts } from '../../utils/context/reducers/authSlice';

function ShowPost({
  post, 
  onClose,
  fetchPost,
}) 
{

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const selectedUser = (state) => state.auth.user
  const user = useSelector(selectedUser)
  const userId = user._id

  // const [post, setPost] = useState('')

  const imageUrlArray = post.imgUrl; 
  const postDate = formatDistanceToNow(new Date(post.date), { addSuffix: true });
  const postUserId = post.userId; 
  const profileImg = postUserId.profileImg; 
  const userName = postUserId.userName;
  const postIds = user.savedPost
  // const poststage = user.hideComment
 
  const [isSavedByUser, setIsSavedByUser] = useState(
    user?.savedPost?.includes(post._id)
  )

  // navigate to user profile
  const handleSearch = (postUserId) => {
    if(postUserId === userId) {
      navigate('/profile')
    } else {
      navigate(`/user-profile/${postUserId}`)
    }
  }

  // save post
  const handleSave = (postId, userId) => {
    // console.log(postId, userId);
    try {
      SavePost({postId, userId})
        .then((response) => {
          const userData = response.data
          // console.log("userdata", userData);
          dispatch(loginSuccuss({user: userData}))
          setIsSavedByUser(!isSavedByUser)
          toast.info(userData.message)
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  }

  // handle dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCommentsEnabled, setIsCommentsEnabled] = useState(!post.hideComment);
  const [isLikesEnabled, setIsLikesEnabled] = useState(!post.hideLikes);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // delete post
  // const handleDeletePost = (postId, userId) => {
  //   try {
  //     deletePost({postId, userId})
  //       .then((response) => {
  //         const postData = response.data
  //         dispatch(setPosts({posts: postData.posts}))
  //         fetchPost()
  //         toast.info("post deleted")
  //       })
  //       .catch((error) => {
  //         toast.error(error.message);
  //       });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const openModal = (postId) => {
    setPostIdToDelete(postId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostIdToDelete(null);
  };

  const confirmDeletePost = () => {
    if (postIdToDelete) {
      deletePost({ postId: postIdToDelete, userId })
        .then((response) => {
          const postData = response.data;
          dispatch(setPosts({ posts: postData.posts }));
          fetchPost()
          toast.info('Post deleted');
        })
        .catch((error) => {
          toast.error(error.message);
        });
      closeModal();
    }
  };

  const handleDeletePost = (postId, userId) => {
    openModal(postId);
  };

  // edit post
  const [IsEditPostOpen, setEditPostOpen] = useState(false)
  const [currentPostId, setCurrentPostId] = useState(null);
  const handlePostEdit = (postId) => {
    setCurrentPostId(postId);
    setEditPostOpen(!IsEditPostOpen)
  }

  // report post
  const [reportModal, setReportModal] = useState(false);
  const handleReportModal = () => {
    setReportModal(!reportModal);
    handleClickOutside()
  }

  // like post
  const [showLikedUsersPopup, setShowLikedUsersPopup] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [likedUsers, setLikedUsers] = useState(post.likes);
  const [isLikedByUser, setIsLikedByUser] = useState(post.likes.includes(userId));

  useEffect(() => {
    setIsLikedByUser(likedUsers.some((likedUser) => likedUser._id === user._id));
  }, [likedUsers, user._id]);

  const toHandleLike = (postId, userId) => {
    try {
      likePost({ postId, userId })
        .then((response) => {
          const postData = response.data;
          dispatch(setPosts({ posts: postData.posts }));
          
          // Toggle the like state
          setIsLikedByUser((prevIsLiked) => {
            if (prevIsLiked) {
              setLikedUsers((prevLikedUsers) =>
                prevLikedUsers.filter((likedUser) => likedUser._id !== userId)
              );
              setLikeCount((prev) => prev - 1);
            } else {
              setLikedUsers((prevLikedUsers) => [
                ...prevLikedUsers,
                { _id: userId },
              ]);
              setLikeCount((prev) => prev + 1);
            }
            return !prevIsLiked;
          });
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleLikedUsersPopup = () => {
    setShowLikedUsersPopup(!showLikedUsersPopup);
  };

  // comment
  const [comments, setComments] = useState([]);
  const [replyComments, setReplyComments] = useState(false);
  const [parentCommentId, setParentCommentId] = useState("");
  const [parentCommentUser, setParentCommentUser] = useState("")

  const handleReplyComments = (commentId, commentUsername) => {
    setReplyComments(true)
    setParentCommentId(commentId)
    setParentCommentUser(commentUsername)
  }
  const handleCancelReplyComments = () => {
    setReplyComments(false)
    setParentCommentId("")
    setParentCommentUser("")
  }

  // get comment
  useEffect(() => {
    const postId = post._id;
    getPostComments(postId)
      .then((response) => {
        const commentData = response.data.comments
        console.log("commentData",commentData);
        setComments(commentData)
      })
      .catch((error) => {
        toast.error(error.message)
        console.log(error);
      })
  }, [post._id])

  
  // add a comment
  const commentInitialValues = {
    comment: "",
  };
  const commentValidationSchema = Yup.object({
    comment: Yup.string().required("Comment is required"),
  });

  const commentHandleSubmit = (values, { resetForm }) => {
    try {
      const commentData = {
        postId: post._id,
        userId: userId,
        comment: values.comment,
      };
      addComment(commentData)
        .then((response) => {
          const data = response.data;
          if (response.status === 200) {
            const commentData = data.comments;
            setComments(commentData);
            toast.success(data.message);
            resetForm(); 
          } else {
            toast.error(data.message);
          }
        })
        .catch((error) => {
          console.log(error?.message);
          toast.error("An error occurred. Please try again.");
        });
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const ReplyCommentHandleSubmit = (values, {resetForm}) => {
    try {
      const commentData = {
        commentId: parentCommentId,
        userId: userId,
        replyComment: values.comment,
      }
      replyComment(commentData)
        .then((response) => {
          const data = response.data
          if (response.status === 200) {
            const commentData = data.comments;
            setComments(commentData);
            toast.success(data.message);
            resetForm(); 
            handleCancelReplyComments()
          } else {
            toast.error(data.message);
          }
        })
    } catch (error) {
      
    }
  }

  const handleDeleteComments = (commentId) => {
    deleteComment({commentId})
      .then((response) => {
        const data = response.data;
        if (response.status === 200) {
          const commentData = data.comments;
          setComments(commentData);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        console.log(error?.message);
        toast.error("An error occurred. Please try again.");
      })
  }

  const handleDeleteReplyComments = (commentId, replyUser, replyTime) => {
    deleteReplyComment({commentId, replyUser, replyTime})
      .then((response) => {
        const data = response.data;
        if (response.status === 200) {
          const commentData = data.comments;
          setComments(commentData);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        console.log(error?.message);
        toast.error("An error occurred. Please try again.");
      })
  }

  // manage comment 
  const manageComment = (postId, userId) => {
    console.log("in comment", postId);
    handleComment({postId, userId})
      .then((response) => {
        if (response.status === 200) {
          setIsCommentsEnabled(!isCommentsEnabled);
        }
        const postData = response.data;
        dispatch(setPosts({ posts: postData.posts }));
        console.log("data",postData);
        toast.success(postData.message)
      })
      .catch((error) => {
        console.error("Error handling comment:", error);
      });
  };

  // manage like
  const manageLikes = (postId, userId) => {
    handleLike({postId, userId})
      .then((response) => {
        if (response.status === 200) {
          setIsLikesEnabled(!isLikesEnabled);
        }
        const postData = response.data;
        dispatch(setPosts({ posts: postData.posts }));
        toast.success(postData.message)
      })
      .catch((error) => {
        console.error("Error handling like:", error);
      });
  };

  return (
    <div className='fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-md'>
      <div className='flex justify-center items-center h-full'> 
        {/* <div className='bg-white px-6 py-2 space-y-0 w-full md:mx-52 rounded-md'>  */}
        <div className='bg-white px-6 py-2 space-y-0 w-full md:mx-52 rounded-md max-h-screen overflow-y-auto'>
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold text-xl'></h2>
            <div>
              <button onClick={onClose} className="text-white dark:text-black px-0 py-0 mt-2 rounded">
                <svg className="w-6 h-6 text-gray-800 dark:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
              </button>
            </div>
          </div>
          <div className='max-w-full mx-auto lg:flex justify-between'>
            {/* left side */}
            <div className="w-full lg:w-7/12 mr-2">
              <div className="w-full lg:px-2 lg:p-0 mb-2 h-max rounded-md border-none shadow-md bg-white border">
                <div>
                  <div className='flex justify-between items-center'>
                    {/* user details */}
                    <div onClick={() => handleSearch(postUserId._id)} className='flex cursor-pointer px-4'>
                      <div className="flex items-center justify-center bg-white rounded-full w-10 h-10 overflow-hidden">
                        <img className='rounded-full object-cover w-full h-full' src={profileImg} alt="" />
                      </div>
                      <div className='mb-1'>
                        <p className='text-black lg:ml-4 ml-2 font-medium lg:text-sm'>{userName}</p>
                        <p className='text-black lg:ml-4 ml-2 font-normal lg:text-xs'>{postDate}</p>
                      </div>
                    </div>

                    {postUserId._id === userId ? (
                      <div className='relative'>
                      {/* edit or delete post */}
                      <div onClick={handleToggleDropdown} className='flex cursor-pointer'>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeWidth="4" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
                        </svg>
                      </div>
                
                      {isDropdownOpen && (
                        <div ref={dropdownRef} className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
                          <button onClick={() => handlePostEdit(post._id)} className='w-full px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-300 hover:text-blue-600 rounded-md'>Edit</button>
                          <button onClick={() => handleDeletePost(post._id, userId)} className='w-full px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-300 hover:text-red-600 rounded-md'>Delete</button>
                
                          {/* Toggle for Likes */}
                          <div className="flex items-center justify-between px-4 py-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Hide Likes</span>
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!isLikesEnabled}
                                onChange={() => manageLikes(post._id, userId)}
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                
                          {/* Toggle for Comments */}
                          <div className="flex items-center justify-between px-4 py-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Hide Comments</span>
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!isCommentsEnabled}
                                onChange={() => manageComment(post._id, userId)}
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    ) : (
                      <div className='relative'>
                        {/* report post */}
                        <div onClick={handleToggleDropdown} className='flex cursor-pointer'>
                          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="3" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
                          </svg>
                        </div>

                        {isDropdownOpen && (
                          <div ref={dropdownRef} className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
                            <button onClick={() => handleReportModal()} className='w-full px-4 py-2 text-left hover:text-red-600 hover:bg-gray-200 rounded-md'>Report</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div onDoubleClick={() => toHandleLike(post._id, user._id)} className="lg:py-2 sm:p-0"> 
                    <div id="controls-carousel" className="relative w-full max-w-lg mx-auto bg-white rounded-md">
                      <div className="relative w-full pb-[100%] overflow-hidden ">
                        <div className="absolute inset-0" data-carousel-item>
                          {imageUrlArray.map((imageUrl, index) => (
                            <img 
                              src={imageUrl} 
                              alt={`post ${index}`} 
                              key={index}
                              className="absolute w-full h-full object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  
                  <div className='text-gray-700 block pb-4 px-4'>
                    <p className='font-semibold'>{post.title}</p>
                    {/* <p className='text-sm'>{post.description}</p> */}
                  </div>

                  {showLikedUsersPopup && <LikedUsers likedUsers={likedUsers} onClose={handleLikedUsersPopup} />}
                  {IsEditPostOpen && <EditPost handlePostEdit={handlePostEdit} postId={currentPostId} userId={userId} fetchPost={fetchPost} />}
                  {reportModal && <ReportModal closeModal={handleReportModal} postId={post._id} userId={userId} />}
                  {<ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={confirmDeletePost}
                    message="Are you sure you want to delete this post?"
                  />}
                </div>
              </div>
            </div>

            {/* right side */}
            <div className="w-full lg:w-6/12 ml-2">
              <div className="w-full h-max rounded-md border-none shadow-md bg-white border px-4 p-1">

                <div className='flex'>
                  <h3 className="font-semibold text-lg mb-2 p-0 mt-2">Comments</h3>
                  {/* <div className='pl-4 pt-1'>
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer"/>
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                  </label>
                  </div> */}

                  {/* <div className='pl-2'>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"/>
                        <div className="peer ring-0 bg-rose-400  rounded-full outline-none duration-300 after:duration-500 w-10 h-10  shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️'] after:rounded-full after:absolute after:outline-none after:h-8 after:w-8 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center  peer-hover:after:scale-75 peer-checked:after:content-['✔️'] after:-rotate-180 peer-checked:after:rotate-0">
                        </div>
                      </label>
                    </div> */}
                </div>

                

                <div className="mb-10 max-h-96 lg:h-96 lg:overflow-auto">
                  {!isCommentsEnabled && (
                    <div className="flex items-center justify-center">
                      <div>
                        <h1 className="text-md font-semibold text-slate-600">
                          Comments are hidden.
                        </h1>
                      </div>
                    </div>
                  )}
                  {isCommentsEnabled && (
                    <div>
                      {comments.length === 0 ? (
                        <p tabIndex="0" className="flex justify-center focus:outline-none text-sm flex-shrink-0 leading-normal px-3 py-16 text-gray-500">Empty Comments :(</p>
                      ): (
                        <div>
                      {comments.map((comment) => (
                        <div key={comment._id} className="mb-6 flex flex-col">
                          {/* Display comment on the left */}
                          <div className="flex justify-start mb-2">
                            <img
                              src={comment.userId.profileImg}  
                              className="object-cover h-8 w-8 rounded-full"
                              alt=""
                            />
                            <div className='flex'>
                              <div className="ml-0 py-0 px-4 bg-white rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-black">
                                <p className="text-sm font-medium">{comment.userId.userName}</p>
                                <p className="text-sm">{comment.comment}</p>
                              </div>
                              {user.userName == comment.userId.userName ? (
                                <div className='flex justify-center items-center ml-2'>
                                  <Trash2 
                                  onClick={() => handleDeleteComments(comment._id)}
                                  className='size-4 text-gray-700 cursor-pointer hover:text-red-500 hover:size-5'/>
                                </div>
                              ): ''}
                            </div>
                          </div>

                          {/* Display time and reply option */}
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </span>
                              <button 
                                onClick={() => {handleReplyComments(comment._id, comment.userId.userName)}}
                                className="text-xs text-blue-500 hover:underline ml-2">
                                Reply
                              </button>
                              {replyComments && comment._id === parentCommentId && (
                                <button
                                  onClick={() => handleCancelReplyComments()} 
                                  className='ml-2'>
                                  <CircleX className='size-5 text-red-500'/>
                                </button>
                              )}
                            </div>


                          {/* Display reply on the right */}
                          {comment.replyComments && comment.replyComments.length > 0 &&  (
                            comment.replyComments.map((reply) => (
                              <div key={reply._id}>
                                {!reply.isReplyDeleted && (
                                  <div className="flex flex-col mb-2">
                                  <div className='flex justify-end mb-2'>
                                    <img
                                      src={reply.userId.profileImg}  
                                      className="object-cover h-8 w-8 rounded-full"
                                      alt={reply.userId.userName}  
                                    />
                                    <div className="mr-2 py-0 px-4 bg-white rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-black">
                                      <p className="text-sm font-medium">{reply.userId.userName}</p>
                                      <p className="text-sm">{reply.replyComment}</p>
                                    </div>
                                    {user.userName == reply.userId.userName ? (
                                      <div className='flex justify-center items-center mr-2'>
                                        <Trash2 
                                        onClick={() => handleDeleteReplyComments(comment._id, reply.userId._id, reply.timestamp)}
                                        className='size-4 text-gray-700 hover:text-red-500 hover:size-5 cursor-pointer'/>
                                      </div>
                                    ): ''}
                                    
                                  </div>
                                  <span className="text-xs text-gray-500 flex justify-end mr-2">
                                    {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                                  </span>
                                </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      ))}
                    </div>
                      )}
                    </div>
                  )}
                </div>
                <div>

                <div className='text-gray-200 flex justify-between pt-2'>
                    {/* like, comment, share */}
                    <div className='py-0 mt-0 flex gap-3'>
                      <div className='group relative'>
                        <button onClick={() => toHandleLike(post._id, user._id)} className='transition-transform transform group-hover:scale-110 group-hover:text-red-600 duration-200'>
                          {isLikedByUser ? 
                            <Heart className='text-red-600 fill-red-600'/> :
                            <Heart className='text-black hover:text-gray-600'/>}
                        </button>
                      </div>

                      <div className='group relative'>
                        <button onClick={() => handlePostPopup()} className='transition-transform transform group-hover:scale-110 duration-200'>
                          <MessageCircle className='text-black hover:text-gray-600'/>
                        </button>
                      </div>
                      
                      <div className='group relative'>
                        <div className='transition-transform transform group-hover:scale-110 duration-200'>
                          <Share2 className='text-black hover:text-gray-600'/>
                        </div>
                      </div>
                    </div>
                    {/* save post */}
                    {isSavedByUser ? (
                      <div onClick={() => handleSave(post._id, userId)} className='py-1 mt-0 flex cursor-pointer relative group'>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z"/>
                        </svg>
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className='text-center'>Unsave Post</p>
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => handleSave(post._id, userId)} className='py-1 mt-0 flex cursor-pointer relative group'>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m17 21-5-4-5 4V3.889a.92.92 0 0 1 .244-.629.808.808 0 0 1 .59-.26h8.333a.81.81 0 0 1 .589.26.92.92 0 0 1 .244.63V21Z"/>
                        </svg>
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Save Post
                        </div>
                      </div>
                    )}
                  </div>
                 
                  <div className='flex'>
                    {!isLikesEnabled && (
                      <span className='font-semibold cursor-pointer ml-2 py-0 text-slate-600 '>
                        likes are hidden
                      </span>
                    )}
                    {isLikesEnabled && (
                      <span onClick={handleLikedUsersPopup} className='font-semibold cursor-pointer ml-2 py-0'>
                      {likeCount} likes
                    </span>
                    )}
                    {/* {commentsCount > 0 && (
                      <span className='font-semibold cursor-pointer ml-2 text-gray-700 hover:text-black'>
                      & {commentsCount} comments
                    </span>
                    )} */}
                  </div>

                  {replyComments && (
                    <Formik
                    initialValues={commentInitialValues}
                    validationSchema={commentValidationSchema}
                    onSubmit={ReplyCommentHandleSubmit}
                    >
                    {({ values }) => {
                      const isCommentEmpty = !values.comment.trim();

                      return (
                        <Form>
                          <div className="relative mt-4 pb-0">
                            <Field
                              name="comment"
                              placeholder={`@${parentCommentUser}`}
                              aria-label="Add a comment.."
                              autoComplete="off"
                              autoCorrect="off"
                              className="block w-full rounded-2xl border border-neutral-300 bg-transparent py-3 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                            />
                            <div className="absolute inset-y-1 right-1 flex justify-end">
                              <button
                                type="submit"
                                aria-label="Submit"
                                className={`flex aspect-square h-full items-center justify-center rounded-xl transition ${
                                  isCommentEmpty ? 'bg-neutral-950 hover:bg-neutral-800' : 'bg-blue-500 hover:bg-blue-400'
                                } text-white`}
                                disabled={isCommentEmpty}
                              >
                                <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                                  <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                  )}

                  {!replyComments && (
                  <Formik
                    initialValues={commentInitialValues}
                    validationSchema={commentValidationSchema}
                    onSubmit={commentHandleSubmit}
                    >
                    {({ values }) => {
                      const isCommentEmpty = !values.comment.trim();

                      return (
                        <Form>
                          <div className="relative mt-4 pb-0">
                            <Field
                              name="comment"
                              placeholder="Add a Comment.."
                              aria-label="Add a Comment.."
                              autoComplete="off"
                              autoCorrect="off"
                              className="block w-full rounded-2xl border border-neutral-300 bg-transparent py-3 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                            />
                            <div className="absolute inset-y-1 right-1 flex justify-end">
                              <button
                                type="submit"
                                aria-label="Submit"
                                className={`flex aspect-square h-full items-center justify-center rounded-xl transition ${
                                  isCommentEmpty ? 'bg-neutral-950 hover:bg-neutral-800' : 'bg-blue-500 hover:bg-blue-400'
                                } text-white`}
                                disabled={isCommentEmpty}
                              >
                                <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                                  <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowPost