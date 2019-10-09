import R from 'ramda'
import chalk from 'chalk'
import { formatWeiToEther } from '../utils/format'

const ADDRESS_LENGTH = 42
const OFFSET = 8

export const getAddressBalanceNow = (
  weiBalance: string | undefined
): string => {
  if (!weiBalance) {
    return ''
  }

  return chalk.grey('now: ' + formatWeiToEther(weiBalance))
}

export const getAddressBalanceRightAligned = (
  weiBalance: string | undefined
): string => {
  if (!weiBalance) {
    return ''
  }

  const fixedWidthBalance = formatWeiToEther(weiBalance)
  const offsetLeft = ADDRESS_LENGTH - fixedWidthBalance.length - OFFSET

  return R.repeat(' ', offsetLeft).join('') + fixedWidthBalance
}
