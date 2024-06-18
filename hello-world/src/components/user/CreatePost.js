import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [community, setCommunity] = useState('');
    const [image, setImage] = useState(null);
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = () => {
        if (!user || !user.token) {
            console.error('No user token found');
            return;
        }

        axios.get("http://127.0.0.1:8000/postapi/list-communities/", {
            headers: {
                "Authorization": `Token ${user.token}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            setCommunities(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching communities:', error);
            setLoading(false);
        });
    };

    const createPost = () => {
        if (!user || !user.token) {
            console.error('No user token found');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('community', community);
        if (image) {
            formData.append('image', image);
        }

        axios.post("http://127.0.0.1:8000/postapi/create-post/", formData, {
            headers: {
                "Authorization": `Token ${user.token}`,
                "Content-Type": "multipart/form-data"
            }
        }).then(response => {
            navigate('/list-communities');
        }).catch(error => {
            console.error('Error creating post:', error);
            setError('Failed to create post. Please try again.');
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createPost();
    };

    return (
        <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '20px 0' }}>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1 className="text-center">Create Post</h1>
                        {error && <p className="text-danger">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={title} 
                                    onChange={(event) => setTitle(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <textarea 
                                    className="form-control" 
                                    value={content} 
                                    onChange={(event) => setContent(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Community</label>
                                <select
                                    className="form-control"
                                    value={community}
                                    onChange={(event) => setCommunity(event.target.value)}
                                    required
                                >
                                    <option value="">Select a community</option>
                                    {communities.map((comm) => (
                                        <option key={comm.id} value={comm.id}>
                                            {comm.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input 
                                    type="file" 
                                    className="form-control-file" 
                                    onChange={(event) => setImage(event.target.files[0])}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Create Post</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
