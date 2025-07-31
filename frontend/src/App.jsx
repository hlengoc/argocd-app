import {useState} from "react";
import "./index.css";
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import Home from './Home';
import Profile from "./Profile";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./components/HomePage";


const oktaAuth = new OktaAuth({
  issuer: "https://dev-39748740.okta.com/oauth2/default",
  clientId: "0oaon19v96y6UoIp05d7",
  redirectUri: window.location.origin + "/login/callback",
  scopes: ["openid", "profile", "email", "offline_access"],
});

function App() {
  const restoreOriginalUri = (_oktaAuth, originalUri) => {
    window.location.replace(originalUri || '/');
  };

  return (
    <>
      <BrowserRouter>
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/login/callback" element={<LoginCallback />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Security>
      </BrowserRouter>
    </>
  );
}

export default App;

