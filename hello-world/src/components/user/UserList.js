import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/postapi/users/', {
                    headers: {
                        Authorization: `Token ${user.token}`,
                    },
                });
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users. Please try again later.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user.token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="user-list-container">
            <Navbar />
            <div className="container">
                <h1 className="text-center">Users</h1>
                <div className="row">
                    {users.map((user) => (
                        <div key={user.id} className="col-12 col-md-6 col-lg-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{user.username}</h5>
                                    <p className="card-text">Email: {user.email}</p>

                                    <Link to={`/edit_user/${user.id}`} className="btn btn-primary">Edit User</Link> {/* Edit User button */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserList;
