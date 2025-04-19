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
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@heroui/react";
import amberIcon from "../../../public/assets/media/A.ico";
import { useSession, signOut } from "next-auth/react";

const AppNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
    },
  ];

  // Check if we're on the login or signup page
  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/signup";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Navbar
      disableAnimation
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="w-full shadow-xl bg-[#ecf0f1]"
    >
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
        <NavbarContent as="div" justify="end">
          {session?.user ? (
            <>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold text-sm cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 hover:opacity-90"
                    style={{ backgroundColor: "#fcb455" }}
                  >
                    {session.user.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{session.user.name}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onPress={handleLogout}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : status === 'loading' ? (
            <></>
          ) : (
            <>
              <NavbarItem className="hidden sm:flex">
                <Link href="/admin/login" underline="always">
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem className="hidden sm:flex">
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
        {session?.user ? (
          // Show menu items for logged in users
          <>
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item.name}-${index}`}>
                <Link
                  className="w-full"
                  color={
                    index === 2
                      ? "warning"
                      : index === menuItems.length - 1
                      ? "danger"
                      : "foreground"
                  }
                  href={item.href}
                  size="lg"
                >
                  {item.name}
                </Link>
              </NavbarMenuItem>
            ))}
          </>
        ) : (
          // Show login/signup for non-logged in users
          !isAuthPage && (
            <>
              <NavbarMenuItem>
                <Link href="/admin/login">Login</Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link href="/admin/signup">Create Account</Link>
              </NavbarMenuItem>
            </>
          )
        )}
      </NavbarMenu>
    </Navbar>
  );
};

export default AppNavbar;