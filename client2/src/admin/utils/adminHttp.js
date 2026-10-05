import axios from "axios";
import { getToken } from "./token";

/*
 * Central admin HTTP hardening.
 *
 * This file does not change any API path. It only:
 * 1. Adds the current admin JWT to admin API requests.
 * 2. Rewrites legacy localhost:5000 URLs to REACT_APP_API_URL when configured.
 * 3. Preserves FormData boundaries by removing a manually supplied
 *    multipart Content-Type header so the browser can add the boundary.
 * 4. Adds the same Authorization header to existing fetch() calls used
 *    by older admin pages/services.
 */

const getConfiguredApiBase = () => {
  try {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.REACT_APP_API_URL
    ) {
      return String(process.env.REACT_APP_API_URL).replace(/\/+$/, "");
    }
  } catch (error) {
    // Ignore environments where process is unavailable.
  }

  return "http://localhost:5000";
};

const isBackendUrl = (url) => {
  if (!url) return false;

  const value = String(url);

  return (
    value.includes("/api/") ||
    value.startsWith("/api") ||
    value.startsWith("http://localhost:5000") ||
    value.startsWith("https://localhost:5000")
  );
};

const rewriteLegacyUrl = (url) => {
  if (!url) return url;

  const value = String(url);
  const apiBase = getConfiguredApiBase();

  return value
    .replace(/^https?:\/\/localhost:5000/, apiBase)
    .replace(/^https?:\/\/127\.0\.0\.1:5000/, apiBase);
};

/* =========================================================
   AXIOS
========================================================= */

axios.interceptors.request.use(
  (config) => {
    try {
      const originalUrl = config?.url || "";

      if (isBackendUrl(originalUrl)) {
        config.url = rewriteLegacyUrl(originalUrl);

        const token = getToken();

        if (token) {
          config.headers = config.headers || {};

          if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        /*
         * Axios/browser should create the multipart boundary itself.
         */
        if (
          typeof FormData !== "undefined" &&
          config.data instanceof FormData &&
          config.headers
        ) {
          delete config.headers["Content-Type"];
          delete config.headers["content-type"];
        }
      }
    } catch (error) {
      console.error("Admin HTTP request setup error:", error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =========================================================
   AXIOS RESPONSE

   If an authenticated admin request receives 401, notify AuthContext
   so stale/expired JWT state is cleared immediately.
========================================================= */

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      const config = error?.config;
      const authorization =
        config?.headers?.Authorization || config?.headers?.authorization;

      if (status === 401 && authorization && typeof window !== "undefined") {
        window.dispatchEvent(new Event("imsec:auth-invalid"));
      }
    } catch (notifyError) {
      console.error("Admin HTTP auth error notification failed:", notifyError);
    }

    return Promise.reject(error);
  },
);

/* =========================================================
   FETCH
========================================================= */

if (
  typeof window !== "undefined" &&
  typeof window.fetch === "function" &&
  !window.__IMSEC_ADMIN_FETCH_HARDENED__
) {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    let url = "";
    let requestInit = { ...init };

    if (typeof input === "string") {
      url = input;
    } else if (input instanceof Request) {
      url = input.url;
      requestInit = {
        method: input.method,
        headers: input.headers,
        body: input.method === "GET" || input.method === "HEAD"
          ? undefined
          : input.body,
        ...init,
      };
    } else {
      url = String(input?.url || input || "");
    }

    if (isBackendUrl(url)) {
      const rewrittenUrl = rewriteLegacyUrl(url);
      const headers = new Headers(requestInit.headers || {});

      const token = getToken();

      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      /*
       * Never force multipart Content-Type.
       * The browser must add the boundary for FormData.
       */
      if (
        typeof FormData !== "undefined" &&
        requestInit.body instanceof FormData
      ) {
        headers.delete("Content-Type");
      }

      requestInit.headers = headers;

      const authenticatedRequest = headers.has("Authorization");
      const response = await originalFetch(rewrittenUrl, requestInit);

      if (
        response.status === 401 &&
        authenticatedRequest &&
        typeof window !== "undefined"
      ) {
        window.dispatchEvent(new Event("imsec:auth-invalid"));
      }

      return response;
    }

    return originalFetch(input, requestInit);
  };

  window.__IMSEC_ADMIN_FETCH_HARDENED__ = true;
}

export { getConfiguredApiBase };

export default {
  getConfiguredApiBase,
};
