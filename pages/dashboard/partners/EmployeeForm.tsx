import { renderInputField } from "@/components/InputComponents/InputComponents";
import Modal from "@/components/Modal";
import { Employee } from "@/components/dashboard_components/EmployeeList";
import LaodingModal from "@/components/loadingmodal";
import { POST, PUT } from "@/constants/fetchConfig";
import { JOB_INPUTS, USER_CONFIG_INPUTS } from "@/constants/templates";
import { Toast } from "@/constants/toastConfig";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
interface Props {
  selectedEmployee: Employee | null;
}
const EmployeeForm: React.FC<Props> = ({ selectedEmployee }) => {
  const [modalOpened, setModalOpened] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const { action } = router.query;
  const [isModify, setIsModify] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const wasChanged = () => {
    if (
      email !== selectedEmployee?.email ||
      phone !== selectedEmployee?.phone ||
      firstName !== selectedEmployee?.firstName ||
      lastName !== selectedEmployee?.lastName ||
      title !== selectedEmployee?.title
    ) {
      if (action === "new" && password === "") {
        return setIsChanged(false);
      }
      return setIsChanged(true);
    } else {
      return setIsChanged(false);
    }
  };
  useEffect(() => {
    if (action === "edit") {
      setIsModify(true);
      if (isModify) {
        setEmail(selectedEmployee?.email ?? "");
        setTitle(selectedEmployee?.title ?? "");
        setFirstName(selectedEmployee?.firstName ?? "");
        setLastName(selectedEmployee?.lastName ?? "");
        setPhone(selectedEmployee?.phone ?? "");
      }
    }
  }, [isModify]);
  useEffect(() => {
    if (isModify) {
      wasChanged();
    }
  }, [email, password, firstName, lastName, title, phone]);
  const addEmployee = async () => {
    setModalOpened(true);
    try {
      const newEmployee = {
        firstName: firstName,
        lastName: lastName,
        title: title,
        password: password,
        phone: phone,
        email: email,
        type: "employee",
      };

      // Validate Fields

      if (
        firstName.trim() === "" ||
        lastName?.trim() === "" ||
        title?.trim() === "" ||
        (!isModify && password?.trim()) === "" ||
        phone.trim() === "" ||
        email.trim() === ""
      ) {
        console.log(firstName, lastName, title, password, phone, email);
        Toast.fire({
          icon: "error",
          title: `Tous les champs sont requis`,
        });
        return;
      }

      var response;
      if (!isModify) {
        response = await POST(`/auth/signup`, newEmployee);
      } else {
        if(!isChanged) {
            Toast.fire({
              icon: "error",
              title: `Les champs n'ont pas été modifiés`,
            });
          }
        response = await PUT(
          `/employees/${selectedEmployee?._id}`,
          newEmployee
        );
      }

      console.log(`Employé ${isModify ? "édité" : "ajouté"} avec succès!`);
      router.back();
      Toast.fire({
        icon: "success",
        title: `Employé ${isModify ? "édité" : "ajouté"} avec succès!!`,
      });
    } catch (error) {
      return Toast.fire({
        icon: "error",
        title: `Error: ${error}`,
      });
    } finally {
      setModalOpened(false);
    }
  };

  return (
    <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
      <div className="flex flex-row justify-start items-center">
        <button
          onClick={() => {
            router.back();
          }}
          className="px-4 py-2 bg-slate-400 rounded-sm"
        >
          <i className="fa-solid fa-arrow-left text-white"></i>
        </button>
        <p className="ml-2 font-semibold text-2xl">{isModify ? `Modifier` : "Creer"} un collaborateur</p>
      </div>
      <div className="pt-5">
        <div className="px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
          <div className="mb-5 flex flex-row justify-between items-center">
            <div className="flex flex-row justify-between">
              <p className="mb-3 font-semibold text-2xl">
                Ajouter un collaborateur
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
              {renderInputField(USER_CONFIG_INPUTS[0], email, (e) =>
                setEmail(e.target.value)
              )}
              {renderInputField(USER_CONFIG_INPUTS[1], phone, (e) =>
                setPhone(e.target.value)
              )}
            </div>
            <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
              {renderInputField(USER_CONFIG_INPUTS[2], lastName, (e) =>
                setLastName(e.target.value)
              )}
              {renderInputField(USER_CONFIG_INPUTS[3], firstName, (e) =>
                setFirstName(e.target.value)
              )}
            </div>
            <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
              {renderInputField(USER_CONFIG_INPUTS[4], title, (e) =>
                setTitle(e.target.value)
              )}
              {action == "new" &&
                renderInputField(
                  USER_CONFIG_INPUTS[5],
                  password,
                  (e) => setPassword(e.target.value),
                  undefined,
                  undefined,
                  undefined,
                  showPass,
                  setShowPass
                )}
            </div>
            <center>
              <button
                onClick={addEmployee}
                className="px-10 py-2 bg-[#3D75B0] text-white rounded-md"
              >
                Enregistrer
              </button>
            </center>
          </div>
        </div>
      </div>
      {/* Form */}
      <LaodingModal isOpen={modalOpened} />
    </div>
  );
};

export default EmployeeForm;
