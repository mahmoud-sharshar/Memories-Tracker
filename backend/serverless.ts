import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import Auth from '@functions/auth0Authorizer';

const serverlessConfiguration: AWS = {
  service: 'backend',
  frameworkVersion: '2',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
    'serverless-offline': {
      port: '3003'
    },
    dynamodb: {
      stages: 'dev',
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
        seed: false,
        convertEmptyValues: true
      }
    },
    s3: {
      host: 'localhost',
      directory: '/tmp'
    }
  },
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-s3-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      MEMORIES_TABLE: 'Memories-${self:provider.stage}',
      MEMORIES_CREATED_AT_INDEX: 'CreatedAtIndex-${self:provider.stage}',
      ATTACHMENT_S3_BUCKET: 'todos-attachments-bucket-${self:provider.stage}',
      SIGNED_URL_EXPIRATION: '300',
      X_AMZN_TRACE_ID: '2021'
    },
    lambdaHashingVersion: '20201221',
    tracing: {
      lambda: true,
      apiGateway: true
    },
    logs: {
      // Enable API Gateway logs
      restApi: true
    },
    iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: ['xray: PutTelemetryRecords', 'xray: PutTraceSegments'],
          Resource: '*'
        },
        {
          Effect: 'Allow',
          Action: ['codedeploy: *'],
          Resource: '*'
        }]
      }
    }
  },
  // import the function via paths
  functions: { hello, Auth },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            "gatewayresponse.header.Access-Control-Allow-Methods": "'GET,OPTIONS,POST'"
          },
          ResponseType: "DEFAULT_4XX",
          RestApiId:
            { Ref: 'ApiGatewayRestApi' }
        }
      },
      MemoriesTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          AttributeDefinitions:
            [
              {
                AttributeName: 'userId',
                AttributeType: 'S'
              },
              {
                AttributeName: 'memoryId',
                AttributeType: 'S'
              },
              {
                AttributeName: 'createdAt',
                AttributeType: 'S'
              }],
          KeySchema: [
            {
              AttributeName: "userId",
              KeyType: 'HASH'
            },
            {
              AttributeName: 'memoryId',
              KeyType: 'RANGE'
            }],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: '${self:provider.environment.MEMORIES_TABLE}',
          LocalSecondaryIndexes: [
            {
              IndexName: '${self:provider.environment.MEMORIES_CREATED_AT_INDEX}',
              KeySchema: [
                {
                  AttributeName: 'userId',
                  KeyType: 'HASH'
                },
                {
                  AttributeName: 'createdAt',
                  KeyType: 'RANGE'
                }],
              Projection: {
                ProjectionType: 'ALL'
              }
            }]
        }
      },
      MemoriesAttachmentsBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.ATTACHMENT_S3_BUCKET}',
          CorsConfiguration: {
            CorsRules:
              [
                {
                  AllowedOrigins: '*',
                  AllowedHeaders: '*',
                  AllowedMethods:
                    ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                  MaxAge: 3000
                }
              ]
          }
        }
      },
      BucketPolicy: {
        Type: ' AWS::S3::BucketPolicy',
        Properties: {
          PolicyDocument: {
            Id: 'AttachmentBucket',
            Version: "2012-10-17",
            Statement: {
              Sid: 'PublicReadForGetBucketObjects',
              Effect: 'Allow',
              Principal: '*',
              Action: 's3:GetObject',
              Resource: 'arn:aws:s3:::${self:provider.environment.ATTACHMENT_S3_BUCKET}/*'
            },
            Bucket: '!Ref MemoriesAttachmentsBucket'
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;



/* eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJVSkVRakJETlRJelJFWXdPREUxTjBKR09FSkVRVFF5T0RoRFFVVkdRME13UWprM1JFTXhOdyJ9.eyJpc3MiOiJodHRwczovL2Rldi1zaGFyc2hhci5ldS5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTIxMzU5OTYwNTc2MTYxNDgwNDkiLCJhdWQiOiJUSFpyeXRpeVFlNDNEZDl0bUlmRHJJWDRZZldIYmJBdyIsImlhdCI6MTYzMzYzMTM1MSwiZXhwIjoxNjM3MjMxMzUxLCJhdF9oYXNoIjoiSkpBbDVGN2J3dHpMRkZfVW5VTnpYdyIsIm5vbmNlIjoiMmpjanV4bmxHSXg0SEtELXhpX1FITXJZbm5sd0tsT2EifQ.EeZuLtH2XW54yrkvlRkuts3EIWeMvqMPCGR_xv_AY2A3yx4AomGNZZv8NmGt_RaSLbk5e_FnOduyP74FeY8mTwKuu3DKybQC6TUXaONNuqviVvo31rscq-9WgBPoC9RgdUpQx4VskXEw_TMjtGZQr4Aj1VFN6iGNbhYxVfK-I6by3ITTihSOo-_a85h04pNZxE7SDD8C2RC_F2AmIzHbLSbWcBg2Tb4yhineZ3TTnkbc4kQdaZYtHOFIAboCS-DDPUeY1rAUAEg2sdLhmLKGQ4_zyK_zX6hxSbXUT7klFHljvbUsvEgAk9ifeEgJwYTalXfKUC30YLFynqaedN5xQw*/