import R from 'ramda'
import ora from 'ora'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import chalk from 'chalk'

import { isTxHash } from './utils/is-tx-hash'
import { getWeb3 } from './utils/web3'
import { formatGasPrice } from './utils/format'

import { getBlocksAgo } from './elements/blocks-ago'
import { getAddressTypePadded } from './elements/address-type'
import { getBalance, getBalanceFixedWidth } from './elements/address-balance'
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



  let tx, txReceipt, block, blockLatest, balanceFrom, balanceTo, codeFrom, codeTo

  while (!tx || !txReceipt || !block || !blockLatest || !balanceFrom || !balanceTo || !codeFrom || !codeTo) {
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
  const averageBigNumber = (bigNumbers: BigNumber[]) => BigNumber.sum(...bigNumbers).dividedToIntegerBy(bigNumbers.length)
  const gasPriceAverage = R.compose<any[], string[], BigNumber[], BigNumber, string>(
    formatGasPrice,
    averageBigNumber,
    R.map(gasPrice => new BigNumber(gasPrice)),
    R.pluck('gasPrice')
  )(block.transactions)

  const transactionStatus = txReceipt.status ? chalk.green`SUCCEEDED` : chalk.red`FAILED`

  // TODO: add historic gas stats from ethgasstation for that time (-5,+5min)
  // TODO: details like: storage written, read, released, selfdestruct, #funccalls, #externalcalls
  // TODO: clarify difference between txreceipt.gasUsed and tx.gas
  // TODO: show current balance of from/to, but also balance of the time of the tx
  // TODO: show emitted logs of a transaction
  // TODO: From/To details: activity indicator, balance back then/balance now, #tx since then, #tx overall, tx every Xh on avg, total ETH moved. Activity last 1h,24h,1d,1w,1m,1y,alltime --> activity horizontal bar with dots
  // TODO: gas usage in the block: bar graph (limit, used, this tx) --> With correct x-offset of `this tx`?
  // TODO: for contracts get exposed functions (parse all tx of this contract with call frequency)
  // TODO: token ownership information for addresses?
  // TODO: show line numbers in data output

  const txMessage = `
    Transaction ${transactionStatus}

           ${getAddressTypePadded(codeFrom)}${getBalanceFixedWidth(balanceFrom)}
     from: ${chalk.cyanBright(tx.from)}
       ↓   ${getBalance(tx.value)}
      to:  ${chalk.cyanBright(tx.to)}
           ${getAddressTypePadded(codeTo)}${getBalanceFixedWidth(balanceTo)}

    Time:  ${new Date(block.timestamp * 1000).toISOString()} (${moment.unix(block.timestamp).fromNow()})
    Block: ${tx.blockNumber}                  (${getBlocksAgo(tx.blockNumber, blockLatest.number)})
           ${block.transactions.length} txs, #uncles: ${block.uncles.length}
           ${block.gasUsed}/${block.gasLimit} (${(100 * block.gasUsed / block.gasLimit).toFixed(2)}%) gas used, block Ø: ${gasPriceAverage}
           block hash: ${tx.blockHash}
    Fee:   ${tx.gas * Number(tx.gasPrice)} (gas: ${tx.gas},${txReceipt.gasUsed} @ ${formatGasPrice(tx.gasPrice)})

    ${await getInputData(tx.input)}
    ${txReceipt.contractAddress ? `⟶ Contract created: ${txReceipt.contractAddress}` : ''}
    Nonce: ${tx.nonce}
    transactionIndex: ${tx.transactionIndex}
    r: ${tx.r}
    s: ${tx.s}
    v: ${tx.v}
  `


  spinner.info(txMessage)
}


console.log(chalk.keyword('orange')('Yay for orange colored text!'));
console.log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
console.log(chalk.hex('#DEADED').dim('Bold gray!'));
