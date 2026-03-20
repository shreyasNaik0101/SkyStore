import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const REGION = "ap-south-1";
const BUCKET = "skystore-files-090208085314-ap-south-1-an";
const TABLE = "Files";

const s3 = new S3Client({ region: REGION });
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const { fileName, userId } = body;

    if (!fileName || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "fileName and userId required" })
      };
    }

    const fileId = uuidv4();
    const key = `${userId}/${fileId}-${fileName}`;

    
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300
    });

    await dynamo.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          userId,
          fileId,
          fileName,
          key,
          status: "uploaded",
          createdAt: new Date().toISOString()
        }
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl,
        fileId,
        key
      })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};