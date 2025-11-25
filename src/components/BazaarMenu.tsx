"use client";
import { Menu, MenuProps } from "@mui/material";
import { Children, cloneElement, Fragment, useState, MouseEvent } from "react";

interface BazaarMenuProps extends Omit<MenuProps, "open" | "children"> {
  open?: boolean;
  handler?: React.ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  }>;
  children: React.ReactElement<{
    onClick?: () => void;
  }>[];
  direction?: "left" | "right";
  shouldCloseOnItemClick?: boolean;
}

const BazaarMenu = ({
  open,
  handler,
  children,
  direction = "left",
  shouldCloseOnItemClick = true,
  ...props
}: BazaarMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleMenuItemClick = (customOnClick?: () => void) => () => {
    if (customOnClick) customOnClick();
    if (shouldCloseOnItemClick) handleClose();
  };

  return (
    <Fragment>
      {handler &&
        cloneElement(handler, {
          onClick: handler.props.onClick || handleClick,
        })}
      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open !== undefined ? open : !!anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction || "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction || "left",
        }}
        {...props}
      >
        {Children.map(children, (child) =>
          cloneElement(child, {
            onClick: handleMenuItemClick(child.props.onClick),
          })
        )}
      </Menu>
    </Fragment>
  );
};

export default BazaarMenu;
