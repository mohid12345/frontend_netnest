import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/login";
import App from "../App";
import HomePage from "../pages/userHomePage/HomePage";
import Signup from "../pages/signup/Signup";

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
])

export default appRouter