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
  

function HomePage() {
  const selectedUser = (state) => state.auth.user;
  console.log("ccd 1:", selectedUser);
  const user = useSelector(selectedUser);
  console.log("ccd 2:", user);
  const userId = user._id || "";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      fetchposts();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchposts = () => {
    setLoading(true);
    getAllPosts({ userId: userId })
      .then((response) => {
        const postDatas = response.data;
        setPosts(postDatas);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        // Set loading to false after 2 seconds
        setTimeout(() => {
          setLoading(false);
        }, 1000); // Adjust the time as needed
      });
  };

  return (
    <>
      {/* <div className="flex justify-between w-full"> */}
        

        <div className="flex flex-col mr-2 lg:ml-5" style={{width:'870px'}}>
          <div className="p-1 rounded-md  bg-white dark:bg-slate-700">
            <Header />
          </div>
           <div className="w-full lg:px-10 p-4 py-4 mr-2 h-max rounded-md bg-white dark:bg-slate-700">
            {posts.map((post) => {
              // console.log("post in inside home", post);
              return (
                <div>
                  {loading && <HomePostLoader/> }
                  {!loading && 
                    <HomePosts key={post._id} post={post} fetchposts={fetchposts} />
                  }
                </div>
              )
            })}
          </div> 
        </div>
       
      {/* </div> */}
        <div className="hidden lg:flex fixed right-0">
          <MiniProfile />
        </div>
    </>
  );
}


export default HomePage 