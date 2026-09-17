import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getCsrfTokenFromCookie } from "../../../../lib/axios";

interface Window {
  Pusher: any;
}
declare var window: Window;

const reverbAppKey =
  process.env.NEXT_PUBLIC_REVERB_APP_KEY ||
  process.env.REVERB_APP_KEY ||
  "";
const reverbHost =
  process.env.NEXT_PUBLIC_REVERB_HOST ||
  process.env.REVERB_HOST ||
  "localhost";
const reverbPort =
  process.env.NEXT_PUBLIC_REVERB_PORT ||
  process.env.REVERB_PORT ||
  "8080";
const reverbScheme =
  process.env.NEXT_PUBLIC_REVERB_SCHEME ||
  process.env.REVERB_SCHEME ||
  "http";

let echoInstance: any = null;

function createEchoInstance() {
  if (typeof window === "undefined") {
    return null;
  }
  if (echoInstance) {
    return echoInstance;
  }

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: reverbAppKey,
    wsHost: reverbHost,
    wsPort: reverbPort ? Number(reverbPort) : 8080,
    wssPort: reverbPort ? Number(reverbPort) : 8080,
    forceTLS: reverbScheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: "/api/broadcasting/auth", // Use Next.js API route
    auth: {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    },
    authorizer: (channel: any, options: any) => {
      return {
        authorize: (socketId: string, callback: Function) => {
          console.log(
            "Authorizing channel:",
            channel.name,
            "with socket:",
            socketId
          );

          // First check if we're authenticated by testing a simple endpoint
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth-check`, {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .then((authResponse) => {
              if (!authResponse.ok) {
                throw new Error(
                  `Authentication check failed: ${authResponse.status}`
                );
              }
              return authResponse.json();
            })
            .then((authData) => {
              console.log("Auth check passed:", authData);

              // Get CSRF token from cookies (no need to fetch)
              const csrfToken = getCsrfTokenFromCookie();
              console.log(
                "CSRF token from cookie:",
                csrfToken ? "found" : "not found"
              );

              // Prepare headers for broadcasting auth
              const headers: Record<string, string> = {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
              };

              // Add CSRF token if available
              if (csrfToken) {
                headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
              }

              // Now proceed with broadcasting auth
              return fetch("/api/broadcasting/auth", {
                method: "POST",
                headers,
                credentials: "include",
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name,
                }),
              });
            })
            .then((response) => {
              console.log("Broadcasting auth response status:", response.status);
              if (!response.ok) {
                return response.text().then((text) => {
                  console.error("Broadcasting auth failed:", text);
                  throw new Error(`HTTP ${response.status}: ${text}`);
                });
              }
              return response.json();
            })
            .then((data) => {
              console.log("Broadcasting auth successful:", data);
              callback(null, data);
            })
            .catch((error) => {
              console.error("Broadcasting auth error:", error);
              callback(error);
            });
        },
      };
    },
  });

  // Add connection event listeners for debugging with proper type casting
  try {
    const pusherConnector = echoInstance.connector as any;

    if (pusherConnector && pusherConnector.pusher) {
      pusherConnector.pusher.connection.bind("connected", () => {
        console.log("Echo: Connected to Reverb");
      });

      pusherConnector.pusher.connection.bind("disconnected", () => {
        console.log("Echo: Disconnected from Reverb");
      });

      pusherConnector.pusher.connection.bind("error", (error: any) => {
        console.error("Echo: Connection error:", error);
      });
    } else {
      console.warn("Pusher connector not available for event binding");
    }
  } catch (error) {
    console.error("Error setting up connection event listeners:", error);
  }

  return echoInstance;
}

const dummyChannel: any = {
  listen: () => dummyChannel,
  subscribed: () => dummyChannel,
  error: () => dummyChannel,
  stopListening: () => dummyChannel,
};

const dummyEcho: any = {
  channel: () => dummyChannel,
  private: () => dummyChannel,
  join: () => dummyChannel,
  leave: () => {},
  connector: null,
};

const echo: any = new Proxy(dummyEcho, {
  get(target, prop) {
    if (typeof window !== "undefined") {
      const instance = createEchoInstance();
      if (instance && prop in instance) {
        const val = instance[prop];
        return typeof val === "function" ? val.bind(instance) : val;
      }
    }
    return target[prop];
  },
});

export default echo;
