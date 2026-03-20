import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        console.log("EVENT:", JSON.stringify(event));

        const userId =
            event.queryStringParameters?.userId ||
            event.queryStringParameters?.userid;

        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "userId is required" }),
            };
        }

        const params = {
            TableName: "Notes",
            KeyConditionExpression: "userId = :uid",
            ExpressionAttributeValues: {
                ":uid": userId,
            },
        };

        const result = await dynamo.send(new QueryCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };

    } catch (err) {
        console.error("ERROR:", err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error fetching notes",
                error: err.message,
            }),
        };
    }
};