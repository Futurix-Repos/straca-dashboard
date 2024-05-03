import { checkPermissionActionToDisplay, checkPermissionNameToDisplay} from '@/constants/templates';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useRouter} from "next/router";
import {Permission, User} from "@/components/dashboard_components/users-permissions/UsersPermissionsList";
import Modal from "@/components/Modal";
import Select from "react-select"
import {Toast} from "@/constants/toastConfig";
import {GET, PUT} from "@/constants/fetchConfig";

export interface UpdateUserPermissionModalProps {
    visible: boolean,
    onClose: () => void,
    selectedUser?: User,
}

export const UpdateUserPermissionModal: React.FC<UpdateUserPermissionModalProps> = ({
    visible,
    onClose,
    selectedUser
}) => {

    const customStyles = {
        valueContainer: (base: any) => ({
            ...base,
            maxHeight: 80,
            overflowY: "auto"
        }),

    };

    const router = useRouter();


    const [loading, setLoading] = useState(false);
    const [permissionsData, setPermissionsData] = useState<Permission[]>([]);
    const [userPermissions, setUserPermissionsData] = useState<Permission[]>(selectedUser?.permissions ?? []);
    const [error, setError] = useState("");


    const fetchPermissionsData = useCallback(async () => {
        let token = localStorage.getItem('token') ?? undefined;
        let headers : any = {"Content-Type": "application/json",};

        if (token) headers.Authorization = `Bearer ${token}`;

        try {
/*            const response = await fetch(`/permissions`, {
                method: "GET",
                headers: headers
            });*/

            const response = await GET(`/permissions`);

/*            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }*/

            const data: Permission[] = response;
            // Set the fetched data into state
            setPermissionsData(data);

        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle errors
        }
    }, []);

    useEffect(() => {
        setUserPermissionsData(selectedUser?.permissions ?? [])
        setLoading(true);
        fetchPermissionsData().finally(() => setLoading(false));

    }, [fetchPermissionsData, setLoading, selectedUser])


    const formatPermissionsData = useMemo(() => {
        return permissionsData.map((permission) => {
            return {value: permission._id, label: `${checkPermissionActionToDisplay(permission)} - ${checkPermissionNameToDisplay(permission)}`}
        })
    }, [permissionsData]);

    const formatUserPermissionsData = useMemo(() => {
        return formatPermissionsData.filter((permission) => {

            return userPermissions.some((userPermission) => {
                return userPermission._id === permission.value
            });
        });

    }, [formatPermissionsData, userPermissions]);

    const onSave = useCallback(async () => {
        setError("");

        if (userPermissions.length > 0 && userPermissions.length === selectedUser?.permissions.length && userPermissions.every((up) => {
            let find = selectedUser?.permissions.find((sup) => sup._id === up._id);

            return (find !== undefined);
        })) setError("Veuillez changer les permissions");

        else if (userPermissions.length === 0 && selectedUser?.permissions.length === 0) setError("Veuillez changer les permissions");

        else {

            try {

                const permissions = userPermissions.map((p) => p._id);

                const updateData = {
                    permissions
                };


                const response = await  PUT(`/users/${selectedUser?._id}`, updateData)

                console.log("response",  response);




                onClose();
                Toast.fire({
                    icon: "success",
                    title: `Permissions modififiées avec succès`,
                });
                router.reload();

            } catch (e) {
                console.error(`Error update user`, e);
            }

        }

    }, [selectedUser, userPermissions]);

    if (!selectedUser) return null;

    return (
        <Modal open={visible} setOpen={onClose} maxWidth="max-w-xl">
            <div id="container-add" className="h-96">
                <div className="p-5 flex flex-col rounded-2xl bg-white text-black">
                    <div className="bg-white mb-4 text-[20px] font-bold rounded text-center ">
                        Modifier Permissions
                    </div>
                    <div className="flex flex-col space-y-4">
                        <span>Permissions</span>
                        <Select styles={customStyles} maxMenuHeight={150} isLoading={loading} isSearchable={true} isMulti onChange={(e) => {
                            setUserPermissionsData(prevState => {
                                return permissionsData.filter((permission) => {

                                    return e.some((userPermission: any) => {
                                        return userPermission.value === permission._id
                                    });
                                });
                            })
                        }}  value={formatUserPermissionsData} options={formatPermissionsData} />
                        {error.length > 0 && <span className="text-red-500  font-semibold">{error}</span>}
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            onSave();
                        }}
                        className="rounded-md bg-[#4763e4]  p-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 mt-10"
                    >
                        Enregistrer
                    </button>
                </div>
            </div>
        </Modal>
    )
}