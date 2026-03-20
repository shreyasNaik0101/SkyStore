import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";
import fs from "fs";

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: fromIni({ profile: "default" }) // 👈 IMPORTANT
});

const file = fs.readFileSync("C:/Users/shrey/architec_saint.png");

await s3.send(new PutObjectCommand({
  Bucket: "skystore-files-090208085314-ap-south-1-an",
  Key: "u1/test-upload.png",
  Body: file
}));

console.log("UPLOAD SUCCESS 🚀");