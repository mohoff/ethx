import R from 'ramda'
import ora from 'ora'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import chalk from 'chalk'

import { isTxHash } from './utils/is-tx-hash'
import { getWeb3 } from './utils/web3'
import { formatGasPrice } from './utils/format'
import { resolveFunctionSignature } from './utils/resolve-function-signature'

import { getBlocksAgo } from './elements/blocks-ago'
import { getAddressTypePadded } from './elements/address-type'
import { getAddressBalanceFixedWith } from './elements/address-balance'

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

  const transactionStatus = txReceipt.status ? chalk.green('SUCCEEDED') : chalk.red('FAILED')
  const functionName = await resolveFunctionSignature(tx.input)


  // TODO: at timestamp with (X secs ago). Make this a top header with block number
  // TODO: add block details: gas consumed, #txs, avg gas price
  // TODO: add historic gas stats from ethgasstation for that time (-5,+5min)
  // TODO: lookup for input hash --> can we show function name?
  // TODO: details like: storage written, read, released, selfdestruct, #funccalls, #externalcalls
  // TODO: clarify difference between txreceipt.gasUsed and tx.gas
  // TODO: show current balance of from/to, but also balance of the time of the tx
  const txMessage = `
    Transaction ${transactionStatus}

            ${getAddressTypePadded(codeFrom)}${getAddressBalanceFixedWith(balanceFrom)}
      from: ${chalk.blue(tx.from)}
        ↓   ${tx.value} ETH
       to:  ${chalk.red(tx.to)}
            ${getAddressTypePadded(codeTo)}${getAddressBalanceFixedWith(balanceTo)}

    at time:  ${new Date(block.timestamp * 1000).toISOString()} (${moment.unix(block.timestamp).fromNow()})
    at block: ${tx.blockNumber}                  (${getBlocksAgo(tx.blockNumber, blockLatest.number)})
              ${block.transactions.length} txs, #uncles: ${block.uncles.length}
              ${block.gasUsed}/${block.gasLimit} gas used, block Ø: ${gasPriceAverage}
              block hash: ${tx.blockHash}

    fee:      ${tx.gas * Number(tx.gasPrice)} (gas: ${tx.gas},${txReceipt.gasUsed} @ ${formatGasPrice(tx.gasPrice)}) (cumulative: ${txReceipt.cumulativeGasUsed})

    nonce: ${tx.nonce}
    transactionIndex: ${tx.transactionIndex}
    r: ${tx.r}
    s: ${tx.s}
    v: ${tx.v}

    input: ${tx.input} ${functionName ? chalk.green(`⟶ ${functionName}`) : '(unkown signature)'}

    created contract at: ${txReceipt.contractAddress}
  `


  spinner.info(txMessage)
}
