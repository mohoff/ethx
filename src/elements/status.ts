import chalk from 'chalk'

export const getStatus = (txHash: string, receiptStatus: boolean): string => {
  const transactionStatus = receiptStatus
    ? chalk.green`SUCCEEDED`
    : chalk.red`FAILED`

  return `${chalk.bold('Transaction')}
    ${chalk.dim.white(txHash)}
    ${chalk.bold(transactionStatus)}`
}
