"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import SchoolModal from "../components/SchoolModal";
import { toast } from "react-toastify";
import Image from "next/image";
import DefaultPicture from "../../../public/assets/media/AmberDefault.png";
import { Button } from "@heroui/react";

export default function CollapsibleSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [school, setSchool] = useState(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path) => pathname.startsWith(path);

  const fetchSchool = async () => {
    if (status === "authenticated" && session?.accessToken) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/school/get-school",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          console.log("Failed to fetch school");
          return;
        }

        const schoolData = await response.json();

        if (schoolData.school_picture) {
          schoolData.school_picture = `data:image/jpeg;base64,${schoolData.school_picture}`;
        }

        setSchool(schoolData);
      } catch (error) {
        toast.error("Error fetching school. Please try again later.", {
          autoClose: 2000,
        });
        console.error("Error fetching school:", error);
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetchSchool();
      console.log("Access Token:", session.accessToken);
    }
  }, [session, status]);

  if (status === "loading") return null;
  if (status === "unauthenticated") return null;

  return (
    <div className="flex h-full w-full">
      <motion.div
        initial={{ width: 60 }}
        animate={{ width: isOpen ? 250 : 60 }}
        transition={{ duration: 0.3 }}
        className="bg-[#fcb455] h-full shadow-md relative flex flex-col"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-4 top-2 bg-[#FFBF00] rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* School Info Section - Only visible when expanded */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="p-4 flex flex-col items-center border-b border-white/20"
          >
            <div className="mb-3 w-[150px] h-[150px] rounded-full overflow-hidden flex items-center justify-center">
              {school?.school_picture ? (
                <Image
                  src={school.school_picture}
                  alt="School Logo"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={DefaultPicture}
                  alt="Default School Logo"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <h3 className="text-lg font-semibold text-center text-white mb-4">
              {school?.school_name || "No School Detected"}
            </h3>

            <Button
              onClick={() => setIsSchoolModalOpen(true)}
              className="w-full"
            >
              {school ? "View School Details" : "Add School"}
            </Button>
          </motion.div>
        )}

        <div className="space-y-1 mt-4 w-full overflow-y-auto flex-grow">
          <SidebarItem
            href="/admin/dashboard"
            label="Dashboard"
            icon={<Home className="w-6 h-6" />}
            isOpen={isOpen}
            active={isActive("/admin/dashboard")}
          />
        </div>
      </motion.div>

      <SchoolModal
        isOpen={isSchoolModalOpen}
        onOpenChange={setIsSchoolModalOpen}
        school={school}
        onSchoolUpdated={fetchSchool}
      />
    </div>
  );
}

function SidebarItem({ href, icon, label, isOpen, active }) {
  return (
    <Link href={href} passHref>
      <div
        className={`flex items-center p-3 cursor-pointer transition-all duration-200 ${
          active ? "bg-white/20" : "hover:bg-[#ffffff1a]"
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          className={`ml-3 text-sm whitespace-nowrap ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {label}
        </motion.span>
      </div>
    </Link>
  );
}
