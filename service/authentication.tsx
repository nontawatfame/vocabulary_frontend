import axios, { AxiosError, AxiosResponse } from 'axios'
import next from 'next';
import { BehaviorSubject } from 'rxjs'

const urlClient: string = process.env.NEXT_PUBLIC_URL as string
const urlServer: string = process.env.URL_API_SERVER as string

function getUrl(): string  {
    let urlRes = urlClient
    if (typeof window === 'undefined') {
        urlRes = urlServer
    }
    return urlRes
}

export const userSubject = new BehaviorSubject<string>("");

export async function login(username: string, password: string) {
    return await axios.post(`${getUrl()}/login`, {username,password}).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}


export async function verifyToken(token: string): Promise<AxiosResponse<any, any>>  {
  return await axios.post(`${getUrl()}/verifyToken`, {},{headers:{"Authorization": `Bearer ${token}`}}).then((res) => res).catch(error => error.response)  
} 