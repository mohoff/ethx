import ora from 'ora'
import chalk from 'chalk'

import { aggregateEthereumData } from './aggregate'

import { formatHex, formatWeiToEther } from './utils/format'

import { getStatus } from './elements/status'
import { getTime } from './elements/time'
import { getFeeAndGasPrice, getGasDetails } from './elements/fee'
import { getEfficiency } from './elements/efficiency'
import { getBlocksAgo } from './elements/blocks-ago'
import { getAverageGasPrice } from './elements/average-gas-price'
import { getAddressTypePadded } from './elements/address-type'
import { getNumberOfTransactions } from './elements/address-num-transactions'
import {
  getAddressBalanceNow,
  getAddressBalanceRightAligned,
} from './elements/address-balance'
import { getInputData } from './elements/input-data'

export const watch = async (txHash: string): Promise<void> => {
  const spinner = ora(`Watching transaction ${txHash}`).start()

  const { from, to, block, tx, txReceipt } = await aggregateEthereumData(txHash)

  // TODO: fix input data output for 0x5865a14b24c6792118c10b5b969d549efe5574ff5a7dca4bd2783414582f0718
  // TODO: add historic gas stats from ethgasstation for that time (-5,+5min)
  // TODO: details like: storage written, read, released, selfdestruct, #funccalls, #externalcalls
  // TODO: show emitted logs of a transaction
  // TODO: From/To details: activity indicator, balance back then/balance now, #tx since then, #tx overall, tx every Xh on avg, total ETH moved. Activity last 1h,24h,1d,1w,1m,1y,alltime --> activity horizontal bar with dots
  // TODO: gas usage in the block: bar graph (limit, used, this tx) --> With correct x-offset of `this tx`?
  // TODO: for contracts get exposed functions (parse all tx of this contract with call frequency)
  // TODO: token ownership information for addresses?
  // TODO: show line numbers in data output
  // TODO: make use of ${tx.transactionIndex}
  // TODO: tx.input: When functionName is known with 1+ params, the value type for the first few lines of hex can be known

  // prettier-ignore
  const txMessage = `
    ${getStatus(txReceipt.status)}

           ${getAddressTypePadded(from.code)}${getAddressBalanceRightAligned(from.balanceAtTx)} ${getAddressBalanceNow(from.balanceNow)}
     from: ${chalk.bold.cyanBright(tx.from)} ${getNumberOfTransactions(tx.nonce)}
       ↓   ${formatWeiToEther(tx.value)}
      to:  ${tx.to ? chalk.bold.cyanBright(tx.to) : chalk.bold.dim.cyanBright(`None ⟶ Contract created at ${txReceipt.contractAddress}`)}
           ${getAddressTypePadded(to.code)}${getAddressBalanceRightAligned(to.balanceAtTx)} ${getAddressBalanceNow(to.balanceNow)}

    Time:  ${getTime(block.atTx.timestamp)}

    Block: ${tx.blockNumber.toLocaleString()} (${getBlocksAgo(tx.blockNumber, block.latest.number)})
           gas: ${block.atTx.gasUsed.toLocaleString()} / ${block.atTx.gasLimit.toLocaleString()} ⟶ ${getEfficiency(block.atTx.gasUsed, block.atTx.gasLimit)}
           Ø gas price in ${ block.atTx.transactions.length} txs: ${getAverageGasPrice(block.atTx.transactions)}
           hash: ${formatHex(tx.blockHash)}

    Fee:   ${getFeeAndGasPrice(txReceipt.gasUsed, tx.gasPrice)}
           ${getGasDetails(txReceipt.gasUsed, tx.gas)}

    Data:  ${await getInputData(tx.input, 11)}

    Signature:
      r: ${formatHex(tx.r)}
      s: ${formatHex(tx.s)}
      v: ${formatHex(tx.v)}
  `

  const output = `Mined transaction ${txHash}
  ${txMessage} `

  txReceipt.status ? spinner.succeed(output) : spinner.fail(output)
}
