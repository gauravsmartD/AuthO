import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../services/auth0.service";
import { toast } from "react-toastify";
import Loader from "./Loader/Loader";
import { handleLogout } from "../utils/common";

const Authenticate = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState();


  const processAuthentication = async (search) => {
    setLoading(true);
    const params = new URLSearchParams(search);
    
    const code = params.get("code");
    // console.log("code is code", code);
    // console.log(window.location.href);

    const code_verifier = sessionStorage.getItem("verifier");
    // console.log("token code_verifier is here", code_verifier);
    // this is the api for getting the access token and refresh token
    await auth.client.oauthToken(
      {
        code,
        code_verifier,
        grantType: "authorization_code",
        scope:
          "openid profile user_metadata  email read:users read:current_user update:users update:current_user_identities update:users_app_metadata,update:current_user_metadata offline_access update:users update:users_app_metadata update:current_user_metadata update:current_user_identities",
        redirect_uri: process.env.REACT_APP_AUTH0_LOGIN_REDIRECT_URL,
        // client_secret: AUTH0_CLIENT_SECRET,
        client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
        // audience: `https://mp-si.uk.auth0.com/api/v2/`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      },
      (error, result) => {
        if (error) {
          // console.log("token error is here", error);
          toast.error(error?.error);
          setLoading(false);
          navigate("/");
        }
        if (result) {
          // console.log("token data is here", result);
          const { accessToken, idToken } = result;
          sessionStorage.setItem("accessToken", accessToken);
          sessionStorage.setItem("idToken", idToken);
          accessToken &&
          auth.client.userInfo(accessToken, async (error, result) => {
            if (error) {
              // console.log("Error in processing the hash", error);
              setLoading(false);
              return;
            }
              setProfile(result);
              // after update member profile
              setLoading(true);
              sessionStorage.setItem("email", result?.email);
              sessionStorage.setItem("authUserId", result?.sub);
              sessionStorage.setItem("isAuthenticated", true);
             
            const redirectUrl = location?.state?.path || "/dashboard";
            navigate(redirectUrl, { replace: true });
              // console.log("profile", result);
            });
        }
      }
    );
  };
  useEffect(() => {
    if (location.search) {
      processAuthentication(location.search);
    }
  }, [location.search]);
  return (
    <>
      {" "}
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="main-section"></div>
      )}
    </>
  );
};
export default Authenticate;
