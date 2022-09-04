import { useState } from 'react';
import axios, { AxiosError, AxiosResponse } from "axios";
import { logDetail } from "../model/logType";

const urlClient: string = process.env.NEXT_PUBLIC_URL as string
const urlServer: string = process.env.URL_API_SERVER as string


function getUrl(): string  {
    let urlRes = urlClient
    if (typeof window === 'undefined') {
        urlRes = urlServer
    }
    return urlRes
}

export async function createLogDetail(logDetailList: logDetail[]) {
    return await axios.post(`${getUrl()}/log/createLogDetail`,{logDetailList}).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function getLogHistory() {
    return await axios.get(`${getUrl()}/log/getLogHistory`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function getLogDetailById(id: number) {
    return await axios.get(`${getUrl()}/log/getLogDetailById/${id}`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}