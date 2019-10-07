

export const getBlocksAgo = (txBlockNumber: number, currentBlockNumber: number): string => {
  if (!txBlockNumber || !currentBlockNumber) {
    return 'Unable to fetch block difference'
  }

  if (txBlockNumber === currentBlockNumber) {
    return 'latest block'
  }

  const blockNumberDiff = currentBlockNumber - txBlockNumber

  return `${blockNumberDiff} block${blockNumberDiff > 1 ? 's' : ''} ago`
}
