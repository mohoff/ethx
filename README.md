# `ethx`

Ethereum transaction viewer. Etherscan.io for the command line.

## Usage

```sh
ethx view <transactionHash>
ethx await <transactionHash> [--confirmations]
```

## TODO

## Ideas

- integrate etherscan api to get verrified contract code
  - parse contract name
  - parse event names --> hash all to find match with logs
  - parse external functions --> hash all to find match with function signature
- add historic gas stats from ethgasstation for that time (-5,+5min)
- From/To details: activity indicator, #tx since then, #tx overall, tx every Xh on avg, total ETH moved.
Activity last 1h,24h,1d,1w,1m,1y,alltime --> activity horizontal bar with dots
- gas usage in the block: bar graph (limit, used, this tx) --> With correct x-offset of `this tx`?
- for contracts get exposed functions (parse all tx of this contract with call frequency)
- show line numbers in data output
- make use of tx.transactionIndex
- tx.input: When functionName is known with 1+ params, the value type for the first few lines of hex can be known
