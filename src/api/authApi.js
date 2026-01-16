import apiClient from "./apiClient";

export const authApi = {
  // Google login
  googleLogin: (idToken) => apiClient.post("/auth/google", { token: idToken }),

  // Logout
  logout: () => {
    const jwt = localStorage.getItem("token");
    return apiClient.post("/auth/logout", null, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  },
};
