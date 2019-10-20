#!/usr/bin/env node

import * as yargs from 'yargs'
import R from 'ramda'
import chalk from 'chalk'

import { view as viewTx, VIEW_TIMEOUT_IN_SECONDS } from './view'
import { await as awaitTx } from './await'

import { validateTxHash } from './utils/validate-tx-hash'
import { timeoutAfter } from './utils/timeout-after'

enum COMMANDS {
  VIEW = 'view',
  AWAIT = 'await',
}

const txHashAsString = R.head(
  R.without(Object.values(COMMANDS), process.argv.slice(2))
)

const argv = yargs
  .command(
    [`${COMMANDS.VIEW} <transactionHash>`, '$0'],
    'View transaction details',
    yargs => {
      yargs
        .positional('transactionHash', {
          type: 'string',
        })
        .check(validateTxHash)
        // If the alias of this command is used, the transaction hash (hex) is interpreted as number.
        // As a fix, we replace here the number representation by the manually parsed string representation.
        .coerce({
          transactionHash: () => txHashAsString,
        })
        .option('timeout', {
          alias: 't',
          type: 'number',
          describe: 'Timeout in seconds until this command fails',
          default: VIEW_TIMEOUT_IN_SECONDS,
        })
        .option('infura-api-key', {
          alias: 'i',
          type: 'string',
          describe: 'Infura API Key used to query Ethereum',
          demandOption: true,
        })
    }
  )
  .command(
    `${COMMANDS.AWAIT} <transactionHash>`,
    'Wait for network confirmations of a transaction',
    yargs => {
      yargs
        .positional('transactionHash', {
          type: 'string',
        })
        .coerce({
          transactionHash: () => txHashAsString,
        })
        .check(validateTxHash)
        .option('confirmations', {
          alias: 'c',
          type: 'number',
          describe: 'Number of confirmations to wait for',
          demandOption: true,
        })
        .option('timeout', {
          alias: 't',
          type: 'number',
          describe: 'Timeout in seconds until this command fails',
          // The termination of this command is primarily controlled with --confirmations
          default: Infinity,
        })
        .option('infura-api-key', {
          alias: 'i',
          type: 'string',
          describe: 'Infura API Key used to query Ethereum',
          demandOption: true,
        })
    }
  ).argv

const handleCliInput = async (): Promise<void> => {
  const timeout = timeoutAfter(argv.timeout as number)

  if (argv._[0] === COMMANDS.VIEW || argv._.length === 0) {
    await timeout(viewTx)(
      argv.transactionHash as string,
      argv.timeout as number,
      argv.infuraApiKey as string
    )
  } else if (argv._[0] === COMMANDS.AWAIT) {
    await timeout(awaitTx)(
      argv.transactionHash as string,
      argv.confirmations as number,
      argv.infuraApiKey as string
    )
  }
}
;(async function main(): Promise<void> {
  try {
    await handleCliInput()
  } catch (error) {
    console.log('\n\n', chalk.red(error), '\n')

    process.exit(1)
  }

  process.exit(0)
})()
