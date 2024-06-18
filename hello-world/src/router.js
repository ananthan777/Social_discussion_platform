import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Register from "./components/auth/register";
import Login from "./components/auth/Login";
import CreateCommunity from "./components/user/CreateCommunity";
import ListCommunity from "./components/user/ListCommunity";
import UserList from "./components/user/UserList";
import EditUser from "./components/user/EditUser";
import CommunityList from "./components/admin/CommunityList";
import EditCommunity from "./components/admin/EditCommunity";
import CreatePost from "./components/user/CreatePost";

const router = createBrowserRouter([
    { path: '/', element: <App/> }, // Root route
    { path: '/register', element: <Register/> }, // Register route
    { path: '/login', element: <Login/> }, // Login route
    { path: '/create-community', element: <CreateCommunity/>},
    { path: '/communities', element: <ListCommunity/>},
    { path: '/user/UserList', element: <UserList/>}, 
    { path: '/edit_user/:id/', element:<EditUser/>},
    {path:'/user/CreatePost/',element:<CreatePost/>},


    {path:'/admin/CommunityList',element:<CommunityList/>},
    {path:'/edit-community/:id',element:<EditCommunity/>},
    
    
    
]);

export default router;
