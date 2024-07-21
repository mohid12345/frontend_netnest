import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AdminLogout } from '../../utils/context/reducers/adminAuthSlice'
import { getDashboardDetails } from '../../services/admin/apiMethods'

function AdminProfile() {
  const selectedAdmin = (state) => state.adminAuth.admin
  const admin = useSelector(selectedAdmin)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(AdminLogout());
    localStorage.removeItem("email");
    toast.info("Logout succussfull");
    navigate("/admin/login")
  }

  const [isDashboardData, setDashboardDatas] = useState('')

  useEffect(() => {
    getDashboardDetails()
      .then((response) => {
        const dashboardDatas = response.data
        setDashboardDatas(dashboardDatas)
        console.log("dashboardDatas",dashboardDatas);
      })
  },[])

  return (
    <>
      <div className='w-full p-4 mr-2'>
        <div className='flex w-full justify-center mb-6'>
          <div className='flex bg-white w-full rounded-md shadow-md'>
            <div className='lg:flex lg:p-8 ml-8 justify-center gap-8'>
              <div className="flex lg:ml-8 ml-10 justify-center">
                <img
                  className=" h-40 w-40 rounded-full"
                  src={admin.profileImg}
                  alt=""
                />
              </div>
              <div className='block lg:ml-8 ml-8 lg:py-0 py-2 lg:mt-0 text-center'>
                <div className='font-semibold text-3xl pb-2'>{admin.name}</div>
                <div className='pb-0'>{admin.email}</div>
                <p></p>
                 
              </div>
              <div className='flex flex-col lg:ml-6'>
                <div className='flex lg:ml-0 justify-between items-center'>
                  <div className='flex items-center px-2'>
                    <button 
                    className='lg:bg-black lg:text-white lg:h-10 lg:w-28 py-2 px-4 rounded  '>Edit Profile</button>
                  </div>
                  <div className='flex items-center px-4'>
                    <button 
                    onClick={handleLogout}
                    className=' lg:bg-black lg:text-white lg:h-10 lg:w-28 py-2 px-4 rounded ml-0 '>Logout</button>
                  </div>
                </div>
                <div className='flex justify-between lg:mt-8 mt-2 cursor-pointer'>
  <div className='flex flex-col cursor-pointer items-center'>
    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-blue-500">
      <p className="font-medium text-lg">{isDashboardData.totalUsers}</p>
    </div>
    <p className="text-sm mt-2">Users</p>
  </div>
  <div className='flex flex-col cursor-pointer items-center'>
    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-yellow-300">
      <p className="font-medium text-lg">{isDashboardData.totalPosts}</p>
    </div>
    <p className="text-sm mt-2">Posts</p>
  </div>
  <div className='flex flex-col cursor-pointer items-center'>
    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-red-500">
      <p className="font-medium text-lg">{isDashboardData.totalReports}</p>
    </div>
    <p className="text-sm mt-2">Reports</p>
  </div>
</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default AdminProfile