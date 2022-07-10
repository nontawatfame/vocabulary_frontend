import axios, { AxiosError, AxiosResponse } from 'axios'
import next from 'next';
import { BehaviorSubject } from 'rxjs'

const url: string = process.env.NEXT_PUBLIC_URL as string
export const userSubject = new BehaviorSubject<string>("");

export async function login(username: string, password: string) {
    return await axios.post(`${url}/login`, {username,password}).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}


export async function verifyToken(token: string): Promise<AxiosResponse<any, any>>  {
  return await axios.post(`${url}/verifyToken`, {},{headers:{"Authorization": `Bearer ${token}`}}).then((res) => res).catch(error => error.response)  
} 