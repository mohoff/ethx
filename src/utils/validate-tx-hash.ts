import chalk from 'chalk'

export const isTxHash = (txHash: string | undefined): boolean =>
  !!txHash && /^0x[A-Fa-f0-9]{64}$/.test(txHash)

export const validateTxHash = ({
  transactionHash,
}: Record<'transactionHash', string | undefined>): true => {
  if (isTxHash(transactionHash)) {
    return true
  }

  throw new Error(
    chalk.red(`${transactionHash} is not a valid transaction hash\n`)
  )
}
