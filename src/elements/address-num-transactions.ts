import numeral from 'numeral'
import chalk from 'chalk'

export const getNumberOfTransactions = (nonce: number): string =>
  chalk.grey(numeral(nonce + 1).format('0o') + ' tx')
