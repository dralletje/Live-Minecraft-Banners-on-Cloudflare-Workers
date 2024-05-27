import { sumBy } from "lodash-es";
import { decode_varint } from "./varint";
import { encode_combined } from "./Protocol";

class WithVarintLengthTransformer
  implements Transformer<Uint8Array, Uint8Array>
{
  #buffer: Array<Uint8Array> = [];

  transform(
    chunk: Uint8Array,
    controller: TransformStreamDefaultController<Uint8Array>
  ) {
    this.#buffer.push(chunk);

    let [size, offset] = decode_varint(this.#buffer[0]);
    let combined_size = sumBy(this.#buffer, (x) => x.byteLength);
    if (combined_size >= size + offset) {
      let combined = encode_combined(this.#buffer);
      controller.enqueue(combined.subarray(offset, offset + size));
      this.#buffer = [combined.subarray(offset + size)];
    }
  }
  flush(controller: TransformStreamDefaultController<Uint8Array>) {
    // controller.enqueue(encode_combined(this.#buffer));
    if (this.#buffer.length > 0) {
      throw new Error("Packet not complete");
    }
  }
}

export let WithVarintLengthTransformStream = () => {
  return new TransformStream<Uint8Array, Uint8Array>(
    new WithVarintLengthTransformer()
  );
};
