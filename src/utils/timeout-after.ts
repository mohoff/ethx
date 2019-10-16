const rejectAfterSeconds = (timeoutInSeconds: number): Promise<never> =>
  new Promise((_, reject): void => {
    // If no timeout should be applied (timeout=Infinity), never reject or resolve.
    if (timeoutInSeconds === Infinity) {
      return
    }

    const id = setTimeout(() => {
      clearTimeout(id)
      reject(`Timeout after ${timeoutInSeconds} seconds`)
    }, timeoutInSeconds * 1000)
  })

// TODO: improve typing
type GenericFn<B> = (...args: any[]) => B
export const timeoutAfter = (timeoutInSeconds: number) => <A, B>(
  promisifiedFn: GenericFn<B>
) => (...args: A[]): Promise<B | void> => {
  return Promise.race([
    promisifiedFn(...args),
    rejectAfterSeconds(timeoutInSeconds),
  ]) as Promise<B | void>
}
