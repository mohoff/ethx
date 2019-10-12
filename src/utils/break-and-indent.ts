import R from 'ramda'

export const breakAndIndent = (indentation: number): string => {
  return '\n' + R.repeat(' ', indentation).join('')
}
