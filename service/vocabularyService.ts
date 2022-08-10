import axios, { AxiosError, AxiosResponse } from 'axios'
import next from 'next';

const url: string = process.env.NEXT_PUBLIC_URL as string

export async function random() {
    return await axios.get(`${url}/vocabulary/random`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

