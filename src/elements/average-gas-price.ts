import { Transaction } from 'web3/eth/types'

import { calculateAverageGasPrice } from '../utils/average-gas-price'
import { formatGasPrice } from '../utils/format'

export const getAverageGasPrice = (transactions: Transaction[]): string => {
  const averageGasPrice = calculateAverageGasPrice(transactions)

  return formatGasPrice(averageGasPrice)
}
