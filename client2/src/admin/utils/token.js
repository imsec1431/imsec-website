const TOKEN_KEYS = ["token", "adminToken", "imsec_admin_token"];

/* =========================================================
   GET TOKEN
========================================================= */

export const getToken = () => {
  /*
   * Check all token keys for compatibility
   *
   * Current AuthContext stores:
   * - token
   * - adminToken
   *
   * Older services may use:
   * - imsec_admin_token
   */

  for (const key of TOKEN_KEYS) {
    const token = localStorage.getItem(key);

    if (token) {
      return token;
    }
  }

  /*
   * Also check sessionStorage
   */

  for (const key of TOKEN_KEYS) {
    const token = sessionStorage.getItem(key);

    if (token) {
      return token;
    }
  }

  return null;
};

/* =========================================================
   SAVE TOKEN
========================================================= */

export const saveToken = (token) => {
  if (!token) {
    return;
  }

  /*
   * Save to the primary key.
   */

  localStorage.setItem("token", token);

  /*
   * Keep compatibility with existing project services.
   */

  localStorage.setItem("adminToken", token);

  localStorage.setItem("imsec_admin_token", token);
};

/* =========================================================
   REMOVE TOKEN
========================================================= */

export const removeToken = () => {
  /*
   * Remove all localStorage token keys.
   */

  TOKEN_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });

  /*
   * Remove all sessionStorage token keys.
   */

  TOKEN_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
  });
};

/* =========================================================
   IS AUTHENTICATED
========================================================= */

export const isAuthenticated = () => {
  return Boolean(getToken());
};

/* =========================================================
   AUTH HEADERS
========================================================= */

export const getAuthHeaders = () => {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export default {
  getToken,
  saveToken,
  removeToken,
  isAuthenticated,
  getAuthHeaders,
};
