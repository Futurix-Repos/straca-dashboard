import { ADD_ORDER_INPUTS, JOB_INPUTS } from "@/constants/templates";
import React, { useEffect, useState } from "react";
import { Commande } from "./OrderList";

// import ClientSelectComponent, { Unit } from '../MyInputFieldComponents';
import { Toast } from "@/constants/toastConfig";
import { useRouter } from "next/router";
import { POST, PUT } from "@/constants/fetchConfig";
import { renderInputField } from "../InputComponents/InputComponents";
import ReactQuill from "react-quill";

export interface AddOrderModalProps {
    isVisible: Boolean;
    text: string;
    onClose: () => void;
    isModify: Boolean;
    selectedOrder: Commande;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({
    isVisible,
    text,
    onClose,
    isModify,
    selectedOrder,
}) => {
    const router = useRouter();

    // text fields
    const [post, setPost] = useState("");
    const [salary, setSalary] = useState("");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");

    const backgroundImage = "https://s3-alpha-sig.figma.com/img/e820/b309/33faaf77f8af260428a9b35d9f503bf6?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=cuKH-bisdmxyI9xwNl09-7tWsQIFEV9A6HkbVZ60UdB8iNYoNwZkxyGPB~GnBJnfmHUl-KXNeGS-7skVzZqqnYLxSyIeGPXmGvNqlszXkEpGQwgRbGv4QJQj~emtO4aiKNMIxU7ncab6tXkEL4NltsI44oHc0g7oAPGb~GsreJ-TExtg-G71j5dQZ~44xaU~bwzfIRRrXw8ezKy7xSTaHvW~spqq8OpPHFtB0k8OjUGCu6lIDgBDWFi1rDPZvRsKMKTHCG1CE6fA9XlWjOwHT3rU54qQnuT37YBFq9GWoP91Xprwzd2fUdVzSiuY6SbJCzVbFN2CFpFxUHsMZxLVzg__";


    const [isChanged, setIsChanged] = useState(false);

    // auto fill text field when user is editing an order
    useEffect(() => {
        if (isModify) {
            console.log("====> Modify <====");
            setStatus(selectedOrder.status);
        }
    }, []);

    // Call the `wasChanged` function whenever the state values change
    useEffect(() => {
        if (isModify) {
            wasChanged();
        }
    }, [
        description,
        status,
    ]);

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") {
            onClose();
        }
    };





    // Order Status enums
    const statusEnum = [
        "En attente de confirmation",
        "Confirmation de réception",
        "En transit",
        "Commande arrivée",
        "Commande livré",
    ];
    const wasChanged = () => {
        if (
            status !== selectedOrder.status
        ) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    };

    // Function to add pricing
    const addOrder = async () => {
        try {
            const newOrder = {
                status: status,

            };

            console.log("NewOrder JSON Body", newOrder);

            // Perform validation to check if all variables are not empty
            if (
                status.trim() === ""
            ) {
                Toast.fire({
                    icon: "error",
                    title: `Please fill in all Fields`,
                });
                return;
            }

            var response;

            if (!isModify) {
                response = await fetch(`/commandes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newOrder),
                });

                response = await POST(`/commandes`, newOrder);
            } else {
                if (!isChanged) {
                    return Toast.fire({
                        icon: "error",
                        title: `Les champs n'ont pas été modifiés`,
                    });
                }
           

                response = await PUT(`/commandes/${selectedOrder._id}`, newOrder);
            }

          

            console.log(`commande ${isModify ? "édité" : "ajouté"} avec succès!`);
            onClose();
            Toast.fire({
                icon: "success",
                title: `commande ${isModify ? "édité" : "ajouté"} avec succès!`,
            });
            router.reload();

            
        } catch (error) {
            console.error("Error adding pricing:", error);
            // Handle errors
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
            id="wrapper"
            onClick={handleClose}
        >
            <div className="bg-white h-full pl-5 pr-16 pt-12 flex flex-col text-black">
                <div className="flex flex-row justify-start items-center">
                    <button onClick={() => { router.back() }} className='px-4 py-2 bg-slate-400 rounded-sm'>
                        <i className="fa-solid fa-arrow-left text-white"></i>
                    </button>
                    <p className="ml-2 font-semibold text-2xl">Créer un commande</p>
                </div>
                <div className='w-full flex flex-col gap-5'>
                    <div className="flex pt-5 justify-between">
                        <div className="w-[65%] px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
                            <div className="mb-5 flex flex-row justify-between items-center">
                                <div className="flex flex-row justify-between">
                                    <p className="mb-3 font-semibold text-2xl">Commande N</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-5 items-center'>
                                <div className="flex w-full justify-between items-start gap-[18px] relative flex-[0_0_auto]">
                                    <div className='w-[10%]'>
                                        {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-full")}
                                    </div>
                                    {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-[50%]")}
                                    {renderInputField(JOB_INPUTS[1], salary, (e) => setSalary(e.target.value), undefined, undefined, "w-[30%]")}
                                </div>
                                <div className="flex w-full justify-between items-start gap-[18px] relative flex-[0_0_auto]">
                                    <div className='w-[50%] flex justify-start gap-14'>
                                        {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-[20%]")}
                                        {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-[20%]")}
                                        {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-[20%]")}
                                    </div>
                                    {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-[30%]")}
                                </div>
                                <div className="flex w-full justify-between items-start gap-[12px] relative flex-[0_0_auto]">
                                    {renderInputField(JOB_INPUTS[2], location, (e) => setLocation(e.target.value))}
                                    <div className='w-[45%]'>
                                        <p className=''>{JOB_INPUTS[4].label}</p>
                                        <ReactQuill id='description' className='w-full' theme="snow" placeholder="Write job description" onChange={setDescription} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Client info */}
                        <div className="flex flex-col w-[34%] gap-5 px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row justify-between">
                                    <p className="mb-3 font-semibold text-2xl">Client N</p>
                                </div>
                            </div>
                            {renderInputField(JOB_INPUTS[1], salary, (e) => setSalary(e.target.value), undefined, undefined, "w-[40%]")}
                            <div className="flex w-full justify-start items-start gap-5 relative flex-[0_0_auto]">
                                {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-[20%]")}
                                {renderInputField(JOB_INPUTS[1], salary, (e) => setSalary(e.target.value), undefined, undefined, "w-[40%]")}
                            </div>
                            {renderInputField(JOB_INPUTS[1], salary, (e) => setSalary(e.target.value), undefined, undefined, "w-[65%]")}
                        </div>
                    </div>
                    {/* Addresse de depart */}
                    <div className="flex flex-col w-full gap-5 px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
                        <div className="mb-5 flex flex-row justify-between items-center">
                            <div className="flex flex-row justify-between">
                                <p className="mb-3 font-semibold text-2xl">Addresse de départ</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 items-center'>
                            {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-full")}
                            {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-full")}
                            <div className='w-full h-72 rounded-lg bg-slate-400'
                                style={{
                                    backgroundImage: `url(${backgroundImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    position: "relative",
                                }}>
                                <div
                                    className='rounded-lg'
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.12)", // Dark grey with 12% opacity
                                    }}
                                ></div>
                            </div>
                            <div className="flex w-full justify-between items-start gap-5 relative flex-[0_0_auto]">
                                {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-[45%]")}
                                {renderInputField(JOB_INPUTS[1], salary, (e) => setSalary(e.target.value), undefined, undefined, "w-[45%]")}
                            </div>
                        </div>
                    </div>
                    {/* Adresse du destinataire */}
                    <div className="flex flex-col w-full gap-5 px-4 py-3 pb-10 bg-[#FAFBFF] rounded-[12px]">
                        <div className="mb-5 flex flex-row justify-between items-center">
                            <div className="flex flex-row justify-between">
                                <p className="mb-3 font-semibold text-2xl">Adresse du destinataire</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 items-center'>
                            {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-full")}
                            {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-full")}
                            <div className='w-full h-72 rounded-lg bg-slate-400'
                                style={{
                                    backgroundImage: `url(${backgroundImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    position: "relative",
                                }}>
                                <div
                                    className='rounded-lg'
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.12)", // Dark grey with 12% opacity
                                    }}
                                ></div>
                            </div>
                            <div className="flex w-full justify-between items-start gap-5 relative flex-[0_0_auto]">
                                {renderInputField(JOB_INPUTS[0], post, (e) => setPost(e.target.value), undefined, undefined, "w-[45%]")}
                                {renderInputField(JOB_INPUTS[1], salary, (e) => setSalary(e.target.value), undefined, undefined, "w-[45%]")}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Form */}
                <center>
                    <button onClick={() => { }} className="my-5 px-10 py-2 bg-[#3D75B0] text-white rounded-md">
                        Enregistrer
                    </button>
                </center>
            </div>
        </div>
    );
};
