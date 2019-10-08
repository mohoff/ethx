import Web3 from 'web3'

import config from '../config.json'
import { EthereumNetwork } from '../globals'

export const getWeb3 = (
  network: EthereumNetwork = EthereumNetwork.MAINNET
): Web3 => {
  return new Web3(
    new Web3.providers.WebsocketProvider(
      `wss://${network}.infura.io/ws/v3/${config.INFURA_API_KEY}`
    )
  )
}
