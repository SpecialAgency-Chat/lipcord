import { RecursiveReadonlyArray, EnumLike } from "./types";

export type BitFieldResolvable<T extends string, N extends number | bigint> =
  | RecursiveReadonlyArray<T | N | `${bigint}` | Readonly<BitField<T, N>>>
  | T
  | N
  | `${bigint}`
  | Readonly<BitField<T, N>>;

export class BitField<S extends string, N extends number | bigint = number> {
  static Flags: EnumLike<unknown, number | bigint> = {};
  public bitfield: N;
  static DefaultBit: number | bigint = 0;

  /**
   * @param {BitFieldResolvable} [bits] Bit(s) to read from
   */
  constructor(bits?: BitFieldResolvable<S, N>) {
    /**
     * Bitfield of the packed bits
     * @type {number|bigint}
     */
    bits ??= BitField.DefaultBit as BitFieldResolvable<S, N>;
    this.bitfield = BitField.resolve(bits);
  }

  /**
   * Checks whether the bitfield has a bit, or any of multiple bits.
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  any(bit: BitFieldResolvable<S, N>): boolean {
    return (this.bitfield & BitField.resolve(bit)) !== BitField.DefaultBit;
  }

  /**
   * Checks if this bitfield equals another
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  equals(bit: BitFieldResolvable<S, N>): boolean {
    return this.bitfield === BitField.resolve(bit);
  }

  /**
   * Checks whether the bitfield has a bit, or multiple bits.
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  has(bit: BitFieldResolvable<S, N>): boolean {
    bit = BitField.resolve(bit);
    return (this.bitfield & bit as N) === bit;
  }

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param {BitFieldResolvable} bits Bit(s) to check for
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
  missing(bits: BitFieldResolvable<S, N>, ...hasParams: readonly unknown[]): S[] {
    return new BitField(bits).remove(this).toArray(...hasParams);
  }

  /**
   * Freezes these bits, making them immutable.
   * @returns {Readonly<BitField>}
   */
  freeze(): Readonly<BitField<S, N>> {
    return Object.freeze(this);
  }

  /**
   * Adds bits to these ones.
   * @param {...BitFieldResolvable} [bits] Bits to add
   * @returns {BitField} These bits or new BitField if the instance is frozen.
   */
  add(...bits: BitFieldResolvable<S, N>[]): BitField<S, N> {
    let total = BitField.DefaultBit as N;
    for (const bit of bits) {
      // @ts-expect-error BitField cannot use |=
      total |= BitField.resolve(bit);
    }
    if (Object.isFrozen(this)) return new BitField(this.bitfield | total);
    this.bitfield |= total;
    return this;
  }

  /**
   * Removes bits from these.
   * @param {...BitFieldResolvable} [bits] Bits to remove
   * @returns {BitField} These bits or new BitField if the instance is frozen.
   */
  remove(...bits: BitFieldResolvable<S, N>[]): BitField<S, N> {
    let total = this.constructor.DefaultBit;
    for (const bit of bits) {
      total |= this.constructor.resolve(bit);
    }
    if (Object.isFrozen(this)) return new this.constructor(this.bitfield & ~total);
    this.bitfield &= ~total;
    return this;
  }

  /**
   * Gets an object mapping field names to a {@link boolean} indicating whether the
   * bit is available.
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {Object}
   */
  serialize(...hasParams: readonly unknown[]): Record<S, boolean> {
    const serialized = {};
    for (const [flag, bit] of Object.entries(this.constructor.Flags)) {
      if (isNaN(flag)) serialized[flag] = this.has(bit, ...hasParams);
    }
    return serialized;
  }

  /**
   * Gets an {@link Array} of bitfield names based on the bits available.
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
  toArray(...hasParams: readonly unknown[]): S[] {
    return [...this[Symbol.iterator](...hasParams)];
  }

  toJSON(): N extends number ? number : string {
    return typeof this.bitfield === 'number' ? this.bitfield : this.bitfield.toString();
  }

  valueOf(): N {
    return this.bitfield;
  }

  *[Symbol.iterator](...hasParams: readonly unknown[]):  IterableIterator<S> {
    for (const bitName of Object.keys(this.constructor.Flags)) {
      if (isNaN(bitName) && this.has(bitName, ...hasParams)) yield bitName;
    }
  }

  /**
   * Data that can be resolved to give a bitfield. This can be:
   * * A bit number (this can be a number literal or a value taken from {@link BitField.Flags})
   * * A string bit number
   * * An instance of BitField
   * * An Array of BitFieldResolvable
   * @typedef {number|string|bigint|BitField|BitFieldResolvable[]} BitFieldResolvable
   */

  /**
   * Resolves bitfields to their numeric form.
   * @param {BitFieldResolvable} [bit] bit(s) to resolve
   * @returns {number|bigint}
   */
  static resolve(bit:  BitFieldResolvable<string, number | bigint>): N {
    const { DefaultBit } = this;
    if (typeof DefaultBit === typeof bit && bit >= DefaultBit) return bit;
    if (bit instanceof BitField) return bit.bitfield;
    if (Array.isArray(bit)) return bit.map(p => this.resolve(p)).reduce((prev, p) => prev | p, DefaultBit);
    if (typeof bit === 'string') {
      if (!isNaN(bit)) return typeof DefaultBit === 'bigint' ? BigInt(bit) : Number(bit);
      if (this.Flags[bit] !== undefined) return this.Flags[bit];
    }
    throw new DiscordjsRangeError(ErrorCodes.BitFieldInvalid, bit);
  }
}

export default BitField;