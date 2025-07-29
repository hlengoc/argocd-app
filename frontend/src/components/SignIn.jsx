import { useAuth } from "react-oidc-context";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";
import "./SignIn.css"

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
        "cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_FQTn7iOst":
          token,
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

function SignIn({ onSignIn, onSignOut }) {
  const auth = useAuth();
  const signOutRedirect = () => {
    const clientId = "72mbup7jo0vls4gbe5osag0mqu";
    const logoutUri = "https://d1tqm374y224ee.cloudfront.net";
    const cognitoDomain =
      "https://ap-southeast-1fqtn7iost.auth.ap-southeast-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    //Verify if user is authenticated by calling DynamoDb service and show a table entry
    getData(auth.user?.id_token);
    return (
      <div id="signin-info" className="container-fluid">
        <pre> Hello: {auth.user?.profile.email} </pre>
        {/* <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre> */}
        <button
          onClick={() => {
            onSignOut();
            auth.removeUser();
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="position-relative">
      <div className="position-absolute top-0 end-0">
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle"></i>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <button
                className="btn btn-light dropdown-item"
                onClick={() => auth.signinRedirect()}
              >
                Sign-in/Sign-up
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
