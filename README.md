# Memories Tracker

- Memories tracker is a simple serverless app that allows the user to track his memories in the locations he visited. 

- This is the capstone project of Cloud Developer Nanodegree offered by Udacity. 
- This application will allow creating/removing/updating/fetching memories items. Each memory item can optionally have an attachment image. Each user only has access to memories items that he/she has created.

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```

# Frontend

The `frontend` folder contains a simple web application that can use the API in the backend.


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a frontend application first edit the `frontend/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd frontend
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless backend application.

# Postman collection
You can find a Postman collection of the backend API in this project root folder.
