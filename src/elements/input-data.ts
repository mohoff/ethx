import R from 'ramda'
import chalk from 'chalk'
import { resolveFunctionSignature } from '../utils/resolve-function-signature'
import { formatHex } from '../utils/format'

type Accumulator = {
  built: string
  numSubsequentZeros: number
}
const greyOutZeros = (bytes32OrMore: string, minZeroChain = 3): string => {
  const [bytes32, lineAppendix] = bytes32OrMore.split(' ')

  const append = (numSubsequentZeros: number, char: string): string => {
    if (!numSubsequentZeros) {
      return char
    }

    const zerosAdded = R.repeat('0', numSubsequentZeros).join('')

    if (numSubsequentZeros >= minZeroChain) {
      return chalk.grey(zerosAdded) + char
    }

    return zerosAdded + char
  }

  const result = bytes32.split('').reduce(
    (acc: Accumulator, char: string) => {
      if (char === '0') {
        return {
          ...acc,
          numSubsequentZeros: acc.numSubsequentZeros + 1,
        }
      }

      return {
        built: acc.built + append(acc.numSubsequentZeros, char),
        numSubsequentZeros: 0,
      }
    },
    { built: '', numSubsequentZeros: 0 }
  )

  const newBytes32 = result.numSubsequentZeros
    ? result.built + append(result.numSubsequentZeros, '')
    : result.built

  return newBytes32 + ' ' + (lineAppendix ? lineAppendix : '')
}

const appendIdentifiedPattern = (bytes32: string): string => {
  const leadingHex = bytes32.slice(0, 24)
  const trailingHex = bytes32.slice(24).split('')

  const numZeros = R.compose<string[], string[], number>(
    R.length,
    R.filter(hex => hex === '0')
  )(trailingHex)

  // As a simple measure of entropy
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

export const getInputData = async (
  inputData: string,
  indentation = 4
): Promise<string> => {
  const functionSignature = inputData.slice(0, 10)
  const functionName = await resolveFunctionSignature(functionSignature)

  const header = `${formatHex(functionSignature)} ${
    functionName
      ? chalk.green('⟶ ' + functionName)
      : chalk.grey('(unkown signature)')
  }`

  if (inputData.length === 10) {
    return header
  }

  const breakAndIdent = '\n' + R.repeat(' ', indentation).join('')

  const data = R.compose<string, string, string[], string[], string>(
    R.join(breakAndIdent),
    R.map(
      R.compose(
        greyOutZeros,
        appendIdentifiedPattern
      )
    ),
    R.splitEvery(64),
    R.slice(10, Infinity)
  )(inputData)

  return `${header}${breakAndIdent}${data}`
}
