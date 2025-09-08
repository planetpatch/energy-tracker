"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "./Button";

const Logo = () => {
  //update the size of the logo when the size of the screen changes
  const [width, setWidth] = useState(0);

  const updateWidth = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    updateWidth();
  }, []);

  // change between the logo and the button when the user scrolls
  const [showButton, setShowButton] = useState(false);

  const changeNavButton = () => {
    if (window.scrollY >= 400 && window.innerWidth < 768) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavButton);
  }, []);

  return (
    <>
      <Link href="/" style={{ display: showButton ? "none" : "block" }}>
        {/* Standard Logo (visible in light mode) */}
        <Image 
          src="/green_logo.png" 
          alt="PlanetPatch Logo"
          width={width < 1024 ? "50" : "75"}
          height={width < 1024 ? "45" : "150"}
          className="relative block dark:hidden"
          priority 
        />
        
        {/* White Logo (visible in dark mode) */}
        <Image 
          src="/white_logo.png" 
          alt="PlanetPatch Logo"
          width={width < 1024 ? "50" : "75"}
          height={width < 1024 ? "45" : "150"}
          className="relative hidden dark:block" 
          priority 
        />
      </Link>
      <div
        style={{
          display: showButton ? "block" : "none",
        }}
      >
        <Button />
      </div>
    </>
  );
};

export default Logo;
