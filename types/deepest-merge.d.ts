declare module "deepest-merge" {
  export default function deepestMerge<T, PT = Partial<T>>(
    ...args: (T | PT)[]
  ): T;
}
