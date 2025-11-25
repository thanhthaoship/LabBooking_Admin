"use client";

import { styled } from "@mui/material";
import { Children, cloneElement, useEffect, useRef, useState } from "react"; // styled component props type

interface IWrapperProps {
  open: boolean;
  parent_height: number;
  header_height: number;
}

// styled component
const Wrapper = styled("div")((props: IWrapperProps) => ({
  cursor: "pointer",
  overflow: "hidden",
  transition: "height 250ms ease-in-out",
  height: props.open ? props.parent_height : props.header_height,
})); // ==============================================================

// ==============================================================
// Add these interfaces before the Wrapper component
interface AccordionProps {
  expanded?: boolean;
  children: React.ReactNode;
}

interface AccordionChildProps {
  open?: boolean;
  onClick?: () => void;
}

// Update the component definition
const Accordion = ({ expanded = false, children }: AccordionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(expanded);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [parentHeight, setParentHeight] = useState<number>(0);

  const toggle = () => setOpen(!open);

  useEffect(() => {
    let parent = ref.current;

    if (parent) {
      setHeaderHeight(parent.children[0].scrollHeight);
      setParentHeight(parent.scrollHeight);
    }
  }, []);

  const modifiedChildren = Children.map(children, (child, ind) => {
    if (ind === 0)
      return cloneElement(child as React.ReactElement<AccordionChildProps>, {
        open,
        onClick: toggle,
      });
    else return child;
  });
  return (
    <Wrapper
      ref={ref}
      open={open}
      header_height={headerHeight}
      parent_height={parentHeight}
    >
      {modifiedChildren}
    </Wrapper>
  );
};

export default Accordion;
