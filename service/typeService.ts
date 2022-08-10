import axios, { AxiosError, AxiosResponse } from 'axios'

const url: string = process.env.NEXT_PUBLIC_URL as string

export async function findAll() {
    return await axios.get(`${url}/type/findAll`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}
