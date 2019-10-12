export const isTxHash = (txHash: string | undefined): boolean =>
  !!txHash && /^0x[A-Fa-f0-9]{64}$/.test(txHash)
