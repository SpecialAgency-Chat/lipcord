export type RecursiveReadonlyArray<T> = ReadonlyArray<T | RecursiveReadonlyArray<T>>;
export type EnumLike<E, V> = Record<keyof E, V>;