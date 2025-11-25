"use client";

import { styled } from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { PropsWithChildren } from "react";

interface StyledLinkProps {
  active_route: "active" | "";
}

const StyledLink = styled("div")<StyledLinkProps>(
  ({ theme, active_route }) => ({
    position: "relative",
    transition: "color 150ms ease-in-out",
    color: active_route === "active" ? theme.palette.primary.main : "inherit",
    "&:hover": {
      color: `${theme.palette.primary.main} !important`,
    },
  })
);

export interface INavLinkProps extends PropsWithChildren {
  href: string;
  style?: React.CSSProperties;
  className?: string;
  color?: string;
}

const NavLink = ({
  href,
  children,
  style,
  className,
  ...props
}: INavLinkProps) => {
  const pathname = usePathname();

  const checkRouteMatch = (): boolean => {
    if (href === "/") return pathname === href;
    return pathname.includes(href);
  };

  const currentRoute = checkRouteMatch();
  return (
    <Link href={href}>
      <StyledLink
        style={style}
        className={clsx(className)}
        active_route={currentRoute ? "active" : ""}
        {...props}
      >
        {children}
      </StyledLink>
    </Link>
  );
};

export default NavLink;
