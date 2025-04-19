"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { Camera, Edit2 } from "lucide-react";

const SchoolModal = ({ isOpen, onOpenChange, school, onSchoolUpdated }) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Separate form states for add and edit
  const [addFormData, setAddFormData] = useState({
    schoolName: "",
    schoolPhone: "",
    address: "",
    schoolType: "",
    schoolPicture: null,
    newPicture: null,
  });

  const [editFormData, setEditFormData] = useState({
    schoolName: "",
    schoolPhone: "",
    address: "",
    schoolType: "",
    schoolPicture: null,
    newPicture: null,
  });

  // Get current form data based on mode
  const currentFormData = school ? editFormData : addFormData;
  const setCurrentFormData = school ? setEditFormData : setAddFormData;

  useEffect(() => {
    if (school) {
      setEditFormData({
        schoolName: school.school_name || "",
        schoolPhone: school.school_phone || "",
        address: school.address || "",
        schoolType: school.school_type || "",
        schoolPicture: school.school_picture || null,
        newPicture: null,
      });
    } else {
      setAddFormData({
        schoolName: "",
        schoolPhone: "",
        address: "",
        schoolType: "",
        schoolPicture: null,
        newPicture: null,
      });
    }
    setEditMode(false);
  }, [school, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFormData((prev) => ({ ...prev, [name]: value }));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentFormData((prev) => ({
          ...prev,
          newPicture: file,
          schoolPicture: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSchool = async () => {
    if (status !== "authenticated" || !session?.accessToken) return;
    setIsLoading(true);

    try {
      const base64Image = addFormData.newPicture
        ? await convertToBase64(addFormData.newPicture)
        : null;

      const response = await fetch(
        "http://localhost:5000/api/school/add-school",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            schoolName: addFormData.schoolName,
            schoolPhone: addFormData.schoolPhone,
            address: addFormData.address,
            schoolType: addFormData.schoolType,
            schoolPicture: base64Image,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          toast.error(`${addFormData.schoolName} already exists!`, {
            autoClose: 2000,
          });
          // Don't close the modal or update state
          return false;
        }
        // Handle other error cases
        toast.error("Failed to add school", { autoClose: 2000 });
        return false;
      }

      // Only proceed if successful (status 201)
      toast.success("School added successfully", { autoClose: 2000 });
      onSchoolUpdated();
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to add school", { autoClose: 2000 });
      console.error("Add school error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSchool = async () => {
    if (status !== "authenticated" || !session?.accessToken || !school) return;
    setIsLoading(true);

    try {
      // Prepare only changed fields
      const updates = {};

      if (editFormData.schoolName !== school.school_name) {
        updates.schoolName = editFormData.schoolName;
      }
      if (editFormData.schoolPhone !== school.school_phone) {
        updates.schoolPhone = editFormData.schoolPhone;
      }
      if (editFormData.address !== school.address) {
        updates.address = editFormData.address;
      }
      if (editFormData.schoolType !== school.school_type) {
        updates.schoolType = editFormData.schoolType;
      }
      if (editFormData.newPicture !== null) {
        updates.schoolPicture = await convertToBase64(editFormData.newPicture);
      }

      // Check if any changes were made
      if (Object.keys(updates).length === 0) {
        toast.info("No changes were made", { autoClose: 2000 });
        return false;
      }

      const response = await fetch(
        "http://localhost:5000/api/school/update-school",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          toast.error(
            `${updates.schoolName || editFormData.schoolName} already exists!`,
            {
              autoClose: 2000,
            }
          );
        } else {
          toast.error(errorData.error || "Failed to update school", {
            autoClose: 2000,
          });
        }
        return false;
      }

      toast.success("School updated successfully", { autoClose: 2000 });
      onSchoolUpdated();
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to update school", {
        autoClose: 2000,
      });
      console.error("Update school error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ToastContainer position="top-right" />
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {school
            ? editMode
              ? "Edit School"
              : "School Information"
            : "Add New School"}
        </ModalHeader>
        <ModalBody>
          {school && !editMode ? (
            <div className="flex flex-col items-center">
              {editFormData.schoolPicture && (
                <div className="mb-4 relative">
                  <Image
                    src={editFormData.schoolPicture}
                    alt="School"
                    className="rounded-full object-cover"
                    style={{
                      width: "200px",
                      height: "200px",
                      border: "2px solid #e5e7eb",
                    }}
                  />
                </div>
              )}

              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">
                  {editFormData.schoolName}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {editFormData.schoolPhone}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {editFormData.address}
                </p>
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  {editFormData.schoolType}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {currentFormData.schoolPicture ? (
                    <>
                      <Image
                        src={currentFormData.schoolPicture}
                        alt="School"
                        className="rounded-full object-cover"
                        style={{
                          width: "200px",
                          height: "200px",
                          border: "2px solid #e5e7eb",
                        }}
                      />
                      <label
                        htmlFor="picture-upload"
                        className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100"
                      >
                        <Camera className="w-5 h-5 text-gray-700" />
                        <input
                          id="picture-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </>
                  ) : (
                    <div className="w-[200px] h-[200px] rounded-full bg-gray-200 flex items-center justify-center">
                      <label
                        htmlFor="picture-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Camera className="w-10 h-10 text-gray-500 mb-2" />
                        <span className="text-gray-500">
                          Upload School Logo
                        </span>
                        <input
                          id="picture-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <Input
                type="text"
                label="School Name"
                name="schoolName"
                value={currentFormData.schoolName}
                onChange={handleInputChange}
                variant="bordered"
                isRequired
              />
              <Input
                type="text"
                label="Address"
                name="address"
                value={currentFormData.address}
                onChange={handleInputChange}
                variant="bordered"
                isRequired
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  label="Phone"
                  name="schoolPhone"
                  value={currentFormData.schoolPhone}
                  onChange={handleInputChange}
                  variant="bordered"
                  isRequired
                />
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" className="w-full">
                      {currentFormData.schoolType || "Select School Type"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="School Type Options">
                    <DropdownItem
                      onClick={() =>
                        setCurrentFormData((prev) => ({
                          ...prev,
                          schoolType: "Private",
                        }))
                      }
                    >
                      Private
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        setCurrentFormData((prev) => ({
                          ...prev,
                          schoolType: "Public",
                        }))
                      }
                    >
                      Public
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {school ? (
            <>
              {editMode ? (
                <>
                  <Button variant="light" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={updateSchool}
                    isLoading={isLoading}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="success"
                    onClick={() => setEditMode(true)}
                    startContent={<Edit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button
              color="primary"
              onClick={addSchool}
              isLoading={isLoading}
              isDisabled={
                !addFormData.schoolName ||
                !addFormData.address ||
                !addFormData.schoolPhone ||
                !addFormData.schoolType
              }
            >
              {isLoading ? "Processing..." : "Add School"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SchoolModal;
