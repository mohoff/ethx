import { waitForMinedTransaction } from './web3/wait-for-mined-tx'
import { view } from './view'

export const await = async (
  txHash: string,
  numConfirmations: number
): Promise<void> => {
  const minedTx = await waitForMinedTransaction(txHash, numConfirmations)

  if (minedTx) {
    await view(txHash)
  }
}
