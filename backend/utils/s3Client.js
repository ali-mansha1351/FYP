import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });

export const s3 = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_BUKCET_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_BUKCET_SECRET_ACCESS_KEY,
  },
});
