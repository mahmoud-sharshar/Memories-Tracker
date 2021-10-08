import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createDynamoDBClient } from "../libs/dynamodb";
import { MemoryItem } from "../models/MemoryItem";
import { MemoryUpdate } from "../models/MemoryUpate";

export class MemoryAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly memoriesTable = process.env.MEMORIES_TABLE
  ) {}

  async getMemory(userId: string, memoryId: string): Promise<MemoryItem> {
    const result = await this.docClient
      .get({
        TableName: this.memoriesTable,
        Key: {
          userId,
          memoryId,
        },
      })
      .promise();
    return result.Item as MemoryItem;
  }

  async getMemoriesForUser(userId: string): Promise<MemoryItem[]> {
    const result: any = await this.docClient
      .query({
        TableName: this.memoriesTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();
    return result.Items as MemoryItem[];
  }

  async createMemory(newItem: MemoryItem): Promise<MemoryItem> {
    await this.docClient
      .put({
        TableName: this.memoriesTable,
        Item: newItem,
      })
      .promise();
    return newItem;
  }

  async updateMemory(
    userId: string,
    memoryId: string,
    memoryRequest: MemoryUpdate
  ): Promise<MemoryItem> {
    const result = await this.docClient
      .update({
        TableName: this.memoriesTable,
        Key: {
          userId,
          memoryId,
        },
        UpdateExpression:
          "set title = :title, caption = :caption, feeling = :feeling, #loc = :memLoc",
        ExpressionAttributeNames: {
          "#loc": "location",
        },
        ExpressionAttributeValues: {
          ":title": memoryRequest.title,
          ":caption": memoryRequest.caption,
          ":feeling": memoryRequest.feeling,
          ":memLoc": memoryRequest.location,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
    return result.Attributes as MemoryItem;
  }

  async deleteMemory(userId: string, memoryId: string) {
    await this.docClient
      .delete({
        TableName: this.memoriesTable,
        Key: {
          userId,
          memoryId,
        },
      })
      .promise();
  }

  async addAttachmentUrl(
    userId: string,
    memoryId: string,
    attachmentUrl: string
  ) {
    await this.docClient
      .update({
        TableName: this.memoriesTable,
        Key: {
          userId,
          memoryId,
        },
        UpdateExpression: "set attachmentUrl = :url",
        ExpressionAttributeValues: {
          ":url": attachmentUrl,
        },
      })
      .promise();
  }
}
