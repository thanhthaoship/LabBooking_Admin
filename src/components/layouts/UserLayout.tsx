"use client";

import Footer from "@components/footer/Footer";
import Header from "@components/header/Header";
import Navbar from "@components/navbar/Navbar";
import Sticky from "@components/sticky/Sticky";
import Topbar from "@components/topbar/Topbar";
import { Fragment, useCallback, useState } from "react";
import FloatingActions from "../FloatingActions";

// ===================================================
const UserLayout = ({ children, showTopbar = true, showNavbar = true }) => {
  const [isFixed, setIsFixed] = useState(false);
  const toggleIsFixed = useCallback((fixed) => setIsFixed(fixed), []);
  return (
    <Fragment>
      {/* TOPBAR */}
      {showTopbar && <Topbar />}

      {/* HEADER */}
      <Sticky fixedOn={0} onSticky={toggleIsFixed} scrollDistance={300}>
        <Header isFixed={isFixed} />
      </Sticky>

      <div className="section-after-sticky">
        {/* NAVIGATION BAR */}
        {showNavbar && <Navbar elevation={0} border={1} />}

        {/* BODY CONTENT */}
        {children}
      </div>

      <FloatingActions />
      {/* FOOTER */}
      <Footer />
    </Fragment>
  );
};

export default UserLayout;
