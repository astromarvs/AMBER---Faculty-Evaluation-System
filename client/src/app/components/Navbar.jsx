"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@heroui/react";
import amberIcon from "../../../public/assets/media/A.ico";

const AppNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Check if current path is /login or /signup
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/signup";

  return (
    <Navbar
      disableAnimation
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="w-full shadow-xl bg-[#ecf0f1]"
    >
      <NavbarContent>
        {!isAuthPage && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        )}

        <NavbarBrand>
          <Link href="/">
            <Image src={amberIcon} alt="Amber Logo" width={40} height={40} />
            <div className="hidden sm:flex flex-col ml-2">
              <p className="text-[#0c0c0c] lg:text-lg sm:text-sm font-bold">
                AMBER Faculty Evaluation System
              </p>
              <p className="text-[#0c0c0c] lg:text-md sm:text-sm font-medium">
                Made for Smart Educational Institution
              </p>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Menu */}
      {!isAuthPage && (
        <NavbarContent as="div" justify="end" className="hidden sm:flex">
          <Link color="foreground" href="/admin/login" underline="always">
            Login
          </Link>
          <Link color="foreground" href="/admin/signup" underline="always">
            Create Account
          </Link>
        </NavbarContent>
      )}

      {/* Mobile Menu */}
      {!isAuthPage && (
        <NavbarMenu className="sm:hidden">
          <NavbarMenuItem>
            <Link href="/admin/login" color="foreground">
              Login
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/admin/signup" color="foreground">
              Create Account
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      )}
    </Navbar>
  );
};

export default AppNavbar;
