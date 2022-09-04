import axios, { AxiosError, AxiosResponse } from 'axios'

const urlClient: string = process.env.NEXT_PUBLIC_URL as string
const urlServer: string = process.env.URL_API_SERVER as string

function getUrl(): string  {
    let urlRes = urlClient
    if (typeof window === 'undefined') {
        urlRes = urlServer
    }
    return urlRes
}

export async function findAll() {
    return await axios.get(`${getUrl()}/type/findAll`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}
