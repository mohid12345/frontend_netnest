import React, { useEffect, useState } from 'react'
import { getAllUsers, getExplorePosts, getUserConnection } from '../../services/user/apiMethods';
import { useSelector } from 'react-redux';
import emptypost from "../../../public/images/nopost.jpg"
import ProfilePostLoader from '../../components/profile/ProfilePostLoader';
import UsersGallery from './UsersGallery';
import ExploreGallery from './ExploreGallery';

function Explore() {

  const selectedUser = (state) => state.auth.user;
  const user = useSelector(selectedUser);
  const userId = user._id;

  const [currentView, setCurrentView] = useState('posts');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([])

  useEffect(() => {
    try {
      setLoading(true)
      
      try {
        fetchPosts();
      } catch (error) {
        console.log(error);
      }

      getAllUsers({userId})
        .then((response)  => {
          const data = response.data
          console.log("user data", data);
          setUsers(data.users);
        })
        .catch((error) => {
          console.log(error);
        })

      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000); 
      });

    } catch (error) {
      console.log(error);
    }
  }, [userId])

  const fetchPosts = () => {
    getExplorePosts({userId})
      .then((response) => {
        const postsData = response.data;
        setPosts(postsData);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div>
      <div className='w-full mt-5 rounded-md bg-white dark:bg-black lg:px-10 lg:pr-0 pr-4'>
        <div className='flex justify-between lg:px-10 gap-10 p-0 font-normal text-lg w-full'>
          <div
            onClick={() => setCurrentView('posts')}
            className={`bg-white dark:bg-black dark:text-white w-full cursor-pointer text-center h-10 flex items-center justify-center rounded hover:shadow-md border-b border-gray-400 ${
              currentView === 'posts' ? 'border-b-2 border-blue-500' : ''
            }`}
          >
            Posts
          </div>
          <div
            onClick={() => setCurrentView('Users')}
            className={`bg-white dark:bg-black dark:text-white w-full cursor-pointer text-center h-10 flex items-center justify-center rounded hover:shadow-md border-b border-gray-400 ${
              currentView === 'Users' ? 'border-b-2 border-blue-500' : ''
            }`}
          > 
            Users
          </div>
        </div>

        {currentView === 'posts' ? (
          posts.length === 0 ? (
            <div className='flex flex-col justify-center items-center mt-4 text-black w-full h-auto'>
              {/* <img className='w-96' src={emptypost} alt="" />
              <p>Create your first post.</p> */}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 bg-white dark:bg-black lg:p-2 mt-2 lg:px-10'>
              {posts.map((post) => (
                <div>
                  {loading && <ProfilePostLoader/> }
                  {!loading && (
                    <div key={post._id} style={{width: '340px'}}>
                      <ExploreGallery post={post} fetchposts={fetchPosts} />
                    </div>
                  ) }
                </div>
              ))}
            </div>
          )
        ) : users.length === 0 ? (
          <div className='flex flex-col justify-center items-center mt-4 text-black w-full h-auto'>
            <img className='w-96' src={emptypost} alt="" />
            <p>No users</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-2 bg-white dark:bg-black p-2 mt-2 lg:px-10'>
            {users.map((user) => (
              <div key={user._id} className='lg:ml-0 ml-4' style={{width: '340px'}}>
                <UsersGallery user={user} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore