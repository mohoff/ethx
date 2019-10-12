import R from 'ramda'
import chalk from 'chalk'

const MIN_ZERO_CHAIN = 3

const append = (
  numSubsequentZeros: number,
  char: string,
  minZeroChain: number
): string => {
  if (!numSubsequentZeros) {
    return char
  }

  const zerosAdded = R.repeat('0', numSubsequentZeros).join('')

  if (numSubsequentZeros >= minZeroChain) {
    return chalk.grey(zerosAdded) + char
  }

  return zerosAdded + char
}

type Accumulator = {
  built: string
  numSubsequentZeros: number
}
export const greyOutZeros = (
  bytes32OrMore: string,
  minZeroChain = MIN_ZERO_CHAIN
): string => {
  const [bytes32, lineAppendix] = bytes32OrMore.split(' ')

  const result = bytes32.split('').reduce(
    (acc: Accumulator, char: string) => {
      if (char === '0') {
        return {
          ...acc,
          numSubsequentZeros: acc.numSubsequentZeros + 1,
        }
      }

      return {
        built: acc.built + append(acc.numSubsequentZeros, char, minZeroChain),
        numSubsequentZeros: 0,
      }
    },
    { built: '', numSubsequentZeros: 0 }
  )

  const newBytes32 = result.numSubsequentZeros
    ? result.built + append(result.numSubsequentZeros, '', minZeroChain)
    : result.built

  return newBytes32 + ' ' + (lineAppendix ? lineAppendix : '')
}
