import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();
const input = { // ScanInput
    TableName: "items", // required
    AttributesToGet: [ // AttributeNameList
        "id",
        "title"
    ],

};
const command = new ScanCommand(input);
const response = await client.send(command);

console.log(response.Items[0])
