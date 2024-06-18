// EditUser.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';

function EditUser() {
    const { id } = useParams();
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
    });
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.token) {
            axios.get(`http://127.0.0.1:8000/postapi/users/${id}/`, {
                headers: { 'Authorization': `Token ${user.token}` }
            })
            .then(response => {
                const { username, email } = response.data;
                setUserDetails({ username, email });
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                // Handle error appropriately (e.g., display a message to the user)
            });
        }
    }, [id, user]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (user && user.token) {
            axios.put(`http://127.0.0.1:8000/postapi/users/${id}/`, userDetails, {
                headers: {
                    'Authorization': `Token ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                navigate('/user/UserList');
            })
            .catch(error => {
                console.error('Error updating user details:', error);
                // Handle error appropriately (e.g., display a message to the user)
            });
        }
    };

    return (
        <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '20px 0' }}>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1 className="text-center">Edit User</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={userDetails.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={userDetails.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary float-right">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditUser;
