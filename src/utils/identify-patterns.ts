import R from 'ramda'
import chalk from 'chalk'

export const identifyPatterns = (bytes32: string): string => {
  const leadingHex = bytes32.slice(0, 24)
  const trailingHex = bytes32.slice(24).split('')

  const numZeros = R.compose<string[], string[], number>(
    R.length,
    R.filter(hex => hex === '0')
  )(trailingHex)

  // Simple heuristic to estimate entropy
  const numDifferentHexValues = R.compose<
    string[],
    Record<string, number>,
    number[],
    number
  >(
    R.length,
    R.values,
    R.countBy(R.identity)
  )(trailingHex)

  if (Number(leadingHex) === 0 && numZeros < 20 && numDifferentHexValues > 8) {
    return `${bytes32} ${chalk.grey`address?`}`
  }

  return bytes32
}
