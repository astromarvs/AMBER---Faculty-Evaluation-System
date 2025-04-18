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
import { useSession } from "next-auth/react";

const AppNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Check if we're on the login or signup page
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/signup";

  return (
    <Navbar
      disableAnimation
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="w-full shadow-xl bg-[#ecf0f1]"
    >
      {/* Left Brand/Logo */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />

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

      {/* Desktop Nav Items */}
      {!isAuthPage && (
        <NavbarContent as="div" justify="end" className="hidden sm:flex">
          {session?.user ? (
            <NavbarItem className="text-sm font-semibold text-gray-800">
              Welcome, {session.user.name || session.user.email}
            </NavbarItem>
          ) : (
            <>
              <NavbarItem>
                <Link href="/admin/login" underline="always">
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link href="/admin/signup" underline="always">
                  Create Account
                </Link>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      )}

      {/* Mobile Menu */}
      <NavbarMenu className="sm:hidden">
        {!isAuthPage && (
          <>
            {session?.user ? (
              <NavbarMenuItem>
                <p className="text-sm text-gray-800">
                  Welcome, {session.user.email}
                </p>
              </NavbarMenuItem>
            ) : (
              <>
                <NavbarMenuItem>
                  <Link href="/admin/login">Login</Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Link href="/admin/signup">Create Account</Link>
                </NavbarMenuItem>
              </>
            )}
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

export default AppNavbar;
