import React from "react";
import Navbar from "./components/Navbar";
import WelcomeSection from './components/WelcomeSection';
import checkAuth from "./components/auth/checkAuth";
import { useSelector } from "react-redux";
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const user = useSelector((state) => state.auth.user);
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);

  return (
    <div>
      <Navbar />
      <WelcomeSection />
      <div>
        {user && isSuperuser ? ( // Check if user is logged in and is admin
          <div>
            <h1>Welcome Admin!</h1>
          </div>
        ) : user ? ( // Check if user is logged in
          <div>
            <h1>Welcome User!</h1>
          </div>
        ) : (
          <div>
            <h1>Please log in to continue</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default checkAuth(App);