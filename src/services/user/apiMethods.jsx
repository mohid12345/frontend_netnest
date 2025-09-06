import { apiCall } from "./apiCalls";
import { chatUrls, connectionUrls, postUrls, userUrls } from "../endPoints";
import { BASE_URL } from "../../constants/baseUrls";
import { useNotificationSocket } from "../../utils/context/SocketContext/nofi_Socket";
import { StatusCodes } from "http-status-codes";
import StringMessages from "../../constants/StringMessages";

// User Register

export const postRegister = (userData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.register, userData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ staus: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// OTP verification
export const postOTP = (otp) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.registerOtp, otp)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// resent otp
export const postResendOTP = (email) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("postresendotp");
            apiCall("post", userUrls.resendOtp, email)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// login

export const postLogin = (userData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.login, userData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// forgotOTP

export const forgotOTP = (otp) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.forgotOtp, otp)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// forgot password

export const forgotPassword = (email) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.forgotPassword, email)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// renew password

export const renewPassword = (userData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.resetPassword, userData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// google authentication

export const googleAuthenticate = (userData) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("userdata in api method", userData);
            apiCall("post", userUrls.googleAuth, userData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// Add new post
export const addPost = (postData) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("Postdata in api", postData);
            apiCall("post", postUrls.addPost, postData)
                .then((response) => {
                    if (response.status === 200) {
                        // socket.emit('sendNotification', {
                        //   postImage: postData.image, // Assuming the post data includes an image
                        //   receiverId: 'all', // You might want to send this to all users or specific users
                        //   senderName: postData.userName, // Assuming you have the user's name in the post data
                        //   message: `${postData.userName} added a new post!`
                        // });
                    }
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// get user post
export const getUserPost = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("in userpost apicall");
            const url = `${postUrls.getUserPosts}/${userId}`;
            apiCall("get", url, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// get all posts
// export const getAllPosts = (userId) => {
//   return new Promise((resolve, reject) => {
//     try {
//       // console.log("userid in getallpost",userId);
//       apiCall("post", postUrls.getAllPosts, userId)
//         .then((response) => {
//           resolve(response)
//         })
//         .catch((err) => {
//           reject(err)
//         })
//     } catch (error) {
//       resolve({status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG})
//     }
//   })
// }

// get all posts(with lazy loading)
export const getAllPosts = ({ userId, page = 1, limit = 3 }) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.getAllPosts, { userId, page, limit })
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        } catch (error) {
            resolve({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: StringMessages.WRONG,
            });
        }
    });
};

// get all posts
export const getEditPost = (postId) => {
    return new Promise((resolve, reject) => {
        try {
            // console.log("userid in getallpost",userId);
            apiCall("post", postUrls.getEditPost, postId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// delete post
export const deletePost = (postData) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("delete api call :", postData);

            apiCall("post", postUrls.deletePost, postData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// user edit profile
export const editProfile = (userData) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("userdata in api method", userData);
            apiCall("post", userUrls.editProfile, userData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// change password
export const changePassword = (values) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.changePassword, values)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// get user suggustions to miniprofile
export const getUserSuggestions = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.userSuggestions, userId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

export const getUserSearch = (searchQuery) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.userSearch, searchQuery)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// get user details
export const getUserDetails = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("getuserdetails", userId);
            apiCall("get", userUrls.getUserDetails + `/${userId}`)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// get user connections
export const getUserConnection = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            // console.log("userid in getting cnnt", userId);
            apiCall("post", connectionUrls.getConnections, userId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// follow user
export const followUser = (data) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", connectionUrls.follow, data)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// unfollow user
export const unFollowUser = (data) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", connectionUrls.unfollow, data)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// get all follow requested users
export const getRequestedUsers = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(userId);

            apiCall("post", connectionUrls.requestedUsers, userId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// reject follow request
export const rejectFollowRequest = (data) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", connectionUrls.rejectRequest, data)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// accept follow request
export const acceptFollowRequest = (data) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", connectionUrls.acceptRequest, data)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// save post
export const SavePost = (postData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.savePost, postData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// get saved post
export const getSavedPosts = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const url = `${postUrls.getSavedPosts}/${userId}`;
            apiCall("get", url, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

export const editPost = (postData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.editPost, postData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// report post
export const reportPost = (postData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.reportPost, postData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// like post
export const likePost = (postData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.likePost, postData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// get post comments
export const getPostComments = (postId) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("getting comment postid", postId);
            const url = `${postUrls.getAllPostComments}/${postId}`;
            apiCall("get", url, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// add comment
export const addComment = (commentData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.addComment, commentData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// reply comment
export const replyComment = (commentData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.replyComment, commentData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// delete comment
export const deleteComment = (commentId) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.deleteComment, commentId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

export const deleteReplyComment = (commentData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.deleteReplyComment, commentData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

export const getCommentsCount = (postId) => {
    return new Promise((resolve, reject) => {
        try {
            const url = `${postUrls.commentCount}/${postId}`;
            apiCall("get", url, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

//  manage comment
export const handleComment = (postData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.handleComment, postData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// manage like
export const handleLike = (postData) => {
    console.log("inlike", postData);
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", postUrls.handleLike, postData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// get notifications
export const getNotifications = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.getNotifications, userId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

export const deleteNotification = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            // apiCall("delete", userUrls.getNotifications, userId)
            apiCall("delete", `${userUrls.getNotifications}?userId=${userId}`)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

export const verifyEmailUpdate = (values) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.verifyEmailUpdate, values)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// verifyOTP for emal

export const verifyOTPForEmail = (otp) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.verifyOtpEmail, otp)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// delete account
export const deleteAccount = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", userUrls.deleteAccount, userId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

export const getExplorePosts = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            // console.log("userid in getallpost",userId);
            apiCall("post", postUrls.getExplorePost, userId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

export const getAllUsers = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            // console.log("userid in getallpost",userId);
            apiCall("post", userUrls.getAllUsers, userId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// get users for conversation
export const getChatElibleUsers = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", chatUrls.getEligibleUsers, userId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

export const addConversation = (conversationData) => {
    // console.log("conversationData", conversationData);
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", chatUrls.addConversation, conversationData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

//  get user conversation
export const getUserConversations = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const url = `${chatUrls.getUserConversation}/${userId}`;
            apiCall("get", url, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// find conversation
export const findConversation = (conversationData) => {
    return new Promise((resolve, reject) => {
        try {
            const url = `${chatUrls.findConversation}/${conversationData.firstUser}/${conversationData.secondUser}`;
            apiCall("post", url, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// add new message
export const addMessage = (formData) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("formdata in api", formData);
            apiCall("post", chatUrls.addMessage, formData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// get user conversations
export const getUserMessages = (conversationId) => {
    return new Promise((resolve, reject) => {
        try {
            const url = `${chatUrls.getMessages}/${conversationId}`;
            apiCall("get", url, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: StringMessages.WRONG });
        }
    });
};

// getlast messages
export const getLastMessages = () => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("get", chatUrls.lastMessages, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// set message read
export const setMessageRead = (messageData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("patch", chatUrls.setMessageRead, messageData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// get unread messages
export const getUnReadMessages = (messageData) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("post", chatUrls.getUnreadMessages, messageData)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

// make account
export const switchAccountPrivate = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            apiCall("patch", userUrls.switchToPrivate, userId)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

//delete One message
export const deleteOneMsg = (id) => {
    return new Promise((resolve, reject) => {
        try {
            const url = `chat/delete-one?id=${id}`;
            apiCall("delete", url)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};

//delete One message
export const deleteConverstion = (id) => {
    return new Promise((resolve, reject) => {
        try {
            const url = `chat/delete-conv?id=${id}`;
            apiCall("delete", url)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            resolve({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Somethings wrong." });
        }
    });
};
