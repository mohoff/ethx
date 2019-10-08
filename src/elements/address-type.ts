import chalk from 'chalk'

enum ContractType {
  EOA = 'EOA',
  CONTRACT = 'Contract',
}

export const getAddressType = (codeAtAddress: string): ContractType => {
  return codeAtAddress === '0x' ? ContractType.EOA : ContractType.CONTRACT
}

export const getAddressTypePadded = (codeAtAddress: string): string => {
  const addressType = getAddressType(codeAtAddress)
  const padLength = addressType === ContractType.EOA.toString() ? 5 : 0

  const coloredAddressType = chalk.grey(addressType)

  return coloredAddressType.padEnd(coloredAddressType.length + padLength, ' ')
}
