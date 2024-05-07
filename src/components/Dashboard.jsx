// Dashboard.js

import axios from "axios";
import React, { useEffect, useState } from "react";
import { handleLogout } from "../utils/common";
import "./Dashboard.css"; // Import your CSS file
import Loader from "./Loader/Loader";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const email = sessionStorage.getItem("email");
  const userId = sessionStorage.getItem("authUserId");
  const userToken = sessionStorage.getItem("accessToken");

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_DEVELOPMENT}/api/v1/user/getuser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error in dashboard", error);
    }
  };

  const handleLogoutButton = () => {
    handleLogout(email, false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="header">User Info</div>

          {data.map((user, index) => (
            <div key={index} className="user-info">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Created At:</strong> {user.created_at}
              </p>
            </div>
          ))}

          <button
            className="logout-button"
            type="button"
            onClick={handleLogoutButton}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
