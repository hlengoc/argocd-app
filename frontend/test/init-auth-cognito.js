// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

/** snippet-start:[javascript.v3.cognito-idp.actions.InitiateAuth] */
// const initiateAuth = ({ username, password, clientId }) => {
//   const client = new CognitoIdentityProviderClient({});

//   const command = new InitiateAuthCommand({
//     AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
//     AuthParameters: {
//       USERNAME: username,
//       PASSWORD: password,
//     },
//     ClientId: clientId,
//   });

//   client.send(command).then(
//     (data) => {
//       return data.AuthenticationResult.IdToken;
//     },
//     (error) => {
//       console.error(error);
//     }
//   );

//   return 0;
// };

//Async
const initiateAuth = async ({ username, password, clientId }) => {
  const client = new CognitoIdentityProviderClient({});

  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
    ClientId: clientId,
  });

  const result = await client.send(command);
  return result.AuthenticationResult.IdToken;
};

initiateAuth({
  username: "leensea96@gmail.com",
  password: "Iambawmim2609!",
  clientId: "72mbup7jo0vls4gbe5osag0mqu",
}).then((data) => {
  console.log(data);
});
