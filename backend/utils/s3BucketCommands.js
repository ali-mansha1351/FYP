import { s3 } from "../utils/s3Client.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

dotenv.config({ path: "backend/config/config.env" });
export const uploadImage = async (params) => {
  const imagecommand = new PutObjectCommand(params);
  await s3.send(imagecommand);
};

export const uploadMultipleImages = async (files) => {
  try {
    const uploadPromises = files.map((file) => {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      return uploadImage(params);
    });
    await Promise.all(uploadPromises);
    return {
      message: "all files uploaded",
    };
  } catch (error) {
    console.log(error);
    throw new Error("error uploading files,from s3BucketCommand");
  }
};

export const deleteImage = async (params) => {
  const deleteImageCommand = new DeleteObjectCommand(params);
  await s3.send(deleteImageCommand);
};

export const deleteMultipleImages = async (files) => {
  try {
    const deletePromises = files.map((file) => {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.name,
      };

      return deleteImage(params);
    });
    await Promise.all(deletePromises);
    return { message: "all files deleted" };
  } catch (error) {
    console.log(error);
    throw new Error("error uploading files,from s3BucketCommand");
  }
};

export const getImage = async (params) => {
  const getCommand = new GetObjectCommand(params);
  const url = await getSignedUrl(s3, getCommand, {
    expiresIn: process.env.AWS_S3_PRE_SIGNED_URL_EXPIRE_TIME,
  });
  return url;
};

export const getMultipleImages = async (files) => {
  try {
    const getPromises = files.map((file) => {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.name,
      };
      return getImage(params);
    });

    const urls = await Promise.all(getPromises);
    return {
      urls,
    };
  } catch (error) {
    throw new Error(error.message || "error getting url from s3 AWS bucket");
  }
};
