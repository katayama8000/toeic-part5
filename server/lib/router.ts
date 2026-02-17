// A function that handles a request.
export type Handler = (
  req: Request,
  match: URLPatternResult,
) => Response | Promise<Response>;

// Represents a single route in the router.
interface Route {
  method: string;
  pattern: URLPattern;
  handler: Handler;
}

/**
 * A simple router for Deno.
 */
export interface SimpleRouter {
  get(pathname: string, handler: Handler): void;
  post(pathname: string, handler: Handler): void;
  fetch(req: Request): Response | Promise<Response>;
}

/**
 * Creates a new simple router.
 */
export const createRouter = (): SimpleRouter => {
  const routes: Route[] = [];

  // A helper to add routes.
  const add = (method: string, pathname: string, handler: Handler) => {
    routes.push({ method, pattern: new URLPattern({ pathname }), handler });
  };

  return {
    /**
     * Add a GET route.
     */
    get(pathname: string, handler: Handler): void {
      add("GET", pathname, handler);
    },

    /**
     * Add a POST route.
     */
    post(pathname: string, handler: Handler): void {
      add("POST", pathname, handler);
    },

    /**
     * The entry point for handling requests.
     */
    fetch: async (req: Request): Promise<Response> => {
      // Handle CORS preflight requests
      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*", // Allow any origin
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      const url = new URL(req.url);

      let response: Response | undefined;

      for (const route of routes) {
        if (route.method === req.method) {
          const match = route.pattern.exec(url);
          if (match) {
            response = await route.handler(req, match);
            break; // Found a match, exit loop
          }
        }
      }

      // If no route was matched, create a 404 response
      if (!response) {
        response = new Response(JSON.stringify({ error: "Not Found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Add CORS headers to the actual response
      const headers = new Headers(response.headers);
      headers.set("Access-Control-Allow-Origin", "*"); // Allow any origin

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    },
  };
};
