import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

const ONE_GWEI_IN_WEI = new BigNumber('1000000000')

export const formatWeiToEther = (weiString: string) => {
  // @ts-ignore
  return ethers.utils.formatEther(weiString, { commify: true, pad: true }) + ' ETH'
}

export const formatWeiToGwei = (weiString: string) => {
  // @ts-ignore
  return ethers.utils.formatUnits(weiString, 'gwei') + 'GWei'
}

export const formatGasPrice = (wei: string | BigNumber): string => {
  wei = typeof wei === 'string' ? new BigNumber(wei) : wei

  const gwei = wei.div(ONE_GWEI_IN_WEI)

  return gwei.toFixed(1) + ' GWei'
}
