"use client";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// NProgress configuration
NProgress.configure({
  showSpinner: true,
  minimum: 0.3,
  easing: "ease",
  speed: 800,
});

function ProgressHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done(); // Prevent NProgress from being stuck after page load
  }, []);

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}

export default function NProgressHandle() {
  return (
    <Suspense>
      <ProgressHandler />
    </Suspense>
  );
}
