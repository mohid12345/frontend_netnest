import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/admin/adminSidebar'


function Admin() {
  const selectAdmin = (state) => state.adminAuth.admin
  const admin = useSelector(selectAdmin)
  const navigate = useNavigate()
  console.log("in admin side");
  useEffect(() => {
    console.log("admin lkjsalfmaslkfnl");
    if(!admin) {
      navigate('/admin/login')
    }
  },[admin, navigate])
  
  return (
    <div className='flex'>
      <AdminSidebar />
      <Outlet />
    </div>
  )
}

export default Admin