
enum ContractType {
  EOA = 'EOA',
  CONTRACT = 'Contract'
}

export const getAddressType = (codeAtAddress: string): ContractType => {
  return codeAtAddress === '0x' ? ContractType.EOA : ContractType.CONTRACT
}

export const getAddressTypePadded = (codeAtAddress: string): string => getAddressType(codeAtAddress).padEnd(ContractType.CONTRACT.length, ' ')
