import R from 'ramda'
import BigNumber from 'bignumber.js'

import { Transaction } from 'web3/eth/types'

const averageBigNumber = (bigNumbers: BigNumber[]): BigNumber =>
  BigNumber.sum(...bigNumbers).dividedToIntegerBy(bigNumbers.length)

export const calculateAverageGasPrice = (
  transactions: Transaction[]
): BigNumber =>
  R.compose<Transaction[], string[], BigNumber[], BigNumber>(
    averageBigNumber,
    R.map(gasPrice => new BigNumber(gasPrice)),
    R.pluck('gasPrice')
  )(transactions)
