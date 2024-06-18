import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import checkAuth from '../auth/checkAuth';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button

function ListCommunities() {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [communityToDelete, setCommunityToDelete] = useState(null);
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
        }).then(response => {
            setCommunities(response.data);
            setLoading(false); // Set loading to false when data is fetched
        }).catch(error => {
            console.error('Error fetching communities:', error);
            setLoading(false); // Set loading to false on error as well
        });
    };

    const handleEdit = (communityId) => {
        navigate(`/edit-community/${communityId}`);
    };

    const handleDelete = (communityId) => {
        setShowModal(true);
        setCommunityToDelete(communityId);
    };

    const confirmDelete = () => {
        if (!user || !user.token) {
            console.error('No user token found');
            return;
        }
        axios.delete(`http://127.0.0.1:8000/postapi/delete-community/${communityToDelete}/`, {
            headers: {
                "Authorization": `Token ${user.token}`,
                "Content-Type": "application/json"
            }
        }).then(response => {
            setCommunities(communities.filter(community => community.id !== communityToDelete));
            setShowModal(false);
            setCommunityToDelete(null);
        }).catch(error => {
            console.error('Error deleting community:', error);
            setShowModal(false);
            setCommunityToDelete(null);
        });
    };

    return (
        <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '20px 0' }}>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1 className="text-center">Communities</h1>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="card-columns">
                                {communities.map(community => (
                                    <div key={community.id} className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">{community.name}</h5>
                                            <p className="card-text">{community.description}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleEdit(community.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(community.id)}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this community?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default checkAuth(ListCommunities);