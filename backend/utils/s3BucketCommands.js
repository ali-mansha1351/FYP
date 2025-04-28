import { s3 } from "../utils/s3Client.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const uploadImage = async (params) => {
  const profileImagecommand = new PutObjectCommand(params);
  await s3.send(profileImagecommand);
};

export const deleteImage = async (params) => {
  const deleteImageCommand = new DeleteObjectCommand(params);
  await s3.send(deleteImageCommand);
};

export const getImage = async (params) => {
  const getCommand = new GetObjectCommand(params);
  const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
  return url;
};
