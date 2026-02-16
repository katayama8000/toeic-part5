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
      add('GET', pathname, handler);
    },

    /**
     * Add a POST route.
     */
    post(pathname: string, handler: Handler): void {
      add('POST', pathname, handler);
    },

    /**
     * The entry point for handling requests.
     */
    fetch: (req: Request): Response | Promise<Response> => {
      const url = new URL(req.url);

      for (const route of routes) {
        if (route.method === req.method) {
          const match = route.pattern.exec(url);
          if (match) {
            return route.handler(req, match);
          }
        }
      }

      // Default 404 Not Found response.
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    },
  };
};
