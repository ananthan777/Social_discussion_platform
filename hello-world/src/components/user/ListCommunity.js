import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import checkAuth from '../auth/checkAuth';

function ListCommunities() {
    const [communities, setCommunities] = useState([]);
    const [filteredCommunities, setFilteredCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
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
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            setCommunities(response.data);
            console.log(response.data)
            setFilteredCommunities(response.data);
            setLoading(false); // Set loading to false when data is fetched
        })
        .catch(error => {
            console.error('Error fetching communities:', error);
            setLoading(false); // Set loading to false on error as well
        });
    };

    const handleLike = async (communityId) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/postapi/communities/${communityId}/like/`, {}, {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            });

            setCommunities(communities.map(community =>
                community.id === communityId 
                    ? { 
                        ...community, 
                        liked: !community.liked, 
                        likes_count: response.data.likes_count, 
                        dislikes_count: response.data.dislikes_count 
                    } 
                    : community
            ));
            setFilteredCommunities(filteredCommunities.map(community =>
                community.id === communityId 
                    ? { 
                        ...community, 
                        liked: !community.liked, 
                        likes_count: response.data.likes_count, 
                        dislikes_count: response.data.dislikes_count 
                    } 
                    : community
            ));
        } catch (error) {
            console.error('Error liking/unliking community:', error);
        }
    };

    const handleDislike = async (communityId) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/postapi/communities/${communityId}/dislike/`, {}, {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            });

            setCommunities(communities.map(community =>
                community.id === communityId 
                    ? { 
                        ...community, 
                        disliked: !community.disliked, 
                        likes_count: response.data.likes_count, 
                        dislikes_count: response.data.dislikes_count 
                    } 
                    : community
            ));
            setFilteredCommunities(filteredCommunities.map(community =>
                community.id === communityId 
                    ? { 
                        ...community, 
                        disliked: !community.disliked, 
                        likes_count: response.data.likes_count, 
                        dislikes_count: response.data.dislikes_count 
                    } 
                    : community
            ));
        } catch (error) {
            console.error('Error disliking/undisliking community:', error);
        }
    };

    const handleEdit = (communityId) => {
        navigate(`/edit-community/${communityId}`);
    };

    const handleCreatePost = (communityId) => {
        navigate(`/user/CreatePost/`);
    };

    const handleSearchChange = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearch(searchValue);
        if (searchValue === '') {
            setFilteredCommunities(communities);
        } else {
            setFilteredCommunities(communities.filter(community => 
                community.name.toLowerCase().includes(searchValue) ||
                community.description.toLowerCase().includes(searchValue)
            ));
        }
    };

    return (
        <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '20px 0' }}>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-10 offset-1">
                        <h1 className="text-center">Communities</h1>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search communities..."
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="card-columns">
                                {filteredCommunities.map(community => (
                                    <div key={community.id} className="card mb-4">
                                        {community.image ? (
                                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                                <img
                                                    src= {community.image}
                                                    className="card-img-top"
                                                    alt={community.name}
                                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null; // prevent infinite loop
                                                        e.target.style.display = 'none'; // hide broken image
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <p>No Image Available</p>
                                        )}
                                        <div className="card-body">
                                            <h5 className="card-title">{community.name}</h5>
                                            <p className="card-text">{community.description}</p>
                                            <p className="card-text">Likes: {community.likes_count} | Dislikes: {community.dislikes_count}</p>
                                            <button
                                                className="btn btn-primary mr-2"
                                                onClick={() => handleEdit(community.id)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn btn-secondary mr-2" 
                                                onClick={() => handleLike(community.id)}
                                            >
                                                {community.liked ? 'Liked' : 'Like'}
                                            </button>
                                            <button 
                                                className="btn btn-danger mr-2" 
                                                onClick={() => handleDislike(community.id)}
                                            >
                                                {community.disliked ? 'Disliked' : 'Dislike'}
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleCreatePost(community.id)}
                                            >
                                                Create Post
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default checkAuth(ListCommunities);
