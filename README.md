# `ethx`

Ethereum transaction pretty-printer. [Etherscan.io](https://etherscan.io/) for the command line.

## Install

```sh
yarn global add @mohoff/ethx
# or
npm install -g @mohoff/ethx
```

## Use

You can use `ethx` to wait for a transaction to reach a certain number of network confirmations or simply pretty-print a mined transaction.

```sh
# View transaction details
ethx [view] <transactionHash> -i infuraApiKey [-t timeout]

# Wait for a transaction to reach a certain number of block confirmations and print its details.
ethx await <transactionHash> -i infuraApiKey [-c confirmations] [-t timeout]
```

## Example

TODO: show terminal screenshot

## Future features and ideas

- Support other providers than infura
- Show contract name (make calls to name() and getName())
- Switch networks with `--network`/`--chain`
- Output raw transaction objects with `--raw`
- Integrate Etherscan API to get verrified contract code
  - parse contract name
  - parse event names --> hash all to find match with tx logs
  - parse external functions --> hash all to find match with function signature
- Add historic gas stats from ethgasstation for that time (-5,+5min)
- From/To details: activity indicator, #tx since then, #tx overall, tx every Xh on avg, total ETH moved.
Activity last 1h,24h,1d,1w,1m,1y,alltime --> activity horizontal bar with dots
- Refactor some parts to use websocket-provider to ease network load
- Gas usage in the block: bar graph (limit, used, this tx) --> With correct x-offset of _current tx_?
- Show line numbers in data output
- Make use of `tx.transactionIndex` --> Can we derive miner's priority in including a tx into the block?
- When functionName is known with 1+ params, the value type for the first few lines of `tx.input` can be derived

## Related Work

- [eth-cli](https://github.com/protofire/eth-cli)
