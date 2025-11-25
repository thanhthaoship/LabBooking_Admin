export const BASE_ADMIN_ROUTE = "/admin";

export const ADMIN_ROUTES = {
  DASHBOARD: `${BASE_ADMIN_ROUTE}/dashboard`,
  ACCOUNT: {
    INDEX: `${BASE_ADMIN_ROUTE}/accounts`,
    CREATE: `${BASE_ADMIN_ROUTE}/accounts/create`,
    DETAILS: (id: string) => `${BASE_ADMIN_ROUTE}/accounts/${id}`,
    EDIT: (id: string) => `${BASE_ADMIN_ROUTE}/accounts/edit/${id}`,
  },
};
