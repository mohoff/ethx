import { waitForMinedTransaction } from './web3/wait-for-mined-tx'
import { view } from './view'

export const await = async (
  txHash: string,
  numConfirmations: number,
  infuraApiKey: string
): Promise<void> => {
  const minedTx = await waitForMinedTransaction(
    txHash,
    infuraApiKey,
    numConfirmations
  )

  if (minedTx) {
    await view(txHash, infuraApiKey)
  }
}
