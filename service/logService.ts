import axios, { AxiosError, AxiosResponse } from "axios";
import { logDetail } from "../model/logType";

const url: string = process.env.NEXT_PUBLIC_URL as string

export async function createLogDetail(logDetailList: logDetail[]) {
    return await axios.post(`${url}/log/createLogDetail`,{logDetailList}).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function getLogHistory() {
    return await axios.get(`${url}/log/getLogHistory`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function getLogDetailById(id: number) {
    return await axios.get(`${url}/log/getLogDetailById/${id}`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}