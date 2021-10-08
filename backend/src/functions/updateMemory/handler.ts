import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { updateMemory } from 'src/businessLayer/memoriesManager';
import { getUserId } from 'src/helpers/functionsUtils';
import { MemoryRequest } from 'src/requests/MemoryRequest';

import schema from './schema';

const updateMemoryHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const newMemory: MemoryRequest = event.body;
  const memoryId = event.pathParameters.memoryId
  const userId = getUserId(event.headers.Authorization)
  const item = await updateMemory(userId, memoryId, newMemory)
  return formatJSONResponse(200, { item });
}

export const main = middyfy(updateMemoryHandler);
