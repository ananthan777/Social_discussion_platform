// EditCommunity.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';
import checkAuth from '../auth/checkAuth';

function EditCommunity() {
    const { id } = useParams();
    const [community, setCommunity] = useState({
        name: '',
        description: '',
        image: null
    });
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.token) {
            axios.get(`http://127.0.0.1:8000/postapi/communities/${id}/`, {
                headers: { 'Authorization': `Token ${user.token}` }
            })
            .then(response => {
                const { name, description, image } = response.data;
                setCommunity({ name, description, image });
            })
            .catch(error => {
                console.error('Error fetching community:', error);
                // Handle error appropriately (e.g., display a message to the user)
            });
        }
    }, [id, user]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCommunity({ ...community, [name]: value });
    };

    const handleImageChange = (event) => {
        setCommunity({ ...community, image: event.target.files[0] });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (user && user.token) {
            const formData = new FormData();
            formData.append('name', community.name);
            formData.append('description', community.description);
            formData.append('image', community.image);

            axios.put(`http://127.0.0.1:8000/postapi/communities/${id}/edit/`, formData, {
                headers: {
                    'Authorization': `Token ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                navigate('/communities');
            })
            .catch(error => {
                console.error('Error updating community:', error);
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
                        <h1 className="text-center">Edit Community</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={community.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={community.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    className="form-control-file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
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

export default checkAuth(EditCommunity);
