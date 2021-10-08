import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "put",
        path: "memories/{memoryId}/attachment",
        cors: true,
        authorizer: "Auth",
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:UpdateItem", "dynamodb:GetItem"],
      Resource:
        "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.MEMORIES_TABLE}",
    },
    {
      Effect: "Allow",
      Action: ["s3:PutObject"],
      Resource:
        "arn:aws:s3:::${self:provider.environment.ATTACHMENT_S3_BUCKET}/*",
    },
  ],
};
