import varint from "varint";

const SEGMENT_BITS = 0x7f;
const CONTINUE_BIT = 0x80;
const SEGMENT_BITS_REVERSED = ~SEGMENT_BITS;

export let encode_varint = (value: number): Uint8Array => {
  return new Uint8Array(varint.encode(value));

  ///////////////////////////////////////////

  // if (value === 0) {
  //   return new Uint8Array([0]);
  // }

  // if (value < 0) {
  //   return new Uint8Array(array_varint.encode(value));
  // }

  // let varint_length = Math.ceil(Math.log2(Math.abs(value) + 1) / 7);
  // let buffer = new Uint8Array(varint_length);

  // let i = 0;
  // while (true) {
  //   if ((value & SEGMENT_BITS_REVERSED) == 0) {
  //     buffer[i] = value;
  //     return buffer;
  //   }
  //   buffer[i] = (value & SEGMENT_BITS) | CONTINUE_BIT;
  //   i = i + 1;
  //   // Note: >>> means that the sign bit is shifted with the rest of the number rather than being left alone
  //   value >>>= 7;
  // }
};

export let decode_varint = (
  buffer: Uint8Array,
  offset?: number
): [number, number] => {
  let value = varint.decode(buffer, offset);
  return [value, varint.decode.bytes];
};
