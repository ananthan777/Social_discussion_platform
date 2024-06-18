import React from 'react';
import './WelcomeSection.css'; // Import the CSS file
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const WelcomeSection = () => {
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);

  return (
    <div className={`welcome-section ${isSuperuser ? 'admin-login' : ''}`}>
      <h2>Welcome to our Social App!</h2>
      <p>Explore the latest communities{!isSuperuser && ' and join the discussions now'}</p>
      {!isSuperuser && (
        <Link to="/admin/CommunityList/" className="custom-btn">
          Visit Profiles
        </Link>
      )}
    </div>
  );
};

export default WelcomeSection;
