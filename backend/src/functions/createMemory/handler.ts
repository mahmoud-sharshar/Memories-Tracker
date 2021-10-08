import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { createNewMemory } from "src/businessLayer/memoriesManager";
import { getUserId } from "src/helpers/functionsUtils";
import { MemoryRequest } from "src/requests/MemoryRequest";

import schema from "./schema";

const createMemory: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const newMemory: MemoryRequest = event.body;
  const userId = getUserId(event.headers.Authorization);
  const item = await createNewMemory(userId, newMemory);
  return formatJSONResponse(200, { item });
};

export const main = middyfy(createMemory);
