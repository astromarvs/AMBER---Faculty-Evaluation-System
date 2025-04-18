"use client";

import { useState } from "react";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Home, FolderKanban, ListTodo, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CollapsibleSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Helper function to determine if route is active
  const isActive = (path: string) => pathname.startsWith(path);

  // Don't render anything if there's no session or still loading
  if (status === "loading") {
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <motion.div
        initial={{ width: 60 }}
        animate={{ width: isOpen ? 250 : 60 }}
        transition={{ duration: 0.3 }}
        className="bg-[#fcb455] h-full shadow-md relative"
      >
        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-4 top-2 bg-[#FFBF00] rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="space-y-1 mt-16 w-full">
          {/* Home */}
          <SidebarItem
            href="/admin/dashboard"
            label="Dashboard"
            icon={<Home className="w-6 h-6" />}
            isOpen={isOpen}
            active={isActive("/admin/dashboard")}
          />
        </div>
      </motion.div>
    </div>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  isOpen,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  active: boolean;
}) {
  return (
    <Link href={href} passHref>
      <div
        className={`flex items-center space-x-4 cursor-pointer mb-3 transition-all duration-200 w-full p-2 
        hover:bg-[#ffffff1a] ${active ? "bg-white/20" : ""}`}
      >
        {icon}
        <Transition
          show={isOpen}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <span className="text-sm">{label}</span>
        </Transition>
      </div>
    </Link>
  );
}