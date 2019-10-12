import R from 'ramda'
import chalk from 'chalk'
import { resolveFunctionSignature } from '../utils/resolve-function-signature'
import { formatBytes32Hex, formatHexData } from '../utils/format'
import { breakAndIndent } from '../utils/break-and-indent'

export const getInputData = async (
  inputData: string,
  indentBy = 4
): Promise<string> => {
  const functionSignature = inputData.slice(0, 10)
  const functionName = await resolveFunctionSignature(functionSignature)

  const header = `${formatBytes32Hex(functionSignature)} ${
    functionName
      ? chalk.green('⟶ ' + functionName)
      : chalk.grey('(unkown signature)')
  }`

  if (inputData.length === 10) {
    return header
  }

  const data = formatHexData(R.slice(10, Infinity, inputData), indentBy)

  return `${header}${breakAndIndent(indentBy)}${data}`
}
