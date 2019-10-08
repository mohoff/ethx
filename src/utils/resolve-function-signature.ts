import R from 'ramda'
import axios from 'axios'

const HOST = 'https://www.4byte.directory'

export const resolveFunctionSignature = async (
  hexSignature: string
): Promise<string | undefined> => {
  if (hexSignature.startsWith('0x')) {
    hexSignature = hexSignature.slice(2)
  }

  const url = `${HOST}/api/v1/signatures/?hex_signature=${hexSignature}`
  const result = await axios.get(url)

  return R.path(['data', 'results', 0, 'text_signature'], result)
}
