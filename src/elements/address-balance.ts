
import R from 'ramda'
import { formatWeiToEther } from '../utils/format'

const ADDRESS_LENGTH = 42
const OFFSET = 8

export const getBalance = (weiBalance: string) => formatWeiToEther(weiBalance)

export const getBalanceFixedWidth = (weiBalance: string) => {
  const fixedWidthBalance = getBalance(weiBalance)
  const offsetLeft = ADDRESS_LENGTH - fixedWidthBalance.length - OFFSET

  return R.repeat(' ', offsetLeft).join('') + fixedWidthBalance
}
