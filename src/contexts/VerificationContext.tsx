"use client";

import { COMMON_ROUTES } from "@/config/routes";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface VerificationContextType {
  userId: string;
  redirectTo: string;
  isVerified: boolean;
  setIsVerified: (isVerified: boolean) => void;
  setRedirectTo: (redirectTo: string) => void;
  setUserId: (userId: string) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(
  undefined
);

export function VerificationProvider({ children }: PropsWithChildren) {
  const [userId, setUserId] = useState("");
  const [redirectTo, setRedirectTo] = useState(COMMON_ROUTES.AUTH.LOGIN);
  const [isVerified, setIsVerified] = useState(false);

  return (
    <VerificationContext.Provider
      value={{
        userId: userId,
        redirectTo: redirectTo,
        isVerified: isVerified,
        setIsVerified: setIsVerified,
        setRedirectTo: setRedirectTo,
        setUserId: setUserId,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error(
      "useVerification must be used within an VerificationProvider"
    );
  }
  return context;
}
