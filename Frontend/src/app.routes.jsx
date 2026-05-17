import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login";    
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import InterviewReport from "./features/interview/pages/InterviewReprt";

//Set all routes here and use Protected component to protect routes which needs authentication
export const router = createBrowserRouter([
    {
        path : "/login",
        element : <Login />
    },
    {
        path : "/register",
        element : <Register />
    },
    {
        path: "/interview",
        element: <Protected> <Home/> </Protected>
    },
     {
        path: "/interview/:interviewId",
        element: <Protected> <InterviewReport/> </Protected>
    }


])