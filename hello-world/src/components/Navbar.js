import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";

function Navbar() {
    const user = useSelector(store => store.auth.user);
    const isSuperuser = useSelector(store => store.auth.isSuperuser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        console.log(user);
        if (user) {
            axios.post('http://127.0.0.1:8000/postapi/logout/', {}, {
                headers: { 'Authorization': "Token " + user.token }
            })
            .then(() => {
                dispatch(removeUser());
                navigate('/login');
            })
            .catch(error => {
                console.error("Logout failed:", error);
            });
        }
    };

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="navbar-brand">
                <h4 style={{ paddingLeft: '10px' }}>
                    <span style={{ color: '#E6DDF3' }}>REDDIT</span>
                    
                    </h4>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse mr-auto" id="navbarNav" style={{ float: "left" }}>
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                    <li className="nav-item">
                        <NavLink exact to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Home
                        </NavLink>
                    </li>
                    {user && (
                        <>
                            <li className="nav-item">
                                <NavLink to="/create-community" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    Community
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/communities" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    Communities
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/user/UserList" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    Profile
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" onClick={logout}>Logout</span>
                            </li>
                        </>
                    )}
                    {isSuperuser && (
                        <>
                            <li className="nav-item">
                                <NavLink to="/admin/CommunityList" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    List
                                </NavLink>
                            </li>
                           
                        </>
                    )}
                    {!user && (
                        <>
                            <li className="nav-item">
                                <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    Signup
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    Login
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
 );
}

export default Navbar;