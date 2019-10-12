import R from 'ramda'
import chalk from 'chalk'

import { formatBytes32Hex, formatHexData } from '../utils/format'
import { breakAndIndent } from '../utils/break-and-indent'

import { Log } from 'web3/types'

const INDEXED_PREFIX = chalk.grey('i ')
const TOPIC_LOOKUP: Record<string, string> = {
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef':
    'Transfer(address,address,uint256)',
  '8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925':
    'Approval(address,address,uint256)',
}

const addIndexedPrefix = (hex: string): string => INDEXED_PREFIX + hex

const formatTopic = (topic: string): string =>
  R.compose<string, string, string>(
    addIndexedPrefix,
    formatBytes32Hex
  )(topic)

const formatTopicsWithIndent = (indentBy: number) => (
  topics: string[]
): string =>
  R.compose<string[], string[], string>(
    R.join(breakAndIndent(indentBy)),
    R.map(formatTopic)
  )(topics)

const buildLog = (indentBy: number) => ({
  data,
  topics,
}: {
  data: string
  topics: string[]
}): string => {
  data = data + data.slice(2)

  const formattedTopics = formatTopicsWithIndent(indentBy)(topics)

  const formattedData = formatHexData(data.slice(2), indentBy + 4)

  const resolvedLogEvent = TOPIC_LOOKUP[topics[0]]

  if (resolvedLogEvent) {
    return `
           ${chalk.green('⟶ ' + resolvedLogEvent)}
       ${formattedTopics}
         ${chalk.grey('0x')}${formattedData}`
  }

  return `
       ${formattedTopics}
         ${chalk.grey('0x')}${formattedData}`
}

export const getLogs = (logs: Log[] | undefined, indentBy: number): string => {
  if (!logs || !logs.length) {
    return chalk.grey('(none)')
  }

  logs = [logs[0], logs[0]]

  const transformedLogs = R.map(
    R.compose<Log, Pick<Log, 'data' | 'topics'>, string>(
      buildLog(indentBy),
      R.pick(['data', 'topics'])
    )
  )(logs)

  return `${transformedLogs.length}
        ${transformedLogs.join('\n')}`
}
