import R from 'ramda'
import ora from 'ora'
import { formatDistanceToNow } from 'date-fns'
import BigNumber from 'bignumber.js'
import chalk from 'chalk'
import numeral from 'numeral'

import { isTxHash } from './utils/is-tx-hash'
import { getWeb3 } from './utils/web3'
import { formatGasPrice, formatHex, formatWeiToEther } from './utils/format'

import { getFeeAndGasPrice, getGasDetails } from './elements/fee'
import { getBlocksAgo } from './elements/blocks-ago'
import { getAddressTypePadded } from './elements/address-type'
import { getAddressBalanceRightAligned } from './elements/address-balance'
import { getInputData } from './elements/input-data'

import { EthereumNetwork } from './globals'

export const watch = async (txHash: string): Promise<void> => {
  if (R.isNil(txHash) || !R.is(String, txHash)) {
    throw new Error('Invalid input')
  }

  if (!isTxHash(txHash)) {
    throw new Error(`Invalid transaction hash ${txHash}`)
  }

  const spinner = ora(`Watching transaction ${txHash}`).start()

  const web3 = getWeb3(EthereumNetwork.MAINNET)

  let tx,
    txReceipt,
    block,
    blockLatest,
    balanceFrom,
    balanceTo,
    codeFrom,
    codeTo

  while (
    !tx ||
    !txReceipt ||
    !block ||
    !blockLatest ||
    !balanceFrom ||
    !balanceTo ||
    !codeFrom ||
    !codeTo
  ) {
    tx = await web3.eth.getTransaction(txHash)
    txReceipt = await web3.eth.getTransactionReceipt(txHash)
    block = await web3.eth.getBlock(tx.blockNumber, true)
    blockLatest = await web3.eth.getBlock('latest')
    balanceFrom = await web3.eth.getBalance(tx.from)
    balanceTo = await web3.eth.getBalance(tx.to)
    codeFrom = await web3.eth.getCode(tx.from)
    codeTo = await web3.eth.getCode(tx.to)
  }

  spinner.succeed(`Mined transaction ${txHash}`)

  //const average = R.converge(R.divide, [R.sum, R.length])
  const averageBigNumber = (bigNumbers: BigNumber[]): BigNumber =>
    BigNumber.sum(...bigNumbers).dividedToIntegerBy(bigNumbers.length)

  const gasPriceAverage = R.compose<
    any[],
    string[],
    BigNumber[],
    BigNumber,
    string
  >(
    formatGasPrice,
    averageBigNumber,
    R.map(gasPrice => new BigNumber(gasPrice)),
    R.pluck('gasPrice')
  )(block.transactions)

  const transactionStatus = txReceipt.status
    ? chalk.green`SUCCEEDED`
    : chalk.red`FAILED`

  // TODO: add historic gas stats from ethgasstation for that time (-5,+5min)
  // TODO: details like: storage written, read, released, selfdestruct, #funccalls, #externalcalls
  // TODO: show current balance of from/to, but also balance of the time of the tx
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
    ${chalk.bold(`Transaction ${transactionStatus}`)}

           ${getAddressTypePadded(codeFrom)}${getAddressBalanceRightAligned(balanceFrom)}
     from: ${chalk.bold.cyanBright(tx.from)} ${chalk.grey(numeral(tx.nonce).format('0o') + ' tx')}
       ↓   ${formatWeiToEther(tx.value)}
      to:  ${chalk.bold.cyanBright(tx.to)}
           ${getAddressTypePadded(codeTo)}${getAddressBalanceRightAligned(balanceTo)}

    Time:  ${new Date(block.timestamp * 1000).toISOString()} (${formatDistanceToNow(block.timestamp * 1000, { includeSeconds: true, addSuffix: true, })})

    Block: ${tx.blockNumber.toLocaleString()} (${getBlocksAgo(tx.blockNumber, blockLatest.number)})
           gas: ${block.gasUsed.toLocaleString()} / ${block.gasLimit.toLocaleString()} ⟶ ${((100 * block.gasUsed) / block.gasLimit).toFixed(2)}% eff.
           Ø gas price in ${block.transactions.length} txs: ${gasPriceAverage}
           hash: ${formatHex(tx.blockHash)}

    Fee:  ${getFeeAndGasPrice(txReceipt.gasUsed, tx.gasPrice)}
          ${getGasDetails(txReceipt.gasUsed, tx.gas)}

    Data: ${await getInputData(tx.input, 11)}
    ${txReceipt.contractAddress ? `⟶ Contract created: ${txReceipt.contractAddress}` : ''}
    Signature:
      r: ${formatHex(tx.r)}
      s: ${formatHex(tx.s)}
      v: ${formatHex(tx.v)}
  `

  spinner.info(txMessage)
}
