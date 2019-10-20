import R from 'ramda'

import { getWeb3 } from './web3'
import { isTxHash } from '../utils/validate-tx-hash'

import { EthereumNetwork } from '../types'

import { TransactionReceipt } from 'web3/types'
import { Block, Transaction } from 'web3/eth/types'

interface AddressContext {
  balanceAtTx: string
  balanceNow: string
  code: string
}
interface TransactionContext {
  from: AddressContext
  to: Partial<AddressContext>
  block: {
    latest: Block
    atTx: Block
  }
  tx: Transaction
  txReceipt: TransactionReceipt
}

export const aggregateTransactionData = async (
  txHash: string,
  infuraApiKey: string
): Promise<TransactionContext | undefined> => {
  if (R.isNil(txHash) || !R.is(String, txHash)) {
    throw new Error('Invalid input')
  }

  if (!isTxHash(txHash)) {
    throw new Error(`Invalid transaction hash ${txHash}`)
  }

  const web3 = getWeb3(infuraApiKey, EthereumNetwork.MAINNET)

  const tx = await web3.eth.getTransaction(txHash)

  if (!tx) {
    return undefined
  }

  const [
    txReceipt,
    block,
    blockLatest,
    balanceFrom,
    balanceTo,
    balanceFromNow,
    balanceToNow,
    codeFrom,
    codeTo,
  ] = await Promise.all([
    web3.eth.getTransactionReceipt(txHash),
    web3.eth.getBlock(tx.blockNumber, true),
    web3.eth.getBlock('latest'),
    web3.eth.getBalance(tx.from, tx.blockNumber),
    tx.to ? web3.eth.getBalance(tx.to, tx.blockNumber) : undefined,
    web3.eth.getBalance(tx.from),
    tx.to ? web3.eth.getBalance(tx.to) : undefined,
    web3.eth.getCode(tx.from),
    tx.to ? web3.eth.getCode(tx.to) : undefined,
  ])

  return {
    from: {
      balanceAtTx: balanceFrom,
      balanceNow: balanceFromNow,
      code: codeFrom,
    },
    to: {
      balanceAtTx: balanceTo,
      balanceNow: balanceToNow,
      code: codeTo,
    },
    block: {
      latest: blockLatest,
      atTx: block,
    },
    tx,
    txReceipt,
  }
}
