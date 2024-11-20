import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import HomePosts from '../../components/homepost/HomePosts'
import MiniProfile from '../../components/userMiniProfile/MiniProfile'
import { getAllPosts } from '../../services/user/apiMethods'
import Header from '../../components/header/header'
import { toast } from 'sonner'
import Loader from '../../components/loader/loader'
import HomePostLoader from '../../components/loader/HomePostLoader'
import emptypost from '../../../public/images/userNoPost.jpg'
  

function HomePage() {
  const selectedUser = (state) => state.auth.user;
  console.log('selectedUser from homepage ::', selectedUser);
  
  const user = useSelector(selectedUser);
  const userId = user._id || "";
  console.log('userId log 666666:', userId);
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    getAllPosts({ userId: userId })
      .then((response) => {
        const postDatas = response.data;
        console.log('my psot data 00:', postDatas);
        if (postDatas && Array.isArray(postDatas)) {
          setPosts(postDatas);
        } else {
          console.log('postDatas is not populated as expected.');
        }
      })
      // console.log('my psot data 00:', posts);
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="flex flex-col mr-2 lg:ml-10" style={{width:'870px'}}>
        <div className="p-2 rounded-md bg-white dark:bg-black">
          <Header />
        </div>

        {loading ? (
          <div className="flex lg:px-10 justify-center items-center mt-4 w-full h-auto">
            <HomePostLoader />
          </div>
        ) : (
          <>
            {posts.length === 0 ? (
              <div className='flex flex-col justify-center items-center mt-4 text-black w-full h-auto'>
                <img className='w-96' src={emptypost} alt="No posts" />
                <p className='text-gray-500'>Build your connections and share your moments.</p>
              </div>
            ) : (
              <div className="w-full lg:px-10 p-4 py-4 mr-2 h-max rounded-md bg-white dark:bg-black">
                {posts.map((post) => (
                  <HomePosts key={post._id} post={post} fetchPosts={fetchPosts} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="hidden lg:flex fixed right-0">
        <MiniProfile />
      </div>
    </>
  );
}


export default HomePage 