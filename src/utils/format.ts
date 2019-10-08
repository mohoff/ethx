import { ethers } from 'ethers'
import chalk from 'chalk'
import BigNumber from 'bignumber.js'

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

export const formatHex = (hex: string | undefined): string =>
  hex ? chalk.grey(hex.slice(0, 2)) + hex.slice(2) : ''
