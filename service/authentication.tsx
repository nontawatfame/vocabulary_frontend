import axios, { AxiosError, AxiosResponse } from 'axios'

const url: string = process.env.NEXT_PUBLIC_URL as string

export let isAuth = false

export function setAuth(auth: boolean) {
    isAuth = auth
}

export async function login(username: string, password: string) {
    return new Promise((resolve, reject) => {
        axios.post(`${url}/login`, {username,password}).then((res: AxiosResponse<any, any>)=> {
            resolve(res);
        }).catch((err: AxiosError) => {
            resolve(err.response)
        })
    });
}


export async function verifyToken(token: string): Promise<AxiosResponse<any, any>>  {
  return await axios.post(`${url}/verifyToken`, {},{headers:{"Authorization": `Bearer ${token}`}}).then((res) => res).catch(error => error.response)  
} 