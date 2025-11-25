"use client";
import { slideDown } from "@animations/keyframes";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// ============================================================
interface StyledBoxProps extends PropsWithChildren {
  componentHeight?: number;
  fixedOn?: number;
  fixed?: boolean;
}

export const StyledBox = styled(
  ({ children, componentHeight, fixedOn, fixed, ...rest }: StyledBoxProps) => (
    <div {...rest}>{children}</div>
  )
)(({ componentHeight, fixedOn, fixed }: StyledBoxProps) => ({
  "& .hold": {
    zIndex: 5,
    boxShadow: "none",
    position: "relative",
  },
  "& .fixed": {
    left: 0,
    right: 0,
    zIndex: 1500,
    position: "fixed",
    top: `${fixedOn}px`,
    boxShadow: "0px 4px 16px rgba(43, 52, 69, 0.1)",
    transition: "all 350ms ease-in-out",
    animation: `${slideDown} 400ms ease-in-out`,
  },
  "& + .section-after-sticky": {
    paddingTop: fixed ? componentHeight : 0,
  },
}));

export interface StickyProps {
  fixedOn: number;
  children: React.ReactNode;
  onSticky?: (fixed: boolean) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
  notifyPosition?: number;
  notifyOnScroll?: (isFixed: boolean) => void;
  scrollDistance?: number;
}

const Sticky = ({
  fixedOn,
  children,
  onSticky,
  containerRef,
  notifyPosition,
  notifyOnScroll,
  scrollDistance = 0,
}: StickyProps) => {
  const [fixed, setFixed] = useState<boolean>(false);
  const [parentHeight, setParentHeight] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<number>(0);

  const scrollListener = useCallback(() => {
    if (typeof window === "undefined") return;

    let distance = window.pageYOffset - positionRef.current;

    if (containerRef?.current) {
      let containerDistance =
        containerRef.current.offsetTop +
        containerRef.current.offsetHeight -
        window.pageYOffset;

      if (notifyPosition && notifyOnScroll) {
        notifyOnScroll(
          distance <= notifyPosition && containerDistance > notifyPosition
        );
      }

      return setFixed(distance <= fixedOn && containerDistance > fixedOn);
    }

    if (notifyPosition && notifyOnScroll) {
      notifyOnScroll(distance >= notifyPosition);
    }

    let isFixed = distance >= fixedOn + scrollDistance;

    if (positionRef.current === 0 && elementRef.current) {
      isFixed =
        distance >= fixedOn + elementRef.current.offsetHeight + scrollDistance;
    }

    setFixed(isFixed);
  }, [containerRef, fixedOn, notifyOnScroll, notifyPosition, scrollDistance]);
  useEffect(() => {
    if (!window) return;
    window.addEventListener("scroll", scrollListener);
    window.addEventListener("resize", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
      window.removeEventListener("resize", scrollListener);
    };
  }, [scrollListener]);
  useEffect(() => {
    if (!positionRef.current) {
      positionRef.current = elementRef.current?.offsetTop || 0;
    }

    setParentHeight(elementRef.current?.offsetHeight || 0);
  }, [children]);
  useEffect(() => {
    if (onSticky) onSticky(fixed);
  }, [fixed, onSticky]);
  return (
    <StyledBox fixedOn={fixedOn} componentHeight={parentHeight} fixed={fixed}>
      <div
        className={clsx({
          hold: !fixed,
          fixed: fixed,
        })}
        ref={elementRef}
      >
        {children}
      </div>
    </StyledBox>
  );
};

export default Sticky;
