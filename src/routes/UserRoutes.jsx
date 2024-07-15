import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/login";
import App from "../App";
import HomePage from "../pages/userHomePage/HomePage";
import Signup from "../pages/signup/Signup";
import Otp from "../pages/otpPage/otp"
import ForgotOtp from "../pages/otpPage/forgotOtp"
import ForgotPassword from "../pages/forgotPassword/forgotPassword"
import RenewPassword from "../pages/forgotPassword/renewPassword";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: (
            <App/>
        ),
        children:[
            {
                path: "/",
                element: <HomePage/>
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
    }
])

export default appRouter