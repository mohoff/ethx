import Web3 from 'web3'

import { EthereumNetwork } from '../types'

export const getWeb3 = (
  infuraApiKey: string,
  network: EthereumNetwork = EthereumNetwork.MAINNET
): Web3 => {
  return new Web3(
    new Web3.providers.WebsocketProvider(
      `wss://${network}.infura.io/ws/v3/${infuraApiKey}`
    )
  )
}
