import UserList from "../components/admin/UserList";
import Admin from "../pages/admin/Admin";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import AdminLogin from "../pages/admin/login/adminLogin";
import AdminProtect from "./adminProtect";

export const adminRouter = {
  path: "/admin",
  element: 
          <AdminProtect>
            <Admin />,
          </AdminProtect>,
  children: [
    {
      path: "/admin/",
      element: <AdminDashboard />
    },
    {
      path: "/admin/users",
      element: <UserList />
    }
  ]
  
}

export const adminLoginRouter = {
  path: "/admin/login",
  element: <AdminLogin />
}