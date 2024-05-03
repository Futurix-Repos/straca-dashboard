import { renderInputField } from "@/components/InputComponents/InputComponents";
import { Job } from "@/components/dashboard_components/JobList";
import { GET, POST, PUT } from "@/constants/fetchConfig";
import { JOB_INPUTS } from "@/constants/templates";
import { Toast } from "@/constants/toastConfig";
import router from "next/router";
import React, { useEffect, useState } from "react";
// Use dynamic for lazy loading ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Proximity } from "@/components/dashboard_components/SettingComponents/proximityCard";
import { ContractType } from "@/components/dashboard_components/SettingComponents/contractTypeCard";
import TypedDropdown from "@/components/InputComponents/TypedDropdown";

interface Props {
  selectedJob: Job | null;
}

const JobForm: React.FC<Props> = ({ selectedJob }) => {
  const [post, setPost] = useState("");
  const [salary, setSalary] = useState("");
  const [proximity, setLocation] = useState<Proximity | null>(null);
  const [contractType, setContractType] = useState<ContractType | null>(null);
  const [description, setDescription] = useState("");
  console.log(`==>${selectedJob?.proximity}`)

  // Dropdown data
  const [proximityList, setProximityList] = useState<Proximity[]>([]);
  const [contractTypeList, setContractTypeList] = useState<ContractType[]>([]);

  // Attention
  const [isChanged, setIsChanged] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const wasChanged = () => {
    if (
      post !== selectedJob?.post ||
      salary !== selectedJob?.salary.toString() ||
      proximity?._id !== selectedJob?.proximity._id ||
      contractType?._id !== selectedJob?.contractType._id ||
      description !== selectedJob?.description
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  useEffect(() => {
    const { action } = router.query;
    setIsModify(action === "edit");

    if (isModify) {
      setPost(selectedJob?.post ?? "");
      setSalary(selectedJob?.salary.toString() ?? "");
      setLocation(selectedJob?.proximity!);
      setContractType(selectedJob?.contractType!);
      setDescription(selectedJob?.description ?? "");
    }
  }, [isModify]);

  useEffect(() => {
    if (isModify) {
      wasChanged();
    }
  }, [post, salary, proximity, contractType, description]);

  // Function to add job
  const addJob = async () => {
    try {
      console.log(proximity);
      const newJob = {
        post: post,
        salary: Number(salary),
        proximity: proximity?._id,
        contractType: contractType?._id,
        description: description,
        status: "test",
      };

      console.log("st.")
      console.log(newJob)
      console.log("st.")

      // Perform validation to check if all variables are not empty
      if (
        !post.trim() ||
        !salary?.trim() ||
        !proximity?._id ||
        !contractType?._id ||
        !description.trim()
      ) {
        Toast.fire({
          icon: "error",
          title: `Merci de remplir tous les champs`,
      });
        return;
      }

      var response;
      if (!isModify) {
        response = await POST(`/jobs`, newJob);
      } else {
        if (!isChanged) {
          return Toast.fire({
            icon: "error",
            title: `Les champs n'ont pas été modifiés`,
          });
        }

        response = await PUT(`/jobs/${selectedJob?._id}`, newJob);
      }

      console.log(`Job ${isModify ? "édité" : "ajouté"} avec succès!`);
      router.back();
      Toast.fire({
        icon: "success",
        title: `Job ${isModify ? "édité" : "ajouté"} avec succès!`,
      });
  
    } catch (error) {
      console.error("Error adding job:", error);
      Toast.fire({
        icon: "error",
        title: {error},
    });
      // Handle errors
    }
  };

  console.log(isModify);
  console.log(selectedJob);

  // Dropdown data fetch
  useEffect(() => {
    const fetchProximityList = async () => {
      try {
        const response = await GET("/proximity");
        const data: Proximity[] = response;
        setProximityList(data);
        console.log(proximityList);
      } catch (error) {
        console.error("Error fetching proximity list:", error);
      }
    };

    const fetchContractTypeList = async () => {
      try {
        const response = await GET("/contractType");
        const data: ContractType[] = response;
        setContractTypeList(data);
        console.log(contractTypeList);
      } catch (error) {
        console.error("Error fetching contractType list:", error);
      }
    };

    fetchProximityList();
    fetchContractTypeList();
  }, []);

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
          Créer un offre
        </p>
      </div>
      <div className="pt-5">
        <div className="px-4 py-3 pb-10 mb-10 bg-[#FAFBFF] rounded-[12px]">
          <div className="mb-5 flex flex-row justify-between items-center">
            <div className="flex flex-row justify-between">
              <p className="mb-3 font-semibold text-2xl">
                Ajouter un offre d'emploi
              </p>
            </div>
          </div>
          {/* Table */}
          <div className="flex flex-col gap-5">
            <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
              {renderInputField(JOB_INPUTS[0], post, (e) =>
                setPost(e.target.value)
              )}
              {renderInputField(JOB_INPUTS[1], salary, (e) =>
                setSalary(e.target.value)
              )}
            </div>
            <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
              <TypedDropdown<Proximity>
                input={{
                  id: JOB_INPUTS[2].id,
                  label: JOB_INPUTS[2].label,
                  placeholder: JOB_INPUTS[2].placeholder, // Optional placeholder
                }}
                value={proximity?.label}
                selectList={proximityList}
                handleSelect={(val) => {
                  console.log("mik")
                  console.log(val)
                  console.log("mik")
                  setLocation(val!);
                }}
                className=""
              />
              <TypedDropdown<ContractType>
                input={{
                  id: JOB_INPUTS[3].id,
                  label: JOB_INPUTS[3].label,
                  placeholder: JOB_INPUTS[3].placeholder, // Optional placeholder
                }}
                value={contractType?.label}
                selectList={contractTypeList}
                handleSelect={(val) => {
                  setContractType(val!);
                }}
                className=""
              />
            </div>
            <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
              <div className="w-full">
                <p className="mb-2">{JOB_INPUTS[4].label}</p>
                {
                  <ReactQuill
                    className="w-full h-[475px] mb-10"
                    theme="snow"
                    placeholder="Write job description"
                    onChange={setDescription}
                    value={description}
                  />
                }
              </div>
            </div>
            <center>
              <button
                onClick={addJob}
                className="px-10 py-2 bg-[#3D75B0] text-white rounded-md"
              >
                Enregistrer
              </button>
            </center>
          </div>
        </div>
      </div>
      {/* Form */}
    </div>
  );
};

export default JobForm;
