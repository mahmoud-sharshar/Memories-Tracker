import { createS3Instance } from "@libs/s3Client"

const attachmentBucket = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const s3 = createS3Instance()

export const generateSignedUrl = (memoryId: string) => {
  const presignedUrl = s3.getSignedUrl('putObject', {
    Bucket: attachmentBucket,
    Key: memoryId,
    Expires: parseInt(urlExpiration)
  })
  return presignedUrl
}
