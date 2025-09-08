import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setPosts } from "../../utils/context/reducers/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import PostGallery from "../../components/profile/postGallery";
import { getSavedPosts, getUserConnection, getUserPost } from "../../services/user/apiMethods";
import emptypost from "/images/nopost.jpg";
import UserEditProfile from "../../components/profile/UserEditProfile";
import FollowingList from "../../components/profile/FollowingList";
import FollowersList from "../../components/profile/FollowersList";
import Loader from "../../components/loader/loader";
import ViewPost from "../../components/homepost/ViewPost";

function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedUser = (state) => state.auth.user;
    const selectPosts = (state) => state.auth.posts;
    const user = useSelector(selectedUser);
    const userId = user._id;
    const posts = useSelector(selectPosts) || [];
    console.log("my :::: ", posts);

    const [loading, setLoading] = useState(false);
    const [postLoading, setPostLoading] = useState(false);
    const [savedPost, setSavedPost] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [IsEditProfileOpen, SetEditProfileOpen] = useState(false);
    const [isFollowingModal, setIsFollowingModal] = useState(false);
    const [isFollowersgModal, setIsFollowersgModal] = useState(false);
    const [currentView, setCurrentView] = useState("posts");
    const [showViewModel, setShowViewModel] = useState(false);

    const handleEditModal = () => {
        SetEditProfileOpen(!IsEditProfileOpen);
    };
    const handleFollowingModal = () => {
        setIsFollowingModal(!isFollowingModal);
    };
    const handleFollowersModal = () => {
        setIsFollowersgModal(!isFollowersgModal);
    };

    const fetchPost = () => {
        getUserPost(userId)
            .then((response) => {
                const postsData = response.data;
                dispatch(setPosts({ posts: postsData }));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        try {
            setLoading(true);

            fetchPost();

            getUserConnection({ userId: userId })
                .then((response) => {
                    const connectionData = response.data.connection;
                    setFollowers(connectionData.followers);
                    setFollowing(connectionData.following);
                })
                .catch((error) => {
                    console.log(error);
                });

            getSavedPosts(userId)
                .then((response) => {
                    const savedPostData = response.data;
                    setSavedPost(savedPostData);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }, [userId, dispatch]);

    // logout
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("email");
        toast.info("Logout succussfull");
        navigate("/login");
    };

    return (
        <div className="w-full p-4 mr-2 bg-white dark:bg-black">
            {loading && <Loader />}
            {!loading && (
                <div>
                    <div className="flex w-full justify-center mb-6 lg:px-10">
                        <div className="flex bg-white dark:bg-black w-full rounded-md shadow-md dark:shadow-gray-500 relative overflow-hidden ">
                            {/* <Meteors number={20} /> */}
                            <div className="lg:flex lg:p-8 ml-4 justify-center gap-8 relative z-10 lg:mb-0 mb-2">
                                <div className="flex ml-2 lg:ml-8 justify-center">
                                    <img className="w-36 h-36 lg:w-40 lg:h-40 object-cover rounded-full" src={user?.profileImg} alt="" />
                                </div>

                                <div className="block lg:ml-10 ml-2 lg:text-start text-center text-black dark:text-white">
                                    <div className="font-semibold text-3xl pb-2">{user?.userName}</div>
                                    <div className="pb-0">{user?.name}</div>
                                    <div className="pb-1">{user?.bio}</div>
                                    <div className="flex justify-between  mt-2 cursor-pointer lg:gap-10 lg:px-0 px-4">
                                        <div className="flex flex-col cursor-pointer items-center">
                                            <p className="font-medium text-lg">{posts?.length}</p>
                                            <p className="text-sm">Posts</p>
                                        </div>
                                        <div
                                            onClick={handleFollowersModal}
                                            className="flex flex-col cursor-pointer items-center lg:ml-0 ml-4"
                                        >
                                            <p className="font-medium text-lg">{followers?.length}</p>
                                            <p className="text-sm">Followers</p>
                                        </div>
                                        <div
                                            onClick={handleFollowingModal}
                                            className="flex flex-col cursor-pointer items-center"
                                        >
                                            <p className="font-medium text-lg">{following?.length}</p>
                                            <p className="text-sm">Following</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex lg:ml-4 py-2 lg:py-0 text-center">
                                    <div>
                                        <button
                                            onClick={handleEditModal}
                                            className="bg-neutral-950 lg:ml-10 ml-6 lg:w-32 w-28 text-neutral-400 border border-neutral-400 border-b-4 lg:font-medium font-normal text-md overflow-hidden relative px-4 lg:py-2 py-1 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                                        >
                                            <span className="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                                            Edit Profile
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-neutral-950 lg:ml-10 ml-6 lg:w-32 w-28 text-neutral-400 border border-neutral-400 border-b-4 font-medium overflow-hidden relative px-4 lg:py-2 py-1 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                                        >
                                            <span className="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-screen mt-5 rounded-md bg-white dark:bg-black ">
                        <div className="flex justify-between px-10 gap-10 p-2 font-normal text-lg">
                            <div
                                onClick={() => setCurrentView("posts")}
                                className={`w-full text-center cursor-pointer h-10 flex items-center justify-center rounded-md transition-all duration-200
      ${
          currentView === "posts"
              ? "border-b-4 border-blue-500 font-semibold bg-gray-100 text-blue-600 dark:text-blue-400"
              : "border-b border-gray-400 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
      }`}
                            >
                                Posts
                            </div>

                            {/* Saved Tab */}
                            <div
                                onClick={() => setCurrentView("saved")}
                                className={`w-full text-center cursor-pointer h-10 flex items-center justify-center rounded-md transition-all duration-200
      ${
          currentView === "saved"
              ? "border-b-4 border-blue-500 bg-gray-100 font-semibold text-blue-600 dark:text-blue-400"
              : "border-b border-gray-400 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
      }`}
                            >
                                Saved
                            </div>
                            {/* <div
                                onClick={() => setCurrentView("posts")}
                                className={`w-full text-center cursor-pointer h-10 flex items-center justify-center rounded hover:shadow-md border-b border-gray-400 bg-white dark:bg-black text-black dark:text-white ${
                                    currentView === "posts" ? "border-b-4 border-blue-500 font-semibold text-blue-600 dark:text-blue-400" : "border-b border-gray-400 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                Posts
                            </div>
                            <div
                                onClick={() => setCurrentView("saved")}
                                className={`w-full text-center cursor-pointer h-10 flex items-center justify-center rounded hover:shadow-md border-b border-gray-400 bg-white dark:bg-black text-black dark:text-white ${
                                    currentView === "saved" ? "border-b-2 border-blue-500" : ""
                                }`}
                            >
                                Saved
                            </div> */}
                        </div>

                        {currentView === "posts" ? (
                            posts?.length === 0 ? (
                                <div className="flex flex-col justify-center items-center mt-4 text-black dark:text-white w-full h-auto">
                                    <img className="w-96" src={emptypost} alt="" />
                                    <p>Create your first post.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-white dark:bg-black lg:p-2 mt-2 lg:px-10">
                                    {Array.isArray(posts) &&
                                        posts.map((post) => (
                                            <div key={post._id}>
                                                <PostGallery post={post} fetchPost={fetchPost} />
                                            </div>
                                        ))}
                                </div>
                            )
                        ) : savedPost?.length === 0 ? (
                            <div className="flex flex-col justify-center items-center mt-4 text-black w-full h-auto">
                                <img className="w-96" src={emptypost} alt="" />
                                <p>No saved post</p>
                            </div>
                        ) : (
                            // <div className='grid grid-cols-1 md:grid-cols-3 gap-2 bg-white dark:bg-black lg:p-2 mt-2 lg:px-10'>
                            //   {savedPost.map((post) => (
                            //     <div key={post._id}>
                            //       <PostGallery post={post} />
                            //     </div>
                            //   ))}
                            // </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white dark:bg-black lg:p-2 mt-2 lg:px-10">
                                {Array.isArray(savedPost) &&
                                    savedPost.map((post) => (
                                        <div key={post._id}>
                                            <PostGallery post={post} fetchPost={fetchPost} />
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {IsEditProfileOpen && <UserEditProfile user={user} handleEditModal={handleEditModal} />}

            {isFollowersgModal && (
                <FollowersList
                    callGetUserConnection={getUserConnection}
                    followers={followers}
                    followingUsers={following}
                    setFollowingUsers={setFollowing}
                    onClose={handleFollowersModal}
                />
            )}

            {isFollowingModal && (
                <FollowingList
                    callGetUserConnection={getUserConnection}
                    currentUser={userId}
                    followingUsers={following}
                    setFollowingUsers={setFollowing}
                    onClose={handleFollowingModal}
                />
            )}
        </div>
    );
}

export default Profile;
