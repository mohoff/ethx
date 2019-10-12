import R from 'ramda'
import { ethers } from 'ethers'
import chalk from 'chalk'
import BigNumber from 'bignumber.js'

import { breakAndIndent } from './break-and-indent'
import { greyOutZeros } from './grey-out-zeros'
import { identifyPatterns } from './identify-patterns'

const ONE_GWEI_IN_WEI = new BigNumber('1000000000')

export const formatWeiToEther = (weiString: string): string => {
  return ethers.utils.formatEther(weiString) + ' ETH'
}

export const formatWeiToGwei = (weiString: string): string => {
  return ethers.utils.formatUnits(weiString, 'gwei') + 'GWei'
}

export const formatGasPrice = (wei: string | BigNumber): string => {
  wei = typeof wei === 'string' ? new BigNumber(wei) : wei
  const gwei = wei.div(ONE_GWEI_IN_WEI)

  return gwei.toFixed(1) + ' GWei'
}

export const formatBytes32Hex = (hex: string): string =>
  hex.startsWith('0x')
    ? chalk.grey('0x') + greyOutZeros(hex.slice(2))
    : greyOutZeros(hex)

export const formatHexData = (data: string, indentBy: number): string =>
  R.compose<string, string[], string[], string>(
    R.join(breakAndIndent(indentBy)),
    R.map(
      R.compose(
        formatBytes32Hex,
        identifyPatterns
      )
    ),
    R.splitEvery(64)
  )(data)
