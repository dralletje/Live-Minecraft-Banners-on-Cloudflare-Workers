import { minecraft_ping } from "./minecraft-ping";
import font_file from "./minecraft-font.ttf";
import satori from "satori";
import { ServerBanner } from "./components/ServerBanner/ServerBanner";
import { ErrorBanner } from "./components/ErrorBanner";

let font = {
  name: "Minecraft",
  data: font_file,
  weight: 400,
  style: "normal",
} as const;

let async_file = async (
  data_promise: Promise<{ default: string | ArrayBuffer }>,
  name: string,
  options?: FileOptions
) => {
  let module = await data_promise;
  return new File([module.default], name, options);
};

let assets = {
  // prettier-ignore
  "/": async_file(import("./public/index.html"), "index.html", { type: "text/html" }),
  // prettier-ignore
  "/dirt.webp": async_file(import("./public/dirt.webp"), "dirt.webp", { type: "image/webp" }),
  // prettier-ignore
  "/dirt-dark.webp": async_file(import("./public/dirt-dark.webp"), "dirt.webp", { type: "image/webp" }),
  // prettier-ignore
  "/dral-logo.svg": async_file(import("./public/dral-logo.svg"), "dral-logo.svg", { type: "image/svg+xml" }),
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname in assets) {
      let file = await assets[url.pathname];

      return new Response(file, {
        headers: { "content-type": file.type },
      });
    } else if (url.pathname === "/banner.svg") {
      let host = url.searchParams.get("host");
      if (host == null) {
        return new Response("Missing host parameter", { status: 400 });
      }
      let [hostname, port_string = "25565"] = host.split(":");
      let port = Number(port_string);
      let title = url.searchParams.get("title") ?? "Minecraft server";

      /// Cache header for 30 seconds
      /// (Thanks Copilot)
      let cache_control = "public, max-age=30";

      try {
        let data = await minecraft_ping({
          hostname,
          port,
          signal: AbortSignal.any([request.signal, AbortSignal.timeout(1000)]),
        });
        return new Response(
          await satori(
            {
              key: "server-banner",
              type: ServerBanner,
              props: {
                motd: data.description,
                online: data.players.online,
                max: data.players.max,
                title: title,
                host: host,
                favicon: data.favicon,
                players: data.players.sample,
              },
            },
            { width: 800, height: 150, fonts: [font] }
          ),
          {
            headers: {
              "content-type": "image/svg+xml",
              "cache-control": cache_control,
            },
          }
        );
      } catch (error: any) {
        return new Response(
          await satori(
            {
              key: "error",
              type: ErrorBanner,
              props: {
                message: error.message,
                title: title,
                host: host,
              },
            },
            { width: 800, height: 150, fonts: [font] }
          ),
          {
            headers: {
              "content-type": "image/svg+xml",
              "cache-control": cache_control,
            },
          }
        );
      }
    } else {
      return new Response("Not found", { status: 404 });
    }
  },
};
