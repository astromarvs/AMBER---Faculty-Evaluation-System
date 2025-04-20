"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../components/LoadingAnimation";
import AddDepartmentModal from "../../components/AddDepartmentModal";
import { ToastContainer } from "react-toastify";
import {
  Button,
  useDisclosure,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useCallback } from "react";

const Department = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    else{
        
    }
  }, [status]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/department/get-department",
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }

      const data = await response.json();
      setDepartments(data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    const fetchDataSequentially = async () => {
      if (status === "authenticated" && session?.accessToken && !hasFetched) {
        setHasFetched(true); // lock
        await fetchDepartments();
      }
    };

    fetchDataSequentially();
  }, [session, status, hasFetched]);

  if (status === "loading" || loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Department Page!</h2>
      <Button className="bg-primary mb-4 text-white" onPress={onOpen}>
        Add Department
      </Button>

      <AddDepartmentModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        session={session}
      />

      <Divider />

      <div className="mt-4">
        <Table isStriped aria-label="Departments table">
          <TableHeader>
            <TableColumn>CODE</TableColumn>
            <TableColumn>NAME</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No departments found"}>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>{dept.dept_code}</TableCell>
                <TableCell>{dept.dept_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Department;
