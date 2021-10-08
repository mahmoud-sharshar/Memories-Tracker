import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import {
  generateMemoryAttachmentUrl,
  isMemoryExist,
} from "src/businessLayer/memoriesManager";
import { getUserId } from "src/helpers/functionsUtils";

const getUploadUrl: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const memoryId = event.pathParameters.memoryId;
  const userId = getUserId(event.headers.Authorization);
  if (!(await isMemoryExist(userId, memoryId)))
    return formatJSONResponse(404, { message: "Memory item is not found" });
  const uploadUrl = await generateMemoryAttachmentUrl(userId, memoryId);
  return formatJSONResponse(200, { uploadUrl });
};

export const main = middyfy(getUploadUrl);
