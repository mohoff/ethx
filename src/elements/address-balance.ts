import R from 'ramda'
import { formatWeiToEther } from '../utils/format'

const ADDRESS_LENGTH = 42
const OFFSET = 8

export const getAddressBalanceRightAligned = (weiBalance: string): string => {
  const fixedWidthBalance = formatWeiToEther(weiBalance)
  const offsetLeft = ADDRESS_LENGTH - fixedWidthBalance.length - OFFSET

  return R.repeat(' ', offsetLeft).join('') + fixedWidthBalance
}
