import { MemoryAccess } from "../dataLayer/memoryAccess";
import { MemoryItem } from "../models/MemoryItem";
import { MemoryRequest } from "../requests/MemoryRequest";
import * as uuid from "uuid";
import { generateSignedUrl } from "../helpers/attachmentUtils";

const memoryAccess = new MemoryAccess();
export const getuserMemorys = (userId: string): Promise<MemoryItem[]> => {
  return memoryAccess.getMemoriesForUser(userId);
};

export const createNewMemory = async (
  userId: string,
  memoryRequest: MemoryRequest
) => {
  const memoryId: string = uuid.v4();
  return memoryAccess.createMemory({
    userId,
    memoryId,
    title: memoryRequest.title,
    caption: memoryRequest.caption,
    location: memoryRequest.location,
    feeling: memoryRequest.feeling,
    createdAt: new Date().toISOString(),
  });
};

export const deleteMemory = async (userId: string, memoryId: string) => {
  if (!(await isMemoryExist(userId, memoryId)))
    throw new Error("Requested todo doesn't exist");

  return memoryAccess.deleteMemory(userId, memoryId);
};

export const updateMemory = async (
  userId: string,
  memoryId: string,
  memoryRequest: MemoryRequest
) => {
  if (!(await isMemoryExist(userId, memoryId)))
    throw new Error("Requested todo doesn't exist");
  return memoryAccess.updateMemory(userId, memoryId, memoryRequest);
};

export const isMemoryExist = async (userId: string, memoryId: string) => {
  const item: MemoryItem = await memoryAccess.getMemory(userId, memoryId);
  return !!item;
};

export const generateMemoryAttachmentUrl = async (
  userId: string,
  memoryId: string
) => {
  const uploadUrl = generateSignedUrl(memoryId);
  const bucketName = process.env.ATTACHMENT_S3_BUCKET;
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${memoryId}`;
  await memoryAccess.addAttachmentUrl(userId, memoryId, imageUrl);
  return uploadUrl;
};
