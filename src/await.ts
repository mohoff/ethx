export const await = async (
  txHash: string,
  numConfirmations: number
): Promise<void> => {
  console.log('await command called with', txHash, numConfirmations)
  // TODO: implement
}
