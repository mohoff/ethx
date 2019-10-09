import chalk from 'chalk'

export const getStatus = (receiptStatus: boolean): string => {
  const transactionStatus = receiptStatus
    ? chalk.green`SUCCEEDED`
    : chalk.red`FAILED`

  return chalk.bold(`Transaction ${transactionStatus}`)
}
