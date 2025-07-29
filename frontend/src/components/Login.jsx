import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";
import { useState } from "react";

async function getData(token) {
  const client = new DynamoDBClient({
    region: "ap-southeast-1",
    // credentials: fromCognitoIdentityPool({
    //     clientConfig: { region: "ap-southeast-1" },
    //     identityPoolId: "ap-southeast-1:f1bac67f-3a27-497d-bf52-acd2309fa0cb"
    // })
    credentials: fromCognitoIdentityPool({
      // Required. The unique identifier for the identity against which credentials
      // will be issued.
      identityPoolId: "ap-southeast-1:f1bac67f-3a27-497d-bf52-acd2309fa0cb",
      // Optional. The ARN of the role to be assumed when multiple roles were received in the token
      // from the identity provider.
      // customRoleArn: "arn:aws:iam::1234567890:role/MYAPP-CognitoIdentity",
      // Optional. A set of name-value pairs that map provider names to provider tokens.
      // Required when using identities associated with external identity providers such as Facebook.
      logins: {
        "graph.facebook.com": token,
      },
      clientConfig: { region: "ap-southeast-1" },
    }),
  });
  const input = {
    // ScanInput
    TableName: "items", // required
    AttributesToGet: [
      // AttributeNameList
      "id",
      "src",
      "title",
    ],
  };
  const command = new ScanCommand(input);
  const response = await client.send(command);
  console.log(response.Items[0].title.S);
}

function Login(props) {
  const [hello, setHello] = useState("");

  function statusChangeCallback(response) {
    // Called with the results from FB.getLoginStatus().
    console.log("statusChangeCallback");
    console.log(response); // The current login status of the person.
    if (response.status === "connected") {
      // Logged into your webpage and Facebook.
      FB.api("/me", function (response) {
        setHello("Hello, " + response.name);
      });
      testAPI();
    } else {
      // Not logged into your webpage or we are unable to tell.
      console.log(response);
    }
  }

  function checkLoginState() {
    // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function (response) {
      // See the onlogin handler
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function () {
    FB.init({
      appId: "1602811093983752",
      cookie: true, // Enable cookies to allow the server to access the session.
      xfbml: true, // Parse social plugins on this webpage.
      version: "v21.0", // Use this Graph API version for this call.
    });

    FB.getLoginStatus(function (response) {
      // Called after the JS SDK has been initialized.
      statusChangeCallback(response); // Returns the login status.
    });
  };

  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");

  function testAPI() {
    // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log("Welcome!  Fetching your information.... ");
    FB.api("/me", function (response) {
      console.log("Successful login for: " + response.name);
    });
    FB.login(function (response) {
      // Check if the user logged in successfully.
      if (response.authResponse) {
        getData(response.authResponse.accessToken);
      } else {
        console.log("There was a problem logging you in.");
      }
    });
  }

  return (
    <>
      <fb:login-button
        scope="public_profile,email"
        onLogin={checkLoginState}
      ></fb:login-button>
      <div id="status">
        <p>{hello}</p>
      </div>
    </>
  );
}

export default Login;
