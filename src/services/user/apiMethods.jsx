import { apiCall } from "./apiCalls";
import { postUrls, userUrls } from "../endPoints";

//user registration

export const postRegister = (userData) => {
  return new Promise((resolve, reject) => {
    try {
      apiCall("post", userUrls.register, userData)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      resolve({staus: 500, message: "Something wrong"})
    }
  })
}

// OTP verification
export const postOTP = (otp) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("otp in postotp", otp);
      apiCall("post", userUrls.registerOtp, otp)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
    } catch (error) {
      resolve({status:500, message: "something wrong"})
    }
  })
} 

// resent otp
export const postResendOTP = (email) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("postresendotp");
      apiCall("post", userUrls.resendOtp, email)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      resolve({status: 500, message: "Something wrong"})
    }
  })
}

// login

export const postLogin = (userData) => {
  return new Promise((resolve, reject) => {
    try {
      apiCall("post", userUrls.login, userData)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      resolve({status: 500, message: "Something wrong"})
    }
  })
}

// forgotOTP

export const forgotOTP = (otp) => {
  return new Promise((resolve, reject) => {
    try {
      apiCall('post', userUrls.forgotOtp, otp)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      resolve({status: 500, message: "Something wrong"})
    }
  })
}

// forgot password

export const forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    try {
      apiCall('post',userUrls.forgotPassword, email)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      resolve({status: 500, message: "Something wrong"})
    }
  })
}


// renew password

export const renewPassword = (userData) => {
  return new Promise((resolve, reject) => {
    try {
      apiCall("post", userUrls.resetPassword, userData)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      resolve({status: 500, message: "Something wrong"})
    }
  })
}



// google authentication

export const googleAuthenticate = (userData) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("userdata in api method", userData)
      apiCall("post", userUrls.googleAuth, userData)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      resolve({status: 500, message: "Something wrong"})
    }
  })
}

//Add new post
export const addPost = (postData) => {
  return new Promise((resolve, reject) => {
    try{
      console.log("Postdata in api", postData);
      apiCall("post", postUrls.addPost, postData)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
    } catch(error){
      resolve({status: 500, message:"Something wrong"})
    }
  })
}

//get user post
export const getUserPost = (userId) => {
  return new Promise((resolve, reject) =>{
    try {
      console.log("in userpost api call");
      const url = `${postUrls.getUserPosts}/${userId}`
      apiCall("get", url, null)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
    } catch (error) {
      resolve({status: 500, message: "Something wrong"})
    }
  })
}

//get all posts
export const getAllPosts = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log("userid in getallpost",userId);
      apiCall("post", postUrls.getAllPosts,userId)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  } catch (error) {
    resolve({status: 500, message: "Something wrong"})
  }
})
}
// get all posts
export const getEditPost = (postId) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log("userid in getallpost",userId);
      apiCall("post", postUrls.getEditPost, postId)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      resolve({status: 500, message: "Something wrong"})
    }
  })
}


// delete post
export const deletePost = (postData) => {
  return new Promise((resolve, reject) => {
    try {
      apiCall("post", postUrls.deletePost, postData)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      resolve({status: 500, message: "Something wrong"})
    }
  })
}


// user edit profile
export const editProfile = (userData) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("userdata in api method", userData)
      apiCall("post", userUrls.editProfile, userData)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      resolve({status: 500, message: "Something wrong"})
    }
  })
}



