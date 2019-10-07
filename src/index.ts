import { watch } from './watch'


(async function main() {
  const passedArgs = process.argv.slice(2)
  await watch(passedArgs[0])
  process.exit(0)
})()
