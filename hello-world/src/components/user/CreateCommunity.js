import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import checkAuth from '../auth/checkAuth';

function CreateCommunity() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    
    
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    

    const createCommunity = () => {
        const token = user?.token || localStorage.getItem('token');
        
        if (!token) {
            console.error('No user token found');
            return;
        }

        console.log('User token:', token); // 


        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', image);

        axios.post("http://127.0.0.1:8000/postapi/create_community/", formData, {
            headers: {
                "Authorization": `Token ${user.token}`,
                "Content-Type": "multipart/form-data",
            },
        }).then(response => {
            navigate('/');
        }).catch(error => {
            console.error('Error creating community:', error);
           
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createCommunity();
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '20px 0' }}>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1 className="text-center">Create Community</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={name} 
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    className="form-control" 
                                    value={description} 
                                    onChange={(event) => setDescription(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input 
                                    type="file" 
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default checkAuth(CreateCommunity);
