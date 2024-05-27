import { decode_json, encode_string } from "@dral/binary-protocol/string";
import { decode_varint, encode_varint } from "@dral/binary-protocol/varint";
import { encode_with_varint_length } from "@dral/binary-protocol/with_varint_length";
import {
  consume,
  decode_combined,
  encode_combined,
} from "@dral/binary-protocol/Protocol";
import { WithVarintLengthTransformStream } from "@dral/binary-protocol/WithVarintLengthTransformStream";
import { connect } from "@dral/disposable-connect";

export let minecraft_ping = async ({
  hostname,
  port,
  signal,
}: SocketAddress & {
  signal?: AbortSignal;
}) => {
  let socket = connect(
    { hostname: hostname, port: port },
    { signal: signal, allowHalfOpen: false }
  );

  try {
    let writer = socket.writable.getWriter();
    let readable = socket.readable
      .pipeThrough(WithVarintLengthTransformStream())
      .getReader();

    /// TODO This should be done by socket.close()??
    signal?.addEventListener("abort", () => {
      readable.cancel();
      writer.close();
    });

    writer.write(
      encode_with_varint_length(
        encode_combined([
          encode_varint(0x00),
          encode_varint(-1),
          encode_string(hostname),
          new Uint16Array([port]),
          encode_varint(1),
        ])
      )
    );

    // Request
    writer.write(encode_with_varint_length(encode_varint(0x00)));

    let packet = await readable.read();
    if (packet.done === true) {
      throw new Error("No response from server");
    }

    let [packet_id, data] = consume(
      decode_combined([
        decode_varint,
        decode_json<{
          version: { name: string; protocol: number };
          players: {
            max: number;
            online: number;
            sample?: [{ id: string; name: string }];
          };
          description: string;
          favicon?: string;
        }>,
      ])
    )(packet.value);

    return data;
  } finally {
    /// Because Wrangler doesn't support `using socket = ...`
    socket[Symbol.dispose]();
  }
};
