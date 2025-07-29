// import React from 'react'
// import ReactDOM from 'react-dom/client'
import Heading from "./components/Heading.jsx";
import Items from "./components/Items.jsx";
import Subscribe from "./components/Subscribe.jsx";
import Login from "./components/Login.jsx";
import App from "./App.jsx";
import SignIn from "./components/SignIn.jsx";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {AuthProvider} from "react-oidc-context";
import "./index.css";

const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_FQTn7iOst",
  client_id: "72mbup7jo0vls4gbe5osag0mqu",
  redirect_uri: "https://d1tqm374y224ee.cloudfront.net",
  // redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "email openid phone",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);
