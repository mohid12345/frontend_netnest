import React, {useEffect, useState} from 'react'
import * as Yup from "yup"
import {editPost, getEditPost} from '../../services/user/apiMethods'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../../utils/context/reducers/authSlice'
import { toast } from 'sonner'
import { useFormik } from 'formik'

function EditPost({handlePostEdit, postId, userId,fetchPosts }) {
    const dispatch = useDispatch()
    const [post,setPost] = useState(null)

    useEffect(() => {
        getEditPost({postId})
        .then((response) => {
            const post = response.data;
            setPost(post)
            Formik.setValues({
                title: post.title,
                imageUrl: post.imgUrl
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }, [postId])
    
    const resetState=()=> {
        formik.values.title='';
    }

    const formik = useFormik({
        initialValues: {
            title: '',
        },
        validationSchema: Yup.object({
            title: Yup.string()
            .trim()
            .required("Title is required")
            .match(/^\S+.*\S$/,"Title cannot contain only spaces"),
        }),
        onSubmit: async() => {
            const {title} = formik.values;
            console.log("from edit post :", postId,title );
            editPost({postId, userId, title})
            .then((response) => {
                const PostData = response.data
                dispatch(setPosts({posts: PostData.posts}))
                toast.info("Post updated successfully")
                resetState()
                handlePostEdit()
                fetchPosts()
            })
            .catch((error) => {
                toast.error(error?.message)
                console.log(error?.message);
            })
        }
    })
    
  return (
    
    <div className='fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-md'>
      <div className='flex justify-center items-center h-full '> 
        <div className='bg-white p-10 space-y-4 w-full md:mx-80 rounded-md'> 
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold text-xl'>Edit Post</h2>
            <div >
            <button 
            onClick={handlePostEdit}
            className=" text-white px-2 py-2 rounded">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>
            </button>
          </div>
          </div>
          <div className='max-w-md mx-auto'>

          {post?.imgUrl && (
              <div className="mb-4">
                <img src={post.imgUrl} alt="Post Image" className="w-80 h-auto max-h-60 object-cover mx-auto rounded" />
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto">
            
              {/* Title Input */}
              <div className="relative z-0 w-full mb-5 group mb-2">
                <input 
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text" 
                name="title" id="title" 
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                <label htmlFor="title" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Title *</label>
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-600 text-xs">
                  {formik.errors.title}
                </p>
              )}
              </div>

              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPost