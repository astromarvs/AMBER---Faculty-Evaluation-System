"use client";

import { useState } from "react";
import amberIcon from "../../public/assets/media/AMBERLOGO.png";
import Image from "next/image";
import { SquareCheckBig } from "lucide-react";
import { Divider } from "@heroui/react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Secure Evaluations",
    description: "All evaluations are encrypted and safely stored, ensuring privacy and integrity.",
  },
  {
    title: "Real-time Reporting",
    description: "Generate detailed reports instantly to support decision-making and policy improvements.",
  },
  {
    title: "Role-Based Access",
    description: "Custom access levels for faculty, peers, and administrators with user-friendly dashboards.",
  },
  {
    title: "Performance Insights",
    description: "Track and visualize performance trends across semesters with powerful analytics tools.",
  },
];

const Amber = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto my-auto gap-6 lg:gap-10 p-4 w-full">
        <div className="md:w-8/12 w-full flex justify-center">
          <div className="w-full w-relative">
            <Image 
              src={amberIcon} 
              alt="Amber Logo" 
              width={800} 
              height={900} 
              className="w-full h-auto object-contain" 
              priority 
            />
          </div>
        </div>
        <div className="md:w-4/12 w-full text-center">
          <div className="flex flex-col items-start max-w-md mx-auto space-y-4 mb-6">
            <div className="text-left">
              <h2 className="text-2xl font-semibold mb-2">About the System</h2>
              <p className="text-sm text-gray-700">
                The Faculty Evaluation System is a comprehensive platform designed to support continuous improvement in teaching and learning. It facilitates streamlined evaluation processes for faculty members, encouraging transparency, accountability, and professional growth.
              </p>
            </div>

            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center">
                <SquareCheckBig className="mr-2" />
                <p>Faculty Member Evaluation</p>
              </div>
              <div className="flex items-center">
                <SquareCheckBig className="mr-2" />
                <p>Self - Evaluation</p>
              </div>
              <div className="flex items-center">
                <SquareCheckBig className="mr-2" />
                <p>Peer Evaluation</p>
              </div>
              <div className="flex items-center">
                <SquareCheckBig className="mr-2" />
                <p>Rankings</p>
              </div>
              <div className="flex items-center">
                <SquareCheckBig className="mr-2" />
                <p>Evaluation Reports</p>
              </div>
              <div className="flex items-center">
                <SquareCheckBig className="mr-2" />
                <p>and more...</p>
              </div>
            </div>
          </div>
          <Divider className="m-2 mx-auto" />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold">
            START EVALUATING NOW!
          </button>
        </div>
      </div>

      {/* New Feature Widgets Section */}
      <div className="w-full bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white shadow-lg rounded-2xl p-6 text-center"
            >
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Amber;
