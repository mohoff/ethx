import BigNumber from 'bignumber.js'

import { formatGasPrice, formatWeiToEther } from '../utils/format'

export const getFeeAndGasPrice = (
  gasUsed: string | number,
  gasPrice: string | number
): string => {
  if (typeof gasUsed === 'string') {
    gasUsed = Number(gasUsed)
  }
  if (typeof gasPrice === 'number') {
    gasPrice = gasPrice.toString()
  }

  const feePaid = new BigNumber(gasUsed).multipliedBy(new BigNumber(gasPrice))

  return `${formatWeiToEther(feePaid.toString())} ─ @${formatGasPrice(
    gasPrice
  )}`
}

export const getGasDetails = (
  gasUsed: string | number,
  gasProvided: string | number
): string => {
  if (typeof gasUsed === 'string') {
    gasUsed = Number(gasUsed)
  }
  if (typeof gasProvided === 'string') {
    gasProvided = Number(gasProvided)
  }

  const gasEfficiency = ((100 * gasUsed) / gasProvided).toFixed(1)

  return `gas: ${gasUsed.toLocaleString()} / ${gasProvided.toLocaleString()} ⟶ ${gasEfficiency}% eff.`
}
