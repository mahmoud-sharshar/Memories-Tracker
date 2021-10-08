import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { deleteMemory } from "src/businessLayer/memoriesManager";
import { getUserId } from "src/helpers/functionsUtils";

const deleteMemoryHanlder: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event
) => {
  const memoryId = event.pathParameters.memoryId;
  const userId = getUserId(event.headers.Authorization);
  await deleteMemory(userId, memoryId);
  return formatJSONResponse(200, {});
};

export const main = middyfy(deleteMemoryHanlder);
