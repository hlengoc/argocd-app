import {useState} from "react";
import axios from "axios";
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

function Subscribe({onSignIn}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [askMe, setAskMe] = useState(false);
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleQuestionChange(event) {
    setQuestion(event.target.value);
  }
  const initiateAuth = async ({username, password, clientId}) => {
    const client = new CognitoIdentityProviderClient({
      region: "ap-southeast-1",
    });
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
        ClientId: clientId,
      });
      const result = await client.send(command);
      // console.log(result.AuthenticationResult.IdToken);
      setToken(result.AuthenticationResult.IdToken);
      setError("");
      alert("Login successfully! Now let look at your pets at the bottom ^^");
      onSignIn();
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };
  function handleLogin(event) {
    event.preventDefault();
    initiateAuth({
      username: email,
      password: password,
      clientId: "oljc1qeesbbjobfc03v71h2ov",
    });
    // Calling cognito identity provider library to get token
    // console.log("token is: " + token);
    //contact Lambda-backend API
    // axios({
    //   method: "post",
    //   url: "https://7jtrlo7xv8.execute-api.ap-southeast-1.amazonaws.com/dev/api",
    //   data: {
    //     question: question,
    //     email: email,
    //   },
    // });
    //contact EKS service API
    // axios({
    //   method: "post",
    //   url: "http://a778ee8aec0254689bd18c343f2a296c-375337423.ap-southeast-1.elb.amazonaws.com:8000/api/redis",
    //   data: {
    //     question: question,
    //     email: email,
    //   },
    // });
  }
  function handleSubmit(event) {
    event.preventDefault();
    // console.log(email);
    // console.log(password);
    // console.log(question);
    console.log("token is: " + token);
    //contact Lambda-backend API
    // axios({
    //   method: "post",
    //   // headers: {
    //   //   Authorization: token,
    //   // },
    //   url: "http://backend-service:8000/api/subscribe",
    //   data: {
    //     question: question,
    //     email: email,
    //   },
    // })
    axios({
      method: "post",
      headers: {
        Authorization: token,
      },
      url: "https://7jtrlo7xv8.execute-api.ap-southeast-1.amazonaws.com/dev/api/rds",
      data: {
        question: question,
        email: email,
      },
    })
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
    alert("Your request has been submitted!");
    setToken("");
    setEmail("");
    setPassword("");
    setQuestion("");
  }

  return (
    <>
      {!askMe ? (
        <div className="container-fluid">
          <button
            onClick={() => {
              setAskMe(!askMe);
            }}
          >
            Test the login function
          </button>
        </div>
      ) : (
        <form className="subscribe-div row g-3 container-fluid" method="POST">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="email"
              placeholder="Your email for contact..."
              value={email}
              onChange={handleEmailChange}
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Your password "
              value={password}
              id="password"
              onChange={handlePasswordChange}
            ></input>
          </div>
          {token ? (
            <div className="mb-3">
              <label htmlFor="question" className="form-label">
                Question
              </label>
              <textarea
                className="form-control"
                name="question"
                id="question"
                rows="4"
                placeholder="Your question for us..."
                value={question}
                onChange={handleQuestionChange}
              ></textarea>
            </div>
          ) : (
            ""
          )}
          {token ? (
            <div className="mb-3">
              <button
                type="submit"
                className="btn btn-outline-dark "
                onClick={handleSubmit}
              >
                Send Question
              </button>
            </div>
          ) : (
            <div className="mb-3">
              <button
                type="submit"
                className="btn btn-outline-dark "
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          )}
          <p>{error}</p>
        </form>
      )}
    </>
  );
}
export default Subscribe;
