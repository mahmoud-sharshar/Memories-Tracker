import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "memories",
        cors: true,
        authorizer: "Auth",
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:Query"],
      Resource:
        "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.MEMORIES_TABLE}",
    },
  ],
};
