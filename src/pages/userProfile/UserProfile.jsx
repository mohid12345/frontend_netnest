import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getUserDetails, getUserPost } from '../../services/user/apiMethods';
import { toast } from 'sonner';
import UserDetails from '../../components/userDetails/UserDetails';
import Loader from '../../components/loader/loader';

function UserProfile() {  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();


  useEffect(() => {
    setLoading(true)    
    getUserDetails(userId)
      .then((response) => {
        setUser(response.data.user)
        setConnections(response.data.connections);
      })
      .catch((error) => {
        toast.error(error.message);
      })
    getUserPost(userId) 
      .then((response) => {
        console.log(response);
        
        const postsData = response.data;
        // console.log('postdata :', postsData);
        
        setPosts(postsData);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
      
  },[])

  // console.log('connectiond @front userProfile :', connections);
  

  return (
    <div className='w-full mr-2'>
      {loading && <p className='flex justify-center items-center mt-10'><Loader/></p> }
      {!loading && <UserDetails user={user} connections={connections} posts={posts} />}
    </div>
  )
}

export default UserProfile