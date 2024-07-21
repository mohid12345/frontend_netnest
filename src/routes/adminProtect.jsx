import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AdminProtect({ children }) {
  const navigate = useNavigate();
  const selectAdmin = (state) => state.adminAuth.admin;
  const admin = useSelector(selectAdmin);

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  if (admin) {
    return children;
  }

  // Optionally, you can return a loading indicator or null if admin check is in progress
  return null;
}

export default AdminProtect;
