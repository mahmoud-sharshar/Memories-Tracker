import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export const createS3Instance = () => {
  if (process.env.IS_OFFLINE) {
    return new XAWS.S3({
      signatureVersion: 'v4',
      s3ForcePathStyle: true,
      accessKeyId: 'S3RVER', // This specific key is required when working offline
      secretAccessKey: 'S3RVER',
      endpoint: new AWS.Endpoint('http://localhost:3003')
    })
  }

  return new XAWS.S3({
    signatureVersion: 'v4'
  })
}
