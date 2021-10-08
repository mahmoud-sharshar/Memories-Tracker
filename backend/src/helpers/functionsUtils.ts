import Axios from 'axios'
import { parseUserId } from 'src/auth/utils'


/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(authHeader: string): string {
  return parseUserId(getToken(authHeader))
}

export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

export async function getSigningKey(
  kid: String,
  jwksUrl: string
): Promise<string> {
  const response = await Axios.get(jwksUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    }
  })

  if (response.status != 200) {
    throw new Error(response.statusText)
  }

  const secret = response.data.keys.filter((key) => {
    return key.kid === kid
  })

  if (!secret) {
    throw new Error('Error fetching secret')
  }

  return secret[0].x5c[0]
}
