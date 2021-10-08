# Serverless Memories API

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.


### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS


## Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for lambda functions
- `libs` - containing shared code base between lambda functions
- `auth` - containing interfaces that is used in authorizer function
- `businessLayer` - containing business logic of the backend that used in lambda functions
- `dataLayer` - containing code that interacts with dynamodb service
- `helpers` - containing helpers code that being used in differect places of the codebase
- `models` - containing interfaces for data models.
- `requests` - containing interfaces for http requests.

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── getMemories
│   │   │   ├── handler.ts      # `getMemories` lambda source code
│   │   │   ├── index.ts        # `getMemories` lambda Serverless configuration
│   │   │   └── schema.ts       # `getMemories` lambda input event JSON-Schema
│   │   ├── others
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file
