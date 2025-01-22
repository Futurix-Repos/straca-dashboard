import { renderInputField } from "@/components/InputComponents/InputComponents";

import { GET, POST, PUT } from "@/constants/fetchConfig";
import { CLIENTS_CONFIG_INPUTS } from "@/constants/templates";
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserType } from "@/constants/types";
import { queryClient } from "@/pages/_app";
import { Loader2 } from "lucide-react";
import CustomLoader from "@/components/CustomLoader";

interface Props {
  action: "create" | "edit";
}
const ClientForm: React.FC<Props> = ({ action }) => {
  const router = useRouter();
  const { id } = router.query;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const { data: clientData, isLoading: isLoadingClient } = useQuery<UserType>({
    queryKey: ["getClientEdit", id],
    queryFn: () => GET(`/clients/${id}`),
    enabled: action === "edit" && (id ?? "").length > 0,
    refetchOnWindowFocus: true,
  });

  const addClientMutation = useMutation({
    mutationFn: (payload: any) => POST(`/clients`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      Toast.fire({
        icon: "success",
        title: `Le client a eté ajouté avec succès`,
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

  const editClientMutation = useMutation({
    mutationFn: (payload: any) => PUT(`/clients/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getClientEdit", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["client"],
      });

      Toast.fire({
        icon: "success",
        title: `Le client a été modifié avec succès`,
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
      (action === "create" && password?.trim()) === "" ||
      phone?.trim() === "" ||
      email?.trim() === ""
    );
  }, [action, email, firstName, lastName, password, phone]);

  const wasChanged = useMemo(() => {
    if (action === "edit" && clientData) {
      return (
        email !== clientData?.email ||
        phone !== clientData?.phone ||
        firstName !== clientData?.firstName ||
        lastName !== clientData?.lastName ||
        company !== clientData?.company ||
        password.length > 0
      );
    }
    return false;
  }, [
    action,
    email,
    clientData,
    firstName,
    lastName,
    password,
    phone,
    company,
  ]);
  const addClient = async () => {
    let newClient = {
      ...(email.trim().length > 0 && { email }),
      ...(phone.trim().length > 0 && { phone }),
      ...(lastName.trim().length > 0 && { lastName }),
      ...(firstName.trim().length > 0 && { firstName }),
      ...(company.trim().length > 0 && { company }),
      ...(password.trim().length > 0 && { password }),
    };

    if (fieldsValidation) {
      Toast.fire({
        icon: "error",
        title: `Merci de remplir tous les champs requis`,
      });
      return;
    }

    if (action === "create") {
      addClientMutation.mutate(newClient);
    } else {
      if (!wasChanged) {
        Toast.fire({
          icon: "error",
          title: `Veuillez modifier les champs`,
        });
        return;
      }
      editClientMutation.mutate(newClient);
    }
  };

  useEffect(() => {
    if (action === "edit" && clientData) {
      setEmail(clientData.email ?? "");
      setPhone(clientData.phone ?? "");
      setFirstName(clientData.firstName ?? "");
      setLastName(clientData.lastName ?? "");
      setCompany(clientData.company ?? "");
    }
  }, [action, clientData]);

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
          {action === "edit" ? `Modifier` : "Creer"} un client
        </p>
      </div>
      <div className="pt-5">
        <div className="px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
          {isLoadingClient ? (
            <CustomLoader />
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
                {renderInputField(CLIENTS_CONFIG_INPUTS[0], email, (e) =>
                  setEmail(e.target.value),
                )}
                {renderInputField(CLIENTS_CONFIG_INPUTS[1], phone, (e) =>
                  setPhone(e.target.value),
                )}
              </div>
              <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
                {renderInputField(CLIENTS_CONFIG_INPUTS[2], lastName, (e) =>
                  setLastName(e.target.value),
                )}
                {renderInputField(CLIENTS_CONFIG_INPUTS[3], firstName, (e) =>
                  setFirstName(e.target.value),
                )}
              </div>
              <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
                {renderInputField(CLIENTS_CONFIG_INPUTS[4], company, (e) =>
                  setCompany(e.target.value),
                )}
                {renderInputField(
                  CLIENTS_CONFIG_INPUTS[5],
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
                  onClick={addClient}
                  className="px-10 py-2 bg-[#3D75B0] text-white rounded-md mt-5"
                >
                  {addClientMutation.isPending ||
                  editClientMutation.isPending ? (
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

export default ClientForm;
