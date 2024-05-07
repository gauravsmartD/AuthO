import { AUTH0_CLIENT_ID, AUTH0_DOMAIN, AUTH0_USER_SCOPE } from "../config";
import auth0 from "auth0-js";

const auth = new auth0.WebAuth({
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  scope: AUTH0_USER_SCOPE,
});

export { auth };