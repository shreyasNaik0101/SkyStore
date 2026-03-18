import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const params = {
      TableName: "Notes",
      Item: {
        userId: body.userId,
        noteId: Date.now().toString(),
        title: body.title,
        content: body.content,
        createdAt: new Date().toISOString(),
      },
    };

    await dynamo.send(new PutCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Note created successfully" }),
    };
  } catch (error) {
    console.error("ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating note",
        error: error.message,
      }),
    };
  }
};
