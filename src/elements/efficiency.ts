export const getEfficiency = (
  nominator: number,
  denominator: number
): string => {
  const efficiency = (100 * nominator) / denominator

  return efficiency.toFixed(1) + '% eff.'
}
