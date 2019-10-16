import ora from 'ora'
import chalk from 'chalk'

import { aggregateTransactionData } from './web3/aggregate-tx-data'

import { formatBytes32Hex, formatWeiToEther } from './utils/format'
import { timeoutAfter } from './utils/timeout-after'

import { getStatus } from './elements/status'
import { getTime } from './elements/time'
import { getFeeAndGasPrice, getGasDetails } from './elements/fee'
import { getEfficiency } from './elements/efficiency'
import { getBlocksAgo } from './elements/blocks-ago'
import { getAverageGasPrice } from './elements/average-gas-price'
import { getLogs } from './elements/logs'
import { getAddressTypePadded } from './elements/address-type'
import { getNumberOfTransactions } from './elements/address-num-transactions'
import {
  getAddressBalanceNow,
  getAddressBalanceRightAligned,
} from './elements/address-balance'
import { getInputData } from './elements/input-data'
import { getSignature } from './elements/signature'

export const VIEW_TIMEOUT_IN_SECONDS = 60

export const view = async (
  txHash: string,
  timeoutInSeconds: number = VIEW_TIMEOUT_IN_SECONDS
): Promise<void> => {
  const spinner = ora(`Fetching transaction details`).start()

  const aggregateWithTimeout = timeoutAfter(timeoutInSeconds)(
    aggregateTransactionData
  )
  const data = await aggregateWithTimeout(txHash)

  if (data === undefined) {
    throw new Error(`Transaction ${txHash} not found. Has it been mined?`)
  }

  const { from, to, block, tx, txReceipt } = data

  // prettier-ignore
  const txMessage = `
    ${getStatus(txHash, txReceipt.status)}

           ${getAddressTypePadded(from.code)}${getAddressBalanceRightAligned(from.balanceAtTx)} ${getAddressBalanceNow(from.balanceNow)}
     from: ${chalk.bold.cyanBright(tx.from)} ${getNumberOfTransactions(tx.nonce)}
       ↓   ${formatWeiToEther(tx.value)}
      to:  ${tx.to ? chalk.bold.cyanBright(tx.to) : chalk.bold.dim.cyanBright(`None ⟶ Contract created at ${txReceipt.contractAddress}`)}
           ${getAddressTypePadded(to.code)}${getAddressBalanceRightAligned(to.balanceAtTx)} ${getAddressBalanceNow(to.balanceNow)}

    Time:  ${getTime(block.atTx.timestamp)}

    Block: ${tx.blockNumber.toLocaleString()} (${getBlocksAgo(tx.blockNumber, block.latest.number)})
           gas: ${block.atTx.gasUsed.toLocaleString()} / ${block.atTx.gasLimit.toLocaleString()} ⟶ ${getEfficiency(block.atTx.gasUsed, block.atTx.gasLimit)}
           Ø gas price in ${ block.atTx.transactions.length} txs: ${getAverageGasPrice(block.atTx.transactions)}
           hash: ${formatBytes32Hex(tx.blockHash)}

    Fee:   ${getFeeAndGasPrice(txReceipt.gasUsed, tx.gasPrice)}
           ${getGasDetails(txReceipt.gasUsed, tx.gas)}

    Data:  ${await getInputData(tx.input, 11)}

    Logs:  ${getLogs(txReceipt.logs, 7)}

    Signature:
      ${getSignature(tx)}
  `

  const output = `Fetched transaction details
  ${txMessage}`

  txReceipt.status ? spinner.succeed(output) : spinner.fail(output)
}
