const apiId = process.env.REACT_APP_AWS_API_ID
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,            // Auth0 domain
  clientId: process.env.REACT_APP_AUTH0_CLIEND_ID,          // Auth0 client id
  callbackUrl: process.env.REACT_APP_AUTH0_CALLBACK_URL
}
