import {useOktaAuth} from "@okta/okta-react";
import "./App.css";
import logo from "./assets/react.svg";

const Home = () => {
  const {authState, oktaAuth} = useOktaAuth();
  const signin = async () => await oktaAuth.signInWithRedirect();
  const signout = async () => await oktaAuth.signOut();
  return (
    <>
      <img src={logo} className="App-logo" alt="logo" />
      <div>
        {!authState?.isAuthenticated && (
          <button onClick={signin}>Sign In</button>
        )}

        {authState?.isAuthenticated && (
          <button onClick={signout}>Sign Out</button>
        )}
      </div>
      <p>
        Edit <code>src/Home.jsx</code> and save to reload.
      </p>
      <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
        Learn React
      </a>
    </>
  );
};

export default Home;
