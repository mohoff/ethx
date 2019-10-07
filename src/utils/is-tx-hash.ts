export const isTxHash = (txHash: string) => /^0x[A-Fa-f0-9]{64}$/.test(txHash)
