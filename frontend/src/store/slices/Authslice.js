import { createSlice } from "@reduxjs/toolkit";

function readStoredToken() {
  try {
    const raw = localStorage.getItem("token");
    if (raw == null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readStoredFullAccess() {
  try {
    const raw = localStorage.getItem("fullAccess");
    if (raw == null) return false;
    return Boolean(JSON.parse(raw));
  } catch {
    return false;
  }
}

function readStoredPermissions() {
  try {
    const raw = localStorage.getItem("permissions");
    if (raw == null) return [];
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

function readStoredUserId() {
  try {
    const raw = localStorage.getItem("userId");
    if (raw == null) return null;
    const n = JSON.parse(raw);
    return typeof n === "number" && Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function readStoredRoleId() {
  try {
    const raw = localStorage.getItem("roleId");
    if (raw == null) return null;
    const n = JSON.parse(raw);
    if (n === null) return null;
    return typeof n === "number" && Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

const initialState = {
  user: null,
  token: readStoredToken(),
  fullAccess: readStoredFullAccess(),
  permissions: readStoredPermissions(),
  userId: readStoredUserId(),
  roleId: readStoredRoleId(),
  isAuthenticated: !!readStoredToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {
        access_token,
        full_access: fullAccessPayload,
        permissions: permPayload,
        user_id: userIdPayload,
        role_id: roleIdPayload,
      } = action.payload;
      state.token = access_token;
      state.fullAccess =
        fullAccessPayload !== undefined
          ? Boolean(fullAccessPayload)
          : state.fullAccess;
      if (Array.isArray(permPayload)) {
        state.permissions = permPayload;
        localStorage.setItem("permissions", JSON.stringify(permPayload));
      }
      if (userIdPayload !== undefined && userIdPayload !== null) {
        state.userId =
          typeof userIdPayload === "number" && Number.isFinite(userIdPayload)
            ? userIdPayload
            : state.userId;
        localStorage.setItem("userId", JSON.stringify(state.userId));
      }
      if (roleIdPayload !== undefined) {
        state.roleId =
          roleIdPayload === null
            ? null
            : typeof roleIdPayload === "number" && Number.isFinite(roleIdPayload)
              ? roleIdPayload
              : state.roleId;
        localStorage.setItem("roleId", JSON.stringify(state.roleId));
      }
      state.isAuthenticated = true;
      localStorage.setItem("token", JSON.stringify(access_token));
      localStorage.setItem("fullAccess", JSON.stringify(state.fullAccess));
    },

    setFullAccess: (state, action) => {
      state.fullAccess = Boolean(action.payload);
      localStorage.setItem("fullAccess", JSON.stringify(state.fullAccess));
    },

    setPermissions: (state, action) => {
      const next = Array.isArray(action.payload) ? action.payload : [];
      state.permissions = next;
      localStorage.setItem("permissions", JSON.stringify(next));
    },

    setUserProfile: (state, action) => {
      const { userId, roleId } = action.payload || {};
      state.userId =
        typeof userId === "number" && Number.isFinite(userId) ? userId : null;
      state.roleId =
        roleId === null || roleId === undefined
          ? null
          : typeof roleId === "number" && Number.isFinite(roleId)
            ? roleId
            : null;
      localStorage.setItem("userId", JSON.stringify(state.userId));
      localStorage.setItem("roleId", JSON.stringify(state.roleId));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.fullAccess = false;
      state.permissions = [];
      state.userId = null;
      state.roleId = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("fullAccess");
      localStorage.removeItem("permissions");
      localStorage.removeItem("userId");
      localStorage.removeItem("roleId");
    },
  },
});

export const {
  setCredentials,
  setFullAccess,
  setPermissions,
  setUserProfile,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
