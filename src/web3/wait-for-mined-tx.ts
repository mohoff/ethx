import ora from 'ora'
import chalk from 'chalk'

import { getWeb3 } from './web3'

import { Transaction } from 'web3/eth/types'
import Web3 from 'web3'
import { EthereumNetwork } from '../types'

const TIMEOUT_IN_SECONDS = 3600

const timeoutAfterSeconds = (timeoutInSeconds: number): Promise<void> =>
  new Promise((_, reject): void => {
    const id = setTimeout(() => {
      clearTimeout(id)
      reject(`Timeout after ${timeoutInSeconds} seconds`)
    }, timeoutInSeconds * 1000)
  })

const resolveWhenMined = async (
  web3: Web3,
  txHash: string
): Promise<Transaction> => {
  let tx
  while (!tx) {
    tx = await web3.eth.getTransaction(txHash)
  }

  return tx
}

const resolveWhenConfirmationsReached = async (
  web3: Web3,
  minedBlockNumber: number,
  numConfirmations: number
): Promise<void> => {
  const spinner = ora(`Waiting for confirmations 0/${numConfirmations}`).start()

  let latestBlock

  while (
    !latestBlock ||
    latestBlock.number < minedBlockNumber + numConfirmations
  ) {
    const currentConfirmations =
      ((latestBlock && latestBlock.number) || minedBlockNumber) -
      minedBlockNumber

    spinner.text = `Waiting for confirmations ${currentConfirmations}/${numConfirmations}`

    latestBlock = await web3.eth.getBlock('latest')
  }

  const actualConfirmations = latestBlock.number - minedBlockNumber
  spinner.succeed(
    `Reached ${numConfirmations} confirmations ${chalk.grey(
      `(${actualConfirmations})`
    )}`
  )
}

export const resolveWhenMinedWithConfirmations = async (
  web3: Web3,
  txHash: string,
  numConfirmations: number
): Promise<Transaction> => {
  const spinner = ora(
    `Waiting for transaction ${txHash} to be minded...`
  ).start()

  const minedTx = await resolveWhenMined(web3, txHash)

  spinner.succeed(`Mined transaction ${txHash}`)

  if (numConfirmations > 0) {
    await resolveWhenConfirmationsReached(
      web3,
      minedTx.blockNumber,
      numConfirmations
    )
  }

  return minedTx
}

export const waitForMinedTransaction = async (
  txHash: string,
  numConfirmation = 0
): Promise<Transaction | void> => {
  const web3 = getWeb3(EthereumNetwork.MAINNET)

  return Promise.race([
    resolveWhenMinedWithConfirmations(web3, txHash, numConfirmation),
    timeoutAfterSeconds(TIMEOUT_IN_SECONDS),
  ])
}
