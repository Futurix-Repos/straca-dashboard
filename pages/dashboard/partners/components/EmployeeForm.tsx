import { renderInputField } from "@/components/InputComponents/InputComponents";
import { GET, POST, PUT } from "@/constants/fetchConfig";
import { JOB_INPUTS, USER_CONFIG_INPUTS } from "@/constants/templates";
import { Toast } from "@/constants/toastConfig";
import router, { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserType, Vehicle } from "@/constants/types";
import { queryClient } from "@/pages/_app";
import CustomLoader from "@/components/CustomLoader";
import { Loader2 } from "lucide-react";

interface Props {
  action: "create" | "edit";
}
const EmployeeForm: React.FC<Props> = ({ action }) => {
  const router = useRouter();
  const { id } = router.query;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const { data: employeeData, isLoading: isLoadingEmployee } =
    useQuery<UserType>({
      queryKey: ["getEmployeeEdit", id],
      queryFn: () => GET(`/employees/${id}`),
      enabled: action === "edit" && (id ?? "").length > 0,
      refetchOnWindowFocus: true,
    });

  const addEmployeeMutation = useMutation({
    mutationFn: (payload: any) => POST(`/employees`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
      Toast.fire({
        icon: "success",
        title: `L'employé a eté ajouté avec succès`,
      });
      router.back();
    },
    onError: (error) => {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: `Une erreur est survenue`,
      });
    },
  });

  const editEmployeeMutation = useMutation({
    mutationFn: (payload: any) => PUT(`/employees/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getEmployeeEdit", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["employee"],
      });

      Toast.fire({
        icon: "success",
        title: `L'employé a été modifié avec succès`,
      });
      router.back();
    },
    onError: (error) => {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: `Une erreur est survenue`,
      });
    },
  });

  const fieldsValidation = useMemo(() => {
    return (
      firstName?.trim() === "" ||
      lastName?.trim() === "" ||
      title?.trim() === "" ||
      (action === "create" && password?.trim()) === "" ||
      phone?.trim() === "" ||
      email?.trim() === ""
    );
  }, [action, email, firstName, lastName, password, phone, title]);

  const wasChanged = useMemo(() => {
    if (action === "edit" && employeeData) {
      return (
        email !== employeeData?.email ||
        phone !== employeeData?.phone ||
        firstName !== employeeData?.firstName ||
        lastName !== employeeData?.lastName ||
        title !== employeeData?.title ||
        password.length > 0
      );
    }
    return false;
  }, [
    action,
    email,
    employeeData,
    firstName,
    lastName,
    password,
    phone,
    title,
  ]);
  const addEmployee = async () => {
    let newEmployee = {
      ...(email.trim().length > 0 && { email }),
      ...(phone.trim().length > 0 && { phone }),
      ...(lastName.trim().length > 0 && { lastName }),
      ...(firstName.trim().length > 0 && { firstName }),
      ...(title.trim().length > 0 && { title }),
      ...(password.trim().length > 0 && { password }),
    };

    if (fieldsValidation) {
      Toast.fire({
        icon: "error",
        title: `Merci de remplir tous les champs`,
      });
      return;
    }

    if (action === "create") {
      addEmployeeMutation.mutate(newEmployee);
    } else {
      if (!wasChanged) {
        Toast.fire({
          icon: "error",
          title: `Veuillez modifier les champs`,
        });
        return;
      }
      editEmployeeMutation.mutate(newEmployee);
    }
  };

  useEffect(() => {
    if (action === "edit" && employeeData) {
      setEmail(employeeData.email ?? "");
      setPhone(employeeData.phone ?? "");
      setFirstName(employeeData.firstName ?? "");
      setLastName(employeeData.lastName ?? "");
      setTitle(employeeData.title ?? "");
    }
  }, [action, employeeData]);

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
        <p className="ml-2 font-semibold text-2xl">
          {action === "edit" ? `Modifier` : "Créer"} un collaborateur
        </p>
      </div>
      <div className="pt-5">
        <div className="px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
          {action === "edit" && isLoadingEmployee ? (
            <CustomLoader />
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
                {renderInputField(USER_CONFIG_INPUTS[0], email, (e) =>
                  setEmail(e.target.value),
                )}
                {renderInputField(USER_CONFIG_INPUTS[1], phone, (e) =>
                  setPhone(e.target.value),
                )}
              </div>
              <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
                {renderInputField(USER_CONFIG_INPUTS[2], lastName, (e) =>
                  setLastName(e.target.value),
                )}
                {renderInputField(USER_CONFIG_INPUTS[3], firstName, (e) =>
                  setFirstName(e.target.value),
                )}
              </div>
              <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
                {renderInputField(USER_CONFIG_INPUTS[4], title, (e) =>
                  setTitle(e.target.value),
                )}
                {renderInputField(
                  USER_CONFIG_INPUTS[5],
                  password,
                  (e) => setPassword(e.target.value),
                  undefined,
                  undefined,
                  undefined,
                  showPass,
                  setShowPass,
                )}
              </div>
              <div>
                <button
                  onClick={addEmployee}
                  className="px-10 py-2 bg-[#3D75B0] text-white rounded-md mt-5"
                >
                  {addEmployeeMutation.isPending ||
                  editEmployeeMutation.isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    `Enregistrer`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Form */}
    </div>
  );
};

export default EmployeeForm;
