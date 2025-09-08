import React, { useEffect, useRef, useState } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import ViewProfilePost from "./ViewProfilePost";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import {
    SavePost,
    deletePost,
    getCommentsCount,
    handleComment,
    handleLike,
    likePost,
} from "../../services/user/apiMethods";
import { toast } from "sonner";
import { loginSuccess, setPosts } from "../../utils/context/reducers/authSlice";
import { Heart, MessageCircle } from "lucide-react";
import EditPost from "../homepost/EditPost";
import ReportModal from "../homepost/ReportModal";
import LikedUsers from "../homepost/LikedUsers";
import ConfirmationModal from "../homepost/ConfirmationModal";
import ShimmerBox from "../loader/ShimmerBox";




function PostGallery({ post, fetchPosts }) {
    const [showViewProfilePost, setShowViewProfilePost] = useState(false);
    console.log("profile :: postGallsery :post ::", post);
// NEW PART
 const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedUser = (state) => state.auth.user;
    const user = useSelector(selectedUser);
    const userId = user._id;
    const postIds = user.savedPost;
    const [isSavedByUser, setIsSavedByUser] = useState(user?.savedPost?.includes(post._id));

    //data for post showcase

    const imageUrlArray = post.imgUrl;
    const postDate = formatDistanceToNow(new Date(post.date), {
        addSuffix: true,
    });
    const postUserId = post.userId;
    const profileImg = postUserId.profileImg;
    const userName = postUserId.userName;
    // navigate to user profile
    const handleSearch = (postUserId) => {
        if (postUserId === userId) {
            navigate("/profile");
        } else {
            navigate(`/user-profile/${postUserId}`);
        }
    };

    //save post
    const handleSave = (postId, userId) => {
        try {
            SavePost({ postId, userId })
                .then((response) => {
                    const userData = response.data;
                    dispatch(loginSuccess({ user: userData }));
                    setIsSavedByUser(!isSavedByUser);
                    toast.info(userData.message);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        } catch (error) {
            console.log(error.message);
        }
    };

    //handle dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(post.hideComment);

    const [isLikesEnabled, setIsLikesEnabled] = useState(post.hideLikes);
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
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    //delete post
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
                    fetchPosts();
                    toast.info("Post deleted");
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

    //edit post
    const [IsEditPostOpen, setEditPostOpen] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const handlePostEdit = (postId) => {
        setCurrentPostId(postId);
        setEditPostOpen(!IsEditPostOpen);
    };

    //report post
    const [reportModal, setReportModal] = useState(false);
    const handleReportModal = () => {
        setReportModal(!reportModal);
        handleClickOutside();
    };

    //like post
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
                    setIsLikedByUser(!isLikedByUser);
                    if (isLikedByUser) {
                        setLikedUsers((prevLikedUsers) => prevLikedUsers.filter((likedUser) => likedUser._id !== userId));
                        setLikeCount((prev) => prev - 1);
                    } else {
                        setLikedUsers((prevLikedUsers) => [...prevLikedUsers, user]);
                        setLikeCount((prev) => prev + 1);
                    }
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

    //Handle Like
    // manage like
    const manageLikes = (postId, userId) => {
        console.log("postId, userId", postId, userId);
        handleLike({ postId, userId })
            .then((response) => {
                if (response.status === 200) {
                    setIsLikesEnabled(!isLikesEnabled);
                }
                const postData = response.data;
                dispatch(setPosts({ posts: postData.posts }));
                toast.success(postData.message);
            })
            .catch((error) => {
                console.error("Error handling like:", error);
            });
    };

    //comment
    const [showCommentModal, setShowCommentModal] = useState(false);
    const handlePostPopup = () => {
        setShowCommentModal(!showCommentModal);
    };

    //manage comment
    const manageComment = (postId, userId) => {
        handleComment({ postId, userId })
            .then((response) => {
                if (response.status == 200) {
                    setIsCommentsEnabled(!isCommentsEnabled);
                }
                const postData = response.data;
                dispatch(setPosts({ posts: postData.posts }));
                toast.success(postData.message);
            })
            .catch((error) => {
                console.error("Error handling comment :", error);
            });
    };

    //comment count
    const [commentsCount, setCommentsCount] = useState("");

    useEffect(() => {
        const postId = post._id;
        getCommentsCount(postId).then((response) => {
            setCommentsCount(response.data.commentCounts);
        });
    }, []);

    //truncated display of description
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    const truncateText = (text, length) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + "...";
    };




    //OLD PART

    const [currentIndex, setCurrentIndex] = useState(0);

    if (!imageUrlArray.length) return null;

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === imageUrlArray.length - 1 ? 0 : prevIndex + 1));
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageUrlArray.length - 1 : prevIndex - 1));
    };

    const handleViewProflePost = () => {
        console.log("ehlooo");

        setShowViewProfilePost(!showViewProfilePost);
    };

    return (
        <div className="relative w-full flex justify-center items-center">
            {/* Image */}
            <div className="relative group w-full">
                <img
                    src={imageUrlArray[currentIndex]}
                    alt={`Post ${currentIndex}`}
                    className="w-full max-h-64 object-cover rounded-lg cursor-pointer"
                />
                <div
                    onClick={() => handleViewProflePost()}
                    className="absolute inset-0 flex justify-center items-center bg-slate-400/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <FaEye className="size-10 text-white" />
                </div>
            </div>

            {/* Prev Button */}
            {imageUrlArray.length > 1 && (
                <button onClick={prevImage} className="absolute left-2 bg-black/50 text-white px-3 py-1 rounded-full">
                    <MdNavigateBefore />
                </button>
            )}

            {/* Next Button */}
            {imageUrlArray.length > 1 && (
                <button onClick={nextImage} className="absolute right-2 bg-black/50 text-white px-3 py-1 rounded-full">
                    <MdNavigateNext />
                </button>
            )}
            {showViewProfilePost && (
                <ViewProfilePost
                    post={post}
                    onClose={handleViewProflePost}
                    toHandleLike={toHandleLike}
                    isLikedByUser={isLikedByUser}
                    likeCount={likeCount}
                    likedUsers={likedUsers}
                    handleLikedUsersPopup={handleLikedUsersPopup}
                    showLikedUsersPopup={showLikedUsersPopup}
                    isSavedByUser={isSavedByUser}
                    handleSave={handleSave}
                    isCommentsEnabled={isCommentsEnabled}
                    isLikesEnabled={isLikesEnabled}
                    manageComment={manageComment}
                    manageLikes={manageLikes}
                    fetchPosts={fetchPosts}
                    commentsCount={commentsCount}
                    getCommentsCount={getCommentsCount}
                />
            )}
        </div>
    );
}

export default PostGallery;
