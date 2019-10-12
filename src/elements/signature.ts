import chalk from 'chalk'

import { formatBytes32Hex } from '../utils/format'

import { Transaction } from 'web3/eth/types'

export const getSignature = ({
  r,
  s,
  v,
}: Pick<Transaction, 'r' | 's' | 'v'>): string => {
  if (!r || !s || !v) {
    return chalk.grey('(unknown signature format)')
  }

  return `
      r: ${formatBytes32Hex(r)}
      s: ${formatBytes32Hex(s)}
      v: ${formatBytes32Hex(v)}
`
}
