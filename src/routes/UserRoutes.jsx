import { createBrowserRouter } from "react-router-dom";
import Protect from "./protectedRoutes/protectedRoute";
import Login from "../pages/login/login";
import App from "../App";
import HomePage from "../pages/userHomePage/HomePage";
import Signup from "../pages/signup/Signup";
import Otp from "../pages/otpPage/otp"
import ForgotOtp from "../pages/otpPage/forgotOtp"
import ForgotPassword from "../pages/forgotPassword/forgotPassword"
import RenewPassword from "../pages/forgotPassword/renewPassword";
import Profile from "../pages/profile/Profile"
// import UserProfile from "../pages/userProfile/UserProfile"
import {adminLoginRouter, adminRouter} from "./adminRouter"

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: (
            <Protect>
            <App/>
            </Protect>
        ),
        children:[
            {
                path: "/",
                element: <HomePage/>
            }
            ,{
                path: '/profile',
                element: <Profile/>
            }

        ]
    },
    {
        path: "/login",
        element: (
            <Login />
        )
    }, 
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/otp",
        element: <Otp/>
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword/>
    },
    {
        path: "/forgot-otp",
        element: <ForgotOtp/>
    },
    {
        path: "/renew-password",
        element: <RenewPassword/>
    },
    adminLoginRouter,
    adminRouter
])

export default appRouter