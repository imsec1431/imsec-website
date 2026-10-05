import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentAdmin } from "../services/authService";

const AuthContext = createContext(null);

/* =========================================================
   TOKEN KEYS
========================================================= */

const TOKEN_KEYS = ["token", "adminToken", "imsec_admin_token"];

/* =========================================================
   GET STORED TOKEN
========================================================= */

const getStoredToken = () => {
  /* -------------------------------------------------------
     LOCAL STORAGE
  ------------------------------------------------------- */

  for (const key of TOKEN_KEYS) {
    const token = localStorage.getItem(key);

    if (token) {
      return token;
    }
  }

  /* -------------------------------------------------------
     SESSION STORAGE
  ------------------------------------------------------- */

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

const saveToken = (token) => {
  if (!token) {
    return;
  }

  /*
   * Save the same JWT under all supported keys.
   */

  localStorage.setItem("token", token);
  localStorage.setItem("adminToken", token);
  localStorage.setItem("imsec_admin_token", token);
};

/* =========================================================
   REMOVE TOKENS
========================================================= */

const removeAllTokens = () => {
  TOKEN_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

/* =========================================================
   CLEAR AUTH SESSION
========================================================= */

const clearAuthSession = () => {
  removeAllTokens();
  localStorage.removeItem("admin");
  sessionStorage.removeItem("admin");
};

/* =========================================================
   NORMALIZE ADMIN
========================================================= */

const normalizeAdmin = (adminData) => {
  if (!adminData) {
    return null;
  }

  return {
    ...adminData,

    role: adminData?.role || "Admin",

    permissions: adminData?.permissions || {
      modules: [],
      departments: [],
    },

    isActive: adminData?.isActive !== false,
  };
};

/* =========================================================
   SAVE ADMIN
========================================================= */

const saveAdmin = (adminData) => {
  if (!adminData) {
    return;
  }

  const normalizedAdmin = normalizeAdmin(adminData);

  localStorage.setItem("admin", JSON.stringify(normalizedAdmin));
};

/* =========================================================
   AUTH PROVIDER
========================================================= */

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const [loading, setLoading] = useState(true);

  /* =======================================================
     INVALID TOKEN EVENT

     adminHttp dispatches this event when an authenticated request
     receives HTTP 401. This keeps the React auth state in sync with
     the backend instead of leaving a stale admin session on screen.
  ======================================================= */

  useEffect(() => {
    const handleInvalidToken = () => {
      clearAuthSession();

      setAdmin(null);
    };

    window.addEventListener("imsec:auth-invalid", handleInvalidToken);

    return () => {
      window.removeEventListener("imsec:auth-invalid", handleInvalidToken);
    };
  }, []);

  /* =======================================================
     LOAD SAVED SESSION + REFRESH ADMIN DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const token = getStoredToken();

        const savedAdmin =
          localStorage.getItem("admin") || sessionStorage.getItem("admin");

        /* ---------------------------------------------------
           NO TOKEN
        --------------------------------------------------- */

        if (!token) {
          clearAuthSession();

          if (mounted) {
            setAdmin(null);
          }

          return;
        }

        /* ---------------------------------------------------
           RESTORE SAVED ADMIN TEMPORARILY
        --------------------------------------------------- */

        if (savedAdmin) {
          try {
            const parsedAdmin = JSON.parse(savedAdmin);

            const normalizedAdmin = normalizeAdmin(parsedAdmin);

            if (mounted) {
              setAdmin(normalizedAdmin);
            }
          } catch (parseError) {
            console.error("Saved admin data parse error:", parseError);
          }
        }

        /* ---------------------------------------------------
           KEEP TOKEN KEYS IN SYNC
        --------------------------------------------------- */

        saveToken(token);

        /* ---------------------------------------------------
           GET LATEST ADMIN FROM BACKEND
           
           IMPORTANT:
           This refreshes the latest Sub Admin permissions.
        --------------------------------------------------- */

        try {
          const response = await getCurrentAdmin(token);

          const latestAdmin =
            response?.data?.data ||
            response?.data?.admin ||
            response?.data?.user;

          if (latestAdmin && mounted) {
            const normalizedAdmin = normalizeAdmin(latestAdmin);

            /*
             * If backend says account is inactive,
             * don't allow the session to continue.
             */

            if (
              normalizedAdmin.role === "Sub Admin" &&
              normalizedAdmin.isActive === false
            ) {
              clearAuthSession();

              setAdmin(null);

              return;
            }

            /*
             * Save latest admin information.
             */

            saveAdmin(normalizedAdmin);

            setAdmin(normalizedAdmin);
          }
        } catch (refreshError) {
          console.error("Failed to refresh current admin:", refreshError);

          const status = refreshError?.response?.status;

          /*
           * A 401 means the JWT is no longer valid (expired, revoked,
           * malformed, or signed with a different JWT secret). Do not keep
           * a cached admin session in that case.
           */
          if (status === 401) {
            clearAuthSession();

            if (mounted) {
              setAdmin(null);
            }

            return;
          }

          /*
           * For temporary network/server failures, keep valid cached admin
           * information so a short outage does not unnecessarily log the
           * user out.
           */
          if (!savedAdmin && mounted) {
            clearAuthSession();
            setAdmin(null);
          }
        }
      } catch (error) {
        console.error("Auth session restore error:", error);

        clearAuthSession();

        if (mounted) {
          setAdmin(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOGIN
  ======================================================= */

  const login = (token, adminData) => {
    if (!token) {
      console.error("Login failed: token missing.");

      return false;
    }

    try {
      /* ---------------------------------------------------
         NORMALIZE ADMIN
      --------------------------------------------------- */

      const normalizedAdmin = normalizeAdmin(adminData);

      /* ---------------------------------------------------
         SAVE JWT
      --------------------------------------------------- */

      saveToken(token);

      /* ---------------------------------------------------
         SAVE ADMIN DATA
      --------------------------------------------------- */

      saveAdmin(normalizedAdmin);

      /* ---------------------------------------------------
         UPDATE STATE
      --------------------------------------------------- */

      setAdmin(normalizedAdmin);

      return true;
    } catch (error) {
      console.error("Login storage error:", error);

      return false;
    }
  };

  /* =======================================================
     REFRESH CURRENT ADMIN
     
     Can also be called manually after permission changes.
  ======================================================= */

  const refreshAdmin = async () => {
    const token = getStoredToken();

    if (!token) {
      return null;
    }

    try {
      const response = await getCurrentAdmin(token);

      const latestAdmin =
        response?.data?.data || response?.data?.admin || response?.data?.user;

      if (!latestAdmin) {
        return null;
      }

      const normalizedAdmin = normalizeAdmin(latestAdmin);

      /* ---------------------------------------------------
         CHECK ACTIVE STATUS
      --------------------------------------------------- */

      if (
        normalizedAdmin.role === "Sub Admin" &&
        normalizedAdmin.isActive === false
      ) {
        clearAuthSession();

        setAdmin(null);

        return null;
      }

      /* ---------------------------------------------------
         SAVE LATEST ADMIN
      --------------------------------------------------- */

      saveAdmin(normalizedAdmin);

      setAdmin(normalizedAdmin);

      return normalizedAdmin;
    } catch (error) {
      console.error("Refresh admin error:", error);

      if (error?.response?.status === 401) {
        clearAuthSession();
        setAdmin(null);
      }

      return null;
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = () => {
    /*
     * Remove ALL token variants.
     */

    clearAuthSession();

    /*
     * Clear React state.
     */

    setAdmin(null);
  };

  /* =======================================================
     UPDATE ADMIN
  ======================================================= */

  const updateAdmin = (updatedAdmin) => {
    if (!updatedAdmin) {
      return;
    }

    const normalizedAdmin = normalizeAdmin({
      ...admin,
      ...updatedAdmin,

      permissions: updatedAdmin.permissions ??
        admin?.permissions ?? {
          modules: [],
          departments: [],
        },

      role: updatedAdmin.role ?? admin?.role ?? "Admin",

      isActive: updatedAdmin.isActive ?? admin?.isActive ?? true,
    });

    saveAdmin(normalizedAdmin);

    setAdmin(normalizedAdmin);
  };

  /* =======================================================
     CHECK SUB ADMIN
  ======================================================= */

  const isSubAdmin = admin?.role === "Sub Admin";

  /* =======================================================
     AUTHENTICATION STATUS
  ======================================================= */

  const isAuthenticated = Boolean(admin) && Boolean(getStoredToken());

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {
    admin,

    setAdmin,

    loading,

    login,

    logout,

    updateAdmin,

    refreshAdmin,

    isSubAdmin,

    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* =========================================================
   USE AUTH
========================================================= */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default AuthContext;
