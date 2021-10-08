import type { AWS } from "@serverless/typescript";

import createMemory from "@functions/createMemory";
import Auth from "@functions/auth0Authorizer";
import getMemories from "@functions/getMemories";
import deleteMemory from "@functions/deleteMemory";
import updateMemory from "@functions/updateMemory";
import getUploadUrl from "@functions/getUploadUrl";

const serverlessConfiguration: AWS = {
  service: "memories-app",
  frameworkVersion: "2",
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
    },
    "serverless-offline": {
      port: "3003",
    },
    dynamodb: {
      stages: "dev",
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
        seed: false,
        convertEmptyValues: true,
      },
    },
    s3: {
      host: "localhost",
      directory: "/tmp",
    },
  },
  plugins: [
    "serverless-esbuild",
    "serverless-iam-roles-per-function",
    /*'serverless-plugin-tracing',*/ "serverless-dynamodb-local",
    "serverless-s3-local",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      MEMORIES_TABLE: "Memories-${self:provider.stage}",
      MEMORIES_CREATED_AT_INDEX: "CreatedAtIndex-${self:provider.stage}",
      ATTACHMENT_S3_BUCKET: "todos-attachments-bucket-${self:provider.stage}",
      SIGNED_URL_EXPIRATION: "300",
      // X_AMZN_TRACE_ID: '2021'
    },
    lambdaHashingVersion: "20201221",
    // tracing: {
    //   lambda: true,
    //   apiGateway: true
    // },
    logs: {
      // Enable API Gateway logs
      restApi: true,
    },
    iam: {
      role: {
        statements: [
          // {
          //   Effect: 'Allow',
          //   Action: ['xray:PutTelemetryRecords', 'xray:PutTraceSegments'],
          //   Resource: '*'
          // },
          {
            Effect: "Allow",
            Action: ["codedeploy:*"],
            Resource: "*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    createMemory,
    Auth,
    getMemories,
    deleteMemory,
    updateMemory,
    getUploadUrl,
  },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            "gatewayresponse.header.Access-Control-Allow-Methods":
              "'GET,OPTIONS,POST'",
          },
          ResponseType: "DEFAULT_4XX",
          RestApiId: { Ref: "ApiGatewayRestApi" },
        },
      },
      MemoriesTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "userId",
              AttributeType: "S",
            },
            {
              AttributeName: "memoryId",
              AttributeType: "S",
            },
            {
              AttributeName: "createdAt",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "userId",
              KeyType: "HASH",
            },
            {
              AttributeName: "memoryId",
              KeyType: "RANGE",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
          TableName: "${self:provider.environment.MEMORIES_TABLE}",
          LocalSecondaryIndexes: [
            {
              IndexName:
                "${self:provider.environment.MEMORIES_CREATED_AT_INDEX}",
              KeySchema: [
                {
                  AttributeName: "userId",
                  KeyType: "HASH",
                },
                {
                  AttributeName: "createdAt",
                  KeyType: "RANGE",
                },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
            },
          ],
        },
      },
      MemoriesAttachmentsBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:provider.environment.ATTACHMENT_S3_BUCKET}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: "*",
                AllowedHeaders: "*",
                AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                MaxAge: 3000,
              },
            ],
          },
        },
      },
      BucketPolicy: {
        Type: " AWS::S3::BucketPolicy",
        Properties: {
          PolicyDocument: {
            Id: "AttachmentBucket",
            Version: "2012-10-17",
            Statement: {
              Sid: "PublicReadForGetBucketObjects",
              Effect: "Allow",
              Principal: "*",
              Action: "s3:GetObject",
              Resource:
                "arn:aws:s3:::${self:provider.environment.ATTACHMENT_S3_BUCKET}/*",
            },
            Bucket: "!Ref MemoriesAttachmentsBucket",
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
