import { User } from "@/config/models/user";
import { ADMIN_ROUTES, COMMON_ROUTES } from "@/config/routes";
import { Role } from "@/config/types";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
}

export const decodeToken = (token: string): User | null => {
  try {
    const decoded: JwtPayload = jwtDecode(token);

    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      throw new Error("Token has expired");
    }

    return {
      id: decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
      phone:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"
        ],
      name: decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ],
      role: decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] as Role,
    };
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};

// Add this function to handle role-based redirects
export const getHomePageUrlByRole = (role?: Role) => {
  switch (role) {
    case "Admin":
      return ADMIN_ROUTES.DASHBOARD;
    case "Manager":
      return ADMIN_ROUTES.DASHBOARD;
    case "User":
      return COMMON_ROUTES.HOME;
    default:
      return COMMON_ROUTES.AUTH.LOGIN;
  }
};
