import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (password !== passwordConf) {
            setErrorMessage('Passwords do not match');
            return false;
        }
        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long');
            return false;
        }
        return true;
    };

    const registerUser = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const user = {
            username: username,
            email: email,
            password1: password,
            password2: passwordConf
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/postapi/signup/', user);
            setErrorMessage('');
            navigate('/login');
        } catch (error) {
            console.error('Error registering user:', error);
            if (error.response && error.response.data) {
                const errorMessages = Object.values(error.response.data.errors || {}).flat();
                setErrorMessage(errorMessages.join(' '));
            } else {
                setErrorMessage('Failed to connect to API');
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1>Register</h1>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <form onSubmit={registerUser}>
                            <div className="form-group">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={passwordConf}
                                    onChange={(event) => setPasswordConf(event.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <Link to="/login" className="float-left">
                                    Already have an account? Login
                                </Link>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary float-right">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
