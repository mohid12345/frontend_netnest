import { apiCall } from "./apiCalls";
import { userUrls } from "../endPoints";

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
