export const isTxHash = (txHash: string): boolean =>
  /^0x[A-Fa-f0-9]{64}$/.test(txHash)
