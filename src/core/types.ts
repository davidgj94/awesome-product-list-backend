export type AwaitedAsyncFunc<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
>;
