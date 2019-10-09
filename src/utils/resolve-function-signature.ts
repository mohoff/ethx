import R from 'ramda'
import axios from 'axios'

const HOST = 'https://www.4byte.directory'
const CONTRACT_CREATION_SIGNATURE = '60806040'

export enum SpecialSignatures {
  CONTRACT_CREATED = '(CONTRACT CREATED)',
}

export const resolveFunctionSignature = async (
  hexSignature: string
): Promise<string | SpecialSignatures.CONTRACT_CREATED | undefined> => {
  if (hexSignature.startsWith('0x')) {
    hexSignature = hexSignature.slice(2)
  }

  if (hexSignature === CONTRACT_CREATION_SIGNATURE) {
    return SpecialSignatures.CONTRACT_CREATED
  }

  const url = `${HOST}/api/v1/signatures/?hex_signature=${hexSignature}`
  const result = await axios.get(url)

  return R.path(['data', 'results', 0, 'text_signature'], result)
}
