// https://github.com/mattpocock/ts-reset/blob/main/src/entrypoints/utils.d.ts
type WidenLiteral<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends bigint
        ? bigint
        : T extends symbol
          ? symbol
          : T;

// ReadonlyArray.includes with widened searchElement and type guard return type
interface ReadonlyArray<T> {
  includes<U extends WidenLiteral<T>>(
    searchElement: U,
    fromIndex?: number,
  ): searchElement is T;
}

// Array.includes with widened searchElement and type guard return type
interface Array<T> {
  includes<U extends WidenLiteral<T>>(
    searchElement: U,
    fromIndex?: number,
  ): searchElement is T;
}
