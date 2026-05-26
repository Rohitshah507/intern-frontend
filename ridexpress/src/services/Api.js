const BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

async function request(endpoint, options = {}) {
  const config = {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  };
  if (config.body && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  } else if (config.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  let res;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (error) {
    throw new Error(
      "Cannot connect to the backend server. Check API URL and make sure the backend is running.",
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const authAPI = {
  signup: (body) => request("/auth/signup", { method: "POST", body }),
  login: (body) => request("/auth/login", { method: "POST", body }),
  forgotPassword: (body) =>
    request("/auth/forgot-password", { method: "POST", body }),
  resetPassword: ({ token, userId, ...body }) =>
    request(
      `/auth/reset-password?token=${encodeURIComponent(token)}&userId=${encodeURIComponent(userId)}`,
      {
        method: "POST",
        body,
      },
    ),
};

export const vehicleAPI = {
  getAll: (params = "") => request(`/vehicles${params}`),
  getById: (id) => request(`/vehicles/${id}`),
  create: (formData) =>
    request("/vehicles", { method: "POST", body: formData }),
  update: (id, formData) =>
    request(`/vehicles/${id}`, { method: "PUT", body: formData }),
  delete: (id) => request(`/vehicles/${id}`, { method: "DELETE" }),
};

export const bookingAPI = {
  getAll: () => request("/booking"),
  getByUser: () => request("/booking/user"),
  getById: (id) => request(`/booking/${id}`),
  create: (body) => request("/booking", { method: "POST", body }),
  update: (id, body) => request(`/booking/${id}`, { method: "PUT", body }),
  delete: (id) => request(`/booking/${id}`, { method: "DELETE" }),
  initiatePayment: (id, body) =>
    request(`/booking/${id}/payment`, { method: "POST", body }),
  confirmPayment: (id, body) =>
    request(`/booking/${id}/payment/confirm`, { method: "PUT", body }),
};
