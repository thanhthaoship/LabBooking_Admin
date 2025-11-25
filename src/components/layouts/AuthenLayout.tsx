import { VerificationProvider } from "@/contexts/VerificationContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VerificationProvider>{children}</VerificationProvider>;
}
