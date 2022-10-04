import axios, { AxiosError, AxiosResponse } from 'axios'
import { SettingType } from '../model/settingType'

const urlClient: string = process.env.NEXT_PUBLIC_URL as string
const urlServer: string = process.env.URL_API_SERVER as string

function getUrl(): string  {
    let urlRes = urlClient
    if (typeof window === 'undefined') {
        urlRes = urlServer
    }
    return urlRes
}

export async function save(settingReq: SettingType) {
    return await axios.post(`${getUrl()}/setting/save`, settingReq).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function getSetting() {
    return await axios.get(`${getUrl()}/setting/getSetting`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}
