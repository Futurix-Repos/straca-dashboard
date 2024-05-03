import axios from "axios";
import router from "next/router";
import {Toast} from "@/constants/toastConfig";
import { getSession, signOut } from "next-auth/react";
import {Session} from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use(
    async function (config) {
        const session: any | Session = await getSession();
        if (!config?.url?.endsWith("/auth/login")) {
            if (session?.user?.jwt)
                config.headers["Authorization"] = `Bearer ${session?.user?.jwt}`;
        }

        return config;
    },
    function (error) {
        console.log("error request", error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        if (response.config.method !== "get") {
            if (response.data?.error === true) {

            } else {

            }
        }

        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        if (error.response.status === 500) {
/*            if (typeof window !== "undefined") {
                window.location.href = "/error500";
            }*/
        }

        if (error.response.status === 401) {
            console.log("401 401 401")
            signOut();
        }

        if (error.response.status === 403) {
            Toast.fire({
                icon: "error",
                title: `Vous n'avez pas les permissions nécéssaires`,
            });
/*            if (typeof window !== "undefined") {
                window.location.href = "/error403";
            }*/
        }

        if (
            error.response.status !== 401 &&
            error.response.status !== 403 &&
            error.response.status !== 500
        ) {

        }

        return Promise.reject(error);
    }
);

export const GET = async (url: string, data?: any) => {
    const response = await axiosInstance.get(`${url}`, {
        data: { stationIds: [] },
    });

    return response.data;
};

export const POST = async (url: string, data: any) => {
    const response = await axiosInstance.post(`${url}`, data);
    return response.data;
};

export const PUT = async (url: string, data: any) => {
    const response = await axiosInstance.put(`${url}`, data);
    return response.data;
};

export const DELETE = async (url: string) => {
    const response = await axiosInstance.delete(`${url}`);
    return response.data;
};