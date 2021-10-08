import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getuserMemorys } from "src/businessLayer/memoriesManager";
import { getUserId } from "src/helpers/functionsUtils";

const getMemories: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const userId = getUserId(event.headers.Authorization);
  const items = await getuserMemorys(userId);
  return formatJSONResponse(200, { items });
};

export const main = middyfy(getMemories);
