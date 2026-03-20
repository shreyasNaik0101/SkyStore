Infrastructure Setup
Amazon S3

Two S3 buckets were created for the SkyStore platform:

skystore-frontend – Hosts the React frontend application.

skystore-files – Stores user uploaded documents and files.

The frontend bucket allows public access for website hosting, while the files bucket remains private for secure storage.

Added Cognito user authentication for SkyStore

implemented upload file logic with presigned url
