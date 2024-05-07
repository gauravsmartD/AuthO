import { toast } from "react-toastify";
import { auth } from "../services/auth0.service";
// import socket from "./config/socket";

export const handleLogout = (email, data) => {
    sessionStorage.clear();
    auth.logout({
      returnTo: `${process.env.REACT_APP_LOGOUT_URL}`, 
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      federated: true
    });
  };