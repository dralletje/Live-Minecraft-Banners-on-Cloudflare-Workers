import {
  ReadableStream,
  Socket,
  SocketInfo,
  SocketOptions,
  TlsOptions,
  WritableStream,
} from "@cloudflare/workers-types/experimental";
import { connect as boring_connect } from "cloudflare:sockets";

type MySocketOptions = SocketOptions & {
  signal?: AbortSignal;
};

class DisposableSocket implements Disposable, Socket {
  #socket: Socket;
  constructor(address: string | SocketAddress, options?: MySocketOptions) {
    this.#socket = boring_connect(address, options);
    if (options?.signal) {
      options.signal.addEventListener("abort", () => {
        this.#socket.close();
      });
    }
  }

  get readable(): ReadableStream<any> {
    return this.#socket.readable;
  }
  get writable(): WritableStream<any> {
    return this.#socket.writable;
  }
  get closed(): Promise<void> {
    return this.#socket.closed;
  }
  get opened(): Promise<SocketInfo> {
    return this.#socket.opened;
  }
  close(): Promise<void> {
    return this.#socket.close();
  }
  startTls(options?: TlsOptions | undefined): Socket {
    return this.#socket.startTls(options);
  }

  [Symbol.dispose](): void {
    this.#socket.close();
  }
}

type ConnectArgs = ConstructorParameters<typeof DisposableSocket>;
export let connect = (...args: ConnectArgs): DisposableSocket => {
  return new DisposableSocket(...args);
};
