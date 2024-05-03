import CustomLoader from "@/components/CustomLoader";
import { renderInputField } from "@/components/InputComponents/InputComponents";
import DropdownComponent from "@/components/InputComponents/dropdowncomponent";
import { renderFileInputField } from "@/components/InputComponents/imageinput";
import { Blog } from "@/components/dashboard_components/BlogList";
import { BlogType } from "@/components/dashboard_components/SettingComponents/blogcard";
import { Tracking } from "@/components/dashboard_components/trackingList";
import { GET, POST, PUT } from "@/constants/fetchConfig";
import { BLOG_INPUTS, JOB_INPUTS, TRACKING_INPUT } from "@/constants/templates";
import { Toast } from "@/constants/toastConfig";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
interface props {
  selectedTracking: Tracking | null;
}
const TrackingForm: React.FC<props> = ({ selectedTracking }) => {
  const router = useRouter();

  const { action } = router.query;
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [orderId, setOrderId] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Attention
  const [isChanged, setIsChanged] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const wasChanged = () => {
    console.log("Selected Tracking:", selectedTracking);
    console.log("Form values:", { name, brand, type, registrationNumber, orderId });
  
    if (
      selectedTracking?.name !== name ||
      selectedTracking?.brand !== brand ||
      selectedTracking?.type !== type ||
      selectedTracking?.registrationNumber !== registrationNumber ||
      selectedTracking?.orderId !== orderId
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };
  
  useEffect(() => {
    if (isModify === true) {
      wasChanged();
    }
  }, [name, brand, registrationNumber, type, selectedTracking, orderId]);

  useEffect(() => {
    if (action === "edit") {
      setIsModify(true);
    } else {
      setIsModify(false); // Reset to false if selectedBlog is null or action is not "edit"
    }
  }, [action]);

  useEffect(() => {
    if (isModify === true) {
      setName(selectedTracking?.name ?? "");
      setType(selectedTracking?.type ?? "");
      setRegistrationNumber(selectedTracking?.registrationNumber ?? "");
      setBrand(selectedTracking?.brand ?? "");
      setOrderId(selectedTracking?.orderId ?? "");
    }
  }, [isModify]);

  // Function to add blog
  const addTracking = async () => {
    const session: any | Session = await getSession();
    const currentUser = session?.user;
    console.log(session?.user.id);

    try {
      setIsLoading(true);
      const newTracking = {
        name: name,
        brand: brand,
        registrationNumber: registrationNumber,
        type: type,
        orderId: orderId,
        createdBy: currentUser._id,
      };

      // Perform validation to check if all variables are not empty
      if (
        name.trim() === "" ||
        brand?.trim() === "" ||
        type?.trim() === "" ||
        registrationNumber.trim() === "" ||
        orderId.trim() === ""
      ) {
        Toast.fire({
          icon: "error",
          title: `Merci de remplir tous les champs`,
        });
        return;
      }

      var response;
      if (!isModify) {
        response = await POST(`/tracking`, newTracking);
      } else {
        if (isChanged === false) {
          return Toast.fire({
            icon: "error",
            title: `Les champs n'ont pas été modifiés`,
          });
        }

        response = await PUT(`/tracking/${selectedTracking?._id}`, newTracking);
        console.log(response);
      }
      if (response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Le numéro de commande n'est pas valide",
        });
      }

      console.log(
        `Gestion et suivi de flotte ${
          isModify ? "édité" : "ajouté"
        } avec succès!!`
      );
      router.back();
      Toast.fire({
        icon: "success",
        title: `Gestion et suivi de flotte ${
          isModify ? "édité" : "ajouté"
        } avec succès!`,
      });
    } catch (error: any) {
      console.error("Error adding tracking:", error);
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message
    });
    } finally {
      setIsLoading(false);
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
        <p className="ml-2 font-semibold text-2xl">
          {isModify ? `Modifier` : `Creer`} un Flotte et suivi{" "}
          {isChanged.toString()}
        </p>
      </div>
      <div className="w-full flex flex-col gap-5">
        <div className="flex pt-5 justify-between">
          <div className="w-full px-4 py-3 pb-10 mb-10 bg-[#FAFBFF] rounded-[12px]">
            <div className="mb-5 flex flex-row justify-between items-center">
              <div className="flex flex-row justify-between">
                <p className="mb-3 font-semibold text-2xl">Flotte et suivi</p>
              </div>
            </div>
            <div className="flex flex-col gap-5 items-center">
              {renderInputField(
                TRACKING_INPUT[0],
                name,
                (e) => setName(e.target.value),
                undefined,
                undefined,
                "w-full"
              )}
              {renderInputField(
                TRACKING_INPUT[1],
                brand,
                (e) => setBrand(e.target.value),
                undefined,
                undefined,
                "w-full"
              )}
              {renderInputField(
                TRACKING_INPUT[3],
                orderId,
                (e) => setOrderId(e.target.value),
                undefined,
                undefined,
                "w-full"
              )}
              {renderInputField(
                TRACKING_INPUT[2],
                type,
                (e) => setType(e.target.value),
                undefined,
                undefined,
                "w-full"
              )}
              {renderInputField(
                TRACKING_INPUT[4],
                registrationNumber,
                (e) => setRegistrationNumber(e.target.value),
                undefined,
                undefined,
                "w-full"
              )}
            </div>
            <center>
              <button
                onClick={addTracking}
                className="px-10 py-2 bg-[#3D75B0] text-white rounded-md mt-5"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  `Enregistrer`
                )}
              </button>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingForm;
