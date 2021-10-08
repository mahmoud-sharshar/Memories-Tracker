import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "delete",
        path: "memories/{memoryId}",
        cors: true,
        authorizer: "Auth",
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:GetItem", "dynamodb:DeleteItem"],
      Resource:
        "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.MEMORIES_TABLE}",
    },
  ],
};
