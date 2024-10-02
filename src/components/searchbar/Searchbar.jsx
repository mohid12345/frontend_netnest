import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserSearch } from '../../services/user/apiMethods';
import { useNavigate } from 'react-router-dom';


function Searchbar({closeSearchmodal}) {
  const selectedUser = (state) => state.auth.user
  const userData = useSelector(selectedUser)
  const userId = userData._id
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()

   useEffect(() => {
    if (searchQuery.length >= 2) { 
      getUserSearch({searchQuery: searchQuery})
       .then((response) => {
        // console.log("user search",response);
          setUsers(response.data.suggestedUsers);
        })
       .catch((error) => {
          console.error(error.message);
        });
    } else {
      setUsers([])
    }
  }, [searchQuery, setSearchQuery]); 

  const searchUser = (event) => {
    setSearchQuery(event.target.value); 
  };

  const handleSearch = (seachuser) => {
    closeSearchmodal()
    if(seachuser === userId) {
      navigate('/profile')
    } else {
      navigate(`/user-profile/${seachuser}`)
    }
  }


  return (
    <div className='fixed w-screen h-screen top-0  left-64 z-50 bg-black bg-opacity-30 backdrop-blur-md ml-0 border-l-1'>
      <div className="fixed w-full max-w-sm h-screen top-0 flex flex-col  bg-white dark:bg-black">
      
        <div className='flex justify-between p-2'>
          <div className="flex-grow flex items-center ml-2">
            <p className="font-semibold text-xl text-black dark:text-white">Search</p>
          </div>
          <div className="flex justify-end p-2">
            <button 
            onClick={closeSearchmodal}
            className=" text-white px-2 py-2 rounded">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-center items-start  h-14 p-2 border-t border-gray-400 mx-2">
          <input 
          onChange={searchUser} 
          type="search" placeholder="Search..." className="w-full max-w-md p-2 lg:mr-0 rounded-l-lg focus:outline-none mt-1" />
        </div>
        {/* search result */}
        {users.map((user) => (
          <div 
            onClick={() => handleSearch(user._id)}
            // to={`/user-profile/${user._id}`} 
            key={user.id} 
            className="flex items-center justify-between gap-3 mt-4 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md mr-3 py-1">
            <div className="flex cursor-pointer">
              <img className="flex w-12  h-12 rounded-full bg-black" src={user.profileImg} alt=""/>
            </div>
            <div className="flex-1 flex-col w-auto ms-1 mb-0 cursor-pointer">
              <p className="text-lg font-semibold text-black truncate dark:text-white">{user.userName}</p>
              <p className='text-sm font-normal text-gray-900 truncate dark:text-white'>{user.name}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Searchbar;
