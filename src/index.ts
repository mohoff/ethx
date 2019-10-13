import * as yargs from 'yargs'
import R from 'ramda'
import chalk from 'chalk'

import { view as viewTx } from './view'
import { await as awaitTx } from './await'

import { isTxHash } from './utils/is-tx-hash'

enum COMMANDS {
  VIEW = 'view',
  AWAIT = 'await',
}

// Hack to get unparsed hex string. By default, yargs parses hex strings to numbers.
const txHashAsString = R.head(
  R.without(Object.values(COMMANDS), process.argv.slice(2))
)

const validateTransactionHash = ({
  transactionHash,
}: Record<'transactionHash', string | undefined>): true => {
  if (isTxHash(transactionHash)) {
    return true
  }

  throw new Error(
    chalk.red(`${transactionHash} is not a valid transaction hash\n`)
  )
}

const argv = yargs
  .command(
    [`${COMMANDS.VIEW} <transactionHash>`, '$0'],
    'View transaction details',
    yargs => {
      yargs
        .positional('transactionHash', {
          type: 'string',
        })
        .check(validateTransactionHash)
        .coerce({
          transactionHash: () => txHashAsString,
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
        .check(validateTransactionHash)
        .option('confirmations', {
          alias: 'c',
          type: 'number',
          describe: 'Number of confirmations to wait for',
          demandCommand: true,
        })
    }
  ).argv

const handleCliInput = async (): Promise<void> => {
  if (argv._[0] === COMMANDS.VIEW || argv._.length === 0) {
    await viewTx(argv.transactionHash as string)
    process.exit(0)
  } else if (argv._[0] === COMMANDS.AWAIT) {
    await awaitTx(argv.transactionHash as string, argv.confirmations as number)
  }
}
;(async function main(): Promise<void> {
  await handleCliInput()
  process.exit(0)
})()
