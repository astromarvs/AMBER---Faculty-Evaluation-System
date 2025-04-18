"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-4 text-lg text-gray-600">
            Welcome, {session?.user?.name || "Admin"}!
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Phone {session.user.phoneNumber || "Admin"}!
          </p>
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard Content</h2>
            <p className="mt-2 text-gray-600">
              This is a protected admin dashboard page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}