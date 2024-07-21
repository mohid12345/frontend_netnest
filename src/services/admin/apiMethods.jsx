import { adminUrls } from "../endPoints";
import adminApiCalls from "./apiCalls";

// Admin login

export const adminPostLogin = (adminData) => {
  return new Promise((resolve, reject) => {
    try {
      adminApiCalls("post", adminUrls.login, adminData)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export const adminUserList = () => {
  return new Promise((resolve, reject) => {
    try {
      adminApiCalls("get", adminUrls.userList, null)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export const adminUserBlock = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      adminApiCalls("post", adminUrls.userBlock, userId)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export const adminPostList = () => {
  return new Promise((resolve, reject) => {
    try {
      adminApiCalls("get", adminUrls.postList, null)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export const adminPostBlock = (postId) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("in api call", postId);
      adminApiCalls("post", adminUrls.postBlock, postId)
    .then((response) => {
      resolve(response)
    })
    .catch((err) => {
      reject(err)
    })
    } catch (error) {
      reject(error)
    }
  })
}

export const adminReportList = () => {
  return new Promise((resolve, reject) => {
    try {
      adminApiCalls("get", adminUrls.reportList, null)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export const getDashboardDetails = () => {
  return new Promise((resolve, reject) => {
    try {
      adminApiCalls("get",adminUrls.getDetails, null) 
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
} 