// Return list of Items
import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";
import {nanoid} from "nanoid";
import Item from "./Item";

const client = new DynamoDBClient({
  region: "ap-southeast-1",
  credentials: fromCognitoIdentityPool({
    clientConfig: {region: "ap-southeast-1"},
    identityPoolId: "ap-southeast-1:f1bac67f-3a27-497d-bf52-acd2309fa0cb",
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
client.send(command).then((response) => {
  console.log(response.Items[0].title.S);
});

// function Items() {
//     const listItems = response.Items.map(person => <Item title={person.title.S} src={person.src.S} key={nanoid()} />);
//     return (
//         <div className="container">
//             <div className="row">
//                 {listItems}
//             </div>
//         </div>
//     );
// }

function Items({visible}) {
  return (
    <>
      {visible ? (
        <div className="container">
          <div className="row">
            <Item name="Teddy" />
            <Item name="Bella" />
            <Item name="Buddy" />
          </div>
        </div>
      ) : (
        <div className="container-fluid"></div>
      )}
    </>
  );
}

export default Items;
